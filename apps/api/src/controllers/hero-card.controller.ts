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
      heroCardService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["HEROCARD:VIEW"],
      query: HeroCardContract.ListQuery,
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
      allPermissions: ["HEROCARD:CREATE"],
      body: HeroCardContract.Create,
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
      allPermissions: ["HEROCARD:EDIT"],
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
      allPermissions: ["HEROCARD:DELETE"],
      detail: {
        summary: "删除HeroCard",
        description: "根据ID删除HeroCard记录",
        tags: ["HeroCard"],
      },
    }
  );
