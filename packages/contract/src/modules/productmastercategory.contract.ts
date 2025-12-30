import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { productMasterCategoryTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductMasterCategoryInsertFields = spread(
  productMasterCategoryTable,
  "insert"
);
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductMasterCategoryFields = spread(
  productMasterCategoryTable,
  "select"
);
export const ProductMasterCategoryContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...ProductMasterCategoryFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(ProductMasterCategoryInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(ProductMasterCategoryInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(ProductMasterCategoryInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...ProductMasterCategoryFields })),
    total: t.Number(),
  }),
} as const;

export type ProductMasterCategoryContract = InferDTO<
  typeof ProductMasterCategoryContract
>;
