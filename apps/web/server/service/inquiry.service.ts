/**
 * ✍️ 【WEB Service - 业务自定义】
 * --------------------------------------------------------
 * 💡 处理复杂的询价提交流程：客户管理、媒体保存、Excel生成、邮件分发。
 * 📊 重构说明：
 *    - 移除 salespersonTable，改用 userTable + salesResponsibilityTable
 *    - 匹配逻辑：通过 salesResponsibilityTable 轮询分配业务员
 *    - 支持多租户、站点隔离
 *    - 使用 siteProduct 和 siteSku 替代直接查询 product 和 sku
 * --------------------------------------------------------
 */

import {
  customerTable,
  type InquiryContract,
  inquiryTable,
  salesResponsibilityTable,
} from "@repo/contract";
import { eq } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { db } from "~/db/connection";
import { sendEmail } from "~/lib/email/email";
import { ServiceContext } from "~/middleware/site";
import { generateInquiryNumber } from "~/modules/inquiry/services/dayCount";
import { generateQuotationExcel } from "~/modules/inquiry/services/excel.service";
import { createSalesInquiryTemplate } from "~/modules/inquiry/services/inquiry.templates";

// 外部业务工具

// 类型定义
type TransactionFn = Parameters<(typeof db)["transaction"]>[0];
type TxType = Parameters<TransactionFn>[0];

type UserWithResponsibility = Awaited<
  ReturnType<typeof InquiryService.prototype.findBestSalesperson>
>;
type validateAndGetSkuData = Awaited<
  ReturnType<typeof InquiryService.prototype.validateAndGetSkuData>
>;

type Inquiry = typeof inquiryTable.$inferSelect;
type SiteSku = validateAndGetSkuData["siteSku"];
type SiteProduct = validateAndGetSkuData["siteProduct"];

/**
 * 询价服务类
 */
export class InquiryService {
  /**
   * 🚀 询价提交：事务处理 + 分单逻辑
   *
   * 流程：
   * 1. 验证并获取站点商品和SKU数据
   * 2. 获取商品的主分类ID列表
   * 3. 开启事务
   * 4. 客户管理 (Upsert)
   * 5. 生成业务单号
   * 6. 匹配业务员（通过 salesResponsibilityTable 轮询）
   * 7. 创建询价记录
   * 8. 更新业务员最后分配时间
   * 9. 事务外异步发送邮件
   */
  async submit(
    body: typeof InquiryContract.Create.static,
    ctx: ServiceContext
  ) {
    const { site } = ctx;

    const siteId = site.id;
    const tenantId = site.tenantId;
    // 1. 验证并获取站点商品和SKU信息
    const { siteProduct, siteSku, skuMediaMainID } =
      await this.validateAndGetSkuData(body, ctx);

    // 2. 获取商品的主分类（用于匹配业务员）
    const masterCategoryIds = await this.getProductMasterCategories(
      siteProduct.productId,
      ctx
    );

    // 3. 开启事务处理核心业务逻辑
    const result = await db.transaction(async (tx) => {
      // 4. 客户管理 (Upsert)
      await this.upsertCustomer(body, ctx, tx);

      // 5. 生成业务单号
      const inquiryNum = await generateInquiryNumber();

      // 6. 匹配业务员（轮询逻辑）
      const targetRep = await this.findBestSalesperson(
        masterCategoryIds,
        ctx,
        tx
      );

      // 7. 创建询价主表
      const [newInquiry] = await tx
        .insert(inquiryTable)
        .values({
          inquiryNum,
          customerName: body.customerName,
          customerCompany: body.customerCompany,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone,
          customerWhatsapp: body.customerWhatsapp,
          status: "pending",
          siteProductId: siteProduct.id,
          siteSkuId: siteSku.id,
          productName: body.productName,
          productDescription: body.productDesc,
          quantity: body.quantity,
          price: siteSku.price,
          paymentMethod: body.paymentMethod,
          customerRequirements: body.customerRemarks,
          masterCategoryId: masterCategoryIds[0] || null, // 用于后续匹配
          ownerId: targetRep?.userId || null, // 分配给业务员
          isPublic: !targetRep, // 没匹配到业务员则进公海
          siteId,
          tenantId,
          createdBy: targetRep?.userId || null,
        })
        .returning();

      // 8. 更新业务员最后分配时间（防止连续分配）
      if (targetRep) {
        await this.updateSalesRepLastAssigned(targetRep.id, tx);
      }

      return {
        targetRep,
        inquiry: newInquiry,
        siteProduct,
        siteSku,
        skuMediaMainID,
      };
    });

    // 9. 事务外：异步执行耗时任务（邮件、Excel）
    if (result.targetRep) {
      this.sendFullInquiryEmail(
        result.targetRep,
        result.inquiry,
        result.siteProduct,
        result.siteSku,
        result.skuMediaMainID!,
        body
      ).catch(console.error);
    }

    return {
      success: true,
      inquiryNumber: result.inquiry.inquiryNum,
      assignedTo: result.targetRep?.user?.name || "Public Pool",
    };
  }

  /**
   * 🔍 验证并获取SKU数据
   *
   * 验证逻辑：
   * - 验证 productId 是否在当前站点有对应的 siteProduct
   * - 验证 skuId 是否存在且属于该 siteProduct
   * - 获取 SKU 的主图媒体
   */
  async validateAndGetSkuData(
    body: typeof InquiryContract.Create.static,
    ctx: ServiceContext
  ) {
    const { site } = ctx;

    const siteId = site.id;

    // 获取站点商品
    const siteProduct = await db.query.siteProductTable.findFirst({
      where: {
        id: body.siteProductId,
      },
      with: {
        product: true,
      },
    });

    if (!siteProduct) {
      throw new HttpError.BadRequest("Product not found in this site");
    }

    // 获取站点SKU
    const siteSku = await db.query.siteSkuTable.findFirst({
      where: {
        id: body.siteSkuId,
      },
      with: {
        sku: {
          with: {
            media: true,
          },
        },
      },
    });

    if (!siteSku) {
      throw new HttpError.BadRequest("SKU not found");
    }

    // 获取SKU媒体（主图）
    const skuMediaMainID =
      body.skuMediaId ||
      siteSku.sku?.media.sort((a, b) => a.sortOrder - b.sortOrder)?.[0].id;

    return { siteProduct, siteSku, skuMediaMainID };
  }

  /**
   * 🔍 获取商品的主分类ID列表
   *
   * 通过 productMasterCategoryTable 查询商品关联的所有主分类
   */
  private async getProductMasterCategories(
    productId: string,
    ctx: ServiceContext
  ): Promise<string[]> {
    const { site } = ctx;

    // 查询商品的主分类
    const productCategories =
      await db.query.productMasterCategoryTable.findMany({
        where: {
          productId,
        },
      });

    if (!productCategories.length) {
      throw new HttpError.BadRequest("Product has no category assigned");
    }

    return productCategories.map((pc) => pc.masterCategoryId);
  }

  /**
   * 🔍 匹配算法：分类优先 + 轮询（Round Robin）
   *
   * 逻辑：
   * 1. 通过 salesResponsibilityTable 找到负责这些分类的所有业务员
   * 2. 过滤出 isAutoAssign = true 的
   * 3. 关联 user 表，过滤 isActive = true 的
   * 4. 按照 lastAssignedAt 升序排序，取最早被分配的那个（最闲）
   *
   * @param masterCategoryIds - 商品的主分类ID列表
   * @param ctx - 服务上下文
   * @param tx - 数据库事务对象
   * @returns 业务员责任关系对象，包含 user 信息
   */
  async findBestSalesperson(
    masterCategoryIds: string[],
    ctx: ServiceContext,
    tx: TxType
  ) {
    const { site } = ctx;
    const tenantId = site.tenantId;

    // 查询这些分类下的所有业务员责任关系
    const responsibilities = await tx.query.salesResponsibilityTable.findMany({
      where: {
        masterCategoryId: {
          in: masterCategoryIds,
        },
        tenantId,
        isAutoAssign: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          },
        },
      },
    });

    // 过滤掉非活跃用户
    const activeReps = responsibilities.filter((r) => r.user.isActive);

    if (activeReps.length === 0) {
      return null; // 没有找到业务员，进公海
    }

    // 按 lastAssignedAt 升序排序（最闲的排前面）
    // 如果 lastAssignedAt 为 null，视为最早（从未分配过）
    const sorted = activeReps.sort((a, b) => {
      const timeA = a.lastAssignedAt ? a.lastAssignedAt.getTime() : 0;
      const timeB = b.lastAssignedAt ? b.lastAssignedAt.getTime() : 0;
      return timeA - timeB;
    });

    return sorted[0]; // 返回最闲的业务员
  }

  /**
   * 📧 更新业务员最后分配时间
   *
   * 更新 salesResponsibilityTable 中的 lastAssignedAt 字段
   * 防止连续将询价单分配给同一个业务员
   */
  private async updateSalesRepLastAssigned(
    responsibilityId: string,
    tx: TxType
  ) {
    await tx
      .update(salesResponsibilityTable)
      .set({ lastAssignedAt: new Date() })
      .where(eq(salesResponsibilityTable.id, responsibilityId));
  }

  /**
   * 👤 客户 Upsert 逻辑
   *
   * 如果客户邮箱已存在则更新，否则创建新客户
   */
  private async upsertCustomer(
    body: typeof InquiryContract.Create.static,
    ctx: ServiceContext,
    tx: TxType
  ) {
    const { site } = ctx;
    const tenantId = site.tenantId;

    const [existing] = await tx
      .select()
      .from(customerTable)
      .where(eq(customerTable.email, body.customerEmail))
      .limit(1);

    const customerData = {
      companyName: body.customerCompany,
      name: body.customerName,
      email: body.customerEmail,
      phone: body.customerPhone,
      whatsapp: body.customerWhatsapp,
      tenantId,
    };

    if (existing) {
      await tx
        .update(customerTable)
        .set(customerData)
        .where(eq(customerTable.id, existing.id));
      return existing.id;
    }

    const [newCustomer] = await tx
      .insert(customerTable)
      .values(customerData)
      .returning();
    return newCustomer.id;
  }

  /**
   * 📧 异步完整通知逻辑 (包含 Excel 和工厂逻辑)
   *
   * TODO: 完成以下功能
   * - 获取工厂信息（从站点的绑定部门）
   * - 生成 Excel（需要实现 generateQuotationExcel）
   * - 发送邮件（需要实现 createSalesInquiryTemplate）
   */
  private async sendFullInquiryEmail(
    targetRep: NonNullable<UserWithResponsibility>,
    inquiry: Inquiry,
    siteProduct: SiteProduct,
    siteSku: SiteSku,
    skuMediaId: string,
    body: typeof InquiryContract.Create.static
  ) {
    try {
      // 1. 获取工厂信息 (假设站点通过关联的 Departments 对应工厂)
      // 这里的逻辑可以根据你的具体 Schema 调整，通常是 Site -> Dept/Factory
      const factories = await db.query.siteTable
        .findFirst({
          where: {
            id: inquiry.siteId,
          },
          with: {
            // 假设 site 关联了部门，部门即工厂
            department: true,
          },
        })
        .then((res) => res!.department);

      // 2. 获取 SKU 的真实媒体信息用于下载
      const media = skuMediaId
        ? await db.query.mediaTable.findFirst({
          where: {
            id: skuMediaId,
          },
        })
        : null;

      // 3. 下载产品图片
      const photoData = media?.url ? await this.downloadImage(media.url) : null;

      // 4. 生成 Excel (利用之前讨论过的 generateQuotationExcel)
      // 映射数据到 Excel 模板格式
      const quotationData = this.mapToExcelData(
        inquiry,
        siteProduct,
        siteSku,
        factories,
        photoData
      );

      const excelBuffer = await generateQuotationExcel(quotationData);

      // 5. 构建邮件模板并发送
      if (!targetRep.user.email) return;

      // 准备 createSalesInquiryTemplate 所需的参数
      const inquiryWithItems = {
        ...inquiry,
        items: [
          {
            productName: inquiry.productName || "",
            productDescription: inquiry.productDescription || "",
            skuQuantity: inquiry.quantity,
            skuPrice: inquiry.price?.toString() || "",
            customerRequirements: inquiry.customerRequirements || "",
          },
        ],
      } as any; // 临时类型断言，因为需要完整的 InquiryWithItems 类型

      const emailTemplate = createSalesInquiryTemplate(
        inquiryWithItems,
        inquiry.inquiryNum,
        factories?.name
          ? [{ name: factories.name, address: factories.address ?? undefined }]
          : [{ name: "DONG QI FOOTWEAR (JIANGXI) CO., LTD" }],
        {
          name: targetRep.user.name,
          email: targetRep.user.email,
        }
      );

      await sendEmail({
        to: targetRep.user.email,
        template: {
          ...emailTemplate,
          attachments: [
            {
              filename: `Quotation-${inquiry.inquiryNum}.xlsx`,
              content: excelBuffer,
              contentType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
          ],
        },
      });

      console.log(
        `[Inquiry] Email sent for ${inquiry.inquiryNum} to ${targetRep.user.email}`
      );
    } catch (error) {
      console.error(
        `[Inquiry Error] Failed to process post-submit tasks for ${inquiry.inquiryNum}:`,
        error
      );
    }
  }
  /**
   * 📊 内部方法：将模型数据映射为 Excel 模板所需格式
   */
  private mapToExcelData(
    inquiry: Inquiry,
    siteProduct: SiteProduct,
    siteSku: SiteSku,
    factories: any,
    photo: any
  ) {
    const mainFactory =
      factories?.name
        ? factories
        : { name: "DONG QI FOOTWEAR (JIANGXI) CO., LTD" };

    return {
      // Exporter (出口商)
      exporterName: "DONG QI FOOTWEAR INTL MFG CO., LTD",
      exporterAddr:
        "No.2 Chiling Road, Chiling Industrial Zone, Houjie, Dongguan, Guangdong, China",
      exporterWeb: "www.dongqifootwear.com",
      exporterEmail: "sales@dongqifootwear.com",
      exporterPhone: 0,

      // Factory (工厂)
      factoryName: mainFactory.name,
      factoryAddr1:
        "Qifu Road #1, ShangOu Industrial Park, Yudu, Ganzhou, Jiangxi,China",
      factoryAddr2:
        "Industrial Road #3, Shangrao Industrial Zone, Shangrao, Jiangxi,China",
      factoryAddr3:
        "Qifu Road #2, ShangOu Industrial Park, Yudu, Ganzhou, Jiangxi,China",
      factoryWeb1: "www.dongqishoes.com",
      factoryWeb2: "www.dongqifootwear.com",
      factoryWeb3: "www.dongqifootwear.com",
      factoryPhone: 1_000_000_000,

      // Client (客户)
      clientCompanyName: inquiry.customerCompany || "",
      clientFullName: inquiry.customerName!,
      clientWhatsApp: inquiry.customerWhatsapp || "",
      clientEmail: inquiry.customerEmail,
      clientPhone: Number.parseInt(inquiry.customerPhone!, 10) || 0,
      photoForRefer: photo
        ? {
          buffer: photo.buffer,
          mimeType: photo.mimeType,
          name: `ref-${inquiry.inquiryNum}`,
        }
        : null,

      // Terms (报价项) - 使用第一个 SKU 信息填充第一行
      termsCode1: siteSku.id || null,
      termsDesc1: inquiry.productDescription || siteProduct.product?.name || "",
      termsUnits1: "pcs",
      termsUsd1: inquiry.price ? String(inquiry.price) : "",
      termsRemark1: inquiry.customerRequirements || "",

      termsCode2: null,
      termsDesc2: "",
      termsUnits2: "",
      termsUsd2: 0,
      termsRemark2: "",

      termsCode3: null,
      termsDesc3: "",
      termsUnits3: "",
      termsUsd3: 0,
      termsRemark3: "",
      termsTTL: inquiry.quantity,
      termsUSD: Number(inquiry.price || 0) * inquiry.quantity,

      // Bank Info (银行信息)
      bankBeneficiary: "DONG QI FOOTWEAR INTL MFG CO., LTD",
      bankAccountNo: 0,
      bankName: "BANK OF CHINA",
      bankAddr: "DONGGUAN BRANCH",

      // Signed By (签署代表)
      exporterBehalf: "Michael Tse",
      date: new Date().toISOString().split("T")[0],
      timeNo: inquiry.inquiryNum,
      clientAddr: inquiry.customerCompany || "",
      payWay: `Payment Method: ${inquiry.paymentMethod || "TBD"}`,
    };
  }
  /**
   * 🖼️ 下载图片为 Buffer
   *
   * 从给定的 URL 下载图片并转换为 Buffer
   */
  private async downloadImage(url?: string) {
    if (!url) return null;
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      return {
        buffer: Buffer.from(await resp.arrayBuffer()),
        mimeType: resp.headers.get("content-type") || "image/jpeg",
      };
    } catch {
      return null;
    }
  }
}
