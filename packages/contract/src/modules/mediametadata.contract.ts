import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { mediaMetadataTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const MediaMetadataInsertFields = spread(mediaMetadataTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const MediaMetadataFields = spread(mediaMetadataTable, "select");
export const MediaMetadataContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...MediaMetadataFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(MediaMetadataInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
    ]).properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(MediaMetadataInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(MediaMetadataInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...MediaMetadataFields })),
    total: t.Number(),
  }),
} as const;

export type MediaMetadataContract = InferDTO<typeof MediaMetadataContract>;
