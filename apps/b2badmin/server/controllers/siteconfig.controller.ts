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
import { SiteConfigContract } from "../../../../packages/contract/src/modules/siteconfig.contract";
import { SiteConfigService } from "../services/siteconfig.service";

const siteconfigService = new SiteConfigService();
/**
 * @generated
 */
export const siteconfigController = new Elysia({ prefix: "/siteconfig" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db }) => siteconfigService.findAll(query, { db, user }),
    {
      allPermissions: ["SITECONFIG:VIEW"],
      query: SiteConfigContract.ListQuery,
      detail: {
        summary: "获取SiteConfig列表",
        description: "分页查询SiteConfig数据，支持搜索和排序",
        tags: ["SiteConfig"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db }) => siteconfigService.create(body, { db, user }),
    {
      allPermissions: ["SITECONFIG:CREATE"],
      body: SiteConfigContract.Create,
      detail: {
        summary: "创建SiteConfig",
        description: "新增一条SiteConfig记录",
        tags: ["SiteConfig"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db }) =>
      siteconfigService.update(params.id, body, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteConfigContract.Update,
      allPermissions: ["SITECONFIG:EDIT"],
      detail: {
        summary: "更新SiteConfig",
        description: "根据ID更新SiteConfig信息",
        tags: ["SiteConfig"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db }) => siteconfigService.delete(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SITECONFIG:DELETE"],
      detail: {
        summary: "删除SiteConfig",
        description: "根据ID删除SiteConfig记录",
        tags: ["SiteConfig"],
      },
    }
  );
