import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { inquiryTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const InquiryInsertFields = spread(inquiryTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const InquiryFields = spread(inquiryTable, "select");
export const InquiryContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...InquiryFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(InquiryInsertFields), ["id", "createdAt", "updatedAt"])
      .properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(InquiryInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(InquiryInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...InquiryFields })),
    total: t.Number(),
  }),
} as const;

export type InquiryContract = InferDTO<typeof InquiryContract>;
