import { salesResponsibilityTable, type UserContract, userRoleTable, userTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { db } from "~/db/connection";
import { auth } from "~/lib/auth";
import type { UserDto } from "~/middleware/auth";
import { type ServiceContext } from "../lib/type";

export class UserService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async list(query: UserContract["ListQuery"], ctx: ServiceContext) {
    const { search } = query;

    const res = await ctx.db.query.userTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
      },
      with: {
        // 获取用户的角色
        roles: true,
        // 获取用户所属部门
        department: true,
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
      where: { tenantId: user.context.tenantId },
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
            siteType: true,
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
        site: {
          id: user.context.site.id,
          name: user.context.site.name,
          domain: user.context.site.domain,
          siteType: user.context.site.siteType,
        },
        parentId: user.context.department.parentId,
      },
      switchableDepartments: departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        category: dept.category,
        parentId: dept.parentId,
        site: {
          id: dept.site.id,
          name: dept.site.name,
          domain: dept.site.domain,
          siteType: dept.site.siteType,
        },
      })),
    };
  }

  /**
   * 创建用户（通用方法）
   * 支持创建任意角色的用户，包括业务员
   */
  public async create(
    body: UserContract["Create"],
    ctx: ServiceContext
  ) {
    const { db, user } = ctx;

    // 使用事务创建用户
    return await db.transaction(async (tx) => {
      // 1. 创建用户（通过 better-auth）
      const newUser = await auth.api.signUpEmail({
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });

      // 2. 更新用户信息
      const [updatedUser] = await tx
        .update(userTable)
        .set({
          phone: body.phone,
          whatsapp: body.whatsapp,
          position: body.position,
          deptId: body.deptId,
          tenantId: user.context.tenantId!,
        })
        .where(eq(userTable.id, newUser.user.id))
        .returning();
      if (!updatedUser) {
        throw new Error("用户创建失败");
      }

      // 3. 分配角色给用户
      await tx.insert(userRoleTable).values({
        userId: updatedUser.id,
        roleId: body.roleId,
      });

      // 4. 如果是业务员角色，分配主分类
      if (body.masterCategoryIds && body.masterCategoryIds.length > 0) {

        // 第一步：构建要插入的数据数组
        // 这里的 map 会返回一个对象数组：[{ userId: '...', masterCategoryId: '...', tenantId: '...' }, ...]
        const insertData = body.masterCategoryIds.map((catId) => ({
          userId: updatedUser.id,
          masterCategoryId: catId, // 注意：这里对应你表里的单数列名
          tenantId: user.context.tenantId, // 🌟 别忘了带上租户ID，这很重要！
          // 如果表里有 priority 或 isAutoAssign 且有默认值，这里可以不传
        }));

        // 第二步：直接把数组传给 values()
        // Drizzle 会自动把它转换成单条 SQL: INSERT INTO ... VALUES (...), (...), (...)
        await tx.insert(salesResponsibilityTable).values(insertData);
      }


      // 返回用户详情
      const userDetails = await tx.query.userTable.findFirst({
        where: {
          id: updatedUser.id
        },
        with: {
          roles: true,
          department: true,
          assignMasterCategories: true,
        },
      });
      return userDetails;
    });
  }


}
