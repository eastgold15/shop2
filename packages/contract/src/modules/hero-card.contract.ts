import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { heroCardTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const HeroCardInsertFields = spread(heroCardTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const HeroCardFields = spread(heroCardTable, "select");
export const HeroCardContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...HeroCardFields,
  }),

  Create: t.Object({
    ...t.Omit(t.Object(HeroCardInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
      "siteId",
      "createdBy", // 不允许修改创建者
      "deptId", // 不允许修改部门
      "tenantId", // 不允许修改租户
    ]).properties,
  }),

  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(HeroCardInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
        "createdBy", // 不允许修改创建者
        "deptId", // 不允许修改部门
        "tenantId", // 不允许修改租户
      ]).properties,
    })
  ),

  ListQuery: t.Object({
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...HeroCardFields })),
    total: t.Number(),
  }),
} as const;

export type HeroCardContract = InferDTO<typeof HeroCardContract>;
