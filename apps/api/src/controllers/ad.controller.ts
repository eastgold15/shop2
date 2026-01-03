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
import { AdContract } from "../../../../packages/contract/src/modules/ad.contract";
import { AdService } from "../services/ad.service";

const adService = new AdService();
/**
 * @generated
 */
export const adController = new Elysia({ prefix: "/ad" })
  .use(dbPlugin)
  .use(authGuardMid)
  // @generated
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      adService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["AD:VIEW"],
      requireDept: true,
      query: AdContract.ListQuery,
      detail: {
        summary: "获取Ad列表",
        description: "分页查询Ad数据，支持搜索和排序",
        tags: ["Ad"],
      },
    }
  )
  // @generated
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      adService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["AD:CREATE"],
      requireDept: true,
      body: AdContract.Create,
      detail: {
        summary: "创建Ad",
        description: "新增一条Ad记录",
        tags: ["Ad"],
      },
    }
  )
  // @generated
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      adService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: AdContract.Update,
      allPermissions: ["AD:EDIT"],
      requireDept: true,
      detail: {
        summary: "更新Ad",
        description: "根据ID更新Ad信息",
        tags: ["Ad"],
      },
    }
  )
  // @generated
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      adService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["AD:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除Ad",
        description: "根据ID删除Ad记录",
        tags: ["Ad"],
      },
    }
  );
