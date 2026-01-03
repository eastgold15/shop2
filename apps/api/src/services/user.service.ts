import { type UserContract, userTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { db } from "~/db/connection";
import type { UserDto } from "~/middleware/auth";
import { type ServiceContext } from "../lib/type";

export class UserService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async list(query: UserContract["ListQuery"], ctx: ServiceContext) {
    const { search } = query;

    const res = await ctx.db.query.userTable.findMany({
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
    body: UserContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(userTable)
      .set(updateData)
      .where(eq(userTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning();
    return res;
  }

  /**
   * 获取租户下所有可切换的部门/站点列表
   * 租户可以切换到其名下的任何工厂/部门
   */
  async getSwitchableDepartments(user: UserDto) {
    // 获取租户下的所有部门
    const departments = await db.query.departmentTable.findMany({
      where: { parentId: user.context.tenantId! },
      columns: {
        id: true,
        name: true,
        category: true,
        parentId: true,
      },
      with: {
        site: {
          columns: {
            id: true,
            name: true,
            domain: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return {
      current: {
        id: user.context.department?.id,
        name: user.context.department?.name,
        category: user.context.department?.category,
        site: user.context.site
          ? {
            id: user.context.site.id,
            name: user.context.site.name,
            domain: user.context.site.domain,
          }
          : undefined,
      },
      departments: departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        category: dept.category,
        parentId: dept.parentId,
        site: dept.site
          ? {
            id: dept.site.id,
            name: dept.site.name,
            domain: dept.site.domain,
          }
          : undefined,
      })),
    };
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: UserContract["Create"], ctx: ServiceContext) {
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
    const [res] = await ctx.db.insert(userTable).values(insertData).returning();
    return res;
  }


}
