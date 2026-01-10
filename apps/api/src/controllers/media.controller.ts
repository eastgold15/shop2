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

import { MediaService } from "../services/media.service";
import { MediaContract } from "@repo/contract";

const mediaService = new MediaService();

export const mediaController = new Elysia({ prefix: "/media" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      mediaService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["MEDIA_VIEW"],
      requireDept: true,
      query: MediaContract.ListQuery,
      detail: {
        summary: "获取Media列表",
        description: "分页查询Media数据，支持搜索和排序",
        tags: ["Media"],
      },
    }
  )
  .get(
    "/page-list",
    ({ query, user, db, currentDeptId }) =>
      mediaService.pageList(query, { db, user, currentDeptId }),
    {
      allPermissions: ["MEDIA_VIEW"],
      requireDept: true,
      query: MediaContract.PageListQuery,
      detail: {
        summary: "分页获取Media列表",
        description: "分页查询Media数据，返回包含data和total的对象",
        tags: ["Media"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      mediaService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["MEDIA_CREATE"],
      requireDept: true,
      body: MediaContract.Create,
      detail: {
        summary: "创建Media",
        description: "新增一条Media记录",
        tags: ["Media"],
      },
    }
  )
  .post(
    "/upload",
    async ({ body, user, db, currentDeptId }) =>
      mediaService.upload(body, { db, user, currentDeptId }),
    {
      allPermissions: ["MEDIA_CREATE"],
      requireDept: true,
      body: MediaContract.Uploads,
      detail: {
        summary: "上传媒体文件",
        description: "上传单个或多个媒体文件到OSS并记录到数据库",
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
      allPermissions: ["MEDIA_EDIT"],
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
      allPermissions: ["MEDIA_DELETE"],
      detail: {
        summary: "删除Media",
        description: "根据ID删除Media记录",
        tags: ["Media"],
      },
    }
  )
  .delete(
    "/batch",
    ({ body, user, db, currentDeptId }) =>
      mediaService.batchDelete(body.ids, { db, user, currentDeptId }),
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
      requireDept: true,
      allPermissions: ["MEDIA_DELETE"],
      detail: {
        summary: "批量删除Media",
        description: "根据ID数组批量删除Media记录",
        tags: ["Media"],
      },
    }
  );
