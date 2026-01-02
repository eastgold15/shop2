import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { userRoleTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const UserRoleInsertFields = spread(userRoleTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const UserRoleFields = spread(userRoleTable, "select");
export const UserRoleContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...UserRoleFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(UserRoleInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(UserRoleInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(UserRoleInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...UserRoleFields })),
    total: t.Number(),
  }),
} as const;

export type UserRoleContract = InferDTO<typeof UserRoleContract>;
