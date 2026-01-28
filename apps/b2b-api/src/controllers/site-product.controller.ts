import { SiteProductContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SiteProductService } from "../services/site-product.service";

const siteProductService = new SiteProductService();
/**
 * @generated
 */
export const siteProductController = new Elysia({ prefix: "/site-product" })
  .use(dbPlugin)
  .use(authGuardMid)
  /**
   * 分页列表查询（从 ProductService 迁移）
   * 支持工厂和集团站两种模式
   */
  .get(
    "/page-list",
    ({ query, user, db, currentDeptId }) =>
      siteProductService.pagelist(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_PRODUCT_VIEW"],
      requireDept: true,
      query: SiteProductContract.ListQuery,
      detail: {
        summary: "获取站点商品分页列表",
        description:
          "管理端获取站点商品列表，包含媒体和SKU。工厂站点只能看到自己创建的商品（INNER JOIN），集团站点可以看到所有工厂的商品（LEFT JOIN）",
        tags: ["SiteProduct"],
      },
    }
  )
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      siteProductService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_PRODUCT_VIEW"],
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
      allPermissions: ["SITE_PRODUCT_CREATE"],
      body: SiteProductContract.Create,
      requireDept: true,
      detail: {
        summary: "创建SiteProduct",
        description: "新增一条SiteProduct记录并自动激活所有SKU",
        tags: ["SiteProduct"],
      },
    }
  )
  /**
   * 批量创建/收录商品到站点
   * 支持两种模式：收录已有商品（集团站）或创建新商品（工厂专用）
   */
  .post(
    "/batch",
    ({ body, user, db, currentDeptId }) =>
      siteProductService.batchCreate(body, { db, user, currentDeptId }),
    {
      body: t.Object({
        items: t.Array(t.Any()),
      }),
      allPermissions: ["SITE_PRODUCT_CREATE"],
      requireDept: true,
      detail: {
        summary: "批量创建/收录商品到站点",
        description:
          "批量上架商品到站点。集团站可以收录已有商品（提供productId），工厂可以创建新商品（提供完整商品信息）。所有商品的SKU会自动激活",
        tags: ["SiteProduct"],
      },
    }
  )

  /**
 * 批量更新商品排序
 * 工厂站点：同时更新 product 和 siteProduct 的 sortOrder
 * 出口商站点：只更新 siteProduct 的 sortOrder
 */
  .put(
    "/batch/sort-order",
    ({ body, user, db, currentDeptId }) =>
      siteProductService.batchUpdateSortOrder(body, {
        db,
        user,
        currentDeptId,
      }),
    {
      body: SiteProductContract.BatchUpdateSortOrder,
      allPermissions: ["SITE_PRODUCT_EDIT"],
      requireDept: true,
      detail: {
        summary: "批量更新商品排序",
        description:
          "批量更新商品的排序值。工厂站点会同时更新源商品和站点商品的排序，出口商站点只更新站点商品的排序",
        tags: ["SiteProduct"],
      },
    }
  )
  /**
    * 更新商品（全量关联更新）
    * 支持两种模式：全局商品（工厂）和站点商品（集团）
    */
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      siteProductService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteProductContract.Update,
      allPermissions: ["SITE_PRODUCT_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新SiteProduct",
        description:
          "更新商品信息。工厂可更新源头数据，集团站只能更新视图数据（名称、描述、SEO等）",
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
      allPermissions: ["SITE_PRODUCT_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SiteProduct",
        description: "根据ID删除SiteProduct记录",
        tags: ["SiteProduct"],
      },
    }
  )
  /**
  * 批量删除商品
  */
  .delete(
    "/batch/delete",
    ({ body, user, db, currentDeptId }) => {
      const { ids } = body;
      return siteProductService.batchDelete(ids, { db, user, currentDeptId });
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
      allPermissions: ["SITE_PRODUCT_DELETE"],
      requireDept: true,
      detail: {
        summary: "批量删除商品",
        description:
          "根据ID列表批量删除商品记录及其关联数据（SKU、媒体、模板等）",
      },
    }
  )
