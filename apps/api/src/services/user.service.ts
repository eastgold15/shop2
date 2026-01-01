import { type UserContract, userTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";
import { db } from "~/db/connection";
import { UserDto } from "~/middleware/auth";

export class UserService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(query: UserContract["ListQuery"], ctx: ServiceContext) {
    const { sort, ...filters } = query;

    const res = await ctx.db.query.userTable.findMany({
      where: {
        deptId: ctx.currentDeptId,
        tenantId: ctx.user.context.tenantId!,
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
        site: user.context.site,
      },
      departments: departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        category: dept.category,
        parentId: dept.parentId,
        site: dept.site,
      })),
    };
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: UserContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.context.tenantId, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db.insert(userTable).values(insertData).returning();
    return res;
  }
}
