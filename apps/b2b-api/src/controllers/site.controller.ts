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
import { SiteContract } from "../../../../packages/contract/src/modules/site.contract";
import { SiteService } from "../services/site.service";

const siteService = new SiteService();
/**
 * @generated
 */
export const siteController = new Elysia({ prefix: "/site" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      siteService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_VIEW"],
      requireDept: true,
      query: SiteContract.ListQuery,
      detail: {
        summary: "获取Site列表",
        description: "分页查询Site数据，支持搜索和排序",
        tags: ["Site"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      siteService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_CREATE"],
      requireDept: true,
      body: SiteContract.Create,
      detail: {
        summary: "创建Site",
        description: "新增一条Site记录",
        tags: ["Site"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      siteService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteContract.Update,
      allPermissions: ["SITE_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新Site",
        description: "根据ID更新Site信息",
        tags: ["Site"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      siteService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SITE_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除Site",
        description: "根据ID删除Site记录",
        tags: ["Site"],
      },
    }
  );
