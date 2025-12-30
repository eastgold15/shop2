import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { departmentTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const DepartmentInsertFields = spread(departmentTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const DepartmentFields = spread(departmentTable, "select");
export const DepartmentContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...DepartmentFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(DepartmentInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(DepartmentInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(DepartmentInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...DepartmentFields })),
    total: t.Number(),
  }),
} as const;

export type DepartmentContract = InferDTO<typeof DepartmentContract>;
