import {
  mediaTable,
  productMediaTable,
  productTable,
  siteProductSiteCategoryTable,
  siteProductTable,
  siteSkuTable,
  skuTable,
} from "@repo/contract";
import { and, eq, min, sql } from "drizzle-orm";
import { ServiceContext } from "~/middleware/site";

/**
 * 🛠️ Category 业务实现
 */
export class SiteCategoryService {
  /**
   * 获取站点分类树
   */
  async tree(ctx: ServiceContext) {
    const res = await ctx.db.query.siteCategoryTable.findMany({
      where: {
        siteId: ctx.site.id,
      },
      with: {
        children: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
    return res;
  }

  async getProductsByCategoryId(
    ctx: ServiceContext,
    id: string,
    query: { page: number; limit: number }
  ) {
    const { page = 1, limit = 10 } = query;

    const flatProducts = await ctx.db
      .select({
        id: productTable.id,
        displayName: sql<string>`COALESCE(${siteProductTable.siteName}, ${productTable.name})`,
        displayDesc: sql<string>`COALESCE(${siteProductTable.siteDescription}, ${productTable.description})`,

        // 🔥 核心图片逻辑：从中间表关联查询第一张图
        mainMedia: sql<string>`(
      SELECT ${mediaTable.url} 
      FROM ${productMediaTable}
      INNER JOIN ${mediaTable} ON ${mediaTable.id} = ${productMediaTable.mediaId}
      WHERE ${productMediaTable.productId} = ${productTable.id}
      ORDER BY ${productMediaTable.sortOrder} ASC 
      LIMIT 1
    )`,

        minPrice: min(
          sql`COALESCE(${siteSkuTable.price}, ${skuTable.price})`
        ).as("min_price"),

        spuCode: productTable.spuCode,
        isFeatured: siteProductTable.isFeatured,
      })
      .from(siteProductSiteCategoryTable)
      .innerJoin(siteProductTable, eq(siteProductSiteCategoryTable.siteProductId, siteProductTable.id))
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      // 必须连接 sku 表，minPrice 才能算出来
      .innerJoin(skuTable, eq(skuTable.productId, productTable.id))
      .leftJoin(
        siteSkuTable,
        and(
          eq(siteSkuTable.skuId, skuTable.id),
          eq(siteSkuTable.siteId, ctx.site.id)
        )
      )
      .where(
        and(
          eq(siteProductSiteCategoryTable.siteCategoryId, id),
          eq(siteProductTable.siteId, ctx.site.id)
        )
      )
      .groupBy(siteProductTable.id, productTable.id)
      .limit(limit)
      .offset((page - 1) * limit);
    return flatProducts;
  }

  /**
   * 获取单个分类 (带站点检查)
   */
  async getById(id: string, ctx: ServiceContext) {
    const res = await ctx.db.query.siteCategoryTable.findFirst({
      where: {
        id,
        siteId: ctx.site.id,
      },
    });
    return res;
  }
}
