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
import { SkuContract } from "../../../../packages/contract/src/modules/sku.contract";
import { SkuService } from "../services/sku.service";

const skuService = new SkuService();
/**
 * @generated
 */
export const skuController = new Elysia({ prefix: "/sku" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get("/", ({ query, user, db }) => skuService.findAll(query, { db, user }), {
    allPermissions: ["SKU:VIEW"],
    query: SkuContract.ListQuery,
    detail: {
      summary: "获取Sku列表",
      description: "分页查询Sku数据，支持搜索和排序",
      tags: ["Sku"],
    },
  })
  .post("/", ({ body, user, db }) => skuService.create(body, { db, user }), {
    allPermissions: ["SKU:CREATE"],
    body: SkuContract.Create,
    detail: {
      summary: "创建Sku",
      description: "新增一条Sku记录",
      tags: ["Sku"],
    },
  })
  .put(
    "/:id",
    ({ params, user, db }) => skuService.update(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      body: SkuContract.Update,
      allPermissions: ["SKU:EDIT"],
      detail: {
        summary: "更新Sku",
        description: "根据ID更新Sku信息",
        tags: ["Sku"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db }) => skuService.delete(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SKU:DELETE"],
      detail: {
        summary: "删除Sku",
        description: "根据ID删除Sku记录",
        tags: ["Sku"],
      },
    }
  );
