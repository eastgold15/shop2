import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { quotationTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const QuotationInsertFields = spread(quotationTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const QuotationFields = spread(quotationTable, "select");
export const QuotationContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
                ...QuotationFields
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
                ...t.Omit(t.Object(QuotationInsertFields), ["id", "createdAt", "updatedAt"]).properties
              }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(t.Object({
              ...t.Omit(t.Object(QuotationInsertFields), ["id", "createdAt", "updatedAt", "siteId"]).properties
            })),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(QuotationInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...QuotationFields })),
    total: t.Number(),
  }),
} as const;

export type QuotationContract = InferDTO<typeof QuotationContract>;
