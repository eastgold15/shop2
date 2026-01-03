import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SiteProductContract } from "../../../../packages/contract/src/modules/site-product.contract";
import { SiteProductService } from "../services/site-product.service";

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
      siteProductService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_PRODUCT:VIEW"],
      requireDept: true,
      query: SiteProductContract.ListQuery,

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
      allPermissions: ["SITE_PRODUCT:CREATE"],
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
      allPermissions: ["SITE_PRODUCT:EDIT"],
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
      allPermissions: ["SITE_PRODUCT:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SiteProduct",
        description: "根据ID删除SiteProduct记录",
        tags: ["SiteProduct"],
      },
    }
  );
