import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { permissionTable } from "../table.schema";
import { PaginationParams, SortParams } from "../helper/query-types.model";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const PermissionInsertFields = spread(permissionTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const PermissionFields = spread(permissionTable, "select");
export const PermissionContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...PermissionFields
              }),
  Create: t.Object({
    ...t.Omit(t.Object(PermissionInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(PermissionInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),

  ListQuery: t.Object({
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...PermissionFields })),
    total: t.Number(),
  }),
} as const;

export type PermissionContract = InferDTO<typeof PermissionContract>;
