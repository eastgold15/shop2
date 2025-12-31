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
import { CustomerContract } from "../../../../packages/contract/src/modules/customer.contract";
import { CustomerService } from "../services/customer.service";

const customerService = new CustomerService();
/**
 * @generated
 */
export const customerController = new Elysia({ prefix: "/customer" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, getScopeObj }) =>
      customerService.findAll(query, { db, user, getScopeObj }),
    {
      allPermissions: ["CUSTOMER:VIEW"],
      query: CustomerContract.ListQuery,
      detail: {
        summary: "获取Customer列表",
        description: "分页查询Customer数据，支持搜索和排序",
        tags: ["Customer"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, getScopeObj }) =>
      customerService.create(body, { db, user, getScopeObj }),
    {
      allPermissions: ["CUSTOMER:CREATE"],
      body: CustomerContract.Create,
      detail: {
        summary: "创建Customer",
        description: "新增一条Customer记录",
        tags: ["Customer"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, getScopeObj }) =>
      customerService.update(params.id, body, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      body: CustomerContract.Update,
      allPermissions: ["CUSTOMER:EDIT"],
      detail: {
        summary: "更新Customer",
        description: "根据ID更新Customer信息",
        tags: ["Customer"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, getScopeObj }) =>
      customerService.delete(params.id, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["CUSTOMER:DELETE"],
      detail: {
        summary: "删除Customer",
        description: "根据ID删除Customer记录",
        tags: ["Customer"],
      },
    }
  );
