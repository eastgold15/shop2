"use client";

import { Building2, CheckCircle, Loader2, Phone, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { HasRole } from "@/components/auth";
import { CreateDepartmentWithSiteModal } from "@/components/form/CreateDepartmentWithSiteModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDepartmentList } from "@/hooks/api/department";
import { useAuthStore } from "@/stores/auth-store";

export default function UsersPage() {
  const [isCreateDeptModalOpen, setIsCreateDeptModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 避免hydration错误
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 获取部门列表
  const {
    data: departmentsResponse,
    isLoading: departmentsLoading,
    refetch: refetchDepartments,
  } = useDepartmentList();
  const currentDeptId = useAuthStore(
    (state) => state.user?.context.department.id
  );
  const departments =
    departmentsResponse?.filter((item) => item.id !== currentDeptId) || [];

  // 如果还没挂载，返回一个加载状态的占位符
  if (!isMounted) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
              <p className="text-slate-500 text-sm">加载中...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <nav className="font-medium text-sm">组织架构管理</nav>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-2xl text-slate-900">部门管理</h1>
                <p className="mt-1 text-slate-500">
                  管理您的组织架构，创建部门和站点
                </p>
              </div>
              <HasRole
                role={["super_admin", "exporter_admin", "factory_admin"]}
              >
                <Button onClick={() => setIsCreateDeptModalOpen(true)}>
                  <Plus className="mr-2" size={18} />
                  创建部门
                </Button>
              </HasRole>
            </div>

            {departmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-600" />
                  <p className="text-slate-500 text-sm">加载中...</p>
                </div>
              </div>
            ) : departments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="mb-4 h-12 w-12 text-slate-300" />
                <h3 className="mb-2 font-semibold text-slate-900">暂无部门</h3>
                <p className="mb-4 text-center text-slate-500">
                  您还没有创建任何部门。点击下方按钮开始创建您的第一个部门。
                </p>
                <HasRole
                  role={["super_admin", "exporter_admin", "factory_admin"]}
                >
                  <Button onClick={() => setIsCreateDeptModalOpen(true)}>
                    <Plus className="mr-2" size={18} />
                    创建第一个部门
                  </Button>
                </HasRole>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {departments.map(
                  (department: {
                    id: string;
                    name: string;
                    code: string;
                    category: string;
                    address?: string;
                    contactPhone?: string;
                  }) => (
                    <div
                      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                      key={department.id}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-green-100 p-2">
                            <Building2 className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">
                              {department.name || "未命名"}
                            </h3>
                            <p className="font-medium text-slate-500 text-sm">
                              {department.code}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div className="rounded-full bg-green-100 px-2 py-1">
                            <span className="font-medium text-green-700 text-xs">
                              {department.category === "group"
                                ? "集团"
                                : "工厂"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 space-y-2 text-slate-600 text-sm">
                        {department.address && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="truncate">
                              {department.address}
                            </span>
                          </div>
                        )}
                        {department.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{department.contactPhone}</span>
                          </div>
                        )}
                      </div>

                      <div className="border-slate-100 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <Building2 className="h-3 w-3" />
                            <span>部门</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="font-medium text-indigo-600 text-sm hover:text-indigo-700">
                              编辑
                            </button>
                            <button className="font-medium text-red-600 text-sm hover:text-red-700">
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* 创建部门弹窗 */}
      <CreateDepartmentWithSiteModal
        onOpenChange={setIsCreateDeptModalOpen}
        onSuccess={() => {
          refetchDepartments();
        }}
        open={isCreateDeptModalOpen}
      />
    </SidebarProvider>
  );
}
