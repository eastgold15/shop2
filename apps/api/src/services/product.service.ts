import {
  mediaTable,
  ProductContract,
  productMasterCategoryTable,
  productMediaTable,
  productTable,
  productTemplateTable,
  SiteProductContract,
  siteCategoryTable,
  siteProductTable,
  skuMediaTable,
  skuTable,
  templateTable,
} from "@repo/contract";
import { and, asc, eq, inArray, like, or, sql } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { productSiteCategoryTable } from "./../../../../packages/contract/src/table.schema";
import { type ServiceContext } from "../lib/type";

export class ProductService {

  /**
 * 管理端获取站点商品列表（包含媒体和SKU）
 */
  public async pagelist(
    query: typeof SiteProductContract.ListQuery.static,
    ctx: ServiceContext
  ) {
    const { page = 1, limit = 10, search, siteCategoryId, isVisible } = query;

    const siteId = ctx.user.context.site.id;
    const siteType = ctx.user.context.site.siteType || "group";

    // 构建查询条件
    const conditions = [
      eq(siteProductTable.siteId, siteId),
      ...(isVisible ? [eq(siteProductTable.isVisible, isVisible)] : []),
    ];

    if (search) {
      conditions.push(
        or(
          like(productTable.name, `%${search}%`),
          like(productTable.description, `%${search}%`)
        )!
      );
    }

    if (siteCategoryId) {
      conditions.push(eq(siteProductTable.siteCategoryId, siteCategoryId));
    }

    // 查询商品数据 - 根据站点类型使用不同的价格逻辑
    // 注意：productTable 没有 price 字段，所有价格都在 siteProductTable
    const result = await ctx.db
      .select({
        id: productTable.id,
        // 名称：工厂用原名，集团可以用 siteName 覆盖
        name:
          siteType === "factory"
            ? productTable.name
            : sql<string>`COALESCE(${siteProductTable.siteName}, ${productTable.name})`,
        spuCode: productTable.spuCode,
        description: productTable.description,
        status: productTable.status,
        units: productTable.units,
        createdAt: productTable.createdAt,
        updatedAt: productTable.updatedAt,
        // 价格逻辑：
        // 工厂站点：直接用 sitePrice（因为工厂创建时已强制同步）
        // 集团站点：用 sitePrice（可能是自定义的，也可能是继承工厂的）
        // 如果 sitePrice 为 null，返回 '0'
        price: sql<string>`COALESCE(${siteProductTable.sitePrice}, '0')`,
        sitePrice: siteProductTable.sitePrice,
        // 是否有自定义价格（集团站点用）
        // 工厂站点总是 hasCustomPrice=false（因为是源头，不是"自定义"）
        hasCustomPrice:
          siteType === "factory"
            ? sql<boolean>`false`
            : sql<boolean>`CASE WHEN ${siteProductTable.sitePrice} IS NOT NULL THEN true ELSE false END`,
        siteName: siteProductTable.siteName,
        siteDescription: siteProductTable.siteDescription,
        siteCategoryId: siteProductTable.siteCategoryId,
      })
      .from(siteProductTable)
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      .limit(Number(limit))
      .offset((page - 1) * limit)
      .where(and(...conditions));

    // 获取商品ID列表
    const productIds = result.map((p) => p.id);

    // 批量查询商品媒体（图片和视频）
    const mediaMap = new Map<
      string,
      { images: any[]; videos: any[]; mainImage: any }
    >();
    if (productIds.length > 0) {
      const mediaRelations = await ctx.db
        .select({
          productId: productMediaTable.productId,
          mediaId: productMediaTable.mediaId,
          isMain: productMediaTable.isMain,
          sortOrder: productMediaTable.sortOrder,
          // 媒体信息
          mediaUrl: mediaTable.url,
          mediaOriginalName: mediaTable.originalName,
          mediaMimeType: mediaTable.mimeType,
          mediaType: mediaTable.mediaType,
          thumbnailUrl: mediaTable.thumbnailUrl,
        })
        .from(productMediaTable)
        .innerJoin(mediaTable, eq(productMediaTable.mediaId, mediaTable.id))
        .where(inArray(productMediaTable.productId, productIds))
        .orderBy(asc(productMediaTable.sortOrder));

      // 整理媒体数据
      for (const product of result) {
        mediaMap.set(product.id, { images: [], videos: [], mainImage: null });
      }

      for (const media of mediaRelations) {
        const productMedia = mediaMap.get(media.productId);
        if (!productMedia) continue;

        const mediaInfo = {
          id: media.mediaId,
          url: media.mediaUrl,
          originalName: media.mediaOriginalName,
          mimeType: media.mediaMimeType,
          mediaType: media.mediaType,
          thumbnailUrl: media.thumbnailUrl,
          isMain: media.isMain,
          sortOrder: media.sortOrder,
        };

        // sortOrder >= 0 是图片，< 0 是视频
        if (media.sortOrder >= 0) {
          productMedia.images.push(mediaInfo);
          if (media.isMain) {
            productMedia.mainImage = mediaInfo;
          }
        } else {
          productMedia.videos.push(mediaInfo);
        }
      }

      // 如果没有主图，使用第一张图片
      for (const product of result) {
        const productMedia = mediaMap.get(product.id);
        if (
          productMedia &&
          !productMedia.mainImage &&
          productMedia.images.length > 0
        ) {
          productMedia.mainImage = productMedia.images[0];
        }
      }
    }

    // 批量查询 SKU 数据
    const skuMap = new Map<string, any[]>();
    // 批量查询模板关联
    const templateMap = new Map<string, string>();
    if (productIds.length > 0) {
      // 查询模板
      const templates = await ctx.db
        .select({
          productId: productTemplateTable.productId,
          templateId: productTemplateTable.templateId,
        })
        .from(productTemplateTable)
        .where(inArray(productTemplateTable.productId, productIds));

      for (const template of templates) {
        templateMap.set(template.productId, template.templateId);
      }

      // 查询 SKU
      const skus = await ctx.db
        .select({
          id: skuTable.id,
          productId: skuTable.productId,
          skuCode: skuTable.skuCode,
          price: skuTable.price,
          marketPrice: skuTable.marketPrice,
          costPrice: skuTable.costPrice,
          stock: skuTable.stock,
          specJson: skuTable.specJson,
          status: skuTable.status,
        })
        .from(skuTable)
        .where(inArray(skuTable.productId, productIds));

      // 收集所有 SKU ID
      const skuIds = skus.map((s) => s.id);

      // 查询 SKU 媒体关联
      const skuMediaMap = new Map<string, any[]>();
      if (skuIds.length > 0) {
        const skuMediaRelations = await ctx.db
          .select({
            skuId: skuMediaTable.skuId,
            mediaId: skuMediaTable.mediaId,
            isMain: skuMediaTable.isMain,
            sortOrder: skuMediaTable.sortOrder,
            // 媒体信息
            mediaUrl: mediaTable.url,
            mediaOriginalName: mediaTable.originalName,
            mediaMimeType: mediaTable.mimeType,
            mediaType: mediaTable.mediaType,
            thumbnailUrl: mediaTable.thumbnailUrl,
          })
          .from(skuMediaTable)
          .innerJoin(mediaTable, eq(skuMediaTable.mediaId, mediaTable.id))
          .where(inArray(skuMediaTable.skuId, skuIds))
          .orderBy(asc(skuMediaTable.sortOrder));

        // 整理 SKU 媒体数据
        for (const sku of skus) {
          skuMediaMap.set(sku.id, []);
        }

        for (const media of skuMediaRelations) {
          const mediaList = skuMediaMap.get(media.skuId);
          if (!mediaList) continue;

          mediaList.push({
            id: media.mediaId,
            url: media.mediaUrl,
            originalName: media.mediaOriginalName,
            mimeType: media.mediaMimeType,
            mediaType: media.mediaType,
            thumbnailUrl: media.thumbnailUrl,
            isMain: media.isMain,
            sortOrder: media.sortOrder,
          });
        }
      }

      for (const sku of skus) {
        if (!skuMap.has(sku.productId)) {
          skuMap.set(sku.productId, []);
        }
        // 为每个 SKU 附加媒体数据
        skuMap.get(sku.productId)!.push({
          ...sku,
          media: skuMediaMap.get(sku.id) || [],
        });
      }
    }

    // 组合数据
    const enrichedResult = result.map((product) => {
      const media = mediaMap.get(product.id) || {
        images: [],
        videos: [],
        mainImage: null,
      };
      const skus = skuMap.get(product.id) || [];
      // 提取 mediaIds 和 videoIds
      const mediaIds = media.images.map((img: any) => img.id);
      const videoIds = media.videos.map((vid: any) => vid.id);

      return {
        ...product,
        // 模板 ID
        templateId: templateMap.get(product.id) || null,
        // 媒体 ID 列表（用于编辑）
        mediaIds,
        videoIds,
        // 媒体数据（用于展示）
        images: media.images,
        videos: media.videos,
        mainImage: media.mainImage?.url || null,
        mainImageId: media.mainImage?.id || null,
        // SKU 数据
        skus,
        skuCount: skus.length,
      };
    });

    // 替换 getSiteProducts 最后的总数计算部分
    const [{ count }] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(siteProductTable)
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      .where(and(...conditions));
    return {
      data: enrichedResult,
      total: Number(count), // 这里的 count 是真实的数据库总数
      page: Number(page),
      limit: Number(limit),
    };
  }
  /**
   * 创建商品（支持站点隔离和模板绑定）只能是工厂创建
   */
  public async create(
    body: SiteProductContract["Create"],
    ctx: ServiceContext
  ) {
    const {
      spuCode,
      status = 0,
      units,
      siteCategoryId,
      templateId,
      name,
      description,
      seoTitle,
      // 媒体字段
      mediaIds, // 商品图片ID列表
      mainImageId, // 主图ID
      videoIds, // 视频ID列表
    } = body;
    // 1. 权限硬校验
    if (ctx.user.context.department.category.toUpperCase() !== "FACTORY") {
      throw new HttpError.Forbidden("只有工厂有权限创建商品库");
    }
    const siteId = ctx.user.context.site.id;

    return await ctx.db.transaction(async (tx) => {
      // 2. 验证站点分类 (为了挂载到货架)
      const [siteCategory] = await tx
        .select()
        .from(siteCategoryTable)
        .where(
          and(
            eq(siteCategoryTable.id, siteCategoryId),
            eq(siteCategoryTable.siteId, siteId)
          )
        )
        .limit(1);

      if (!siteCategory) {
        throw new HttpError.NotFound(
          `站点分类不存在${siteCategoryId}，站点ID:${siteId}`
        );
      }

      // 3. 验证模板 & 获取主分类归属 (🔥 核心修改)
      let targetMasterCategoryId: string | null = null;

      if (templateId) {
        const [template] = await tx
          .select() // Select All，包含 masterCategoryId
          .from(templateTable)
          .where(eq(templateTable.id, templateId))
          .limit(1);

        if (!template) {
          throw new HttpError.NotFound("指定的模板不存在");
        }

        // 从模板中提取主分类ID
        targetMasterCategoryId = template.masterCategoryId;
      } else {
        // 💡 策略决策：如果没选模板，是否允许创建无主分类商品？
        // 如果业务要求严格，这里可以 
        throw new HttpError.BadRequest("必须选择商品模板");
      }

      // 4. 创建商品主体 (SPU)
      const [product] = await tx
        .insert(productTable)
        .values({
          name,
          spuCode,
          description,
          status,
          units,
          tenantId: ctx.user.context.tenantId,
          deptId: ctx.currentDeptId,
          createdBy: ctx.user.id,
        })
        .returning();

      // 5. 关联模板
      if (templateId) {
        await tx.insert(productTemplateTable).values({
          productId: product.id,
          templateId,
        });
      }


      // 6. 关联主分类 (🔥 以前是靠 siteCategory，现在靠 template)
      if (targetMasterCategoryId) {
        await tx.insert(productMasterCategoryTable).values({
          productId: product.id,
          masterCategoryId: targetMasterCategoryId, // 使用模板绑定的主分类
        });
      }
      // 7. 关联站点分类 (货架)
      if (siteCategoryId) {
        await tx.insert(productSiteCategoryTable).values({
          productId: product.id,
          siteCategoryId: siteCategory.id,
        });
      }


      // 8. 关联媒体 (逻辑不变)
      const allMediaIds = [...(mediaIds || []), ...(videoIds || [])];

      if (allMediaIds.length > 0) {
        // 验证媒体是否存在
        const existingMedia = await tx
          .select()
          .from(mediaTable)
          .where(inArray(mediaTable.id, allMediaIds));

        const foundIds = existingMedia.map((m) => m.id);
        const notFound = allMediaIds.filter((id) => !foundIds.includes(id));

        if (notFound.length > 0) {
          throw new HttpError.NotFound(`媒体 ID ${notFound.join(", ")} 不存在`);
        }

        // 构建媒体关联数据
        const mediaRelations: any[] = [];

        // 处理图片（sortOrder 从 0 开始）
        if (mediaIds && mediaIds.length > 0) {
          mediaIds.forEach((mediaId: string, index: number) => {
            mediaRelations.push({
              productId: product.id,
              mediaId,
              isMain: mediaId === mainImageId,
              sortOrder: index,
            });
          });
        }

        // 处理视频（sortOrder 设为 -1）
        if (videoIds && videoIds.length > 0) {
          videoIds.forEach((mediaId: string, index: number) => {
            mediaRelations.push({
              productId: product.id,
              mediaId,
              isMain: false,
              sortOrder: -1 - index, // -1, -2, -3... 保持顺序
            });
          });
        }

        if (mediaRelations.length > 0) {
          await tx.insert(productMediaTable).values(mediaRelations);
        }
      }


      // 9. 创建站点商品视图
      const [siteProduct] = await tx
        .insert(siteProductTable)
        .values({
          siteId,
          productId: product.id,
          siteName: name,
          siteDescription: description,
          siteCategoryId,
          seoTitle,
          isVisible: true,
        })
        .returning();

      return {
        product,
        siteProduct,
      };
    });
  }



  /**
   * 更新商品（全量关联更新）分两种一种是全局商品，一种是站点商品
   */
  public async update(
    productId: string,
    body: ProductContract["Update"],
    ctx: ServiceContext
  ) {
    const {
      // 基础字段
      name, spuCode, description, status, units,
      // 站点视图字段
      seoTitle, siteCategoryId,
      // 源头控制字段 (集团站无权修改，传了也白传)
      templateId, mediaIds, mainImageId, videoIds,
    } = body;

    const siteId = ctx.user.context.site?.id;
    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }
    const siteType = ctx.user.context.site.siteType || "group";

    return await ctx.db.transaction(async (tx) => {
      // 1. 检查权限
      const [siteProduct] = await tx
        .select()
        .from(siteProductTable)
        .where(
          and(
            eq(siteProductTable.productId, productId),
            eq(siteProductTable.siteId, siteId)
          )
        )
        .limit(1);

      if (!siteProduct) {
        throw new HttpError.NotFound("商品不存在或无权访问");
      }
      // =========================================================
      // 场景 A: 集团站/普通站点 (只更新视图，立即返回)
      // =========================================================

      if (siteType !== "factory") {
        // 1. 更新站点商品表 (SiteProduct)
        await tx.update(siteProductTable)
          .set({
            siteName: name, // 允许改名
            siteDescription: description, // 允许改描述
            seoTitle,
            siteCategoryId, // 允许改自己的货架
            // 注意：集团站不允许改 sitePrice，除非你开放这个权限
          })
          .where(eq(siteProductTable.id, siteProduct.id));

        // [重点]：集团站改了 siteCategoryId，不需要也不应该去同步 masterCategoryId
        // 因为集团的分类可能是"促销区"，这不代表商品本身变成了"促销品"类别

        return { success: true, id: productId }; // 🔥 集团站逻辑结束，直接返回
      }

      // =========================================================
      // 场景 B: 工厂站 (源头修改，逻辑继续往下走)
      // =========================================================
      // 1. 更新源头表 (Product)
      await tx
        .update(productTable)
        .set({
          name,
          spuCode,
          description,
          status,
          units,
        })
        .where(eq(productTable.id, productId));
      // 2. 强制同步工厂的站点表 (SiteProduct)
      await tx.update(siteProductTable)
        .set({
          siteName: name, // 工厂视图强制同步标准名
          siteDescription: description,
          seoTitle,
          siteCategoryId,
        })
        .where(eq(siteProductTable.id, siteProduct.id));

      // 3. [工厂特权] 处理模版 & 主分类联动
      if (templateId !== undefined) {
        // 先清理旧的
        await tx.delete(productTemplateTable).where(eq(productTemplateTable.productId, productId));

        // 如果传入了新的 templateId (非 null/空字符串)
        if (templateId) {
          // 2.1 关联新模版
          await tx.insert(productTemplateTable).values({ productId, templateId });

          // 2.2 🔥 查出新模版对应的主分类
          const [newTemplate] = await tx
            .select({ masterCategoryId: templateTable.masterCategoryId })
            .from(templateTable)
            .where(eq(templateTable.id, templateId))
            .limit(1);

          // ✨ 增加这个校验：确保模版有效
          if (!newTemplate) {
            throw new HttpError.NotFound("更新失败：指定的模板ID不存在");
          }

          // 2.3 级联更新商品的主分类
          if (newTemplate.masterCategoryId) {
            await tx.delete(productMasterCategoryTable).where(eq(productMasterCategoryTable.productId, productId));
            await tx.insert(productMasterCategoryTable).values({
              productId,
              masterCategoryId: newTemplate.masterCategoryId
            });
          }
        } else {
          // 如果 templateId 是 null，表示用户想“解绑模版”
          // 此时是否要删除 MasterCategory？
          // 建议：保持 MasterCategory 不动，或者也删除。看业务定义。
          // 目前你的代码是保持不动，这是安全的。
          throw new HttpError.BadRequest("更新失败：模版ID不能为空");
        }
      }


      // 4. [工厂特权] 媒体更新 (全量替换)
      // --- 阶段 D: 媒体全量替换 (Images & Videos) ---
      if (mediaIds !== undefined || videoIds !== undefined) {
        await tx
          .delete(productMediaTable)
          .where(eq(productMediaTable.productId, productId));

        const allMediaIds = [...(mediaIds || []), ...(videoIds || [])];
        if (allMediaIds.length > 0) {
          const mediaRelations: any[] = [];
          // 图片处理 (sortOrder >= 0)
          mediaIds?.forEach((id: string, idx: number) => {
            mediaRelations.push({
              productId,
              mediaId: id,
              isMain: id === mainImageId,
              sortOrder: idx,
            });
          });
          // 视频处理 (sortOrder < 0)
          videoIds?.forEach((id: string, idx: number) => {
            mediaRelations.push({
              productId,
              mediaId: id,
              isMain: false,
              sortOrder: -1 - idx,
            });
          });
          await tx.insert(productMediaTable).values(mediaRelations);
        }
      }
      return { success: true, id: productId };
    });
  }

  /**
   * 批量删除商品
   */
  public async batchDelete(ids: string[], ctx: ServiceContext) {
    const siteId = ctx.user.context.site?.id;
    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }

    await ctx.db.transaction(async (tx) => {
      // 1. 验证商品是否属于当前站点
      const siteProducts = await tx
        .select()
        .from(siteProductTable)
        .where(
          and(
            inArray(siteProductTable.productId, ids),
            eq(siteProductTable.siteId, siteId)
          )
        );

      if (siteProducts.length === 0) {
        throw new HttpError.NotFound("未找到可删除的商品");
      }

      // 2. 删除站点商品关联
      await tx
        .delete(siteProductTable)
        .where(
          and(
            eq(siteProductTable.siteId, siteId),
            inArray(siteProductTable.productId, ids)
          )
        );
      await tx.delete(skuTable).where(inArray(skuTable.productId, ids));

      // 3. 删除其他关联数据
      await tx
        .delete(productMediaTable)
        .where(inArray(productMediaTable.productId, ids));

      await tx
        .delete(productTemplateTable)
        .where(inArray(productTemplateTable.productId, ids));

      await tx
        .delete(productMasterCategoryTable)
        .where(inArray(productMasterCategoryTable.productId, ids));

      // 4. 删除商品
      await tx.delete(productTable).where(inArray(productTable.id, ids));
    });

    return { count: ids.length, message: `成功删除 ${ids.length} 个商品` };
  }

  /**
   * 删除单个商品（复用批量删除逻辑以确保权限检查和关联数据清理）
   */
  public async delete(id: string, ctx: ServiceContext) {
    // 复用 batchDelete 方法，确保权限检查和数据清理逻辑一致
    return await this.batchDelete([id], ctx);
  }

  public async getSkuList(id: string, ctx: ServiceContext) {
    // 修复：移除数组解构，findMany 返回的是数组而不是单个对象
    const res = await ctx.db.query.skuTable.findMany({
      where: {
        productId: id,
        tenantId: ctx.user.context.tenantId!,
        deptId: ctx.currentDeptId,
      },
      with: {
        media: {
          columns: {
            mediaId: true,
            isMain: true,
          },
        },
      },
    });
    return res;
  }
}
