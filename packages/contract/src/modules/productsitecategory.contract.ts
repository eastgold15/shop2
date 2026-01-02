import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { productSiteCategoryTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductSiteCategoryInsertFields = spread(
  productSiteCategoryTable,
  "insert"
);
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductSiteCategoryFields = spread(
  productSiteCategoryTable,
  "select"
);
export const ProductSiteCategoryContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...ProductSiteCategoryFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(ProductSiteCategoryInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(ProductSiteCategoryInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(ProductSiteCategoryInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...ProductSiteCategoryFields })),
    total: t.Number(),
  }),
} as const;

export type ProductSiteCategoryContract = InferDTO<
  typeof ProductSiteCategoryContract
>;
