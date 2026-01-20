"use client";

import {
  Building2,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  Plus,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { HasRole } from "@/components/auth";
import { HasFactory, HasGroup } from "@/components/auth/Has";
import { CreateUserModal } from "@/components/form/CreateUserModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDeleteUser, useUserList } from "@/hooks/api/user";
import { useAuthStore } from "@/stores/auth-store";

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | undefined>();
  const [editingUserData, setEditingUserData] = useState<any>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  const currentUserId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: response,
    isLoading,
    refetch,
  } = useUserList({
    search: "",
  });
  const users = response?.filter((item) => item.id !== currentUserId) || [];

  const deleteUser = useDeleteUser();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除用户 "${name}" 吗？此操作不可恢复。`)) {
      return;
    }
    await deleteUser.mutateAsync(id);
  };

  const handleEdit = (user: any) => {
    setEditingUserId(user.id);
    setEditingUserData(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUserId(undefined);
    setEditingUserData(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingUserId(undefined);
    setEditingUserData(undefined);
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    setEditingUserId(undefined);
    setEditingUserData(undefined);
    setIsModalOpen(false);
    refetch();
  };

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

            <HasGroup>
              <nav className="font-medium text-sm">出口商业务员</nav>
            </HasGroup>
            <HasFactory>
              <nav className="font-medium text-sm">用户管理</nav>
            </HasFactory>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <HasGroup>
                  <h1 className="font-bold text-2xl text-slate-900">
                    出口商业务员管理
                  </h1>
                </HasGroup>
                <HasFactory>
                  <h1 className="font-bold text-2xl text-slate-900">
                    业务员管理
                  </h1>
                </HasFactory>
                <p className="mt-1 text-slate-500">
                  管理您团队中的所有用户，分配角色和权限
                </p>
              </div>
              <HasRole
                role={["super_admin", "exporter_admin", "factory_admin"]}
              >
                <Button onClick={handleCreate}>
                  <Plus className="mr-2" size={18} />
                  创建用户
                </Button>
              </HasRole>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-600" />
                  <p className="text-slate-500 text-sm">加载中...</p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <User className="mb-4 h-12 w-12 text-slate-300" />
                <h3 className="mb-2 font-semibold text-slate-900">暂无用户</h3>
                <p className="mb-4 text-center text-slate-500">
                  您还没有创建任何用户。点击下方按钮开始创建您的第一个用户。
                </p>
                <HasRole
                  role={["super_admin", "exporter_admin", "factory_admin"]}
                >
                  <Button onClick={handleCreate}>
                    <Plus className="mr-2" size={18} />
                    创建第一个用户
                  </Button>
                </HasRole>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user: any) => (
                  <div
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    key={user.id}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-indigo-100 p-2">
                          <User className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {user.name || "未命名"}
                          </h3>
                          {user.position && (
                            <p className="font-medium text-slate-500 text-sm">
                              {user.position}
                            </p>
                          )}
                          <HasGroup>
                            <p className="text-slate-400 text-xs">
                              出口商管理员
                            </p>
                          </HasGroup>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {user.roles && user.roles.length > 0 && (
                          <div className="rounded-full bg-blue-100 px-2 py-1">
                            <span className="font-medium text-blue-700 text-xs">
                              {user.roles[0].name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 space-y-2 text-slate-600 text-sm">
                      {user.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.department && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span>{user.department.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-slate-100 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          <User className="h-3 w-3" />
                          <span>用户</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="font-medium text-indigo-600 text-sm hover:text-indigo-700"
                            onClick={() => handleEdit(user)}
                          >
                            编辑
                          </button>
                          <button
                            className="font-medium text-red-600 text-sm hover:text-red-700"
                            onClick={() =>
                              handleDelete(user.id, user.name || "未命名")
                            }
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      <CreateUserModal
        initialData={editingUserData}
        onOpenChange={handleModalClose}
        onSuccess={handleModalSuccess}
        open={isModalOpen}
        userId={editingUserId}
      />
    </SidebarProvider>
  );
}
