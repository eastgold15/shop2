import { SkuContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SkuService } from "../services/sku.service";

const skuService = new SkuService();

export const skuController = new Elysia({ prefix: "/sku", tags: ["SKU"] })
  .use(dbPlugin)
  .use(authGuardMid)
  /**
   * 获取 SKU 列表
   */
  .get(
    "/list",
    ({ query, user, db, currentDeptId }) =>
      skuService.list({ db, user, currentDeptId }, query),
    {
      allPermissions: ["SKU_VIEW"],
      requireDept: true,
      query: SkuContract.ListQuery,
      detail: {
        summary: "获取SKU列表",
        description: "分页查询SKU数据，支持按商品ID、搜索和状态筛选",
      },
    }
  )
  /**
   * 获取单个 SKU 详情（用于编辑回显）
   */
  .get(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      skuService.getDetail({ db, user, currentDeptId }, params.id),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SKU_VIEW"],
      requireDept: true,
      detail: {
        summary: "获取SKU详情",
        description: "根据ID获取SKU的详细信息，包括图片",
      },
    }
  )
  /**
   * 批量创建 SKU
   */
  .post(
    "/product/:productId/batch",
    ({ params, body, user, db, currentDeptId }) =>
      skuService.batchCreateSkus(
        { db, user, currentDeptId },
        params.productId,
        body
      ),
    {
      params: t.Object({ productId: t.String() }),
      body: SkuContract.BatchCreate,
      allPermissions: ["SKU_CREATE"],
      requireDept: true,
      detail: {
        summary: "批量创建SKU",
        description: "为指定商品批量创建SKU，包含规格和图片关联",
      },
    }
  )
  /**
   * 更新单个 SKU
   */
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      skuService.update({ db, user, currentDeptId }, params.id, body),
    {
      params: t.Object({ id: t.String() }),
      body: SkuContract.Update,
      allPermissions: ["SKU_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新SKU",
        description: "更新SKU信息，支持图片全量替换",
      },
    }
  )
  /**
   * 删除单个 SKU
   */
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      skuService.delete({ db, user, currentDeptId }, params.id),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SKU_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SKU",
        description: "根据ID删除SKU记录",
      },
    }
  );
