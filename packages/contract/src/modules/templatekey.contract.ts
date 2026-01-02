import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { templateKeyTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TemplateKeyInsertFields = spread(templateKeyTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TemplateKeyFields = spread(templateKeyTable, "select");
export const TemplateKeyContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...TemplateKeyFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(TemplateKeyInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(TemplateKeyInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(TemplateKeyInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...TemplateKeyFields })),
    total: t.Number(),
  }),
} as const;

export type TemplateKeyContract = InferDTO<typeof TemplateKeyContract>;
