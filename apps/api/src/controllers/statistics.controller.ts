import { Elysia } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { StatisticsService } from "../services/statistics.service";

const statisticsService = new StatisticsService();

export const statisticsController = new Elysia({ prefix: "/statistics" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ user, db, currentDeptId }) => {
      const roleName = user?.roles?.[0]?.name || "default";
      const tenantId = user.context.tenantId!;

      return statisticsService.getStatisticsByRole(
        tenantId,
        roleName,
        currentDeptId || "",
        { db, user, currentDeptId }
      );
    },
    {
      requireDept: true,
      detail: {
        summary: "获取仪表盘统计数据",
        description: "根据用户角色获取对应的统计数据",
        tags: ["Statistics"],
      },
    }
  )
  .get(
    "/notifications",
    ({ user, db, currentDeptId }) => {
      const roleName = user?.roles?.[0]?.name || "default";
      const tenantId = user.context.tenantId!;

      return statisticsService.getNotifications(
        tenantId,
        roleName,
        currentDeptId || "",
        { db, user, currentDeptId }
      );
    },
    {
      requireDept: true,
      detail: {
        summary: "获取通知列表",
        description: "根据用户角色获取对应的业务通知",
        tags: ["Statistics"],
      },
    }
  );
