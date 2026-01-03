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
  // @generated
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      templateService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["TEMPLATE_VIEW"],
      requireDept: true,
      query: TemplateContract.ListQuery,
      detail: {
        summary: "获取Template列表",
        description: "分页查询Template数据，支持搜索和排序",
        tags: ["Template"],
      },
    }
  )
  // @generated
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      templateService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["TEMPLATE_CREATE"],
      requireDept: true,
      body: TemplateContract.Create,
      detail: {
        summary: "创建Template",
        description: "新增一条Template记录",
        tags: ["Template"],
      },
    }
  )
  // @generated
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      templateService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: TemplateContract.Update,
      allPermissions: ["TEMPLATE_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新Template",
        description: "根据ID更新Template信息",
        tags: ["Template"],
      },
    }
  )
  // @generated
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      templateService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["TEMPLATE_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除Template",
        description: "根据ID删除Template记录",
        tags: ["Template"],
      },
    }
  );
