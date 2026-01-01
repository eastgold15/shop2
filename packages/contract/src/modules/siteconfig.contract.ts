import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { siteConfigTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SiteConfigInsertFields = spread(siteConfigTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SiteConfigFields = spread(siteConfigTable, "select");
export const SiteConfigContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...SiteConfigFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(SiteConfigInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(SiteConfigInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(SiteConfigInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...SiteConfigFields })),
    total: t.Number(),
  }),
} as const;

export type SiteConfigContract = InferDTO<typeof SiteConfigContract>;
