import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { skuTable } from "../table.schema";

const autoFields = [
  "id",
  "createdAt",
  "updatedAt",
  "siteId",
  "tenantId",
  "deptId",
  "createdBy",
];
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SkuInsertFields = spread(skuTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SkuFields = spread(skuTable, "select");
export const SkuContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...SkuFields,
  }),

  Update: t.Partial(
    t.Composite([
      t.Omit(t.Object(SkuInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
        "tenantId",
        "deptId",
        "createdBy",
      ]),
      t.Object({
        mediaIds: t.Optional(t.Array(t.String())), // 该 SKU 的图片 ID 列表
        mainImageId: t.Optional(t.String()), // 指定哪张 ID 为主图
      }),
    ])
  ),
  // Patch 请求 (部分更新)
  Patch: t.Partial(
    t.Composite([
      t.Omit(t.Object(SkuInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]),
      t.Object({
        mediaIds: t.Optional(t.Array(t.String())),
        mainImageId: t.Optional(t.String()),
      }),
    ])
  ),
  // BatchCreate 批量创建
  BatchCreate: t.Array(
    t.Object({
      skuCode: SkuFields.skuCode,
      price: SkuFields.price,
      stock: SkuFields.stock,
      specJson: t.Any(), // { "Color": "Red", "Size": "M" }
      mediaIds: t.Optional(t.Array(t.String())), // 每个SKU可以有自己的图片集
      marketPrice: SkuFields.marketPrice,
      costPrice: SkuInsertFields.costPrice,
      weight: SkuInsertFields.weight,
      volume: SkuInsertFields.volume,
    })
  ),

  ListQuery: t.Object({
    page: t.Optional(t.Number()),
    limit: t.Optional(t.Number()),
    productId: t.String(),
    search: t.Optional(t.String()),
    status: t.Optional(t.Number()),
    sort: t.Optional(t.String()),
    sortOrder: t.Optional(t.String()),
  }),

  // BatchDelete 批量删除
  BatchDelete: t.Object({
    ids: t.Array(t.String()), // SKU ID 数组
  }),

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...SkuFields })),
    total: t.Number(),
  }),
} as const;

export type SkuContract = InferDTO<typeof SkuContract>;
