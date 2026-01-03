import { type ProductContract, productTable } from "@repo/contract";
import { eq, and, desc, inArray } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class ProductService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: ProductContract["Create"], ctx: ServiceContext) {
      const userContext = ctx.user.context;
      const insertData = {
              ...body,
              // 自动注入租户信息
              ...(ctx.user ? { tenantId: userContext.tenantId!, createdBy: ctx.user.id } : {})
            };
            const [res] = await ctx.db.insert(productTable).values(insertData).returning();
            return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(query: ProductContract["ListQuery"], ctx: ServiceContext) {
      const {  sort, ...filters } = query;
      const userContext = ctx.user.context;

            const res = await ctx.db.query.productTable.findMany({
              where: {
                deptId: ctx.currentDeptId,
                tenantId: userContext!.tenantId!,
              },
              orderBy: {
              createdAt: "desc",
            },
          })

           return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(id: string, body: ProductContract["Update"], ctx: ServiceContext) {
      const updateData = { ...body, updatedAt: new Date() };
             const [res] = await ctx.db.update(productTable)
               .set(updateData)
               .where(eq(productTable.id, id))
               .returning();
             return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
      const [res] = await ctx.db.delete(productTable).where(eq(productTable.id, id)).returning();
             return res;
  }

  /** 批量删除 - 自定义方法 */
  public async batchDelete(ids: string[], ctx: ServiceContext) {
    const res = await ctx.db
      .delete(productTable)
      .where(
        inArray(
          productTable.id,
          ids
        )
      )
      .returning();
    return res;
  }
}
