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
import { TemplateContract } from "../../../../packages/contract/src/modules/template.contract";
import { TemplateService } from "../services/template.service";

const templateService = new TemplateService();
/**
 * @generated
 */
export const templateController = new Elysia({ prefix: "/template" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, getScopeObj }) =>
      templateService.findAll(query, { db, user, getScopeObj }),
    {
      allPermissions: ["TEMPLATE:VIEW"],
      query: TemplateContract.ListQuery,
      detail: {
        summary: "获取Template列表",
        description: "分页查询Template数据，支持搜索和排序",
        tags: ["Template"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, getScopeObj }) =>
      templateService.create(body, { db, user, getScopeObj }),
    {
      allPermissions: ["TEMPLATE:CREATE"],
      body: TemplateContract.Create,
      detail: {
        summary: "创建Template",
        description: "新增一条Template记录",
        tags: ["Template"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, getScopeObj }) =>
      templateService.update(params.id, body, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      body: TemplateContract.Update,
      allPermissions: ["TEMPLATE:EDIT"],
      detail: {
        summary: "更新Template",
        description: "根据ID更新Template信息",
        tags: ["Template"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, getScopeObj }) =>
      templateService.delete(params.id, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["TEMPLATE:DELETE"],
      detail: {
        summary: "删除Template",
        description: "根据ID删除Template记录",
        tags: ["Template"],
      },
    }
  );
