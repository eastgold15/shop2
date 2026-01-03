import { type TenantContract, tenantTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class TenantService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: TenantContract["Create"], ctx: ServiceContext) {
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
      .insert(tenantTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async list(
    query: TenantContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.tenantTable.findMany({
      where: {
        id: ctx.user.context.tenantId!,
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
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
