import { type SiteProductContract, siteProductTable } from "@repo/contract";
import { eq } from "drizzle-orm";
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
}
