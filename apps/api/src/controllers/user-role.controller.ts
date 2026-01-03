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
import { UserRoleContract } from "../../../../packages/contract/src/modules/userrole.contract";
import { UserRoleService } from "../services/user-role.service";

const userroleService = new UserRoleService();
/**
 * @generated
 */
export const userroleController = new Elysia({ prefix: "/userrole" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      userroleService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["USERROLE:VIEW"],
      query: UserRoleContract.ListQuery,
      detail: {
        summary: "获取UserRole列表",
        description: "分页查询UserRole数据，支持搜索和排序",
        tags: ["UserRole"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      userroleService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["USERROLE:CREATE"],
      body: UserRoleContract.Create,
      detail: {
        summary: "创建UserRole",
        description: "新增一条UserRole记录",
        tags: ["UserRole"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      userroleService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: UserRoleContract.Update,
      allPermissions: ["USERROLE:EDIT"],
      detail: {
        summary: "更新UserRole",
        description: "根据ID更新UserRole信息",
        tags: ["UserRole"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      userroleService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["USERROLE:DELETE"],
      detail: {
        summary: "删除UserRole",
        description: "根据ID删除UserRole记录",
        tags: ["UserRole"],
      },
    }
  );
