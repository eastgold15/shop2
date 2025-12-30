import { type TenantContract, tenantTable } from "@repo/contract";
import { and, eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class TenantService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: TenantContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db
      .insert(tenantTable)
      .values(insertData)
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(
    query: TenantContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { limit = 10, page = 0, sort, ...filters } = query;
    const whereConditions = [];
    // 租户隔离
    if (ctx.user?.tenantId)
      whereConditions.push(eq(tenantTable.tenantId, ctx.user.tenantId));

    const data = await ctx.db
      .select()
      .from(tenantTable)
      .where(and(...whereConditions))
      .limit(limit)
      .offset((page - 1) * limit);
    const total = await ctx.db.$count(tenantTable, and(...whereConditions));
    return { data, total };
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: TenantContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(tenantTable)
      .set(updateData)
      .where(eq(tenantTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(tenantTable)
      .where(eq(tenantTable.id, id))
      .returning();
    return res;
  }
}
