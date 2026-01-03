/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { Elysia, t } from "elysia";
import { MediaMetadataContract } from "media-metadata.contract";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
";

import { MediaMetadataService } from "media-metadata.service";
";

const mediaMetadataService = new MediaMetadataService();
/**
 * @generated
 */
export const mediaMetadataController = new Elysia({ prefix: "/media-metadata" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db }) => mediaMetadataService.findAll(query, { db, user }),
    {
      allPermissions: ["MEDIAMETADATA:VIEW"],
      query: MediaMetadataContract.ListQuery,
      detail: {
        summary: "获取MediaMetadata列表",
        description: "分页查询MediaMetadata数据，支持搜索和排序",
        tags: ["MediaMetadata"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db }) => mediaMetadataService.create(body, { db, user }),
    {
      allPermissions: ["MEDIAMETADATA:CREATE"],
      body: MediaMetadataContract.Create,
      detail: {
        summary: "创建MediaMetadata",
        description: "新增一条MediaMetadata记录",
        tags: ["MediaMetadata"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, user, db }) =>
      mediaMetadataService.update(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      body: MediaMetadataContract.Update,
      allPermissions: ["MEDIAMETADATA:EDIT"],
      detail: {
        summary: "更新MediaMetadata",
        description: "根据ID更新MediaMetadata信息",
        tags: ["MediaMetadata"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db }) =>
      mediaMetadataService.delete(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["MEDIAMETADATA:DELETE"],
      detail: {
        summary: "删除MediaMetadata",
        description: "根据ID删除MediaMetadata记录",
        tags: ["MediaMetadata"],
      },
    }
  );
