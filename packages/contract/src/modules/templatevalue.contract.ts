import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { templateValueTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TemplateValueInsertFields = spread(templateValueTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const TemplateValueFields = spread(templateValueTable, "select");
export const TemplateValueContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...TemplateValueFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(TemplateValueInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(TemplateValueInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(TemplateValueInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...TemplateValueFields })),
    total: t.Number(),
  }),
} as const;

export type TemplateValueContract = InferDTO<typeof TemplateValueContract>;
