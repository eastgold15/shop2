import {
  departmentTable,
  inquiryTable,
  productTable,
  siteTable,
  userTable,
} from "@repo/contract";
import { and, count, eq, gte } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class StatisticsService {
  async getSuperAdminStats(tenantId: string, ctx: ServiceContext) {
    const [totalSites] = await ctx.db
      .select({ count: count() })
      .from(siteTable)
      .where(eq(siteTable.tenantId, tenantId));

    const [totalExporters] = await ctx.db
      .select({ count: count() })
      .from(departmentTable)
      .where(
        and(
          eq(departmentTable.tenantId, tenantId),
          eq(departmentTable.category, "group")
        )
      );

    const [totalUsers] = await ctx.db
      .select({ count: count() })
      .from(userTable)
      .where(
        and(eq(userTable.tenantId, tenantId), eq(userTable.isActive, true))
      );

    const [activeSites] = await ctx.db
      .select({ count: count() })
      .from(siteTable)
      .where(
        and(eq(siteTable.tenantId, tenantId), eq(siteTable.isActive, true))
      );

    return {
      super_admin: {
        totalSites: totalSites.count,
        totalExporters: totalExporters.count,
        totalUsers: totalUsers.count,
        activeSites: activeSites.count,
      }
    }
  }

  async getExporterStats(tenantId: string, ctx: ServiceContext) {
    const [totalFactories] = await ctx.db
      .select({ count: count() })
      .from(departmentTable)
      .where(
        and(
          eq(departmentTable.tenantId, tenantId),
          eq(departmentTable.category, "factory")
        )
      );

    const [totalTeamMembers] = await ctx.db
      .select({ count: count() })
      .from(userTable)
      .where(
        and(eq(userTable.tenantId, tenantId), eq(userTable.isActive, true))
      );

    const [totalProducts] = await ctx.db
      .select({ count: count() })
      .from(productTable)
      .where(eq(productTable.tenantId, tenantId));

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [thisMonthOrders] = await ctx.db
      .select({ count: count() })
      .from(inquiryTable)
      .where(
        and(
          eq(inquiryTable.tenantId, tenantId),
          gte(inquiryTable.createdAt, sevenDaysAgo)
        )
      );

    return {
      tenant_admin: {
        totalFactories: totalFactories.count,
        totalTeamMembers: totalTeamMembers.count,
        totalProducts: totalProducts.count,
        thisMonthOrders: thisMonthOrders.count,
      }
    }
  }

  async getFactoryStats(tenantId: string, deptId: string, ctx: ServiceContext) {
    const [totalStaff] = await ctx.db
      .select({ count: count() })
      .from(userTable)
      .where(and(eq(userTable.deptId, deptId), eq(userTable.isActive, true)));

    const [totalProducts] = await ctx.db
      .select({ count: count() })
      .from(productTable)
      .where(eq(productTable.deptId, deptId));

    const [pendingOrders] = await ctx.db
      .select({ count: count() })
      .from(inquiryTable)
      .where(
        and(eq(inquiryTable.deptId, deptId), eq(inquiryTable.status, "pending"))
      );

    return {
      dept_manager: {
        totalStaff: totalStaff.count,
        totalProducts: totalProducts.count,
        pendingOrders: pendingOrders.count,
      }
    }
  }

  async getStatisticsByRole(
    tenantId: string,
    role: string,
    deptId: string,
    ctx: ServiceContext
  ) {
    if (role === "super_admin") {
      return await this.getSuperAdminStats(tenantId, ctx);
    }
    if (role === "tenant_admin") {
      return await this.getExporterStats(tenantId, ctx);
    }
    if (role === "dept_manager") {
      return await this.getFactoryStats(tenantId, deptId, ctx);
    }
    return null;
  }

  async getNotifications(
    tenantId: string,
    role: string,
    deptId: string,
    ctx: ServiceContext
  ) {
    const notifications = [];

    if (role === "tenant_admin") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [newFactories] = await ctx.db
        .select({ count: count() })
        .from(departmentTable)
        .where(
          and(
            eq(departmentTable.tenantId, tenantId),
            eq(departmentTable.category, "factory"),
            gte(departmentTable.createdAt, sevenDaysAgo)
          )
        );

      if (newFactories.count > 0) {
        notifications.push({
          text: `本周新增 ${newFactories.count} 个工厂申请`,
          color: "bg-blue-500",
          createdAt: new Date().toISOString(),
        });
      }

      if (notifications.length === 0) {
        notifications.push({
          text: "系统运行状态良好，所有服务正常",
          color: "bg-emerald-500",
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (role === "dept_manager") {
      const [pendingOrders] = await ctx.db
        .select({ count: count() })
        .from(inquiryTable)
        .where(
          and(
            eq(inquiryTable.deptId, deptId),
            eq(inquiryTable.status, "pending")
          )
        );

      if (pendingOrders.count > 0) {
        notifications.push({
          text: `新订单待处理：${pendingOrders.count} 个`,
          color: "bg-blue-500",
          createdAt: new Date().toISOString(),
        });
      }

      if (notifications.length === 0) {
        notifications.push({
          text: "系统运行状态良好，所有服务正常",
          color: "bg-emerald-500",
          createdAt: new Date().toISOString(),
        });
      }
    }

    if (role === "super_admin") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [newExporters] = await ctx.db
        .select({ count: count() })
        .from(departmentTable)
        .where(
          and(
            eq(departmentTable.tenantId, tenantId),
            eq(departmentTable.category, "group"),
            gte(departmentTable.createdAt, sevenDaysAgo)
          )
        );

      if (newExporters.count > 0) {
        notifications.push({
          text: `新增 ${newExporters.count} 个出口商申请，需要审核`,
          color: "bg-amber-500",
          createdAt: new Date().toISOString(),
        });
      }

      if (notifications.length === 0) {
        notifications.push({
          text: "系统运行状态良好，所有服务正常",
          color: "bg-emerald-500",
          createdAt: new Date().toISOString(),
        });
      }
    }

    return notifications.slice(0, 5);
  }
}
