/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { HeroCardContract } from "../../../../packages/contract/src/modules/herocard.contract";
import { HeroCardService } from "../services/herocard.service";

const herocardService = new HeroCardService();
/**
 * @generated
 */
export const herocardController = new Elysia({ prefix: "/herocard" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db }) => herocardService.findAll(query, { db, user }),
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
    ({ body, user, db }) => herocardService.create(body, { db, user }),
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
    ({ params, body, user, db }) =>
      herocardService.update(params.id, body, { db, user }),
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
    ({ params, user, db }) => herocardService.delete(params.id, { db, user }),
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
