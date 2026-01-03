/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { SkuMediaContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SkuMediaService } from "~/services/sku-media.service";

const skuMediaService = new SkuMediaService();
/**
 * @generated
 */
export const skuMediaController = new Elysia({ prefix: "/sku-media" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      skuMediaService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SKUMEDIA:VIEW"],
      requireDept: true,
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
    ({ body, user, db, currentDeptId }) =>
      skuMediaService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["SKUMEDIA:CREATE"],
      body: SkuMediaContract.Create,
      requireDept: true,
      detail: {
        summary: "创建SkuMedia",
        description: "新增一条SkuMedia记录",
        tags: ["SkuMedia"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      skuMediaService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SkuMediaContract.Update,
      requireDept: true,
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
    ({ params, user, db, currentDeptId }) =>
      skuMediaService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SKUMEDIA:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SkuMedia",
        description: "根据ID删除SkuMedia记录",
        tags: ["SkuMedia"],
      },
    }
  );
