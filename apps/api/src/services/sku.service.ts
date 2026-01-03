import { type SkuContract, skuTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class SkuService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: SkuContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? {
            tenantId: ctx.user.context.tenantId!,
            createdBy: ctx.user.id,
            deptId: ctx.currentDeptId,
          }
        : {}),
    };
    const [res] = await ctx.db.insert(skuTable).values(insertData).returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(query: SkuContract["ListQuery"], ctx: ServiceContext) {
    const { search } = query;

    const res = await ctx.db.query.skuTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { originalName: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: SkuContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(skuTable)
      .set(updateData)
      .where(eq(skuTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(skuTable)
      .where(eq(skuTable.id, id))
      .returning();
    return res;
  }
}
