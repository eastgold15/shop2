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
import { MasterCategoryContract } from "../../../../packages/contract/src/modules/mastercategory.contract";
import { MasterCategoryService } from "../services/mastercategory.service";

const mastercategoryService = new MasterCategoryService();
/**
 * @generated
 */
export const mastercategoryController = new Elysia({
  prefix: "/mastercategory",
})
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      mastercategoryService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["MASTERCATEGORY:VIEW"],
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
      mastercategoryService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["MASTERCATEGORY:CREATE"],
      body: MasterCategoryContract.Create,
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
      mastercategoryService.update(params.id, body, {
        db,
        user,
        currentDeptId,
      }),
    {
      params: t.Object({ id: t.String() }),
      body: MasterCategoryContract.Update,
      allPermissions: ["MASTERCATEGORY:EDIT"],
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
      mastercategoryService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["MASTERCATEGORY:DELETE"],
      detail: {
        summary: "删除MasterCategory",
        description: "根据ID删除MasterCategory记录",
        tags: ["MasterCategory"],
      },
    }
  );
