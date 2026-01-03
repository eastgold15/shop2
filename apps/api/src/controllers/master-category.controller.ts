/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { MasterCategoryContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { MasterCategoryService } from "~/services/master-category.service";

const masterCategoryService = new MasterCategoryService();
export const masterCategoryController = new Elysia({
  prefix: "/master-category",
})
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      masterCategoryService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["MASTERCATEGORY_VIEW"],
      requireDept: true,
      query: MasterCategoryContract.ListQuery,
      detail: {
        summary: "获取MasterCategory列表",
        description: "分页查询MasterCategory数据，支持搜索和排序",
        tags: ["MasterCategory"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      masterCategoryService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["MASTERCATEGORY_CREATE"],
      body: MasterCategoryContract.Create,
      requireDept: true,
      detail: {
        summary: "创建MasterCategory",
        description: "新增一条MasterCategory记录",
        tags: ["MasterCategory"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      masterCategoryService.update(params.id, body, {
        db,
        user,
        currentDeptId,
      }),
    {
      params: t.Object({ id: t.String() }),
      body: MasterCategoryContract.Update,
      requireDept: true,
      allPermissions: ["MASTERCATEGORY_EDIT"],
      detail: {
        summary: "更新MasterCategory",
        description: "根据ID更新MasterCategory信息",
        tags: ["MasterCategory"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      masterCategoryService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["MASTERCATEGORY_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除MasterCategory",
        description: "根据ID删除MasterCategory记录",
        tags: ["MasterCategory"],
      },
    }
  )

  // 获取树形结构的主分类列表
  .get(
    "/tree",
    async ({ db, user, currentDeptId }) =>
      await masterCategoryService.getTree({ db, user, currentDeptId }),
    {
      allPermissions: ["MASTERCATEGORY_VIEW"],
      requireDept: true,
      detail: {
        summary: "获取树形主分类列表",
        description: "获取当前租户的树形结构主分类列表",
        tags: ["MasterCategory"],
      },
    }
  );
