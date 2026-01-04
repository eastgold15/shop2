import { type PermissionContract, permissionTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "~/lib/type";

export class PermissionService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: PermissionContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
    };
    const [res] = await ctx.db
      .insert(permissionTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async list(
    query: PermissionContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;
    const res = await ctx.db.query.permissionTable.findMany({
      where: {
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: PermissionContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(permissionTable)
      .set(updateData)
      .where(eq(permissionTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(permissionTable)
      .where(eq(permissionTable.id, id))
      .returning();
    return res;
  }

}
