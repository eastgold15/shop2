import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { skuTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SkuInsertFields = spread(skuTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SkuFields = spread(skuTable, "select");
export const SkuContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...SkuFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(SkuInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),

  Update: t.Partial(
    t.Composite([
      t.Omit(t.Object(SkuInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
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
  BatchCreate: t.Object({
    productId: t.String(),
    skus: t.Array(
      t.Object({
        skuCode: t.String(),
        price: t.Number(),
        stock: t.Optional(t.Number()),
        specJson: t.Any(),
        mediaIds: t.Optional(t.Array(t.String())),
      })
    ),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(SkuInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...SkuFields })),
    total: t.Number(),
  }),
} as const;

export type SkuContract = InferDTO<typeof SkuContract>;
