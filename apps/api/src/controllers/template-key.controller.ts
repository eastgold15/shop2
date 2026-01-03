/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { TemplateKeyContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { TemplateKeyService } from "~/services/template-key.service";

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
      templateKeyService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["TEMPLATEKEY:VIEW"],
      query: TemplateKeyContract.ListQuery,
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
      allPermissions: ["TEMPLATEKEY:CREATE"],
      body: TemplateKeyContract.Create,
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
      allPermissions: ["TEMPLATEKEY:EDIT"],
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
      allPermissions: ["TEMPLATEKEY:DELETE"],
      detail: {
        summary: "删除TemplateKey",
        description: "根据ID删除TemplateKey记录",
        tags: ["TemplateKey"],
      },
    }
  );
