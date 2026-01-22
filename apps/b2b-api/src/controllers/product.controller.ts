import {
  ProductContract,
  ProductVariantContract,
  SiteProductContract,
} from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export const productController = new Elysia({
  prefix: "/product",
  tags: ["Product"],
})
  .use(dbPlugin)
  .use(authGuardMid)
  /**
   * 管理端获取站点商品列表（包含媒体和SKU）
   */
  .get(
    "/page-list",
    ({ query, user, db, currentDeptId }) =>
      productService.pagelist(query, { db, user, currentDeptId }),
    {
      allPermissions: ["PRODUCT_VIEW"],
      requireDept: true,
      query: SiteProductContract.ListQuery,
      detail: {
        summary: "获取商品列表",
        description:
          "分页查询商品数据，支持搜索、分类筛选和可见性过滤，返回包含媒体和SKU的完整信息",
      },
    }
  )
  /**
   * 获取商品的 SKU 列表
   */
  .get(
    "/:id/sku",
    ({ params, user, db, currentDeptId }) =>
      productService.getSkuList(params.id, { db, user, currentDeptId }),
    {
      allPermissions: ["PRODUCT_VIEW"],
      requireDept: true,
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "获取商品的SKU列表",
        description: "根据商品ID获取其所有SKU规格信息",
      },
    }
  )
  /**
   * 创建商品（支持站点隔离和模板绑定）- 只能是工厂创建
   */
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      productService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["PRODUCT_CREATE"],
      requireDept: true,
      body: ProductContract.Create,
      detail: {
        summary: "创建商品",
        description:
          "创建新商品，包含基础信息、媒体关联和模板绑定。仅工厂部门有权限创建",
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
      productService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteProductContract.Update,
      allPermissions: ["PRODUCT_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新商品",
        description:
          "更新商品信息。工厂可更新源头数据，集团站只能更新视图数据（名称、描述、SEO等）",
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
      return productService.batchDelete(ids, { db, user, currentDeptId });
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
      allPermissions: ["PRODUCT_DELETE"],
      requireDept: true,
      detail: {
        summary: "批量删除商品",
        description:
          "根据ID列表批量删除商品记录及其关联数据（SKU、媒体、模板等）",
      },
    }
  )
  /**
   * 删除单个商品
   */
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      productService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["PRODUCT_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除商品",
        description: "根据ID删除单个商品记录及其关联数据",
      },
    }
  );



/**
 * 变体媒体管理路由
 * 用于按颜色属性值绑定图片，避免为每个 SKU 重复上传
 */
export const productVariantController = new Elysia({
  prefix: "/product-variant",
  tags: ["Product Variant Media"],
})
  .use(dbPlugin)
  .use(authGuardMid)
  /**
   * 获取商品变体媒体配置
   */
  .get(
    "/:productId",
    ({ params, user, db, currentDeptId }) =>
      productService.getVariantMedia(params.productId, {
        db,
        user,
        currentDeptId,
      }),
    {
      params: t.Object({
        productId: t.String(),
      }),
      allPermissions: ["PRODUCT_VIEW"],
      requireDept: true,
      detail: {
        summary: "获取商品变体媒体配置",
        description:
          "获取商品按颜色属性配置的变体图片，返回每个颜色值的图片列表",
      },
    }
  )
  /**
   * 保存商品变体媒体配置
   */
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      productService.setVariantMedia(body, {
        db,
        user,
        currentDeptId,
      }),
    {
      body: ProductVariantContract.SetVariantMedia,
      allPermissions: ["PRODUCT_EDIT"],
      requireDept: true,
      detail: {
        summary: "保存商品变体媒体配置",
        description:
          "为商品的不同颜色属性值设置专属图片，避免为每个 SKU 重复上传",
      },
    }
  )
  /**
   * 获取 SKU 媒体（三级继承逻辑）
   */
  .get(
    "/sku/:skuId/media",
    ({ params, user, db, currentDeptId }) =>
      productService.getSkuMedia(params.skuId, {
        db,
        user,
        currentDeptId,
      }),
    {
      params: t.Object({
        skuId: t.String(),
      }),
      allPermissions: ["PRODUCT_VIEW"],
      requireDept: true,
      detail: {
        summary: "获取 SKU 媒体（继承逻辑）",
        description:
          "按 SKU专属 > 变体级(颜色) > 商品级 的优先级获取图片，返回媒体来源和图片列表",
      },
    }
  );
