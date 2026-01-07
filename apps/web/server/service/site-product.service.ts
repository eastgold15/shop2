/**
 * ✍️ 【WEB Service - 业务自定义】
 * --------------------------------------------------------
 * 💡 你可以在此重写基类方法或添加私有业务逻辑。
 * 🛡️ 自动化脚本永远不会覆盖此文件。
 * --------------------------------------------------------
 */
import {
  mediaTable,
  ProductContract,
  productMediaTable,
  productTable,
  siteProductCategoryTable,
  siteProductTable,
  siteSkuTable,
  skuTable,
} from "@repo/contract";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { ServiceContext } from "~/middleware/site";

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
        units: productTable.units,

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
        mainMedia: sql<string>`(
          SELECT ${mediaTable.url}
          FROM ${productMediaTable}
          INNER JOIN ${mediaTable} ON ${mediaTable.id} = ${productMediaTable.mediaId}
          WHERE ${productMediaTable.productId} = ${productTable.id}
          ORDER BY ${productMediaTable.isMain} DESC, ${productMediaTable.sortOrder} ASC
          LIMIT 1
        )`,
      })
      .from(siteProductTable)
      // 必须关联物理产品表拿基础字段
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      // 如果传入了站点分类 ID，则关联中间表过滤
      .leftJoin(
        siteProductCategoryTable,
        eq(siteProductTable.id, siteProductCategoryTable.siteProductId)
      );

    // 2. 注入过滤条件 (站点隔离是必须的)
    const filters = [eq(siteProductTable.siteId, ctx.site.id)];
    if (categoryId) {
      filters.push(eq(siteProductCategoryTable.siteCategoryId, categoryId));
    }

    // 3. 执行查询
    const data = await baseQuery
      .where(and(...filters))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(
        sortOrder === "desc"
          ? desc(
            siteProductTable.createdAt
          )
          : asc(
            siteProductTable.createdAt
          )
      );


    // 4. 计算总数
    const [{ count }] = await ctx.db
      .select({ count: sql<number>`count(distinct ${siteProductTable.id})` })
      .from(siteProductTable)
      .leftJoin(
        siteProductCategoryTable,
        eq(siteProductTable.id, siteProductCategoryTable.siteProductId)
      )
      .where(and(...filters));

    return { data, total: count };
  }

  /**
   * 🔍 获取商品详情 (使用 Relational Query)
   */

  async getDetail(id: string, ctx: ServiceContext) {
    const result = await ctx.db.query.siteProductTable.findFirst({
      where: {
        id,
        siteId: ctx.site.id,
      },
      // 🔥 使用 extras 混合原生 SQL 逻辑
      extras: {
        // 这里的 table 代表 siteProductTable
        displayName: (table) =>
          sql<string>`COALESCE(${table.siteName}, (SELECT ${productTable.name} FROM ${productTable} WHERE ${productTable.id} = ${table.productId}))`.as("display_name"),

        displayDesc: (table) =>
          sql<string>`COALESCE(${table.siteDescription}, (SELECT ${productTable.description} FROM ${productTable} WHERE ${productTable.id} = ${table.productId}))`.as("display_desc"),
      },
      // 嵌套拉取所有关联资产
      with: {
        // 拉取物理商品表（如果你还想看原始字段）
        product: {
          with: {
            productMedia: {
              with: {
                media: true,
              },
            },
          },
        },
        // 拉取站点分类
        siteCategories: true,
        siteSkus: {
          with: {
            sku: {
              with: {
                skuMedia: {
                  with: {
                    media: true,
                  },
                },
              },
            },
          }
        }
      },
    });

    if (!result) throw new Error("商品不存在");

    // --- 开始清洗数据 ---
    // --- 开始清洗数据 ---
    return {
      // 1. 站点层基础属性 (直接展开)
      id: result.id,
      productId: result.productId,
      siteId: result.siteId,
      sortOrder: result.sortOrder,
      isFeatured: result.isFeatured,
      isVisible: result.isVisible,
      seoTitle: result.seoTitle,
      createdAt: result.createdAt,

      // 2. 应用覆盖逻辑 (使用 SQL extras 算出的结果)
      name: result.displayName,
      description: result.displayDesc,

      // 3. 资产层物理属性 (spuCode 等)
      spuCode: result.product?.spuCode,
      units: result.product?.units,

      // 4. 清洗图片列表 (Gallery)
      // 路径: result.product -> productMedia -> media
      images: result.product?.productMedia.map(pm => ({
        url: pm.media?.url,
        mediaType: pm.media?.mediaType,
        isMain: pm.isMain,
        sortOrder: pm.sortOrder,
        id: pm.mediaId
      })).sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0) || a.sortOrder - b.sortOrder) || [],

      // 5. 清洗规格列表 (SKUs)
      // 逻辑：siteSku 覆盖价格和状态，物理 Sku 提供 code 和规格 JSON
      skus: result.siteSkus.map(ss => {
        const pSku = ss.sku; // 物理 SKU
        return {
          siteSkuId: ss.id,
          skuId: ss.skuId,
          skuCode: pSku?.skuCode,
          // 价格逻辑：站点价格不存在(null)则回退到物理价格
          price: ss.price ?? pSku?.price,
          stock: pSku?.stock,
          specJson: pSku?.specJson, // 存储颜色、尺寸等
          isActive: ss.isActive,
          // 规格图片展平
          images: pSku?.skuMedia.map(sm => ({
            url: sm.media?.url,
            isMain: sm.isMain,
            sortOrder: sm.sortOrder
          })) || []
        };
      }),

      // 6. 清洗分类 (简单的 ID 数组或对象数组)
      categories: result.siteCategories.map(sc => ({
        id: sc.id,
        name: sc.name
      }))
    };
  }


}
