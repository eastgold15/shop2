import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { productTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductInsertFields = spread(productTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductFields = spread(productTable, "select");
export const ProductContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...ProductFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(ProductInsertFields), ["id", "createdAt", "updatedAt"])
      .properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(ProductInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(ProductInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...ProductFields })),
    total: t.Number(),
  }),
} as const;

export type ProductContract = InferDTO<typeof ProductContract>;
