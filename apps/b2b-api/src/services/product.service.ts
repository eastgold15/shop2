import {
  mediaTable,
  ProductContract,
  ProductVariantContract,
  productMasterCategoryTable,
  productMediaTable,
  productTable,
  productTemplateTable,
  productVariantMediaTable,
  SiteProductContract,
  siteCategoryTable,
  siteProductSiteCategoryTable,
  siteProductTable,
  siteSkuTable,
  skuMediaTable,
  skuTable,
  templateKeyTable,
  templateTable,
  templateValueTable,
} from "@repo/contract";
import {
  and,
  asc,
  desc,
  eq,
  exists,
  getColumns,
  inArray,
  isNotNull,
  isNull,
  like,
  or,
  sql,
} from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { SiteSWithManageAble } from "~/db/utils";
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
    const {
      page = 1,
      limit = 10,
      search,
      siteCategoryId,
      isVisible,
      isListed,
    } = query;

    const siteId = ctx.user.context.site.id;
    const siteType = ctx.user.context.site.siteType || "group";
    const tenantId = ctx.user.context.tenantId;

    // 从 productTable 中排除 tenantId, name, description，因为这些会被特殊处理
    const { tenantId: productTenantId, name, description, ...rest } = getColumns(productTable);

    // --- 1. 构建查询字段 (SQL层解决优先级问题) ---
    const baseQuery = ctx.db
      .select({
        ...rest,

        templateId: sql<string>`${productTemplateTable.templateId}`,
        site_product_id: siteProductTable.id, // 🔥 用于查询站点分类

        // 🔥【核心修正】智能字段：数据库直接计算最终值 (站点优先 > 原厂兜底)
        name: sql<string>`COALESCE(${siteProductTable.siteName}, ${productTable.name})`,
        description: sql<string>`COALESCE(${siteProductTable.siteDescription}, ${productTable.description})`,

        // 🔥 保留原厂数据，用于对比和调试
        originalName: productTable.name,
        originalDescription: productTable.description,

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
      } else if (isListed === false || isListed === "false") {
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
      // 定义一个子查询：检查中间表是否存在对应的关联记录
      const categoryCondition = exists(
        ctx.db
          .select()
          .from(siteProductSiteCategoryTable)
          .where(
            and(
              // 这里的 id 对应 siteProductTable.id
              eq(
                siteProductSiteCategoryTable.siteProductId,
                siteProductTable.id
              ),
              eq(siteProductSiteCategoryTable.siteCategoryId, siteCategoryId)
            )
          )
      );

      if (siteType === "factory") {
        conditions.push(categoryCondition);
      } else {
        // 集团站点：不仅要分类匹配，还要确保 siteProduct 记录本身存在（如果是 Left Join 的话）
        conditions.push(
          and(isNotNull(siteProductTable.id), categoryCondition)!
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
      .orderBy(
        // 优先级 1: 站点自定义排序 (nullsLast 确保未收录的商品排在后面)
        asc(siteProductTable.sortOrder),
        // 优先级 2: 原厂默认排序
        asc(productTable.sortOrder),
        // 优先级 3: 最新创建优先
        desc(productTable.createdAt)
      )
      .limit(Number(limit))
      .offset((page - 1) * limit);

    // 获取商品ID列表和siteProduct ID列表
    const productIds = result.map((p) => p.id);
    const siteProductIds = result
      .map((p) => p.site_product_id)
      .filter((id) => id != null) as string[];

    // 查询站点分类关联（用于回显）
    const siteCategoryMap = new Map<string, string>();
    if (siteProductIds.length > 0) {
      const siteCategories = await ctx.db
        .select({
          siteProductId: siteProductSiteCategoryTable.siteProductId,
          siteCategoryId: siteProductSiteCategoryTable.siteCategoryId,
        })
        .from(siteProductSiteCategoryTable)
        .where(
          inArray(siteProductSiteCategoryTable.siteProductId, siteProductIds)
        );

      siteCategories.forEach((sc) => {
        siteCategoryMap.set(sc.siteProductId, sc.siteCategoryId);
      });
    }

    // 提取所有涉及的 templateId (去重 & 去空)
    const templateIds = [
      ...new Set(result.map((p) => p.templateId).filter((id) => !!id)),
    ] as string[];

    // =========================================================
    // 🔥 修改：查询模板属性定义 (Key) + 属性可选值 (Value)
    // 同时查询 SKU 规格属性和公共属性
    // =========================================================
    const templateKeyMap = new Map<string, any[]>();
    const commonAttributeMap = new Map<string, any[]>();

    if (templateIds.length > 0) {
      // 1. 先查属性名 (Keys) - 同时查询 SKU 规格和公共属性
      const { ...rest } = getColumns(templateKeyTable);
      const keys = await ctx.db
        .select({
          ...rest,
        })
        .from(templateKeyTable)
        .where(inArray(templateKeyTable.templateId, templateIds))
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

      // 5. 组装 Key + Options，并按 TemplateId 和 isSkuSpec 分组
      for (const k of keys) {
        const attr = {
          key: k.key,
          label: k.key,
          inputType: k.inputType,
          options: valueMap.get(k.id) || [],
          isRequired: k.isRequired,
        };

        if (k.isSkuSpec) {
          // SKU 规格属性
          if (!templateKeyMap.has(k.templateId)) {
            templateKeyMap.set(k.templateId, []);
          }
          templateKeyMap.get(k.templateId)!.push(attr);
        } else {
          // 公共属性
          if (!commonAttributeMap.has(k.templateId)) {
            commonAttributeMap.set(k.templateId, []);
          }
          commonAttributeMap.get(k.templateId)!.push(attr);
        }
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

        // 根据媒体类型正确分类，而不是仅根据 sortOrder
        if (media.mediaType === "image") {
          productMedia.images.push(mediaInfo);
          if (media.isMain) {
            productMedia.mainImage = mediaInfo;
          }
        } else if (media.mediaType === "video") {
          productMedia.videos.push(mediaInfo);
        } else {
          // 对于未知类型，根据 sortOrder 兼容处理
          if (media.sortOrder >= 0) {
            productMedia.images.push(mediaInfo);
          } else {
            productMedia.videos.push(mediaInfo);
          }
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

      // 🔥 获取该商品的规格定义（SKU规格属性）
      const specs = product.templateId
        ? templateKeyMap.get(product.templateId) || []
        : [];

      // 🔥 获取该商品的公共属性（非SKU规格属性）
      const commonAttributes = product.templateId
        ? commonAttributeMap.get(product.templateId) || []
        : [];

      return {
        // 身份 ID
        id: product.id,
        siteProductId: product.site_product_id, // 🔥 site_product 表的 ID，用于排序等操作
        templateId: product.templateId,

        // 核心展示信息 (SQL 已处理好优先级)
        name: product.name,
        description: product.description,
        // 基础属性
        spuCode: product.spuCode,
        status: product.status,
        customAttributes: product.customAttributes,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,

        isVisible: product.status === 1,
        isCustomized: product.isCustomized,

        // 🔥 站点分类（用于回显）
        siteCategoryId: product.site_product_id
          ? siteCategoryMap.get(product.site_product_id)
          : undefined,

        // 调试/对比用字段
        originalName: product.originalName,
        originalDescription: product.originalDescription,

        // 🔥 返回给前端的核心字段：告诉前端这个商品有哪些规格项
        // 前端根据这个数组来渲染 SKU 列表的"表头"
        specs: specs.map((s) => ({
          key: s.key,
          label: s.key,
          inputType: s.inputType,
          options: s.options,
        })),

        // 🔥 公共属性：模板中定义的非SKU规格属性（如单位、材质等）
        commonAttributes: commonAttributes.map((s) => ({
          key: s.key,
          label: s.key,
          inputType: s.inputType,
          options: s.options,
          isRequired: s.isRequired,
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
      countQuery = countQuery.innerJoin(
        siteProductTable,
        and(
          eq(productTable.id, siteProductTable.productId),
          eq(siteProductTable.siteId, siteId)
        )
      ) as any;
    } else {
      countQuery = countQuery.leftJoin(
        siteProductTable,
        and(
          eq(productTable.id, siteProductTable.productId),
          eq(siteProductTable.siteId, siteId)
        )
      ) as any;
    }

    // 模板 Join
    countQuery = countQuery.leftJoin(
      productTemplateTable,
      eq(productTable.id, productTemplateTable.productId)
    ) as any;

    const [{ count }] = await countQuery.where(and(...conditions));

    return {
      data: enrichedResult,
      total: Number(count),
      page: Number(page),
      limit: Number(limit),
    };
  }
  /**
   * 创建商品（支持站点隔离和模板绑定）只能是工厂创建 同时写入到站点商品表
   */

  public async create(body: ProductContract["Create"], ctx: ServiceContext) {
    const {
      spuCode,
      status = 0,
      siteCategoryId,
      templateId,
      siteName,
      siteDescription,
      seoTitle,
      mediaIds,
      mainImageId,
      videoIds,
      customAttributes,
    } = body;

    // 1. 权限硬校验
    if (ctx.user.context.department.category.toUpperCase() !== "FACTORY") {
      throw new HttpError.Forbidden("只有工厂有权限创建商品库");
    }

    const siteId = ctx.user.context.site.id;
    const tenantId = ctx.user.context.tenantId;

    return await ctx.db.transaction(async (tx) => {
      // 2. 验证站点分类
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
        throw new HttpError.NotFound("站点分类不存在或不属于当前站点");
      }

      // 3. 验证模板并获取 MasterCategory 归属
      let targetMasterCategoryId: string | null = null;
      if (templateId) {
        const [template] = await tx
          .select()
          .from(templateTable)
          .where(eq(templateTable.id, templateId))
          .limit(1);

        if (!template) throw new HttpError.NotFound("指定的模板不存在");
        targetMasterCategoryId = template.masterCategoryId;
      } else {
        throw new HttpError.BadRequest("必须选择商品模板");
      }

      // 4. 创建商品主体 (SPU 资产层)
      const [product] = await tx
        .insert(productTable)
        .values({
          name: siteName, // 初始使用站点名作为标准名
          spuCode,
          description: siteDescription,
          status,
          customAttributes,
          tenantId,
          deptId: ctx.currentDeptId,
          createdBy: ctx.user.id,
        })
        .returning();

      // 5. 关联模板
      await tx.insert(productTemplateTable).values({
        productId: product.id,
        templateId: templateId!,
      });

      // 6. 关联主分类 (用于业务员分单逻辑)
      if (targetMasterCategoryId) {
        await tx.insert(productMasterCategoryTable).values({
          productId: product.id,
          masterCategoryId: targetMasterCategoryId,
        });
      }

      // 7. 创建站点商品视图 (Site-Specific View)
      const [siteProduct] = await tx
        .insert(siteProductTable)
        .values({
          siteId,
          productId: product.id,
          siteName,
          siteDescription,
          seoTitle,
          isVisible: true,
        })
        .returning();

      // 8. 关联站点分类 (中间表 site_product_category_rel)
      // 这里的表名请根据你的实际导出确认：siteProductSiteCategoryTable
      if (siteCategoryId) {
        await tx.insert(siteProductSiteCategoryTable).values({
          siteProductId: siteProduct.id, // 🔥 关联的是 site_product 的 ID
          siteCategoryId,
        });
      }

      // 9. 关联媒体 (Images & Videos)
      const allMediaIds = [...(mediaIds || []), ...(videoIds || [])];
      if (allMediaIds.length > 0) {
        // 构建媒体关联数据
        const mediaRelations: any[] = [];

        // 图片
        mediaIds?.forEach((mediaId, index) => {
          mediaRelations.push({
            productId: product.id,
            mediaId,
            isMain: mediaId === mainImageId,
            sortOrder: index,
          });
        });

        // 视频
        videoIds?.forEach((mediaId, index) => {
          mediaRelations.push({
            productId: product.id,
            mediaId,
            isMain: false,
            sortOrder: -1 - index,
          });
        });

        if (mediaRelations.length > 0) {
          await tx.insert(productMediaTable).values(mediaRelations);
        }
      }

      return {
        product,
        siteProduct,
      };
    });
  }

  /**
   * 更新商品（全量关联更新）
   */
  public async update(
    productId: string,
    body: SiteProductContract["Update"],
    ctx: ServiceContext
  ) {
    const {
      siteName,
      siteDescription,
      seoTitle,
      siteCategoryId, // 站点分类ID
      spuCode,
      status,
      templateId,
      mediaIds,
      mainImageId,
      videoIds,
      customAttributes,
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
      // 1. 查找或准备当前站点的 site_product 记录
      const currentSiteId = ctx.user.context.site.id;

      // =========================================================
      // 场景 A: 集团站/普通站点 (只更新站点视图)
      // =========================================================
      if (siteType !== "factory") {
        // 1.1 更新或插入 site_product 表 (注意：移除了 siteCategoryId)
        const [upserted] = await tx
          .insert(siteProductTable)
          .values({
            siteId: currentSiteId,
            productId,
            siteName,
            siteDescription,
            seoTitle,
            isVisible: true,
          })
          .onConflictDoUpdate({
            target: [siteProductTable.siteId, siteProductTable.productId],
            set: {
              siteName,
              siteDescription,
              seoTitle,
            },
          })
          .returning({ id: siteProductTable.id });

        // 1.2 更新中间表 site_product_category_rel
        if (siteCategoryId) {
          await tx
            .delete(siteProductSiteCategoryTable)
            .where(eq(siteProductSiteCategoryTable.siteProductId, upserted.id));

          await tx.insert(siteProductSiteCategoryTable).values({
            siteProductId: upserted.id,
            siteCategoryId,
          });
        }

        return { success: true, id: productId };
      }

      // =========================================================
      // 场景 B: 工厂站 (源头修改 + 视图修改)
      // =========================================================

      // 2.1 校验工厂权限下的 site_product
      const [factorySiteProduct] = await tx
        .select()
        .from(siteProductTable)
        .where(
          and(
            eq(siteProductTable.productId, productId),
            eq(siteProductTable.siteId, currentSiteId)
          )
        )
        .limit(1);

      if (!factorySiteProduct) {
        throw new HttpError.NotFound("工厂站点商品记录不存在");
      }

      // 2.2 更新 SPU 源头
      await tx
        .update(productTable)
        .set({
          name: siteName || undefined,
          spuCode,
          description: siteDescription,
          status,
          customAttributes,
        })
        .where(eq(productTable.id, productId));

      // 2.3 更新工厂自己的站点视图
      await tx
        .update(siteProductTable)
        .set({
          siteName,
          siteDescription,
          seoTitle,
        })
        .where(eq(siteProductTable.id, factorySiteProduct.id));

      // 2.4 更新工厂站点的分类关联 (中间表)
      if (siteCategoryId) {
        await tx
          .delete(siteProductSiteCategoryTable)
          .where(
            eq(
              siteProductSiteCategoryTable.siteProductId,
              factorySiteProduct.id
            )
          );

        await tx.insert(siteProductSiteCategoryTable).values({
          siteProductId: factorySiteProduct.id,
          siteCategoryId,
        });
      }

      // 3. [工厂特权] 处理模版 & 主分类联动 (逻辑保持不变)
      if (templateId !== undefined) {
        await tx
          .delete(productTemplateTable)
          .where(eq(productTemplateTable.productId, productId));
        if (templateId) {
          await tx
            .insert(productTemplateTable)
            .values({ productId, templateId });
          const [newTemplate] = await tx
            .select({ masterCategoryId: templateTable.masterCategoryId })
            .from(templateTable)
            .where(eq(templateTable.id, templateId))
            .limit(1);

          if (newTemplate?.masterCategoryId) {
            await tx
              .delete(productMasterCategoryTable)
              .where(eq(productMasterCategoryTable.productId, productId));
            await tx.insert(productMasterCategoryTable).values({
              productId,
              masterCategoryId: newTemplate.masterCategoryId,
            });
          }
        }
      }

      // 🔥 修复后的逻辑
      if (templateId !== undefined && templateId) {
        const newTemplateKeys = await tx
          .select({ key: templateKeyTable.key })
          .from(templateKeyTable)
          .where(
            and(
              eq(templateKeyTable.templateId, templateId),
              eq(templateKeyTable.isSkuSpec, true)
            )
          );

        const newSpecKeys = newTemplateKeys.map((k) => k.key);

        if (newSpecKeys.length === 0) {
          await tx
            .update(skuTable)
            .set({ specJson: {}, updatedAt: new Date() })
            .where(eq(skuTable.productId, productId));
        } else {
          await tx
            .update(skuTable)
            .set({
              // 关键点：使用 ARRAY[...] 并在内部通过 sql.join 展开参数
              specJson: sql`COALESCE(
          (
            SELECT jsonb_object_agg(key, value)
            FROM jsonb_each(${skuTable.specJson}::jsonb)
            WHERE key = ANY(ARRAY[${sql.join(newSpecKeys, sql`, `)}]::text[])
          ),
          '{}'::jsonb
        )`,
              updatedAt: new Date(),
            })
            .where(eq(skuTable.productId, productId));
        }
      }

      // 4. [工厂特权] 媒体全量替换 (逻辑保持不变)
      if (mediaIds !== undefined || videoIds !== undefined) {
        await tx
          .delete(productMediaTable)
          .where(eq(productMediaTable.productId, productId));
        const mediaRelations: any[] = [];
        mediaIds?.forEach((id, idx) => {
          mediaRelations.push({
            productId,
            mediaId: id,
            isMain: id === mainImageId,
            sortOrder: idx,
          });
        });
        videoIds?.forEach((id, idx) => {
          mediaRelations.push({
            productId,
            mediaId: id,
            isMain: false,
            sortOrder: -1 - idx,
          });
        });
        if (mediaRelations.length > 0)
          await tx.insert(productMediaTable).values(mediaRelations);
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
        await tx
          .delete(siteProductTable)
          .where(inArray(siteProductTable.productId, validIds));
        await tx
          .delete(productMediaTable)
          .where(inArray(productMediaTable.productId, validIds));
        await tx
          .delete(productTemplateTable)
          .where(inArray(productTemplateTable.productId, validIds));
        await tx
          .delete(productMasterCategoryTable)
          .where(inArray(productMasterCategoryTable.productId, validIds));

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
          const siteProductIds = result.map((r) => r.id);
          await tx
            .delete(siteSkuTable) // 假设你有这张表
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
            id: true,
            sortOrder: true,
          },
        },
      },
    });
    return res;
  }

  // =========================================================
  // 变体媒体管理方法
  // =========================================================

  /**
   * 自动识别商品模板中的颜色属性
   * 匹配规则：属性名包含 "Color", "颜色", "colour"
   */
  private async identifyColorAttribute(
    productId: string,
    ctx: ServiceContext
  ): Promise<{ key: string; keyId: string } | null> {
    // 1. 获取商品模板
    const [productTemplate] = await ctx.db
      .select()
      .from(productTemplateTable)
      .where(eq(productTemplateTable.productId, productId));

    if (!productTemplate) return null;

    // 2. 查询模板的所有 SKU 规格属性
    const keys = await ctx.db
      .select()
      .from(templateKeyTable)
      .where(
        and(
          eq(templateKeyTable.templateId, productTemplate.templateId),
          eq(templateKeyTable.isSkuSpec, true)
        )
      );

    // 3. 自动识别：属性名包含 "Color", "颜色", "colour" 的属性
    const colorKey = keys.find((k) => /color|颜色|colour/i.test(k.key));

    return colorKey ? { key: colorKey.key, keyId: colorKey.id } : null;
  }

  /**
   * 获取商品的变体媒体配置
   * 返回按颜色属性值分组的媒体配置
   */
  public async getVariantMedia(productId: string, ctx: ServiceContext) {
    // 1. 识别颜色属性
    const colorAttr = await this.identifyColorAttribute(productId, ctx);
    if (!colorAttr) {
      throw new HttpError.BadRequest("商品未配置颜色属性");
    }

    // 2. 查询该颜色属性的所有可选值
    const values = await ctx.db
      .select({
        id: templateValueTable.id,
        value: templateValueTable.value,
      })
      .from(templateValueTable)
      .where(eq(templateValueTable.templateKeyId, colorAttr.keyId))
      .orderBy(asc(templateValueTable.sortOrder));

    // 3. 查询已配置的变体媒体
    const variantMediaList = await ctx.db
      .select({
        attributeValueId: productVariantMediaTable.attributeValueId,
        mediaId: productVariantMediaTable.mediaId,
        isMain: productVariantMediaTable.isMain,
        sortOrder: productVariantMediaTable.sortOrder,
        mediaUrl: mediaTable.url,
        mediaOriginalName: mediaTable.originalName,
        mediaType: mediaTable.mediaType,
      })
      .from(productVariantMediaTable)
      .innerJoin(
        mediaTable,
        eq(productVariantMediaTable.mediaId, mediaTable.id)
      )
      .where(eq(productVariantMediaTable.productId, productId))
      .orderBy(asc(productVariantMediaTable.sortOrder));

    // 4. 按属性值分组
    const mediaMap = new Map<string, any[]>();
    variantMediaList.forEach((vm) => {
      if (!mediaMap.has(vm.attributeValueId)) {
        mediaMap.set(vm.attributeValueId, []);
      }
      mediaMap.get(vm.attributeValueId)!.push({
        id: vm.mediaId,
        url: vm.mediaUrl,
        isMain: vm.isMain,
        sortOrder: vm.sortOrder,
        mediaType: vm.mediaType,
      });
    });

    // 5. 组装响应
    return {
      productId,
      colorAttributeKey: colorAttr.key,
      variantMedia: values.map((v) => ({
        attributeValueId: v.id,
        attributeValue: v.value,
        images: mediaMap.get(v.id) || [],
      })),
    };
  }

  /**
   * 保存商品的变体媒体配置
   * 使用事务确保数据一致性
   */
  public async setVariantMedia(
    body: typeof ProductVariantContract.SetVariantMedia.static,
    ctx: ServiceContext
  ) {
    const { productId, variantMedia } = body;

    return await ctx.db.transaction(async (tx) => {
      // 1. 删除旧的变体媒体配置
      await tx
        .delete(productVariantMediaTable)
        .where(eq(productVariantMediaTable.productId, productId));

      // 2. 插入新的配置（参照商品主图逻辑，第一张默认为主图）
      for (const vm of variantMedia) {
        const mediaRelations = vm.mediaIds.map((mediaId, index) => ({
          productId,
          attributeValueId: vm.attributeValueId,
          mediaId,
          isMain: index === 0, // 🔥 第一张图默认为主图
          sortOrder: index,
        }));

        if (mediaRelations.length > 0) {
          await tx.insert(productVariantMediaTable).values(mediaRelations);
        }
      }

      return { success: true };
    });
  }

  /**
   * 获取 SKU 的媒体（三级继承逻辑）
   * 优先级：SKU专属 > 变体级(颜色) > 商品级
   */
  public async getSkuMedia(skuId: string, ctx: ServiceContext) {
    // 1. 查询 SKU 信息
    const [sku] = await ctx.db
      .select()
      .from(skuTable)
      .where(eq(skuTable.id, skuId));

    if (!sku) {
      throw new HttpError.NotFound("SKU 不存在");
    }

    // 2. 第一优先级：SKU 专属媒体
    const skuMedia = await ctx.db
      .select({
        mediaId: skuMediaTable.mediaId,
        isMain: skuMediaTable.isMain,
        mediaUrl: mediaTable.url,
      })
      .from(skuMediaTable)
      .innerJoin(mediaTable, eq(skuMediaTable.mediaId, mediaTable.id))
      .where(eq(skuMediaTable.skuId, skuId))
      .orderBy(asc(skuMediaTable.sortOrder));

    if (skuMedia.length > 0) {
      return { source: "sku", media: skuMedia };
    }

    // 3. 第二优先级：变体级媒体
    // 解析 specJson 找到颜色属性值
    const specJson =
      typeof sku.specJson === "string"
        ? JSON.parse(sku.specJson)
        : sku.specJson;

    const colorAttr = await this.identifyColorAttribute(sku.productId, ctx);
    if (colorAttr) {
      const colorValue = specJson[colorAttr.key];
      if (colorValue) {
        // 查询该颜色值的 templateValue.id
        const [templateValue] = await ctx.db
          .select()
          .from(templateValueTable)
          .where(
            and(
              eq(templateValueTable.templateKeyId, colorAttr.keyId),
              eq(templateValueTable.value, colorValue)
            )
          );

        if (templateValue) {
          const variantMedia = await ctx.db
            .select({
              mediaId: productVariantMediaTable.mediaId,
              isMain: productVariantMediaTable.isMain,
              mediaUrl: mediaTable.url,
            })
            .from(productVariantMediaTable)
            .innerJoin(
              mediaTable,
              eq(productVariantMediaTable.mediaId, mediaTable.id)
            )
            .where(
              and(
                eq(productVariantMediaTable.productId, sku.productId),
                eq(productVariantMediaTable.attributeValueId, templateValue.id)
              )
            )
            .orderBy(asc(productVariantMediaTable.sortOrder));

          if (variantMedia.length > 0) {
            return { source: "variant", media: variantMedia };
          }
        }
      }
    }

    // 4. 第三优先级：商品级媒体
    const productMedia = await ctx.db
      .select({
        mediaId: productMediaTable.mediaId,
        isMain: productMediaTable.isMain,
        mediaUrl: mediaTable.url,
      })
      .from(productMediaTable)
      .innerJoin(mediaTable, eq(productMediaTable.mediaId, mediaTable.id))
      .where(eq(productMediaTable.productId, sku.productId))
      .orderBy(asc(productMediaTable.sortOrder));

    return { source: "product", media: productMedia };
  }
}
