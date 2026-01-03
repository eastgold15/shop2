import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SkuMediaContract } from "../../../../packages/contract/src/modules/sku-media.contract";
import { SkuMediaService } from "../services/sku-media.service";

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
      skuMediaService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SKU_MEDIA:VIEW"],
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
      allPermissions: ["SKU_MEDIA:CREATE"],
      requireDept: true,
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
    ({ params, body, user, db, currentDeptId }) =>
      skuMediaService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SkuMediaContract.Update,
      requireDept: true,
      allPermissions: ["SKU_MEDIA:EDIT"],
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
      allPermissions: ["SKU_MEDIA:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SkuMedia",
        description: "根据ID删除SkuMedia记录",
        tags: ["SkuMedia"],
      },
    }
  );
