import {
  mediaTable,
  productMasterCategoryTable,
  productMediaTable,
  productTable,
  productTemplateTable,
  type SiteProductContract,
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
import type { Transaction } from "~/db/connection";
import { SiteSWithManageAble } from "~/db/utils";
import { type ServiceContext } from "../lib/type";
export class SiteProductService {
  /**
   * 统一创建入口 (双模支持)
   * 模式 A [收录模式]: 传入 productId
   * - 适用角色: 集团站 (Group)
   * - 行为: 查找现有商品 -> 建立站点关联 -> 激活 SKU
   * 模式 B [新建模式]: 不传 productId，传入 spuCode, templateId 等
   * - 适用角色: 工厂 (Factory)
   * - 行为: 创建物理商品/模板/媒体 -> 建立站点关联 -> 激活 SKU
   */
  public async create(
    body: SiteProductContract["Create"],
    ctx: ServiceContext
  ) {
    const siteId = ctx.user.context.site?.id;
    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }
    const siteType = ctx.user.context.site.siteType || "group";
    const tenantId = ctx.user.context.tenantId;

    return await ctx.db.transaction(async (tx) => {
      let productId: string;
      let initialSiteData: { siteName: string; siteDescription?: string } = {
        siteName: "",
      };

      // =========================================================
      // 逻辑分流
      // =========================================================
      // 判断是否提供了 productId (Contract 中定义为 Union 类型，需做类型收窄或判断)
      if ("productId" in body && body.productId) {
        // -------------------------------------------------------
        // [模式 A: 集团站收录]
        // -------------------------------------------------------
        productId = body.productId;

        // 校验物理商品是否存在
        const [existsProduct] = await tx
          .select()
          .from(productTable)
          .where(eq(productTable.id, productId))
          .limit(1);

        if (!existsProduct) {
          throw new HttpError.NotFound("商品池中未找到该商品");
        }

        // 收录时，默认使用原厂名称和描述
        initialSiteData = {
          siteName: body.siteName || existsProduct.name,
          siteDescription:
            body.siteDescription || existsProduct.description || "",
        };
      } else {
        // -------------------------------------------------------
        // [模式 B: 工厂新建] (原 create1 逻辑迁移至此)
        // -------------------------------------------------------
        if (siteType !== "factory") {
          throw new HttpError.Forbidden("只有工厂有权限创建全新的商品源");
        }

        // 类型断言：此时 body 是创建物理商品所需的数据
        const newProductBody = body as any;
        const {
          spuCode,
          status = 0,
          templateId,
          customAttributes,
          mediaIds,
          mainImageId,
          videoIds,
        } = newProductBody;

        // B1. 验证模板并获取 MasterCategory
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
        // B2. 创建物理商品主体 (SPU)
        // 注意：工厂新建时，Product 的 name 默认等于输入的 siteName 或 name
        const productName = newProductBody.siteName || newProductBody.name;
        const productDesc =
          newProductBody.siteDescription || newProductBody.description;

        const [product] = await tx
          .insert(productTable)
          .values({
            name: productName,
            spuCode,
            description: productDesc,
            status,
            customAttributes,
            tenantId,
            deptId: ctx.currentDeptId,
            createdBy: ctx.user.id,
          })
          .returning();

        productId = product.id;
        initialSiteData = {
          siteName: productName,
          siteDescription: productDesc,
        };

        // B3. 物理层关联：模板
        await tx.insert(productTemplateTable).values({
          productId,
          templateId: templateId!,
        });

        // B4. 物理层关联：主分类 (用于分单)
        if (targetMasterCategoryId) {
          await tx.insert(productMasterCategoryTable).values({
            productId,
            masterCategoryId: targetMasterCategoryId,
          });
        }

        // B5. 物理层关联：媒体 (复用私有方法)
        await this.createPhysicalMedia(
          tx,
          productId,
          mediaIds,
          videoIds,
          mainImageId
        );
      }

      // =========================================================
      // 2. 创建站点视图 (SiteProduct) - 两个模式汇聚于此
      // =========================================================

      const [siteProduct] = await tx
        .insert(siteProductTable)
        .values({
          siteId,
          productId,
          siteName: initialSiteData.siteName,
          siteDescription: initialSiteData.siteDescription,
          seoTitle: body.seoTitle,
          isVisible: true,
        })
        .returning();

      // =========================================================
      // 3. 关联站点分类
      // =========================================================
      if (body.siteCategoryId) {
        // 可选：校验 siteCategoryId 是否属于当前 siteId
        // const [validCat] = await tx.select().from(siteCategoryTable)...

        await tx.insert(siteProductSiteCategoryTable).values({
          siteProductId: siteProduct.id,
          siteCategoryId: body.siteCategoryId,
        });
      }

      // =========================================================
      // 4. 激活 SKU (核心逻辑：同步物理 SKU 到站点)
      // =========================================================
      await this.activateSkus(tx, siteProduct.id, productId, siteId);

      return siteProduct;
    });
  }
  /**
   * 私有：创建物理商品媒体关联
   */
  private async createPhysicalMedia(
    tx: any,
    productId: string,
    mediaIds?: string[],
    videoIds?: string[],
    mainImageId?: string
  ) {
    const allMediaIds = [...(mediaIds || []), ...(videoIds || [])];
    if (allMediaIds.length === 0) return;

    const mediaRelations: any[] = [];

    // 图片
    mediaIds?.forEach((mediaId, index) => {
      mediaRelations.push({
        productId,
        mediaId,
        isMain: mediaId === mainImageId,
        sortOrder: index,
      });
    });

    // 视频 (sortOrder 负数以示区分，或排在最后)
    videoIds?.forEach((mediaId, index) => {
      mediaRelations.push({
        productId,
        mediaId,
        isMain: false,
        sortOrder: -1 - index,
      });
    });

    if (mediaRelations.length > 0) {
      await tx.insert(productMediaTable).values(mediaRelations);
    }
  }
  public async list(
    query: SiteProductContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.siteProductTable.findMany({
      where: {
        siteId: (ctx.user.context.site as any).id!,
        ...(search ? { originalName: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
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

          // 🔥 核心：分类关联时自动激活所有 SKU
          // 获取该商品的所有物理 SKU
          const physicalSkus = await tx
            .select()
            .from(skuTable)
            .where(eq(skuTable.productId, productId));

          // 批量创建 siteSku 记录（如果不存在）
          if (physicalSkus.length > 0) {
            await tx
              .insert(siteSkuTable)
              .values(
                physicalSkus.map((sku) => ({
                  siteId: currentSiteId,
                  siteProductId: upserted.id,
                  skuId: sku.id,
                  price: sku.price, // 继承原价
                  isActive: true, // 默认激活
                }))
              )
              .onConflictDoNothing(); // 如果已存在则跳过，保留站点自定义价格
          }
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
   * 批量更新商品排序
   * 工厂站点：同时更新 product 和 siteProduct 的 sortOrder
   * 出口商站点：只更新 siteProduct 的 sortOrder
   */
  public async batchUpdateSortOrder(
    body: SiteProductContract["BatchUpdateSortOrder"],
    ctx: ServiceContext
  ) {
    const { items } = body;
    const siteType = ctx.user.context.site.siteType || "group";
    const siteId = ctx.user.context.site.id;

    if (!items || items.length === 0) {
      return { success: true, count: 0 };
    }

    return await ctx.db.transaction(async (tx) => {
      // 1. 更新 siteProduct 表的 sortOrder
      for (const item of items) {
        await tx
          .update(siteProductTable)
          .set({ sortOrder: item.sortOrder })
          .where(
            and(
              eq(siteProductTable.id, item.siteProductId),
              eq(siteProductTable.siteId, siteId)
            )
          );
      }

      // 2. 如果是工厂站点，同时更新 product 表的 sortOrder
      if (siteType === "factory") {
        // 获取所有 siteProduct 记录对应的 productId
        const siteProducts = await tx
          .select({
            id: siteProductTable.id,
            productId: siteProductTable.productId,
            sortOrder: siteProductTable.sortOrder,
          })
          .from(siteProductTable)
          .where(
            and(
              inArray(
                siteProductTable.id,
                items.map((i) => i.siteProductId)
              ),
              eq(siteProductTable.siteId, siteId)
            )
          );

        // 更新对应的 product 表的 sortOrder
        for (const sp of siteProducts) {
          const item = items.find((i) => i.siteProductId === sp.id);
          if (item) {
            await tx
              .update(productTable)
              .set({ sortOrder: item.sortOrder })
              .where(eq(productTable.id, sp.productId));
          }
        }
      }

      return { success: true, count: items.length };
    });
  }

  /**
   * 批量创建/收录商品到站点
   * 支持两种模式：
   * 1. 收录已有商品（集团站）：提供 productId
   * 2. 创建新商品（工厂专用）：提供完整商品信息
   */
  public async batchCreate(
    body: { items: Record<string, any>[] },
    ctx: ServiceContext
  ) {
    const results = {
      success: [] as string[],
      failed: [] as { id: string; reason: string }[],
    };

    for (const item of body.items) {
      try {
        // 复用 create() 方法，确保逻辑一致
        await this.create(item as any, ctx);
        results.success.push(item.productId || item.spuCode || item.id);
      } catch (error) {
        results.failed.push({
          id: item.productId || item.spuCode || item.id || "unknown",
          reason: error instanceof Error ? error.message : "未知错误",
        });
      }
    }

    return {
      total: body.items.length,
      successCount: results.success.length,
      failedCount: results.failed.length,
      results,
    };
  }

  /**
   * 管理端获取站点商品列表（包含媒体和SKU）
   * 从 ProductService 迁移，保持原有的复杂查询逻辑
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
    const {
      tenantId: productTenantId,
      name,
      description,
      ...rest
    } = getColumns(productTable);

    // --- 1. 构建查询字段 (SQL层解决优先级问题) ---
    const baseQuery = ctx.db
      .select({
        ...rest,

        templateId: sql<string>`${productTemplateTable.templateId}`,
        site_product_id: siteProductTable.id,

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
   * 私有方法：激活 SKU（确保一致性）
   * 在创建 siteProduct 后自动创建 siteSku 记录
   */
  private async activateSkus(
    tx: Transaction,
    siteProductId: string,
    productId: string,
    siteId: string
  ) {
    const physicalSkus = await tx
      .select()
      .from(skuTable)
      .where(eq(skuTable.productId, productId));

    if (physicalSkus.length > 0) {
      await tx
        .insert(siteSkuTable)
        .values(
          physicalSkus.map((sku) => ({
            siteId,
            siteProductId,
            skuId: sku.id,
            price: sku.price,
            isActive: true,
          }))
        )
        .onConflictDoNothing();
    }
  }

  /**
   * 批量删除商品
   * @param ids 站点商品 ID 列表 (site_product.id)
   */
  public async batchDelete(ids: string[], ctx: ServiceContext) {
    const siteId = ctx.user.context.site?.id;
    const siteType = ctx.user.context.site?.siteType || "group";

    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }
    if (!ids || ids.length === 0) return { count: 0 };

    return await ctx.db.transaction(async (tx) => {
      // =========================================================
      // 场景 A: 工厂站 (源头删除 - 物理删除)
      // =========================================================
      if (siteType === "factory") {
        // 1. [ID 转换] 根据传入的 siteProductId 查找对应的 productId
        // 同时确保这些 siteProduct 属于当前站点
        const siteProducts = await tx
          .select({
            id: siteProductTable.id,
            productId: siteProductTable.productId,
          })
          .from(siteProductTable)
          .where(
            and(
              inArray(siteProductTable.id, ids),
              eq(siteProductTable.siteId, siteId)
            )
          );

        if (siteProducts.length === 0) {
          throw new HttpError.NotFound(
            "未找到对应的商品，请检查商品ID是否正确"
          );
        }

        const physicalProductIds = siteProducts.map((sp) => sp.productId);

        // 2. [二次校验] 确保这些物理商品属于当前部门 (防止 ID 伪造删除他人商品)
        const validProducts = await tx
          .select({ id: productTable.id })
          .from(productTable)
          .where(
            and(
              inArray(productTable.id, physicalProductIds),
              eq(productTable.deptId, ctx.currentDeptId) // 🔒 锁死部门归属
            )
          );

        const validPhysicalIds = validProducts.map((p) => p.id);

        if (validPhysicalIds.length === 0) {
          throw new HttpError.NotFound(
            "未找到有权删除的源头商品，可能不属于当前部门"
          );
        }

        // 3. 执行物理级联删除 (先子后父)

        // a. 删除关联表
        await tx
          .delete(siteProductTable)
          .where(inArray(siteProductTable.productId, validPhysicalIds));
        await tx
          .delete(productMediaTable)
          .where(inArray(productMediaTable.productId, validPhysicalIds));
        await tx
          .delete(productTemplateTable)
          .where(inArray(productTemplateTable.productId, validPhysicalIds));
        await tx
          .delete(productMasterCategoryTable)
          .where(
            inArray(productMasterCategoryTable.productId, validPhysicalIds)
          );

        // b. 删除 SKU (物理库存)
        await tx
          .delete(skuTable)
          .where(inArray(skuTable.productId, validPhysicalIds));

        // c. 最后删除源商品
        await tx
          .delete(productTable)
          .where(inArray(productTable.id, validPhysicalIds));

        return { count: validPhysicalIds.length, message: "成功删除源头商品" };
      }

      // =========================================================
      // 场景 B: 集团站 (视图删除 - 仅取消收录)
      // =========================================================

      // 1. 显式删除 site_sku (如果数据库没有配置 ON DELETE CASCADE)
      await tx
        .delete(siteSkuTable)
        .where(inArray(siteSkuTable.siteProductId, ids));

      // 2. 删除 site_product
      const result = await tx
        .delete(siteProductTable)
        .where(
          and(
            eq(siteProductTable.siteId, siteId), // 🔒 只能删自己站点的
            inArray(siteProductTable.id, ids)
          )
        )
        .returning({ id: siteProductTable.id });

      if (result.length === 0) {
        throw new HttpError.NotFound("未找到对应的商品，请检查商品ID是否正确");
      }

      return { count: result.length, message: "成功取消收录" };
    });
  }

  /**
   * 删除单个商品
   * @param id 站点商品 ID (site_product.id)
   */
  public async delete(id: string, ctx: ServiceContext) {
    return await this.batchDelete([id], ctx);
  }

  /**
   * 获取 SKU 列表
   * @param id 站点商品 ID (site_product.id)
   */
  public async getSkuList(id: string, ctx: ServiceContext) {
    // 1. [ID 转换] 先获取物理 productId
    const siteProduct = await ctx.db.query.siteProductTable.findFirst({
      where: {
        id,
      },
      columns: { productId: true },
    });

    if (!siteProduct) {
      throw new HttpError.NotFound("商品不存在");
    }

    const physicalProductId = siteProduct.productId;

    // 2. 查询 SKU 列表
    // 这里依然查询 skuTable (物理表)，如果需要站点特定的价格，应该 join siteSkuTable
    const res = await ctx.db.query.skuTable.findMany({
      where: {
        productId: physicalProductId,
        tenantId: ctx.user.context.tenantId!, // 租户隔离
      },
      with: {
        media: {
          orderBy: (skuMedia, { asc }) => [asc(skuMedia.sortOrder)],
        },
        // 可选：如果需要返回站点特定的 SKU 状态或价格，可以在这里加 with siteSkus
      },
    });

    return res;
  }
}
