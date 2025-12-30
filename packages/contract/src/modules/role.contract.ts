import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { roleTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const RoleInsertFields = spread(roleTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const RoleFields = spread(roleTable, "select");
export const RoleContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...RoleFields,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(RoleInsertFields), ["id", "createdAt", "updatedAt"])
      .properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(RoleInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),

  ListQuery: t.Object({
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...RoleFields })),
    total: t.Number(),
  }),
} as const;

export type RoleContract = InferDTO<typeof RoleContract>;