import {
  type DepartmentContract,
  departmentTable,
  siteTable,
  userRoleTable,
} from "@repo/contract";
import { eq } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { auth } from "~/lib/auth";
import { type ServiceContext } from "../lib/type";

export class DepartmentService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: DepartmentContract["Create"], ctx: ServiceContext) {
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
      .insert(departmentTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async list(
    query: DepartmentContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.departmentTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  public async update(
    id: string,
    body: DepartmentContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(departmentTable)
      .set(updateData)
      .where(eq(departmentTable.id, id))
      .returning();
    return res;
  }

  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(departmentTable)
      .where(eq(departmentTable.id, id))
      .returning();
    return res;
  }

  public async detail(id: string, ctx: ServiceContext) {
    const department = await ctx.db.query.departmentTable.findFirst({
      where: {
        id,
      },
      with: {
        users: {
          with: {
            roles: true,
          },
        },
      },
    });

    if (!department) {
      throw new HttpError.NotFound("部门不存在");
    }

    const manager = department.users?.find(
      (user) =>
        user.roles.some((role) => role.name === "dept_manager") && user.isActive
    );

    return {
      ...department,
      manager: manager
        ? {
          id: manager.id,
          name: manager.name,
          email: manager.email,
        }
        : null,
    };
  }

  /**
   * 创建部门+站点+管理员
   * 使用事务确保数据一致性
   */
  async createDepartmentWithSiteAndAdmin(
    body: typeof DepartmentContract.CreateDepartmentWithSiteAndAdmin.static,
    ctx: ServiceContext
  ) {
    const { db, user } = ctx;

    // 使用事务执行
    return await db.transaction(async (tx) => {
      // 1. 创建部门

      const [department] = await tx
        .insert(departmentTable)
        .values({
          tenantId: user.context.tenantId!,
          name: body.department.name,
          parentId: body.department.parentId || null,
          // name: body.department.name,
          code: body.department.code,
          category: body.department.category as "factory" | "group",
          address: body.department.address,
          contactPhone: body.department.contactPhone,
          logo: body.department.logo,
          extensions: body.department.extensions || null,
          isActive: true,
        })
        .returning();

      const departmentId = department.id;

      const [site] = await tx
        .insert(siteTable)
        .values({
          tenantId: user.context.tenantId!,
          boundDeptId: departmentId,
          siteType: "factory",
          name: body.site.name,
          domain: body.site.domain,
          isActive: body.site.isActive ?? true,
        })
        .returning();

      const newUser = await auth.api.signUpEmail({
        body: {
          name: body.admin.name,
          email: body.admin.email,
          password: body.admin.password, // ⚠️ 生产环境应该先哈希
          tenantId: user.context.tenantId!,
          deptId: departmentId,
        },
      });

      // 5. 查找或创建 "dept_manager" 角色
      const role = await tx.query.roleTable.findFirst({
        where: {
          name: "dept_manager",
        },
      });
      if (!role) throw new HttpError.NotFound("角色 dept_manager 不存在");

      // 6. 分配角色给用户
      await tx.insert(userRoleTable).values({
        userId: newUser.user.id,
        roleId: role.id,
      });

      return {
        department: {
          id: department.id,
          name: department.name,
        },
        site: {
          id: site.id,
          name: site.name,
          domain: site.domain,
        },
        admin: {
          id: newUser.user.id,
          name: newUser.user.name,
          email: newUser.user.email,
        },
      };
    });
  }
}
