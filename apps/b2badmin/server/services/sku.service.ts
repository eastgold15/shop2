import { type SkuContract, skuTable } from "@repo/contract";
import { and, eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class SkuService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: SkuContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db.insert(skuTable).values(insertData).returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(query: SkuContract["ListQuery"], ctx: ServiceContext) {
    const { limit = 10, page = 0, sort, ...filters } = query;
    const whereConditions = [];
    // 租户隔离
    if (ctx.user?.tenantId)
      whereConditions.push(eq(skuTable.tenantId, ctx.user.tenantId));

    const data = await ctx.db
      .select()
      .from(skuTable)
      .where(and(...whereConditions))
      .limit(limit)
      .offset((page - 1) * limit);
    const total = await ctx.db.$count(skuTable, and(...whereConditions));
    return { data, total };
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
