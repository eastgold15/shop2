import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { siteCategoryTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SiteCategoryInsertFields = spread(siteCategoryTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SiteCategoryFields = spread(siteCategoryTable, "select");
export const SiteCategoryContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...SiteCategoryFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(SiteCategoryInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(SiteCategoryInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(SiteCategoryInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...SiteCategoryFields })),
    total: t.Number(),
  }),
} as const;

export type SiteCategoryContract = InferDTO<typeof SiteCategoryContract>;
