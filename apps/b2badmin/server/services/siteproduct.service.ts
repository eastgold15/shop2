import { type SiteProductContract, siteProductTable } from "@repo/contract";
import { and, eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class SiteProductService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(
    body: SiteProductContract["Create"],
    ctx: ServiceContext
  ) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db
      .insert(siteProductTable)
      .values(insertData)
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(
    query: SiteProductContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { limit = 10, page = 0, sort, ...filters } = query;
    const whereConditions = [];
    // 租户隔离
    if (ctx.user?.tenantId)
      whereConditions.push(eq(siteProductTable.tenantId, ctx.user.tenantId));

    const data = await ctx.db
      .select()
      .from(siteProductTable)
      .where(and(...whereConditions))
      .limit(limit)
      .offset((page - 1) * limit);
    const total = await ctx.db.$count(
      siteProductTable,
      and(...whereConditions)
    );
    return { data, total };
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
}
