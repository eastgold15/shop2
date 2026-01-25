import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { siteCategoryTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SiteCategoryInsertFields = spread(siteCategoryTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const SiteCategoryFields = spread(siteCategoryTable, "select");

const Base = t.Omit(t.Object(SiteCategoryFields), [
  "siteId",
  "createdAt",
  "updatedAt",
]);

export const SiteCategoryContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...SiteCategoryFields,
  }),
  TreeEntity: t.Recursive((Self) =>
    t.Object({
      // 展开所有基础字段
      ...SiteCategoryFields,
      // 递归定义 children
      children: t.Optional(t.Array(Self)),
    })
  ),

  Create: t.Object({
    ...t.Omit(t.Object(SiteCategoryInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
      "tenantId",
      "deptId",
      "siteId",
    ]).properties,
    url: t.Optional(t.String()), // 手动添加 url 字段
  }),

  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(SiteCategoryInsertFields), [
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
      url: t.Optional(t.String()), // 手动添加 url 字段
    })
  ),
  // Patch 请求 (部分更新)
  Patch: t.Partial(
    t.Object({
      ...t.Omit(t.Object(SiteCategoryInsertFields), [
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
      url: t.Optional(t.String()), // 手动添加 url 字段
    })
  ),

  ListQuery: t.Object({
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...SiteCategoryFields })),
    total: t.Number(),
  }),
} as const;

export type SiteCategoryContract = InferDTO<typeof SiteCategoryContract>;
