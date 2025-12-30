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
import { UserContract } from "../../../../packages/contract/src/modules/user.contract";
import { UserService } from "../services/user.service";

const userService = new UserService();
/**
 * @generated
 */
export const userController = new Elysia({ prefix: "/user" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get("/", ({ query, user, db }) => userService.findAll(query, { db, user }), {
    allPermissions: ["USER:VIEW"],
    query: UserContract.ListQuery,
    detail: {
      summary: "获取User列表",
      description: "分页查询User数据，支持搜索和排序",
      tags: ["User"],
    },
  })
  .post("/", ({ body, user, db }) => userService.create(body, { db, user }), {
    allPermissions: ["USER:CREATE"],
    body: UserContract.Create,
    detail: {
      summary: "创建User",
      description: "新增一条User记录",
      tags: ["User"],
    },
  })
  .put(
    "/:id",
    ({ params, user, db }) => userService.update(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      body: UserContract.Update,
      allPermissions: ["USER:EDIT"],
      detail: {
        summary: "更新User",
        description: "根据ID更新User信息",
        tags: ["User"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db }) => userService.delete(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["USER:DELETE"],
      detail: {
        summary: "删除User",
        description: "根据ID删除User记录",
        tags: ["User"],
      },
    }
  );
