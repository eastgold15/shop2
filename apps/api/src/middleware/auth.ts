import { Elysia } from "elysia";
import { HttpError } from "elysia-http-problem-json";
import { dbPlugin } from "~/db/connection";
import { auth } from "~/lib/auth";
import type { DBtype } from "~/lib/type";

// 系统没有超管，每个用户登录之后，一定有租户ID、工厂ID等信息，用户信息及部门id 都放在上下文中// 请求头名称

// 请求头名称：用于指定当前操作的部门ID
const CURRENT_DEPT_HEADER = "x-current-dept-id";

export const authGuardMid = new Elysia({ name: "authGuard" })
  .use(dbPlugin)
  // 1. 基础鉴权：获取 User 和 Permissions (这部分是全局必须的)
  .derive(async ({ request, db }) => {
    const headers = request.headers;
    const session = await auth.api.getSession({ headers });
    if (!session) throw new HttpError.Unauthorized("未登录");

    // 检查是否有 x-current-dept-id 请求头，如果有则覆盖用户 context 中的部门信息
    const currentDeptIdFromHeader = request.headers.get(CURRENT_DEPT_HEADER);
    console.log("currentDeptIdFromHeader:", currentDeptIdFromHeader);

    let targetDept = null;
    if (currentDeptIdFromHeader) {
      targetDept = await db.query.departmentTable.findFirst({
        where: {
          id: currentDeptIdFromHeader,
        },
      });
    }

    let userRolePermission = await getUserWithRoles(
      session.user.id,
      db,
      targetDept?.category
    );
    if (currentDeptIdFromHeader) {
      const targetDept = await db.query.departmentTable.findFirst({
        where: {
          id: currentDeptIdFromHeader,
          tenantId: userRolePermission.context.tenantId,
        },
        with: {
          site: true,
        },
      });

      if (targetDept) {
        // 更新用户的 context，使用请求头指定的部门和站点
        userRolePermission = {
          ...userRolePermission,
          context: {
            ...userRolePermission.context,
            department: {
              id: targetDept.id,
              name: targetDept.name,
              category: targetDept.category,
              parentId: targetDept.parentId,
            },
            site: {
              id: targetDept.site.id,
              name: targetDept.site.name,
              domain: targetDept.site.domain,
              siteType: targetDept.site.siteType,
            },
          },
        };
      }
    }

    return {
      user: userRolePermission,
    };
  })
  // 2. 定义宏
  .macro({
    /**
     * 权限校验宏
     * 用法: { allPermissions: ['USER:READ'] }
     */
    allPermissions: (names: string[]) => ({
      beforeHandle({ user, status }) {
        if (!user) throw new HttpError.Forbidden("您没有任何权限");
        if (!user.permissions) {
          throw new HttpError.Forbidden("您没有任何权限");
        }
        for (const n of names) {
          if (
            !(user.permissions.includes(n) || user.permissions.includes("*"))
          ) {
            return status(403, `权限不足，需要 ${n} 权限`);
          }
        }
      },
    }),

    /**
     * 部门上下文校验宏
     * 用法: { requireDept: true }
     * 效果: 验证 Header 并将 currentDeptId 注入 Context
     */
    requireDept: {
      resolve: async ({ request, db, user }) => {
        const currentDeptId = request.headers.get(CURRENT_DEPT_HEADER);
        if (!currentDeptId) {
          throw new HttpError.BadRequest("请选择当前操作的部门");
        }
        if (!user) throw new HttpError.Forbidden("您没有任何权限");

        const userTenantId = user.context.tenantId; // 新 DTO 结构

        const targetDept = await db.query.departmentTable.findFirst({
          where: { id: currentDeptId },
          columns: { id: true, tenantId: true },
        });

        if (!targetDept || targetDept.tenantId !== userTenantId) {
          throw new HttpError.Forbidden("无权访问该部门");
        }

        // ✅ 返回注入的变量
        return {
          currentDeptId,
        };
      },
    },
  })
  .as("global");

// --- 辅助函数保持不变 ---

async function getUserWithRoles(
  userID: string,
  db: DBtype,
  deptCategory?: string
) {
  const rawUser = await db.query.userTable.findFirst({
    where: { id: userID },
    with: {
      roles: {
        with: {
          permissions: {
            columns: {
              name: true,
            },
          },
        },
      },
      department: {
        columns: {
          id: true,
          name: true,
          category: true,
          parentId: true,
          tenantId: true,
        },
        with: {
          site: true,
        },
      },
    },
  });

  if (!rawUser) throw new HttpError.NotFound("用户不存在");

  // --- 数据清洗 (Transformer) ---
  // 1. 扁平化权限 (去重)
  const permissions = Array.from(
    new Set(
      rawUser.roles
        .flatMap((role) => role.permissions.map((p) => p.name))
        .filter(Boolean)
    )
  );

  let permissionWithDeptCategory = permissions;
  switch (deptCategory) {
    case "factory":
      permissionWithDeptCategory = permissions.filter(
        (p) => !FACTORY_NO_PERMISSIONS.includes(p)
      );
      break;
    case "group":
      permissionWithDeptCategory = permissions.filter(
        (p) => !GROUPSITE_NO_PERMISSIONS.includes(p)
      );
      break;
    default:
      break;
  }

  // 2. 提取角色名
  const roles = rawUser.roles.map((r) => ({
    name: r.name,
    dataScope: r.dataScope,
  }));
  // 3. 构建上下文 (Context)
  // 注意：由于 tenantId, deptId, site.boundDeptId 都是必填的，所以这些值一定存在
  const context = {
    tenantId: rawUser.tenantId, // ✅ 必填
    department: {
      id: rawUser.department.id,
      name: rawUser.department.name,
      category: rawUser.department.category,
      parentId: rawUser.department.parentId,
    },
    site: {
      id: rawUser.department.site.id,
      name: rawUser.department.site.name,
      domain: rawUser.department.site.domain,
      siteType: rawUser.department.site.siteType,
    },
  };

  // 4. 返回清洗后的对象
  return {
    id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    image: rawUser.image,
    phone: rawUser.phone,
    position: rawUser.position,
    isSuperAdmin: !!rawUser.isSuperAdmin,
    context,
    roles,
    permissions: permissionWithDeptCategory,
  };
}

export type UserDto = Awaited<NonNullable<ReturnType<typeof getUserWithRoles>>>;

const FACTORY_NO_PERMISSIONS = ["SITES_MANAGE", "TENANTS_MANAGE"];

// 集团站权限
const GROUPSITE_NO_PERMISSIONS = [
  "SKU_CREATE",
  "SKU_DELETE",
  "PRODUCT_CREATE",
  "PRODUCT_DELETE",
];
