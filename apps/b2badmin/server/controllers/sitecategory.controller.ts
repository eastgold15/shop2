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
import { SiteCategoryContract } from "../../../../packages/contract/src/modules/sitecategory.contract";
import { SiteCategoryService } from "../services/sitecategory.service";

const sitecategoryService = new SiteCategoryService();
/**
 * @generated
 */
export const sitecategoryController = new Elysia({ prefix: "/sitecategory" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, getScopeObj }) =>
      sitecategoryService.findAll(query, { db, user, getScopeObj }),
    {
      allPermissions: ["SITECATEGORY:VIEW"],
      query: SiteCategoryContract.ListQuery,
      detail: {
        summary: "获取SiteCategory列表",
        description: "分页查询SiteCategory数据，支持搜索和排序",
        tags: ["SiteCategory"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, getScopeObj }) =>
      sitecategoryService.create(body, { db, user, getScopeObj }),
    {
      allPermissions: ["SITECATEGORY:CREATE"],
      body: SiteCategoryContract.Create,
      detail: {
        summary: "创建SiteCategory",
        description: "新增一条SiteCategory记录",
        tags: ["SiteCategory"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, getScopeObj }) =>
      sitecategoryService.update(params.id, body, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteCategoryContract.Update,
      allPermissions: ["SITECATEGORY:EDIT"],
      detail: {
        summary: "更新SiteCategory",
        description: "根据ID更新SiteCategory信息",
        tags: ["SiteCategory"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, getScopeObj }) =>
      sitecategoryService.delete(params.id, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SITECATEGORY:DELETE"],
      detail: {
        summary: "删除SiteCategory",
        description: "根据ID删除SiteCategory记录",
        tags: ["SiteCategory"],
      },
    }
  );
