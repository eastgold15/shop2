import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { rolePermissionTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const RolePermissionInsertFields = spread(rolePermissionTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const RolePermissionFields = spread(rolePermissionTable, "select");
export const RolePermissionContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...RolePermissionFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(RolePermissionInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(RolePermissionInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(RolePermissionInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...RolePermissionFields })),
    total: t.Number(),
  }),
} as const;

export type RolePermissionContract = InferDTO<typeof RolePermissionContract>;
