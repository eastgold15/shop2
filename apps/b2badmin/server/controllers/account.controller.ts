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
import { AccountContract } from "../../../../packages/contract/src/modules/account.contract";
import { AccountService } from "../services/account.service";

const accountService = new AccountService();
/**
 * @generated
 */
export const accountController = new Elysia({ prefix: "/account" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db }) => accountService.findAll(query, { db, user }),
    {
      allPermissions: ["ACCOUNT:VIEW"],
      query: AccountContract.ListQuery,
      detail: {
        summary: "获取Account列表",
        description: "分页查询Account数据，支持搜索和排序",
        tags: ["Account"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db }) => accountService.create(body, { db, user }),
    {
      allPermissions: ["ACCOUNT:CREATE"],
      body: AccountContract.Create,
      detail: {
        summary: "创建Account",
        description: "新增一条Account记录",
        tags: ["Account"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, user, db }) => accountService.update(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      body: AccountContract.Update,
      allPermissions: ["ACCOUNT:EDIT"],
      detail: {
        summary: "更新Account",
        description: "根据ID更新Account信息",
        tags: ["Account"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db }) => accountService.delete(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["ACCOUNT:DELETE"],
      detail: {
        summary: "删除Account",
        description: "根据ID删除Account记录",
        tags: ["Account"],
      },
    }
  );
