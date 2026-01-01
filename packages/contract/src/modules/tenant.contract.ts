import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { tenantTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TenantInsertFields = spread(tenantTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TenantFields = spread(tenantTable, "select");
export const TenantContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...TenantFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(TenantInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(TenantInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(TenantInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...TenantFields })),
    total: t.Number(),
  }),
} as const;

export type TenantContract = InferDTO<typeof TenantContract>;
