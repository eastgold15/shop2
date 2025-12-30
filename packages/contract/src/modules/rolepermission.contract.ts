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
  // Patch 请求 (部分更新)
  Patch: t.Partial(
    t.Object({
      ...t.Omit(t.Object(RolePermissionInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),

  ListQuery: t.Object({
    roleId: t.String(),
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...RolePermissionFields })),
    total: t.Number(),
  }),
  // 批量更新角色权限
  BatchUpdate: t.Object({
    roleId: t.String(),
    permissionIds: t.Array(t.String()),
  }),
} as const;

export type RolePermissionContract = InferDTO<typeof RolePermissionContract>;