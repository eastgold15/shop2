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
import { TenantContract } from "../../../../packages/contract/src/modules/tenant.contract";
import { TenantService } from "../services/tenant.service";

const tenantService = new TenantService();
/**
 * @generated
 */
export const tenantController = new Elysia({ prefix: "/tenant" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      tenantService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["TENANT:VIEW"],
      query: TenantContract.ListQuery,
      detail: {
        summary: "获取Tenant列表",
        description: "分页查询Tenant数据，支持搜索和排序",
        tags: ["Tenant"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      tenantService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["TENANT:CREATE"],
      body: TenantContract.Create,
      detail: {
        summary: "创建Tenant",
        description: "新增一条Tenant记录",
        tags: ["Tenant"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      tenantService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: TenantContract.Update,
      allPermissions: ["TENANT:EDIT"],
      detail: {
        summary: "更新Tenant",
        description: "根据ID更新Tenant信息",
        tags: ["Tenant"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      tenantService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["TENANT:DELETE"],
      detail: {
        summary: "删除Tenant",
        description: "根据ID删除Tenant记录",
        tags: ["Tenant"],
      },
    }
  );
