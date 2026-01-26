import {
  productTable,
  type SiteProductContract,
  siteProductTable,
} from "@repo/contract";
import { and, eq, inArray } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class SiteProductService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(
    body: SiteProductContract["Create"],
    ctx: ServiceContext
  ) {
    if (!ctx.user?.context?.tenantId) {
      throw new Error("User context or tenantId is required");
    }

    if (!ctx.user?.context?.site?.id) {
      throw new Error("Site context is required");
    }
    const insertData = {
      ...body,
      tenantId: ctx.user.context.tenantId!,
      createdBy: ctx.user.id,
      deptId: ctx.currentDeptId,
      siteId: (ctx.user.context.site as any).id!,
    };
    const [res] = await ctx.db
      .insert(siteProductTable)
      .values(insertData)
      .returning();
    return res;
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

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: SiteProductContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(siteProductTable)
      .set(updateData)
      .where(eq(siteProductTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(siteProductTable)
      .where(eq(siteProductTable.id, id))
      .returning();
    return res;
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
}
