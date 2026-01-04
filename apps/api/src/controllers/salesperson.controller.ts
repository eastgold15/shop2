import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { SalespersonService } from "../services/salesperson.service";

const salespersonService = new SalespersonService();

export const salespersonController = new Elysia({
  prefix: "/salespersons",
})
  .use(dbPlugin)
  .use(authGuardMid)

  /**
   * 获取业务员列表
   */
  .get(
    "/",
    async ({ query, user, db, currentDeptId }) =>
      salespersonService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["USER:VIEW"],
      requireDept: true,
      query: t.Object({
        page: t.Optional(t.Numeric()),
        limit: t.Optional(t.Numeric()),
        search: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
      }),
      detail: {
        summary: "获取业务员列表",
        description:
          "分页查询业务员数据，支持搜索和状态筛选。返回业务员的详细信息，包括用户信息、联系方式、职位等。",
        tags: ["Salesperson"],
      },
    }
  )

  /**
   * 创建业务员
   */
  .post(
    "/",
    async ({ body, user, db, currentDeptId }) =>
      salespersonService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["USER:CREATE"],
      requireDept: true,
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        phone: t.Optional(t.String()),
        whatsapp: t.Optional(t.String()),
        position: t.Optional(t.String()),
        department: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
        masterCategoryIds: t.Optional(t.Array(t.String())),
      }),
      detail: {
        summary: "创建业务员",
        description:
          "创建新的业务员账号，自动归属到当前用户的站点。根据站点类型（出口商/工厂）设置不同的数据权限范围。",
        tags: ["Salesperson"],
      },
    }
  )

  /**
   * 更新业务员
   */
  .put(
    "/:id",
    async ({ params, body, user, db, currentDeptId }) =>
      salespersonService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["USER:EDIT"],
      requireDept: true,
      body: t.Object({
        phone: t.Optional(t.String()),
        whatsapp: t.Optional(t.String()),
        position: t.Optional(t.String()),
        department: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
      }),
      detail: {
        summary: "更新业务员",
        description: "更新业务员的基本信息，包括联系方式、职位、账号状态等。",
        tags: ["Salesperson"],
      },
    }
  )

  /**
   * 删除业务员
   */
  .delete(
    "/:id",
    async ({ params, user, db, currentDeptId }) =>
      salespersonService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["USER:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除业务员",
        description: "根据ID删除业务员记录。此操作不可恢复，请谨慎使用。",
        tags: ["Salesperson"],
      },
    }
  )

  /**
   * 更新业务员的主分类
   */
  .put(
    "/:id/master-categories",
    async ({ params, body, user, db, currentDeptId }) =>
      salespersonService.updateMasterCategories(params.id, body.masterCategoryIds, {
        db,
        user,
        currentDeptId,
      }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["USER:EDIT"],
      requireDept: true,
      body: t.Object({
        masterCategoryIds: t.Array(t.String()),
      }),
      detail: {
        summary: "更新业务员的主分类",
        description:
          "更新业务员负责的主分类列表。主分类决定了业务员可以管理和销售哪些产品。",
        tags: ["Salesperson"],
      },
    }
  );
