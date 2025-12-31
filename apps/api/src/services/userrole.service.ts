import { type UserRoleContract, userRoleTable } from "@repo/contract";
import { and, eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

type UserDto = {
  id: string;
  name: string;
  address: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  image: string | null;
  isSuperAdmin: boolean;
  phone: string | null;
  city: string | null;
};

/**
 * 用户角色关联服务
 * 注意：userRoleTable 是联合表（userId + roleId），没有独立的 id
 */
export class UserRoleService {
  /**
   * 为用户分配角色
   */
  async assign(userId: string, roleId: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .insert(userRoleTable)
      .values({ userId, roleId })
      .returning();
    return res;
  }

  /**
   * 移除用户角色
   */
  async remove(userId: string, roleId: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(userRoleTable)
      .where(
        and(eq(userRoleTable.userId, userId), eq(userRoleTable.roleId, roleId))
      )
      .returning();
    return res;
  }

  /**
   * 获取用户的角色列表
   */
  async getUserRoles(userId: string, ctx: ServiceContext) {
    const user = await ctx.db.query.userTable.findFirst({
      where: {
        id: userId,
      },
      with: {
        roles: true,
      },
    });
    return user?.roles ?? [];
  }

  /**
   * 获取角色下的用户列表
   */
  async getRoleUsers(roleId: string, ctx: ServiceContext) {
    // 由于关系定义在 userTable.roles 上，需要反向查询
    // 通过查询所有用户并过滤有该角色的用户
    const users = await ctx.db.query.userTable.findMany({
      with: {
        roles: {
          where: {
            id: roleId,
          },
        },
      },
    });

    return users
      .filter((u) => u.roles.length > 0)
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isActive: u.isActive,
      }));
  }

  /**
   * 获取该用户身份下的用户角色管理列表
   * 根据用户身份过滤可见的用户角色分配
   */
  async list(ctx: ServiceContext, user: UserDto) {
    // 超管可以看到所有用户及其角色
    if (user.isSuperAdmin) {
      const users = await ctx.db.query.userTable.findMany({
        with: {
          roles: true,
        },
      });

      // 转换为用户角色列表格式
      return users.flatMap((u) =>
        u.roles.map((r) => ({
          userId: u.id,
          roleId: r.id,
          user: {
            id: u.id,
            name: u.name,
            email: u.email,
            isActive: u.isActive,
            isSuperAdmin: u.isSuperAdmin,
          },
          role: {
            id: r.id,
            name: r.name,
            description: r.description,
            type: r.type,
            priority: r.priority,
          },
        }))
      );
    }

    // 非超管需要过滤租户内的用户
    const scopeObj = ctx.getScopeObj();
    const users = await ctx.db.query.userTable.findMany({
      where: {
        tenantId: scopeObj.tenantId,
      },
      with: {
        roles: true,
      },
    });

    return users.flatMap((u) =>
      u.roles.map((r) => ({
        userId: u.id,
        roleId: r.id,
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          isActive: u.isActive,
          isSuperAdmin: u.isSuperAdmin,
        },
        role: {
          id: r.id,
          name: r.name,
          description: r.description,
          type: r.type,
          priority: r.priority,
        },
      }))
    );
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: UserRoleContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db
      .insert(userRoleTable)
      .values(insertData)
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(
    query: UserRoleContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { sort, ...filters } = query;

    const res = await ctx.db.query.userRoleTable.findMany({
      where: {
        deptId: ctx.currentDeptId,
        tenantId: ctx.user.tenantId!,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: UserRoleContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(userRoleTable)
      .set(updateData)
      .where(eq(userRoleTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(userRoleTable)
      .where(eq(userRoleTable.id, id))
      .returning();
    return res;
  }
}
