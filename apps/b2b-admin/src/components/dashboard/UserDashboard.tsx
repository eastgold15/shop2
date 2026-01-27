"use client";

import {
  AlertCircle,
  Building2,
  Globe,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Can } from "@/components/auth/Can";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications, useStatistics } from "@/hooks/api/statistics";
import { useAuthStore } from "@/stores/auth-store";

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div>
        <p className="mb-1 font-medium text-slate-500 text-sm">{label}</p>
        <h3 className="font-bold text-2xl text-slate-900">{value}</h3>
      </div>
      <div className={`rounded-lg p-3 ${color} text-white shadow-inner`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { data: statistics, isLoading } = useStatistics();
  const { data: notifications } = useNotifications();

  if (!user) {
    return <DashboardSkeleton />;
  }

  const roleName = user.roles?.[0]?.name;
  // @ts-expect-error
  const roleStats = statistics?.[roleName];
  console.log("roleStats:", roleStats);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-extrabold text-3xl text-slate-900 tracking-tight">
          欢迎回来，{user.name} 👋
        </h1>
        <p className="text-slate-500">
          {user.roles?.[0]?.name || "普通用户"} | {user.email}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton className="h-32 rounded-xl" key={i} />
          ))
        ) : roleStats ? (
          [
            roleName === "super_admin" && [
              {
                label: "管理站点",
                value: roleStats.totalSites?.toString() || "0",
                icon: ShieldCheck,
                color: "bg-purple-500",
              },
              {
                label: "出口商数量",
                value: roleStats.totalExporters?.toString() || "0",
                icon: Building2,
                color: "bg-indigo-500",
              },
              {
                label: "系统用户",
                value: roleStats.totalUsers?.toString() || "0",
                icon: Users,
                color: "bg-emerald-500",
              },
              {
                label: "活跃站点",
                value: roleStats.activeSites?.toString() || "0",
                icon: Globe,
                color: "bg-amber-500",
              },
            ],
            roleName === "tenant_admin" && [
              {
                label: "管理工厂",
                value: roleStats.totalFactories?.toString() || "0",
                icon: Building2,
                color: "bg-indigo-500",
              },
              {
                label: "团队成员",
                value: roleStats.totalTeamMembers?.toString() || "0",
                icon: Users,
                color: "bg-emerald-500",
              },
              {
                label: "总产品数",
                value: roleStats.totalProducts?.toString() || "0",
                icon: Package,
                color: "bg-blue-500",
              },
              {
                label: "本月订单",
                value: roleStats.thisMonthOrders?.toString() || "0",
                icon: TrendingUp,
                color: "bg-amber-500",
              },
            ],
            roleName === "dept_manager" && [
              {
                label: "部门业务员",
                value: roleStats.totalStaff?.toString() || "0",
                icon: Users,
                color: "bg-emerald-500",
              },
              {
                label: "工厂产品",
                value: roleStats.totalProducts?.toString() || "0",
                icon: Package,
                color: "bg-indigo-500",
              },
              {
                label: "待审核",
                value: roleStats.pendingOrders?.toString() || "0",
                icon: AlertCircle,
                color: "bg-amber-500",
              },
            ],
          ]
            .flat()
            .filter(Boolean)
            .map((stat, index) => <StatCard key={index} {...stat} />)
        ) : (
          <p className="col-span-full text-center text-slate-400">
            暂无统计数据
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-bold text-slate-900 text-xl">通知中心</h2>
            <div className="space-y-5">
              {notifications && notifications.length > 0 ? (
                notifications.map((note, i) => (
                  <div className="group flex items-center gap-4" key={i}>
                    <div
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${note.color} ring-4 ring-slate-50`}
                    />
                    <div className="flex flex-col">
                      <p className="text-slate-600 transition-colors group-hover:text-slate-900">
                        {note.text}
                      </p>
                      <span className="text-slate-400 text-xs">
                        {new Date(note.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">暂无新通知</p>
              )}
            </div>
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-bold text-slate-900 text-xl">快速操作</h2>
            <div className="flex flex-col gap-3">
              <Can permission="SITES_MANAGE">
                <Link
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-lg active:scale-95"
                  href="/dashboard/site-config"
                >
                  <Settings size={18} />
                  系统设置
                </Link>
              </Can>

              <Can permission="PRODUCT_VIEW">
                <Link
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                  href="/dashboard/product"
                >
                  <Package size={18} />
                  产品管理
                </Link>
              </Can>

              <Can permission="FACTORY_VIEW">
                <Link
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95"
                  href="/dashboard/dept"
                >
                  <Building2 size={18} />
                  工厂管理
                </Link>
              </Can>

              <Can permission="QUOTATION_VIEW">
                <Link
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                  href="/dashboard"
                >
                  <ShoppingCart size={18} />
                  订单管理
                </Link>
              </Can>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton className="h-32 rounded-xl" key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}
