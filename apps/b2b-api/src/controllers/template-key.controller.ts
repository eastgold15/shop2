import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { TemplateKeyContract } from "../../../../packages/contract/src/modules/template-key.contract";
import { TemplateKeyService } from "../services/template-key.service";

const templateKeyService = new TemplateKeyService();
/**
 * @generated
 */
export const templateKeyController = new Elysia({ prefix: "/template-key" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      templateKeyService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["TEMPLATE_KEY:VIEW"],
      query: TemplateKeyContract.ListQuery,
      requireDept: true,

      detail: {
        summary: "获取TemplateKey列表",
        description: "分页查询TemplateKey数据，支持搜索和排序",
        tags: ["TemplateKey"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      templateKeyService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["TEMPLATE_KEY:CREATE"],
      body: TemplateKeyContract.Create,
      requireDept: true,
      detail: {
        summary: "创建TemplateKey",
        description: "新增一条TemplateKey记录",
        tags: ["TemplateKey"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      templateKeyService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: TemplateKeyContract.Update,
      allPermissions: ["TEMPLATE_KEY:EDIT"],
      requireDept: true,
      detail: {
        summary: "更新TemplateKey",
        description: "根据ID更新TemplateKey信息",
        tags: ["TemplateKey"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      templateKeyService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["TEMPLATE_KEY:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除TemplateKey",
        description: "根据ID删除TemplateKey记录",
        tags: ["TemplateKey"],
      },
    }
  );
