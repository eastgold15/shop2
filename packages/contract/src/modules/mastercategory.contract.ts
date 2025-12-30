import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { masterCategoryTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const MasterCategoryInsertFields = spread(masterCategoryTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const MasterCategoryFields = spread(masterCategoryTable, "select");
export const MasterCategoryContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...MasterCategoryFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(MasterCategoryInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(MasterCategoryInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(MasterCategoryInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...MasterCategoryFields })),
    total: t.Number(),
  }),
} as const;

export type MasterCategoryContract = InferDTO<typeof MasterCategoryContract>;
