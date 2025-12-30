import { t } from "elysia";

import { type InferDTO, spread } from "../helper/utils";
import { userTable } from "../table.schema";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const UserInsertFields = spread(userTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const UserFields = spread(userTable, "select");
export const UserContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...UserFields,
  }),

  Create: t.Composite([
    t.Object(
      t.Omit(t.Object(UserInsertFields), ["id", "createdAt", "updatedAt"])
        .properties
    ),
    t.Object({
      password: t.String(),
      roleId: t.Optional(t.String()),
    }),
  ]),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(UserInsertFields), [
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
      ...t.Omit(t.Object(UserInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...UserFields })),
    total: t.Number(),
  }),
} as const;

export type UserContract = InferDTO<typeof UserContract>;