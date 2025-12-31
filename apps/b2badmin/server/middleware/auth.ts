import { Elysia } from "elysia";
import { HttpError } from "elysia-http-problem-json";
import { dbPlugin } from "~/db/connection";
import { auth } from "~/lib/auth";
import { DBtype } from "~/lib/type";

// 系统没有超管，每个用户登录之后，一定有租户ID、工厂ID等信息，用户信息及部门id 都放在上下文中
// 请求头名称：用于指定当前操作的部门ID
const CURRENT_DEPT_HEADER = "x-current-dept-id";
// 导出最终的 user 类型（排除 null）
export const authGuardMid = new Elysia({ name: "authGuard" })
  .use(dbPlugin)
  .derive(async ({ request, db }) => {
    // 1. 验证 Session
    const headers = request.headers;
    const session = await auth.api.getSession({ headers });
    if (!session) throw new HttpError.Unauthorized("未登录");
    // 2. fetch user（包含部门信息和父部门ID）
    const userRolePermission = await getUserWithRoles(session.user.id, db);
    const permissions = [
      ...new Set(
        userRolePermission.roles
          .flatMap((role) =>
            role.permissions.map((permission) => permission.name)
          )
          .filter(Boolean)
      ),
    ];
    return {
      user: userRolePermission,
      permissions,
    };
  })
  .derive(async ({ user, db, request }) => {
    // 3. 从请求头获取 currentDeptId 并验证
    const currentDeptIdHeader = request.headers.get(CURRENT_DEPT_HEADER);
    let currentDeptId: string | null = null;
    if (!currentDeptIdHeader) {
      throw new HttpError.BadRequest("应该先登录");
    }
    // 验证指定的部门是否属于该用户的租户
    const targetDept = await db.query.departmentTable.findFirst({
      where: {
        id: currentDeptIdHeader,
      },
      columns: { id: true, tenantId: true },
    });
    if (!targetDept) {
      throw new HttpError.BadRequest("指定的部门不存在");
    }
    if (targetDept.tenantId !== user.tenantId) {
      throw new HttpError.Forbidden("无权访问该部门");
    }
    currentDeptId = currentDeptIdHeader;
    return {
      currentDeptId,
    };
  })
  .macro({
    allPermissions: (names: string[]) => ({
      beforeHandle({ permissions, status }) {
        if (!permissions) {
          throw new HttpError.Forbidden("您没有任何权限");
        }
        for (const n of names) {
          if (!(permissions.includes(n) || permissions.includes("*"))) {
            return status(403, `权限不足，需要 ${n} 权限`);
          }
        }
      },
    }),
  })
  .as("global");

async function getUserWithRoles(userID: string, db: DBtype) {
  const userRolePermission = await db.query.userTable.findFirst({
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
  if (!userRolePermission) throw new HttpError.NotFound("用户不存在");

  return userRolePermission;
}

export type UserDto = Awaited<NonNullable<ReturnType<typeof getUserWithRoles>>>;
