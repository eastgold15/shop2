import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { mediaTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const MediaInsertFields = spread(mediaTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const MediaFields = spread(mediaTable, "select");
export const MediaContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...MediaFields,
  }),
  Entity: t.Object(MediaFields),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(MediaInsertFields), ["id", "createdAt", "updatedAt"])
      .properties,
  }),

  Uploads: t.Object({
    files: t.Files(), // 支持多个文件
    category: t.Optional(MediaInsertFields.category),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(MediaInsertFields), [
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
      ...t.Omit(t.Object(MediaInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),

  ListQuery: t.Object({
    ...t.Partial(t.Object(MediaInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
    ids: t.Optional(t.Array(t.String())), // 批量查询 ID 列表
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...MediaFields })),
    total: t.Number(),
  }),
} as const;

export type MediaContract = InferDTO<typeof MediaContract>;
