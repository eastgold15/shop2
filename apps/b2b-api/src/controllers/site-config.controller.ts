import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SiteConfigContract } from "../../../../packages/contract/src/modules/site-config.contract";
import { SiteConfigService } from "../services/site-config.service";

const siteConfigService = new SiteConfigService();

export const siteConfigController = new Elysia({ prefix: "/site-config" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      siteConfigService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_CONFIG:VIEW"],
      query: SiteConfigContract.ListQuery,
      requireDept: true,
      detail: {
        summary: "获取SiteConfig列表",
        description: "分页查询SiteConfig数据，支持搜索和排序",
        tags: ["SiteConfig"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      siteConfigService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["SITE_CONFIG:CREATE"],
      body: SiteConfigContract.Create,
      requireDept: true,
      detail: {
        summary: "创建SiteConfig",
        description: "新增一条SiteConfig记录",
        tags: ["SiteConfig"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      siteConfigService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: SiteConfigContract.Update,
      requireDept: true,
      allPermissions: ["SITE_CONFIG:EDIT"],
      detail: {
        summary: "更新SiteConfig",
        description: "根据ID更新SiteConfig信息",
        tags: ["SiteConfig"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      siteConfigService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["SITE_CONFIG:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除SiteConfig",
        description: "根据ID删除SiteConfig记录",
        tags: ["SiteConfig"],
      },
    }
  );
