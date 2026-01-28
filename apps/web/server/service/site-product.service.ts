/**
 * ✍️ 【WEB Service - 业务自定义】
 * --------------------------------------------------------
 * 💡 你可以在此重写基类方法或添加私有业务逻辑。
 * 🛡️ 自动化脚本永远不会覆盖此文件。
 * --------------------------------------------------------
 */
import {
  mediaTable,
  type ProductContract,
  productMediaTable,
  productTable,
  productTemplateTable,
  productVariantMediaTable,
  siteProductSiteCategoryTable,
  siteProductTable,
  siteSkuTable,
  skuTable,
  templateKeyTable,
  templateValueTable,
} from "@repo/contract";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import type { ServiceContext } from "~/middleware/site";

export class SiteProductService {
  /**
   * 🛒 获取带聚合信息的商品列表
   */
  async list(query: ProductContract["ListQuery"], ctx: ServiceContext) {
    const {
      page = 1,
      limit = 10,
      sort = "sortOrder",
      sortOrder = "asc",
      categoryId, // 站点分类 ID
      search, // 搜索关键词
    } = query;

    // 1. 构建基础查询
    const baseQuery = ctx.db
      .select({
        // --- 站点商品字段 (优先) ---
        siteProductId: siteProductTable.id,
        // 如果 siteName 为空，则回退到 productTable.name
        displayName: sql<string>`COALESCE(${siteProductTable.siteName}, ${productTable.name})`,
        displayDesc: sql<string>`COALESCE(${siteProductTable.siteDescription}, ${productTable.description})`,
        isFeatured: siteProductTable.isFeatured,
        sortOrder: siteProductTable.sortOrder,

        // --- 物理产品字段 ---
        productId: productTable.id,
        spuCode: productTable.spuCode,

        // --- 聚合：最低价 (SiteSku 优先) ---
        minPrice: sql<string>`(
          SELECT MIN(COALESCE(${siteSkuTable.price}, ${skuTable.price}))
          FROM ${skuTable}
          LEFT JOIN ${siteSkuTable} ON 
            ${siteSkuTable.skuId} = ${skuTable.id} AND 
            ${siteSkuTable.siteId} = ${ctx.site.id}
          WHERE ${skuTable.productId} = ${productTable.id}
          AND COALESCE(${siteSkuTable.isActive}, true) = true
        )`.as("min_price"),

        // --- 聚合：主图 ---
        // 优先级：商品主图 → 变体主图 → 第一张变体图 → 第一张商品图
        mainMedia: sql<string>`COALESCE(
          -- 1. 优先：商品级主图
          (
            SELECT ${mediaTable.url}
            FROM ${productMediaTable}
            INNER JOIN ${mediaTable} ON ${mediaTable.id} = ${productMediaTable.mediaId}
            WHERE ${productMediaTable.productId} = ${productTable.id}
              AND ${productMediaTable.isMain} = true
            LIMIT 1
          ),
          -- 2. 其次：变体级主图
          (
            SELECT ${mediaTable.url}
            FROM ${productVariantMediaTable}
            INNER JOIN ${mediaTable} ON ${mediaTable.id} = ${productVariantMediaTable.mediaId}
            WHERE ${productVariantMediaTable.productId} = ${productTable.id}
              AND ${productVariantMediaTable.isMain} = true
            ORDER BY ${productVariantMediaTable.sortOrder} ASC
            LIMIT 1
          ),
          -- 3. 再次：第一张变体图
          (
            SELECT ${mediaTable.url}
            FROM ${productVariantMediaTable}
            INNER JOIN ${mediaTable} ON ${mediaTable.id} = ${productVariantMediaTable.mediaId}
            WHERE ${productVariantMediaTable.productId} = ${productTable.id}
            ORDER BY ${productVariantMediaTable.sortOrder} ASC
            LIMIT 1
          ),
          -- 4. 最后：第一张商品图
          (
            SELECT ${mediaTable.url}
            FROM ${productMediaTable}
            INNER JOIN ${mediaTable} ON ${mediaTable.id} = ${productMediaTable.mediaId}
            WHERE ${productMediaTable.productId} = ${productTable.id}
            ORDER BY ${productMediaTable.sortOrder} ASC
            LIMIT 1
          )
        )`.as("main_media"),
      })
      .from(siteProductTable)
      // 必须关联物理产品表拿基础字段
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      // 如果传入了站点分类 ID，则关联中间表过滤
      .leftJoin(
        siteProductSiteCategoryTable,
        eq(siteProductTable.id, siteProductSiteCategoryTable.siteProductId)
      );

    // 2. 注入过滤条件 (站点隔离是必须的)
    const filters = [
      eq(siteProductTable.siteId, ctx.site.id),
      eq(productTable.status, 1), // 只返回启用的商品
    ];
    if (categoryId) {
      filters.push(eq(siteProductSiteCategoryTable.siteCategoryId, categoryId));
    }
    // 搜索关键词：匹配站点商品名称或物理商品名称（不区分大小写）
    if (search) {
      const searchTerm = `%${search}%`;
      filters.push(
        sql`(
          ${siteProductTable.siteName} ILIKE ${searchTerm}
          OR ${productTable.name} ILIKE ${searchTerm}
        )`
      );
    }

    // 3. 执行查询
    const data = await baseQuery
      .where(and(...filters))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(
        sortOrder === "desc"
          ? desc(siteProductTable.sortOrder)
          : asc(siteProductTable.sortOrder)
      );

    // 4. 计算总数
    const [{ count }] = await ctx.db
      .select({ count: sql<number>`count(distinct ${siteProductTable.id})` })
      .from(siteProductTable)
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      .leftJoin(
        siteProductSiteCategoryTable,
        eq(siteProductTable.id, siteProductSiteCategoryTable.siteProductId)
      )
      .where(and(...filters));

    return { data, total: count };
  }

  /**
   * 🔍 获取商品详情 (使用 Relational Query)
   */

  // async getDetail(id: string, ctx: ServiceContext) {
  //   const result = await ctx.db.query.siteProductTable.findFirst({
  //     where: {
  //       id,
  //       siteId: ctx.site.id,
  //     },
  //     // 🔥 使用 extras 混合原生 SQL 逻辑
  //     extras: {
  //       // 这里的 table 代表 siteProductTable
  //       displayName: (table) =>
  //         sql<string>`COALESCE(${table.siteName}, (SELECT ${productTable.name} FROM ${productTable} WHERE ${productTable.id} = ${table.productId}))`.as(
  //           "display_name"
  //         ),

  //       displayDesc: (table) =>
  //         sql<string>`COALESCE(${table.siteDescription}, (SELECT ${productTable.description} FROM ${productTable} WHERE ${productTable.id} = ${table.productId}))`.as(
  //           "display_desc"
  //         ),
  //     },
  //     // 嵌套拉取所有关联资产
  //     with: {
  //       // 拉取物理商品表（如果你还想看原始字段）
  //       product: {
  //         with: {
  //           media: true,
  //         },
  //       },
  //       // 拉取站点分类
  //       siteCategories: true,
  //       siteSkus: {
  //         with: {
  //           sku: {
  //             with: {
  //               media: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!result) throw new Error("商品不存在");

  //   // --- 开始清洗数据 ---
  //   // --- 开始清洗数据 ---
  //   return {
  //     // 1. 站点层基础属性 (直接展开)
  //     siteProductId: result.id, // ✅ 修复：返回 siteProduct 的 ID，不是 product 的 ID
  //     siteId: result.siteId,
  //     sortOrder: result.sortOrder,
  //     isFeatured: result.isFeatured,
  //     isVisible: result.isVisible,
  //     seoTitle: result.seoTitle,
  //     createdAt: result.createdAt,

  //     // 2. 应用覆盖逻辑 (使用 SQL extras 算出的结果)
  //     displayName: result.displayName,
  //     displayDesc: result.displayDesc,

  //     // 3. 资产层物理属性 (spuCode 等)
  //     spuCode: result.product?.spuCode,

  //     // 4. 清洗视频列表 (Gallery)
  //     //  第一张是视频
  //     media: result.product.media
  //       .map((pm) => ({
  //         url: pm.url,
  //         mediaType: pm.mediaType,
  //         sortOrder: pm.sortOrder,
  //         id: pm.id,
  //       }))
  //       .sort((a, b) => a.sortOrder - b.sortOrder),

  //     // 5. 清洗规格列表 (SKUs)
  //     // 逻辑：siteSku 覆盖价格和状态，物理 Sku 提供 code 和规格 JSON
  //     skus: result.siteSkus.map((ss) => {
  //       const pSku = ss.sku; // 物理 SKU
  //       return {
  //         siteSkuId: ss.id,
  //         skuCode: pSku.skuCode,
  //         // 价格逻辑：站点价格不存在(null)则回退到物理价格
  //         price: pSku.price,
  //         costPrice: pSku.costPrice,
  //         marketPrice: pSku.marketPrice,
  //         weight: pSku.weight,
  //         volume: pSku.volume,
  //         stock: pSku.stock,
  //         specJson: pSku.specJson, // 存储颜色、尺寸等
  //         extraAttributes: pSku.extraAttributes,
  //         isActive: ss.isActive,
  //         // 规格图片展平
  //         media: pSku.media
  //           .map((sm) => ({
  //             url: sm.url,
  //             mediaType: sm.mediaType,
  //             sortOrder: sm.sortOrder,
  //             id: sm.id,
  //           }))
  //           .sort((a, b) => a.sortOrder - b.sortOrder),
  //       };
  //     }),
  //     // 6. 清洗分类 (简单的 ID 数组或对象数组)
  //     siteCategories: result.siteCategories.map((sc) => ({
  //       id: sc.id,
  //       name: sc.name,
  //     })),
  //   };
  // }

  async getDetail(id: string, ctx: ServiceContext) {
    const result = await ctx.db.query.siteProductTable.findFirst({
      where: {
        id,
        siteId: ctx.site.id,
        RAW: (table) => sql`EXISTS (
          SELECT 1
          FROM ${productTable}
          WHERE ${productTable.id} = ${table.productId}
          AND ${productTable.status} = 1
        )`,
      },
      with: {
        product: {
          with: {
            // 🔥 新增：查询变体媒体
            variantMedia: {
              with: {
                media: true,
                attributeValue: true, // 获取属性值信息
              },
            },
          },
        },
        siteCategories: true,
        siteSkus: {
          with: {
            sku: {
              with: { media: true },
            },
          },
        },
      },
    });

    if (!result) throw new Error("商品不存在");

    // 🔥 识别颜色属性
    const identifyColorAttribute = async () => {
      const [productTemplate] = await ctx.db
        .select()
        .from(productTemplateTable)
        .where(eq(productTemplateTable.productId, result.productId));

      if (!productTemplate) return null;

      const keys = await ctx.db
        .select()
        .from(templateKeyTable)
        .where(
          and(
            eq(templateKeyTable.templateId, productTemplate.templateId),
            eq(templateKeyTable.isSkuSpec, true)
          )
        );

      const colorKey = keys.find((k) => /color|颜色|colour/i.test(k.key));
      return colorKey ? { key: colorKey.key, keyId: colorKey.id } : null;
    };

    const colorAttr = await identifyColorAttribute();

    // 🔥 构建颜色值到 attributeValueId 的映射
    const colorValueToIdMap = new Map<string, string>();
    if (colorAttr) {
      const values = await ctx.db
        .select()
        .from(templateValueTable)
        .where(eq(templateValueTable.templateKeyId, colorAttr.keyId));

      values.forEach((v) => {
        colorValueToIdMap.set(v.value, v.id);
      });
    }

    // --- 媒体处理逻辑：不包含商品级图片，只包含变体和 SKU 图片 ---
    const processMedia = (mediaArr: any[], offset = 0, isVideoLast = true) => {
      return mediaArr.map((m) => {
        let weight = (m.sortOrder ?? 0) + offset;
        if (isVideoLast && m.mediaType?.startsWith("video")) {
          weight += 10_000; // 视频权重极大，确保置底
        }
        return {
          id: m.id,
          url: m.url,
          mediaType: m.mediaType,
          sortOrder: weight,
        };
      });
    };

    // 🔥 聚合媒体：变体媒体 (权重 1000) + SKU 媒体 (权重 2000)
    const variantMedia =
      result.product.variantMedia?.flatMap((vm) =>
        processMedia([vm.media], 1000)
      ) || [];

    const skuMedia = result.siteSkus.flatMap((ss) =>
      processMedia(ss.sku.media, 2000)
    );

    const gallery = [...variantMedia, ...skuMedia].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );

    // --- 响应值封装 ---
    return {
      // 1. 身份信息
      id: result.id, // 前端直接用 id
      productId: result.productId,
      spuCode: result.product?.spuCode,

      // 2. 显示内容 (已处理覆盖逻辑)
      name: result.siteName || result.product?.name,
      description: result.siteDescription || result.product?.description,
      seoTitle: result.seoTitle,

      // 3. 状态与配置
      isFeatured: result.isFeatured,
      isVisible: result.isVisible,
      createdAt: result.createdAt,

      // 4. customAttributes
      customAttributes: result.product?.customAttributes || {},

      // 5. 规格列表 (包含变体媒体继承逻辑)
      skus: result.siteSkus.map((ss) => {
        const pSku = ss.sku;
        const specs = pSku.specJson as Record<string, string>;

        // 🔥 三级继承逻辑计算 mediaIds
        // 1. SKU 专属媒体 (最高优先级)
        const ownMediaIds = pSku.media.map((m) => m.id);

        // 2. 变体级媒体 (按颜色继承)
        let inheritedMediaIds: string[] = [];
        if (colorAttr && colorValueToIdMap.size > 0) {
          const colorValue = specs[colorAttr.key] || specs.颜色;
          if (colorValue) {
            const attributeValueId = colorValueToIdMap.get(colorValue);
            if (attributeValueId) {
              inheritedMediaIds =
                result.product.variantMedia
                  ?.filter((vm) => vm.attributeValueId === attributeValueId)
                  .map((vm) => vm.mediaId) || [];
            }
          }
        }

        // 合并：变体级继承 + SKU专属 (SKU专属优先级更高，放在后面)
        const mediaIds = Array.from(
          new Set([...inheritedMediaIds, ...ownMediaIds])
        );

        return {
          id: ss.id, // siteSkuId
          skuCode: pSku.skuCode,
          price: ss.price || pSku.price,
          stock: pSku.stock,
          specJson: specs,
          isActive: ss.isActive,
          // 🔥 前端根据此过滤 gallery
          mediaIds,
        };
      }),

      // 5. 媒体库 (只包含变体和 SKU 图片)
      gallery,

      // 6. 分类
      categories: result.siteCategories.map((sc) => ({
        id: sc.id,
        name: sc.name,
      })),

      // 7. 颜色属性名 (前端用于识别颜色选择器)
      colorAttributeKey: colorAttr?.key,
    };
  }
}
