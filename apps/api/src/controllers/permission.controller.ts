import { PermissionContract } from "@repo/contract";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { PermissionService } from "../services/permission.service";

const permissionService = new PermissionService();

export const permissionController = new Elysia({ prefix: "/permission" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ user, db, currentDeptId, query }) =>
      permissionService.list(
        query,
        { db, user, currentDeptId }
      ),
    {
      allPermissions: ["PERMISSION_VIEW"],
      query: t.Object({
        search: t.Optional(t.String()),
      }),
      requireDept: true,
      detail: {
        summary: "获取权限列表",
        description: "获取系统中所有可用的权限",
        tags: ["Permission"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      permissionService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: PermissionContract.Update,
      allPermissions: ["PERMISSION_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新权限",
        description: "更新权限的描述",
        tags: ["Permission"],
      },
    }
  );
