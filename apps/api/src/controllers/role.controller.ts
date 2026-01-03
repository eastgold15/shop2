/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { RoleContract } from "../../../../packages/contract/src/modules/role.contract";
import { RoleService } from "../services/role.service";

const roleService = new RoleService();
/**
 * @generated
 */
export const roleController = new Elysia({ prefix: "/role" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      roleService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["ROLE:VIEW"],
      query: RoleContract.ListQuery,
      detail: {
        summary: "获取Role列表",
        description: "分页查询Role数据，支持搜索和排序",
        tags: ["Role"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      roleService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["ROLE:CREATE"],
      body: RoleContract.Create,
      detail: {
        summary: "创建Role",
        description: "新增一条Role记录",
        tags: ["Role"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      roleService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: RoleContract.Update,
      allPermissions: ["ROLE:EDIT"],
      requireDept: true,
      detail: {
        summary: "更新Role",
        description: "根据ID更新Role信息",
        tags: ["Role"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      roleService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["ROLE:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除Role",
        description: "根据ID删除Role记录",
        tags: ["Role"],
      },
    }
  );
