import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { dailyInquiryCounterTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const DailyInquiryCounterInsertFields = spread(
  dailyInquiryCounterTable,
  "insert"
);
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const DailyInquiryCounterFields = spread(
  dailyInquiryCounterTable,
  "select"
);
export const DailyInquiryCounterContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...DailyInquiryCounterFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(DailyInquiryCounterInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(DailyInquiryCounterInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(DailyInquiryCounterInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...DailyInquiryCounterFields })),
    total: t.Number(),
  }),
} as const;

export type DailyInquiryCounterContract = InferDTO<
  typeof DailyInquiryCounterContract
>;
