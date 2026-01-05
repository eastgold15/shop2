import {
  mediaTable,
  productMasterCategoryTable,
  productMediaTable,
  productTable,
  productTemplateTable,
  SiteProductContract,
  siteCategoryTable,
  siteProductTable,
  skuMediaTable,
  skuTable,
  templateKeyTable,
  templateTable,
  templateValueTable,
} from "@repo/contract";
import {
  and,
  asc,
  eq,
  inArray,
  isNotNull,
  isNull,
  like,
  or,
  sql,
} from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { SiteSWithManageAble } from "~/db/utils";
import { productSiteCategoryTable, siteSkuTable } from "./../../../../packages/contract/src/table.schema";
import { type ServiceContext } from "../lib/type";

export class ProductService {
  /**
   * 管理端获取站点商品列表（包含媒体和SKU）
   *
   * 核心逻辑：
   * - 工厂站点：只能看到自己创建的商品（INNER JOIN site_product）
   * - 集团站点：可以看到所有工厂的商品，可以自定义（LEFT JOIN site_product）
   */
  public async pagelist(
    query: typeof SiteProductContract.ListQuery.static,
    ctx: ServiceContext
  ) {
    const { page = 1, limit = 10, search, siteCategoryId, isVisible, isListed } = query;

    const siteId = ctx.user.context.site.id;
    const siteType = ctx.user.context.site.siteType || "group";
    const tenantId = ctx.user.context.tenantId;

    // --- 1. 构建查询字段 (SQL层解决优先级问题) ---
    const baseQuery = ctx.db
      .select({
        id: productTable.id,
        spuCode: productTable.spuCode,
        status: productTable.status,
        units: productTable.units,
        createdAt: productTable.createdAt,
        updatedAt: productTable.updatedAt,
        templateId: sql<string>`${productTemplateTable.templateId}`,

        // 🔥【核心修正】智能字段：数据库直接计算最终值 (站点优先 > 原厂兜底)
        name: sql<string>`COALESCE(${siteProductTable.siteName}, ${productTable.name})`,
        description: sql<string>`COALESCE(${siteProductTable.siteDescription}, ${productTable.description})`,

        // 辅助字段：保留原厂数据，用于对比和调试
        originalName: productTable.name,
        originalDescription: productTable.description,

        // 站点特有数据
        siteCategoryId: siteProductTable.siteCategoryId,
        isVisible: siteProductTable.isVisible,
        isCustomized: sql<boolean>`${siteProductTable.id} IS NOT NULL`,
      })
      .from(productTable);

    // --- 2. 动态 Join 策略 ---
    let queryBuilder = baseQuery;

    if (siteType === "factory") {
      // === 工厂模式：INNER JOIN ===
      // 工厂只能看到明确归属于自己站点的商品
      queryBuilder = queryBuilder.innerJoin(
        siteProductTable,
        and(
          eq(productTable.id, siteProductTable.productId),
          eq(siteProductTable.siteId, siteId)
        )
      ) as any;
    } else {
      // === 集团模式：LEFT JOIN ===
      // 集团可以看到所有商品，关联出自己站点的自定义配置（如果有）
      queryBuilder = queryBuilder.leftJoin(
        siteProductTable,
        and(
          eq(productTable.id, siteProductTable.productId),
          eq(siteProductTable.siteId, siteId)
        )
      ) as any;
    }

    // --- 3. 关联模板表（LEFT JOIN，因为不是所有商品都有模板）---
    queryBuilder = queryBuilder.leftJoin(
      productTemplateTable,
      eq(productTable.id, productTemplateTable.productId)
    ) as any;

    // --- 4. 构建 Where 条件 ---
    const conditions = [
      eq(productTable.tenantId, tenantId), // 租户隔离
    ];

    // 工厂只能看自己部门生产的商品
    if (siteType === "factory") {
      conditions.push(eq(productTable.deptId, ctx.currentDeptId));
    } else {
      // === 集团站核心过滤逻辑 ===
      if (isListed === true) {
        // 🔥 情况 A: 只查"已收录" (我的商品管理)
        // 逻辑：site_product 表里必须有记录
        conditions.push(isNotNull(siteProductTable.id));
      }
      else if (isListed === false || isListed === 'false') {
        // 🔥 情况 B: 只查"未收录" (商品池/选品中心)
        // 逻辑：site_product 表里必须是 NULL
        conditions.push(isNull(siteProductTable.id));
      }
      // 情况 C: undefined -> 查全部 (保持原样)
    }

    // 搜索条件（搜索原厂名、站点名和SPU编码）
    if (search) {
      conditions.push(
        or(
          like(productTable.name, `%${search}%`),
          like(siteProductTable.siteName, `%${search}%`),
          like(productTable.spuCode, `%${search}%`)
        )!
      );
    }

    // 站点分类筛选
    if (siteCategoryId) {
      // 集团站点：只筛选已配置该分类的商品
      // 工厂站点：按配置的分类筛选
      if (siteType === "factory") {
        conditions.push(eq(siteProductTable.siteCategoryId, siteCategoryId));
      } else {
        // 集团站点：需要 site_product 记录存在且分类匹配
        conditions.push(
          and(
            isNotNull(siteProductTable.id),
            eq(siteProductTable.siteCategoryId, siteCategoryId)
          )!
        );
      }
    }

    // 可见性筛选
    if (isVisible !== undefined) {
      if (siteType === "factory") {
        conditions.push(eq(siteProductTable.isVisible, isVisible!));
      } else if (isVisible) {
        conditions.push(
          or(eq(siteProductTable.isVisible, true), isNull(siteProductTable.id))!
        );
      } else {
        conditions.push(eq(siteProductTable.isVisible, false));
      }
    }

    // --- 5. 执行查询 ---
    const result = await queryBuilder
      .where(and(...conditions))
      .limit(Number(limit))
      .offset((page - 1) * limit);



    // 获取商品ID列表
    const productIds = result.map((p) => p.id);

    // 提取所有涉及的 templateId (去重 & 去空)
    const templateIds = [
      ...new Set(result.map((p) => p.templateId).filter((id) => !!id)),
    ] as string[];

    // =========================================================
    // 🔥 修改：查询模板属性定义 (Key) + 属性可选值 (Value)
    // =========================================================
    const templateKeyMap = new Map<string, any[]>();

    if (templateIds.length > 0) {
      // 1. 先查属性名 (Keys)
      const keys = await ctx.db
        .select({
          id: templateKeyTable.id, // 🔥 必须查 ID，用来关联 Value
          templateId: templateKeyTable.templateId,
          key: templateKeyTable.key,
          inputType: templateKeyTable.inputType,
          isSkuSpec: templateKeyTable.isSkuSpec,
          sortOrder: templateKeyTable.sortOrder,
        })
        .from(templateKeyTable)
        .where(
          and(
            inArray(templateKeyTable.templateId, templateIds),
            eq(templateKeyTable.isSkuSpec, true)
          )
        )
        .orderBy(asc(templateKeyTable.sortOrder));

      // 2. 提取所有的 Key ID
      const keyIds = keys.map((k) => k.id);

      // 3. 🔥 再查属性值 (Values) - 只有 select 类型才需要，但为了简单可以全查
      let values: any[] = [];
      if (keyIds.length > 0) {
        values = await ctx.db
          .select({
            templateKeyId: templateValueTable.templateKeyId,
            value: templateValueTable.value,
            sortOrder: templateValueTable.sortOrder,
          })
          .from(templateValueTable)
          .where(inArray(templateValueTable.templateKeyId, keyIds))
          .orderBy(asc(templateValueTable.sortOrder));
      }

      // 4. 将 Values 按 KeyId 分组
      // Map<KeyId, ["S", "M", "L"]>
      const valueMap = new Map<string, string[]>();
      for (const v of values) {
        if (!valueMap.has(v.templateKeyId)) {
          valueMap.set(v.templateKeyId, []);
        }
        valueMap.get(v.templateKeyId)!.push(v.value);
      }

      // 5. 组装 Key + Options，并按 TemplateId 分组
      for (const k of keys) {
        if (!templateKeyMap.has(k.templateId)) {
          templateKeyMap.set(k.templateId, []);
        }

        templateKeyMap.get(k.templateId)!.push({
          key: k.key,
          label: k.key,
          inputType: k.inputType,
          // 🔥 注入选项值
          options: valueMap.get(k.id) || [],
        });
      }
    }

    // --- 6. 批量查询媒体数据（图片和视频）---
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

      // 初始化 mediaMap
      for (const product of result) {
        mediaMap.set(product.id, { images: [], videos: [], mainImage: null });
      }

      // 整理媒体数据
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

    // --- 7. 批量查询 SKU 数据 ---
    const skuMap = new Map<string, any[]>();
    if (productIds.length > 0) {
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
          weight: skuTable.weight,
          volume: skuTable.volume,
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

      // 为每个 SKU 附加媒体数据
      for (const sku of skus) {
        if (!skuMap.has(sku.productId)) {
          skuMap.set(sku.productId, []);
        }
        skuMap.get(sku.productId)!.push({
          ...sku,
          media: skuMediaMap.get(sku.id) || [],
        });
      }
    }

    // --- 8. 最终组合 (SQL已处理优先级，直接映射) ---
    const enrichedResult = result.map((product) => {
      const media = mediaMap.get(product.id) || {
        images: [],
        videos: [],
        mainImage: null,
      };
      const skus = skuMap.get(product.id) || [];
      const mediaIds = media.images.map((img: any) => img.id);
      const videoIds = media.videos.map((vid: any) => vid.id);

      // 🔥 获取该商品的规格定义
      const specs = product.templateId
        ? (templateKeyMap.get(product.templateId) || [])
        : [];

      return {
        // 身份 ID
        id: product.id,
        templateId: product.templateId,

        // 核心展示信息 (SQL 已处理好优先级)
        name: product.name,
        description: product.description,

        // 基础属性
        spuCode: product.spuCode,
        status: product.status,
        units: product.units,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,

        // 站点状态
        siteCategoryId: product.siteCategoryId || null,
        isVisible: product.isVisible ?? true,
        isCustomized: product.isCustomized,

        // 调试/对比用字段
        originalName: product.originalName,
        originalDescription: product.originalDescription,

        // 🔥 返回给前端的核心字段：告诉前端这个商品有哪些规格项
        // 前端根据这个数组来渲染 SKU 列表的"表头"
        specs: specs.map((s) => ({
          key: s.key,
          label: s.key, // 如果你有专门的 label 字段就用 label，没有就用 key
          inputType: s.inputType,
          options: s.options, // 🔥 加上选项值
        })),

        // 媒体与SKU
        mediaIds,
        videoIds,
        images: media.images,
        videos: media.videos,
        mainImage: media.mainImage?.url || null,
        mainImageId: media.mainImage?.id || null,
        // SKU 数据 (specJson 里的 key 应该与上面 specs 里的 key 对应)
        skus: skus.map((sku) => ({
          ...sku,
          // 确保 specJson 是对象
          specJson:
            typeof sku.specJson === "string"
              ? JSON.parse(sku.specJson)
              : sku.specJson,
        })),
        skuCount: skus.length,
      };
    });

    // --- 9. 计算总数（使用相同的 Join 和 Where 逻辑）---
    let countQuery = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(productTable);

    // Join 逻辑复刻
    if (siteType === "factory") {
      countQuery = countQuery.innerJoin(siteProductTable, and(eq(productTable.id, siteProductTable.productId), eq(siteProductTable.siteId, siteId))) as any;
    } else {
      countQuery = countQuery.leftJoin(siteProductTable, and(eq(productTable.id, siteProductTable.productId), eq(siteProductTable.siteId, siteId))) as any;
    }

    // 模板 Join
    countQuery = countQuery.leftJoin(productTemplateTable, eq(productTable.id, productTemplateTable.productId)) as any;

    const [{ count }] = await countQuery.where(and(...conditions));

    return {
      data: enrichedResult,
      total: Number(count),
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
      siteName,
      siteDescription,
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
          name: siteName,
          spuCode,
          description: siteDescription,
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
          siteName,
          siteDescription,
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
    body: SiteProductContract["Update"],
    ctx: ServiceContext
  ) {
    const {
      // 站点视图字段（集团站可编辑）
      siteName,
      siteDescription,
      seoTitle,
      siteCategoryId,

      spuCode,

      status,
      units,
      // 源头控制字段 (集团站无权修改，传了也白传)
      templateId,
      mediaIds,
      mainImageId,
      videoIds,
    } = body;

    const siteType = ctx.user.context.site.siteType || "group";
    let managedSiteIds: string[] = [ctx.user.context.site.id];
    if (siteType === "group") {
      managedSiteIds = await SiteSWithManageAble(ctx.user.context.tenantId);
    }
    if (managedSiteIds.length === 0) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }

    return await ctx.db.transaction(async (tx) => {
      // 1. 检查权限
      const [siteProduct] = await tx
        .select()
        .from(siteProductTable)
        .where(
          and(
            eq(siteProductTable.productId, productId),
            inArray(siteProductTable.siteId, managedSiteIds)
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
        // 集团站id
        const currentSiteId = ctx.user.context.site.id;

        await tx.insert(siteProductTable).values({
          siteId: currentSiteId,
          productId,
          siteName,
          siteDescription,
          seoTitle,
          siteCategoryId,
          isVisible: true,
        }).onConflictDoUpdate({
          // 定义冲突条件：同一个站点 + 同一个商品
          // 需要在数据库建唯一索引: UNIQUE(site_id, product_id)
          target: [siteProductTable.siteId, siteProductTable.productId],
          set: {
            siteName,
            siteDescription,
            seoTitle,
            siteCategoryId,
            isVisible: true,
          },
        })
        return { success: true, id: productId }; // 🔥 集团站逻辑结束，直接返回
      }

      // =========================================================
      // 场景 B: 工厂站 (源头修改，逻辑继续往下走)
      // =========================================================
      // 1. 更新源头表 (Product)
      await tx
        .update(productTable)
        .set({
          name: siteName!, // 工厂视图强制同步标准名
          spuCode,
          description: siteDescription, // 工厂视图强制同步标准描述
          status,
          units,
        })
        .where(eq(productTable.id, productId));
      // 2. 强制同步工厂的站点表 (SiteProduct)
      await tx
        .update(siteProductTable)
        .set({
          siteName, // 工厂视图强制同步标准名
          siteDescription, // 工厂视图强制同步标准描述
          seoTitle,
          siteCategoryId,
        })
        .where(eq(siteProductTable.id, siteProduct.id));

      // 3. [工厂特权] 处理模版 & 主分类联动
      if (templateId !== undefined) {
        // 先清理旧的
        await tx
          .delete(productTemplateTable)
          .where(eq(productTemplateTable.productId, productId));

        // 如果传入了新的 templateId (非 null/空字符串)
        if (templateId) {
          // 2.1 关联新模版
          await tx
            .insert(productTemplateTable)
            .values({ productId, templateId });

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
            await tx
              .delete(productMasterCategoryTable)
              .where(eq(productMasterCategoryTable.productId, productId));
            await tx.insert(productMasterCategoryTable).values({
              productId,
              masterCategoryId: newTemplate.masterCategoryId,
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
    const siteType = ctx.user.context.site?.siteType || "group";
    const tenantId = ctx.user.context.tenantId;

    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }
    if (!ids || ids.length === 0) return { count: 0 };


    await ctx.db.transaction(async (tx) => {
      // =========================================================
      // 场景 A: 工厂站 (源头删除 - 连根拔起)
      // =========================================================
      // 1. 根据站点类型执行不同的删除逻辑
      if (siteType === "factory") {
        // === 工厂站：删除源数据 ===
        // 1.1 安全校验：只能删除自己部门生产的商品
        // 防止 Factory A 删除了 Factory B 的商品（如果他们共用一个租户数据库）
        const products = await tx
          .select({ id: productTable.id })
          .from(productTable)
          .where(
            and(
              inArray(productTable.id, ids),
              eq(productTable.deptId, ctx.currentDeptId) // 🔒 锁死部门归属
            )
          );

        const validIds = products.map((p) => p.id);
        if (validIds.length === 0) {
          throw new HttpError.NotFound("未找到有权删除的商品");
        }

        // 1.2 执行删除
        // 由于 Schema 中有 onDelete: "cascade"，理论上只删 productTable 即可
        // 但为了代码逻辑显性化，手动删从表也是好习惯，注意顺序（先子后父）

        // a. 删除关联表 (site_product, template, media, category)
        // 这些表都依赖 productId，可以直接删
        await tx.delete(siteProductTable).where(inArray(siteProductTable.productId, validIds));
        await tx.delete(productMediaTable).where(inArray(productMediaTable.productId, validIds));
        await tx.delete(productTemplateTable).where(inArray(productTemplateTable.productId, validIds));
        await tx.delete(productMasterCategoryTable).where(inArray(productMasterCategoryTable.productId, validIds));

        // b. 删除 SKU (物理库存)
        // 注意：如果 sku 表有关联 site_sku，需要依赖级联或先删 site_sku
        await tx.delete(skuTable).where(inArray(skuTable.productId, validIds));

        // c. 最后删除源商品
        await tx.delete(productTable).where(inArray(productTable.id, validIds));
      }
      // =========================================================
      // 场景 B: 集团站/分销站 (视图删除 - 仅取消收录)
      // =========================================================
      else {
        // === 集团站：只能删除站点视图 ===
        // 2.1 验证商品是否存在且可访问
        const result = await tx
          .delete(siteProductTable)
          .where(
            and(
              eq(siteProductTable.siteId, siteId), // 🔒 只删当前站点的引用
              inArray(siteProductTable.productId, ids)
            )
          )
          .returning({ id: siteProductTable.id });


        // 2.2 删除 site_sku 表中的记录 (站点价格覆写)
        // 因为 site_sku 关联的是 site_product_id (根据你的Schema设计)
        // 如果你的 schema 设置了 site_product 级联删除 site_sku，这一步由于上面删了 site_product 会自动完成
        // 如果没有级联，或者想显式处理：
        if (result.length > 0) {
          const siteProductIds = result.map(r => r.id);
          await tx.delete(siteSkuTable) // 假设你有这张表
            .where(inArray(siteSkuTable.siteProductId, siteProductIds));
        }
      }
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

    console.log("ctx.user.context.tenantId:", ctx.user.context.tenantId);
    console.log("ctx.currentDeptId:", ctx.currentDeptId);
    const res = await ctx.db.query.skuTable.findMany({
      where: {
        productId: id,
        tenantId: ctx.user.context.tenantId,

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
