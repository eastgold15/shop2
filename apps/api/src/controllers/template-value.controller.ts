/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */

import { TemplateValueContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { TemplateValueService } from "../services/template-value.service";

const templatevalueService = new TemplateValueService();
/**
 * @generated
 */
export const templateValueController = new Elysia({ prefix: "/templatevalue" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      templatevalueService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["TEMPLATEVALUE:VIEW"],
      query: TemplateValueContract.ListQuery,
      requireDept: true,
      detail: {
        summary: "获取TemplateValue列表",
        description: "分页查询TemplateValue数据，支持搜索和排序",
        tags: ["TemplateValue"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      templatevalueService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["TEMPLATEVALUE:CREATE"],
      body: TemplateValueContract.Create,
      requireDept: true,
      detail: {
        summary: "创建TemplateValue",
        description: "新增一条TemplateValue记录",
        tags: ["TemplateValue"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      templatevalueService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: TemplateValueContract.Update,
      requireDept: true,
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
    ({ params, user, db, currentDeptId }) =>
      templatevalueService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      requireDept: true,
      allPermissions: ["TEMPLATEVALUE:DELETE"],
      detail: {
        summary: "删除TemplateValue",
        description: "根据ID删除TemplateValue记录",
        tags: ["TemplateValue"],
      },
    }
  );
