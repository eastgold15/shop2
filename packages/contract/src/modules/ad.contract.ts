import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { adTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const AdInsertFields = spread(adTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const AdFields = spread(adTable, "select");
export const AdContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...AdFields,
  }),

  Create: t.Object({
    ...t.Omit(t.Object(AdInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
      "startDate",
      "endDate",
      "tenantId", // 后端从 ctx.user.context.tenantId 注入
      "siteId", // 后端从 ctx.user.context.site.id 注入
      "deptId", // 后端从 ctx.currentDeptId 注入
      "createdBy", // 后端从 ctx.user.id 注入
    ]).properties,
    startDate: t.String(),
    endDate: t.String(),
  }),

  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(AdInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "startDate",
        "endDate",
        "siteId", // 不允许修改站点
        "tenantId", // 不允许修改租户
        "deptId", // 不允许修改部门
        "createdBy", // 不允许修改创建者
      ]).properties,
      startDate: t.String(),
      endDate: t.String(),
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(AdInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...AdFields })),
    total: t.Number(),
  }),
} as const;

export type AdContract = InferDTO<typeof AdContract>;
