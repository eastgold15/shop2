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
import { SkuMediaContract } from "../../../../packages/contract/src/modules/skumedia.contract";
import { SkuMediaService } from "../services/skumedia.service";

const skumediaService = new SkuMediaService();
/**
 * @generated
 */
export const skumediaController = new Elysia({ prefix: "/skumedia" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db }) => skumediaService.findAll(query, { db, user }),
    {
      allPermissions: ["SKUMEDIA:VIEW"],
      query: SkuMediaContract.ListQuery,
      detail: {
        summary: "获取SkuMedia列表",
        description: "分页查询SkuMedia数据，支持搜索和排序",
        tags: ["SkuMedia"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db }) => skumediaService.create(body, { db, user }),
    {
      allPermissions: ["SKUMEDIA:CREATE"],
      body: SkuMediaContract.Create,
      detail: {
        summary: "创建SkuMedia",
        description: "新增一条SkuMedia记录",
        tags: ["SkuMedia"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db }) =>
      skumediaService.update(params.id, body, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      body: SkuMediaContract.Update,
      allPermissions: ["SKUMEDIA:EDIT"],
      detail: {
        summary: "更新SkuMedia",
        description: "根据ID更新SkuMedia信息",
        tags: ["SkuMedia"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db }) => skumediaService.delete(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SKUMEDIA:DELETE"],
      detail: {
        summary: "删除SkuMedia",
        description: "根据ID删除SkuMedia记录",
        tags: ["SkuMedia"],
      },
    }
  );
