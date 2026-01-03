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
import { MediaContract } from "../../../../packages/contract/src/modules/media.contract";
import { MediaService } from "../services/media.service";

const mediaService = new MediaService();

export const mediaController = new Elysia({ prefix: "/media" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      mediaService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["MEDIA:VIEW"],
      requireDept: true,
      query: MediaContract.ListQuery,
      detail: {
        summary: "获取Media列表",
        description: "分页查询Media数据，支持搜索和排序",
        tags: ["Media"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      mediaService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["MEDIA:CREATE"],
      requireDept: true,
      body: MediaContract.Create,
      detail: {
        summary: "创建Media",
        description: "新增一条Media记录",
        tags: ["Media"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, user, db, body, currentDeptId }) =>
      mediaService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: MediaContract.Update,
      allPermissions: ["MEDIA:EDIT"],
      requireDept: true,
      detail: {
        summary: "更新Media",
        description: "根据ID更新Media信息",
        tags: ["Media"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      mediaService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      requireDept: true,
      allPermissions: ["MEDIA:DELETE"],
      detail: {
        summary: "删除Media",
        description: "根据ID删除Media记录",
        tags: ["Media"],
      },
    }
  );
