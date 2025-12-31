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
import { TemplateValueContract } from "../../../../packages/contract/src/modules/templatevalue.contract";
import { TemplateValueService } from "../services/templatevalue.service";

const templatevalueService = new TemplateValueService();
/**
 * @generated
 */
export const templatevalueController = new Elysia({ prefix: "/templatevalue" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, getScopeObj }) =>
      templatevalueService.findAll(query, { db, user, getScopeObj }),
    {
      allPermissions: ["TEMPLATEVALUE:VIEW"],
      query: TemplateValueContract.ListQuery,
      detail: {
        summary: "获取TemplateValue列表",
        description: "分页查询TemplateValue数据，支持搜索和排序",
        tags: ["TemplateValue"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, getScopeObj }) =>
      templatevalueService.create(body, { db, user, getScopeObj }),
    {
      allPermissions: ["TEMPLATEVALUE:CREATE"],
      body: TemplateValueContract.Create,
      detail: {
        summary: "创建TemplateValue",
        description: "新增一条TemplateValue记录",
        tags: ["TemplateValue"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, getScopeObj }) =>
      templatevalueService.update(params.id, body, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      body: TemplateValueContract.Update,
      allPermissions: ["TEMPLATEVALUE:EDIT"],
      detail: {
        summary: "更新TemplateValue",
        description: "根据ID更新TemplateValue信息",
        tags: ["TemplateValue"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, getScopeObj }) =>
      templatevalueService.delete(params.id, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["TEMPLATEVALUE:DELETE"],
      detail: {
        summary: "删除TemplateValue",
        description: "根据ID删除TemplateValue记录",
        tags: ["TemplateValue"],
      },
    }
  );
