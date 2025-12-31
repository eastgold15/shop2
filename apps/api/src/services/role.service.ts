import { type RoleContract, roleTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../../lib/type";

export class RoleService {
  public async create(body: RoleContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user?.tenantId ? { tenantId: ctx.user.tenantId } : {}),
      ...(ctx.user?.id ? { createdBy: ctx.user.id } : {}),
    };
    const [res] = await ctx.db.insert(roleTable).values(insertData).returning();
    return res;
  }

  public async findAll(query: RoleContract["ListQuery"], ctx: ServiceContext) {
    const { search } = query;
    const scopeObj = ctx.getScopeObj();
    const res = await ctx.db.query.roleTable.findMany({
      where: {
        tenantId: scopeObj.tenantId,
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: RoleContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(roleTable)
      .set(updateData)
      .where(eq(roleTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(roleTable)
      .where(eq(roleTable.id, id))
      .returning();
    return res;
  }
}
