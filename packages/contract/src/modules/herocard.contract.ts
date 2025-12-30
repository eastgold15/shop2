import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
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
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Create: t.Object({
    ...t.Omit(t.Object(HeroCardInsertFields), ["id", "createdAt", "updatedAt"])
      .properties,
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Update: t.Partial(
    t.Object({
      ...t.Omit(t.Object(HeroCardInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
      ]).properties,
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(HeroCardInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...HeroCardFields })),
    total: t.Number(),
  }),
} as const;

export type HeroCardContract = InferDTO<typeof HeroCardContract>;
