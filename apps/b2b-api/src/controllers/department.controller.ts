/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */

import { DepartmentContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { DepartmentService } from "../services/department.service";

const departmentService = new DepartmentService();

export const departmentController = new Elysia({ prefix: "/department" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      departmentService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["DEPARTMENT_VIEW"],
      requireDept: true,
      query: DepartmentContract.ListQuery,
      detail: {
        summary: "获取Department列表",
        description: "分页查询Department数据，支持搜索和排序",
        tags: ["Department"],
      },
    }
  )
  .get(
    "/:id",
    ({ params, user, db }) =>
      departmentService.detail(params.id, {
        db,
        user,
        currentDeptId: params.id,
      }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["DEPARTMENT_VIEW"],
      detail: {
        summary: "获取Department详情",
        description: "根据ID获取Department详情信息",
        tags: ["Department"],
      },
    }
  )

  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      departmentService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["DEPARTMENT_CREATE"],
      requireDept: true,
      body: DepartmentContract.Create,
      detail: {
        summary: "创建Department",
        description: "新增一条Department记录",
        tags: ["Department"],
      },
    }
  )

  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      departmentService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: DepartmentContract.Update,
      allPermissions: ["DEPARTMENT_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新Department",
        description: "根据ID更新Department信息",
        tags: ["Department"],
      },
    }
  )

  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      departmentService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["DEPARTMENT_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除Department",
        description: "根据ID删除Department记录",
        tags: ["Department"],
      },
    }
  )
  // 自定义端点：创建部门+站点+管理员
  .post(
    "/with-site-and-admin",
    async ({ body, user, db, currentDeptId, headers }) =>
      departmentService.createDepartmentWithSiteAndAdmin(
        body,
        {
          db,
          user,
          currentDeptId,
        },
        headers
      ),
    {
      body: DepartmentContract.CreateDepartmentWithSiteAndAdmin,
      allPermissions: ["DEPARTMENT_CREATE"],
      requireDept: true,
      detail: {
        summary: "创建部门、站点和管理员",
        description:
          "一次性创建部门、关联站点和管理员用户，使用事务确保数据一致性",
        tags: ["Department"],
      },
    }
  )
  // 自定义端点：更新部门+站点+管理员
  .put(
    "/with-site-and-admin",
    async ({ body, user, db, currentDeptId, headers }) =>
      departmentService.updateDepartmentWithSiteAndAdmin(
        body,
        {
          db,
          user,
          currentDeptId,
        },
        headers
      ),
    {
      body: DepartmentContract.UpdateDepartmentWithSiteAndAdmin,
      allPermissions: ["DEPARTMENT_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新部门、站点和管理员",
        description:
          "更新部门、站点信息，管理员信息为可选（留空则不修改管理员）",
        tags: ["Department"],
      },
    }
  );
