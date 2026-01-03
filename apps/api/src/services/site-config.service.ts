import { type SiteConfigContract, siteConfigTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class SiteConfigService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: SiteConfigContract["Create"], ctx: ServiceContext) {
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
    const [res] = await ctx.db
      .insert(siteConfigTable)
      .values(insertData)
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(
    query: SiteConfigContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.siteConfigTable.findMany({
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
    body: SiteConfigContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(siteConfigTable)
      .set(updateData)
      .where(eq(siteConfigTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(siteConfigTable)
      .where(eq(siteConfigTable.id, id))
      .returning();
    return res;
  }
}
