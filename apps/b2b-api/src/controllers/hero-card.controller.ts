import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { HeroCardContract } from "../../../../packages/contract/src/modules/hero-card.contract";
import { HeroCardService } from "../services/hero-card.service";

const heroCardService = new HeroCardService();
/**
 * @generated
 */
export const heroCardController = new Elysia({ prefix: "/hero-card" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      heroCardService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["HERO_CARD_VIEW"],
      query: HeroCardContract.ListQuery,
      requireDept: true,
      detail: {
        summary: "获取HeroCard列表",
        description: "分页查询HeroCard数据，支持搜索和排序",
        tags: ["HeroCard"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      heroCardService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["HERO_CARD_CREATE"],
      body: HeroCardContract.Create,
      requireDept: true,
      detail: {
        summary: "创建HeroCard",
        description: "新增一条HeroCard记录",
        tags: ["HeroCard"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      heroCardService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: HeroCardContract.Update,
      allPermissions: ["HERO_CARD_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新HeroCard",
        description: "根据ID更新HeroCard信息",
        tags: ["HeroCard"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      heroCardService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["HERO_CARD_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除HeroCard",
        description: "根据ID删除HeroCard记录",
        tags: ["HeroCard"],
      },
    }
  )
  .patch(
    "/sort",
    ({ body, user, db, currentDeptId }) =>
      heroCardService.updateSortOrder(body.items, { db, user, currentDeptId }),
    {
      body: t.Object({
        items: t.Array(
          t.Object({
            id: t.String(),
            sortOrder: t.Number(),
          })
        ),
      }),
      allPermissions: ["HERO_CARD_EDIT"],
      requireDept: true,
      detail: {
        summary: "批量更新HeroCard排序",
        description: "批量更新多个HeroCard的排序值",
        tags: ["HeroCard"],
      },
    }
  )
  .patch(
    "/:id/toggle",
    ({ params, user, db, currentDeptId }) =>
      heroCardService.patchStatus(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["HERO_CARD_EDIT"],
      requireDept: true,
      detail: {
        summary: "切换HeroCard激活状态",
        description: "切换指定HeroCard的启用/禁用状态",
        tags: ["HeroCard"],
      },
    }
  )
  .delete(
    "/batch",
    ({ body, user, db, currentDeptId }) =>
      heroCardService.batchDelete(body.ids, { db, user, currentDeptId }),
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
      allPermissions: ["HERO_CARD_DELETE"],
      requireDept: true,
      detail: {
        summary: "批量删除HeroCard",
        description: "根据ID列表批量删除HeroCard记录",
        tags: ["HeroCard"],
      },
    }
  );
