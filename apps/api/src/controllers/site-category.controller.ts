/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { SiteCategoryContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SiteCategoryService } from "~/services/site-category.service";

const siteCategoryService = new SiteCategoryService();

export const siteCategoryController = new Elysia({ prefix: "/site-category" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      siteCategoryService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_CATEGORY_VIEW"],
      requireDept: true,
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
    ({ body, user, db, currentDeptId }) =>
      siteCategoryService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_CATEGORY_CREATE"],
      body: SiteCategoryContract.Create,
      requireDept: true,
      detail: {
        summary: "创建SiteCategory",
        description: "新增一条SiteCategory记录",
        tags: ["SiteCategory"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      siteCategoryService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteCategoryContract.Update,
      requireDept: true,
      allPermissions: ["SITE_CATEGORY_EDIT"],
      detail: {
        summary: "更新SiteCategory",
        description: "根据ID更新SiteCategory信息",
        tags: ["SiteCategory"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      siteCategoryService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SITE_CATEGORY_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SiteCategory",
        description: "根据ID删除SiteCategory记录",
        tags: ["SiteCategory"],
      },
    }
  )

  // 获取树形结构的分类列表
  .get(
    "/tree",
    async ({ db, user, currentDeptId }) =>
      await siteCategoryService.tree({ db, user, currentDeptId }),
    {
      allPermissions: ["SITE_CATEGORY_VIEW"],
      requireDept: true,
      detail: {
        summary: "获取树形分类列表",
        description: "获取当前站点的树形结构分类列表",
        tags: ["SiteCategories"],
      },
    }
  );
