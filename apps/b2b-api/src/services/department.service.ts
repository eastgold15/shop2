import { randomBytes, scryptSync } from "node:crypto";
import {
  accountTable,
  type DepartmentContract,
  departmentTable,
  siteTable,
  userRoleTable,
  userTable,
} from "@repo/contract";
import { eq } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { auth } from "~/lib/auth";
import { type ServiceContext } from "../lib/type";

function generateCompatibleHash(password: string) {
  const salt = randomBytes(16); // 生成16字节随机盐值
  const hash = scryptSync(password, salt, 64, {
    N: 16_384,
    r: 8,
    p: 1,
  });

  // 拼接成 salt_hex : hash_hex 格式
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export class DepartmentService {
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
    const { currentDeptId, db, user } = ctx;
    // 1. 初始化基础过滤条件（租户隔离）
    const where: any = {};
    //出口商业务员
    if (user.roles[0].dataScope === "current_and_below") {
      const dept = await ctx.db.query.departmentTable.findFirst({
        where: {
          id: currentDeptId,
        },
        with: {
          childrens: {
            columns: {
              id: true,
            },
          },
        },
      });
      if (!dept) {
        throw new Error("不存在");
      }
      const childIds = (dept.childrens ?? []).map((c) => c.id);
      where.id = { in: childIds };
    } else if (user.roles[0].dataScope === "current") {
      where.id = { eq: currentDeptId };
    }
    const res = await ctx.db.query.departmentTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
        ...where,
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
        user.roles.some((role) => role.name === "工厂管理员") && user.isActive
    );

    return {
      ...department,
      manager: manager
        ? {
            id: manager.id,
            name: manager.name,
            email: manager.email,
            phone: manager.phone,
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
      const { id, ...deptData } = body.department;

      // 1. 创建部门
      const [department] = await tx
        .insert(departmentTable)
        .values({
          id: body.department.id || undefined, // 必须显式传入 ID，否则无法判断冲突
          tenantId: user.context.tenantId!,
          name: body.department.name,
          parentId: body.department.parentId || null,
          code: body.department.code,
          category: body.department.category as "factory" | "group",
          address: body.department.address,
          contactPhone: body.department.contactPhone,
          logo: body.department.logo,
          extensions: body.department.extensions || null,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: departmentTable.id,
          set: {
            ...deptData,
          },
        })
        .returning(); // 无论创建还是更新，都会返回最新的记录（包含 ID）

      // 3. 核心检查：确保拿到了 ID 再去创建用户
      if (!department?.id) {
        throw new Error("部门 ID 获取失败，无法创建关联用户");
      }
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
        .onConflictDoUpdate({
          target: siteTable.boundDeptId,
          set: {
            name: body.site.name,
            domain: body.site.domain,
            isActive: body.site.isActive ?? true,
          },
        })
        .returning();

      // 3. 用户 Upsert 逻辑
      let adminUserId: string;

      // 检查用户是否已存在
      const existingUser = await tx.query.userTable.findFirst({
        where: {
          tenantId: user.context.tenantId!,
          email: body.admin.email,
        },
      });
      if (existingUser) {
        // --- 更新现有用户 ---
        adminUserId = existingUser.id;
        const updateData = {
          name: body.admin.name,
          deptId: departmentId,
          phone: body.admin.phone,
        };
        // 如果传了新密码，需要加密 (这里假设你使用了 hashPassword 工具函数)
        if (body.admin.password) {
          // ⚠️ 注意：如果你使用 Better Auth，建议调用它的 update 方法
          // 如果是直接操作数据库，必须手动哈希
          const newPassword = await generateCompatibleHash(body.admin.password);
          await tx
            .update(accountTable)
            .set({
              password: newPassword,
            })
            .where(eq(accountTable.id, existingUser.id));
        }
        await tx
          .update(userTable)
          .set(updateData)
          .where(eq(userTable.id, adminUserId));
      } else {
        // --- 创建新用户 ---
        // Better Auth 的 signUpEmail 会自动处理内部的密码哈希
        const signupRes = await auth.api.signUpEmail({
          body: {
            ...body.admin,
            password: body.admin.password, // ⚠️ 生产环境应该先哈希
            name: body.admin.name,
            email: body.admin.email,
            tenantId: user.context.tenantId!,
            deptId: departmentId,
          },
        });
        adminUserId = signupRes.user.id;
      }

      const newUser = await db.query.userTable.findFirst({
        where: {
          id: adminUserId,
        },
      });

      if (!newUser) {
        throw new Error("沒有用戶");
      }

      // 5. 查找或创建 "dept_manager" 角色
      const role = await tx.query.roleTable.findFirst({
        where: {
          name: "工厂管理员",
        },
      });
      if (!role) throw new HttpError.NotFound("角色 工厂管理员 不存在");

      // 6. 分配角色给用户
      await tx
        .insert(userRoleTable)
        .values({
          userId: adminUserId,
          roleId: role.id,
        })
        .onConflictDoNothing();

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
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      };
    });
  }
}
