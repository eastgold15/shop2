import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { productTemplateTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductTemplateInsertFields = spread(
  productTemplateTable,
  "insert"
);
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductTemplateFields = spread(productTemplateTable, "select");
export const ProductTemplateContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...ProductTemplateFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(ProductTemplateInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(ProductTemplateInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(ProductTemplateInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...ProductTemplateFields })),
    total: t.Number(),
  }),
} as const;

export type ProductTemplateContract = InferDTO<typeof ProductTemplateContract>;
