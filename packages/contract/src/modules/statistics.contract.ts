import { t } from "elysia";
import { InferDTO } from "~/helper/utils";

export const StatisticsContract = {

  Response: t.Object({
    super_admin: t.Optional(
      t.Object({
        totalSites: t.Number(),
        totalExporters: t.Number(),
        totalUsers: t.Number(),
        activeSites: t.Number(),
      })
    ),
    tenant_admin: t.Optional(
      t.Object({
        totalFactories: t.Number(),
        totalTeamMembers: t.Number(),
        totalProducts: t.Number(),
        thisMonthOrders: t.Number(),
      })
    ),
    dept_manager: t.Optional(
      t.Object({
        totalStaff: t.Number(),
        totalProducts: t.Number(),
        pendingOrders: t.Number(),
      })
    ),
  }),

  NotificationsResponse: t.Array(
    t.Object({
      text: t.String(),
      color: t.String(),
      createdAt: t.String(),
    })
  ),
} as const;

export type StatisticsContract = InferDTO<typeof StatisticsContract>;
