import { type RoleContract, rolePermissionTable, roleTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class RoleService {
  public async create(body: RoleContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user?.context.tenantId
        ? { tenantId: ctx.user.context.tenantId }
        : {}),
      ...(ctx.user?.id ? { createdBy: ctx.user.id } : {}),
    };
    const [res] = await ctx.db.insert(roleTable).values(insertData).returning();
    return res;
  }

  async list(ctx: ServiceContext, query?: RoleContract["ListQuery"]) {
    const res = await ctx.db.query.roleTable.findMany({
      where: {
        ...(query?.search ? { name: { like: `%${query.search}%` } } : {}),
        ...(query?.search
          ? { description: { like: `%${query.search}%` } }
          : {}),
      },
    });


    return res;
  }

  /**
   * 获取角色详情（包含权限列表）
   */
  async detail(roleId: string, ctx: ServiceContext) {
    const role = await ctx.db.query.roleTable.findFirst({
      where: {
        id: roleId,
      },
      with: {
        permissions: true
      },
    });
    return role;
  }

  /**
   * 设置角色权限（批量替换）
   */
  async setPermissions(
    roleId: string,
    permissionIds: string[],
    ctx: ServiceContext
  ) {
    return await ctx.db.transaction(async (tx) => {
      // 1. 删除该角色的所有现有权限
      await tx
        .delete(rolePermissionTable)
        .where(eq(rolePermissionTable.roleId, roleId));

      // 2. 批量插入新权限
      if (permissionIds.length > 0) {
        const rolePermissionData = permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        }));
        await tx.insert(rolePermissionTable).values(rolePermissionData);
      }

      // 3. 返回更新后的角色
      const [updatedRole] = await tx
        .select()
        .from(roleTable)
        .where(eq(roleTable.id, roleId))
        .limit(1);

      return updatedRole;
    });
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
