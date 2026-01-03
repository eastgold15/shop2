/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { SiteProductContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SiteProductService } from "~/services/site-product.service";

const siteProductService = new SiteProductService();
/**
 * @generated
 */
export const siteProductController = new Elysia({ prefix: "/site-product" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      siteProductService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITEPRODUCT:VIEW"],
      query: SiteProductContract.ListQuery,
      requireDept: true,
      detail: {
        summary: "获取SiteProduct列表",
        description: "分页查询SiteProduct数据，支持搜索和排序",
        tags: ["SiteProduct"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      siteProductService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["SITEPRODUCT:CREATE"],
      body: SiteProductContract.Create,
      requireDept: true,
      detail: {
        summary: "创建SiteProduct",
        description: "新增一条SiteProduct记录",
        tags: ["SiteProduct"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      siteProductService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteProductContract.Update,
      allPermissions: ["SITEPRODUCT:EDIT"],
      requireDept: true,
      detail: {
        summary: "更新SiteProduct",
        description: "根据ID更新SiteProduct信息",
        tags: ["SiteProduct"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      siteProductService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SITEPRODUCT:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SiteProduct",
        description: "根据ID删除SiteProduct记录",
        tags: ["SiteProduct"],
      },
    }
  );
