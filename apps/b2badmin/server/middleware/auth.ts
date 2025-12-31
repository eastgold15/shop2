import { Elysia } from "elysia";
import { HttpError } from "elysia-http-problem-json";
import { dbPlugin } from "~/db/connection";
import { auth } from "~/lib/auth";

// 定义权重字典：数字越大，权限越大
const SCOPE_WEIGHT = {
  all: 4, // 全部数据
  dept_and_child: 3, // 本部门及子部门
  dept_only: 2, // 本部门
  self: 1, // 仅本人
} as const;

export interface AUthFilterObj {
  tenantId: string;
  deptId: string | { in: string[] };
  createdBy: string;
}

export const authGuardMid = new Elysia({ name: "authGuard" })

  .use(dbPlugin)
  .derive(async ({ request, db }) => {
    // 1. 验证 Session (这里省略你之前的代码)
    const headers = request.headers;
    // 1️⃣ verify session
    const session = await auth.api.getSession({ headers });
    if (!session) throw new HttpError.Unauthorized("未登录");

    // 2️⃣ fetch user
    const userRolePermission = await db.query.userTable.findFirst({
      where: { id: session.user.id },
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
      },
    });
    if (!userRolePermission) throw new HttpError.NotFound("用户不存在");

    const permissions = [
      ...new Set(
        userRolePermission.roles
          .flatMap((role) =>
            role.permissions.map((permission) => permission.name)
          )
          .filter(Boolean)
      ),
    ];

    const user = userRolePermission;
    return {
      user,
      permissions, // 自动注入到后续的所有 Hook 中
    };
  })
  .resolve(({ user, db }) => {
    const getMaxScope = () => {
      let maxWeight = 0;
      let maxScope = "self"; // 默认最低

      // 遍历用户所有角色
      for (const ur of user.roles) {
        const scope = ur.dataScope;
        const weight = SCOPE_WEIGHT[scope] || 0;

        if (weight > maxWeight) {
          maxWeight = weight;
          maxScope = scope;
        }
      }
      return maxScope; // 返回最大的那个 scope 字符串
    };

    const effectiveScope = getMaxScope();
    const getScopeObj = async () => {
      // 计算出最终生效的 scope
      const filter: any = {
        tenantId: user.tenantId,
      };

      // 超管直接返回租户限制
      if (user.isSuperAdmin) return filter;

      // 2. 根据角色追加限制 (全都是 AND 关系，所以可以直接往对象里塞 key)
      switch (effectiveScope) {
        case "all":
          // 权重 4: 看所有 -> 不加任何额外限制，只看租户
          break;

        case "dept_and_child": {
          // 权重 3: 本部门及子部门
          const childDepts = await db.query.departmentTable.findMany({
            where: { parentId: user.deptId! },
            columns: { id: true },
          });
          const deptIds = childDepts.map((item) => item.id);
          filter.deptId = {
            in: [user.deptId!, ...deptIds],
          };
          break;
        }

        case "dept_only":
          // 权重 2: 限制部门
          filter.deptId = user.deptId!; // 非空断言（确保非超管有 deptId）
          break;

        // case "self":
        default:
          // 权重 1: 限制创建人
          filter.createdBy = user.id;
          break;
      }
      return filter;
    };
    return {
      // ...
      getScopeObj,
      // 也可以把计算出的最大权限暴露出去，方便前端展示
      effectiveScope,
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

// .get('/', ({ user,getScopeObj,effectiveScope}) => 'auth guard middleware works')
