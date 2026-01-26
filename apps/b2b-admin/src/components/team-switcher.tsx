"use client";

import { Building2, Check, ChevronDown, Factory, Loader2 } from "lucide-react";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

// 2. 统一图标获取逻辑
const SiteIcon = ({
  type,
  className,
}: {
  type?: string;
  className?: string;
}) => {
  const Icon = type === "factory" ? Factory : Building2;
  return <Icon className={cn("size-4", className)} />;
};

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { user, currentDept, switchableDepts, getCurrentSite, switchDept } =
    useAuthStore();

  // 1. 过滤出除当前部门外的其他可切换部门
  const otherDepts = useMemo(
    () => switchableDepts?.filter((d) => d.id !== currentDept?.id) || [],
    [switchableDepts, currentDept?.id]
  );

  // 2. 权限检查：只有超级管理员或出口商（总部级别）才能看到可切换部门
  const canSwitchDepts = useMemo(() => {
    const isSuperAdmin = user?.isSuperAdmin || user?.permissions?.includes("*");
    // category === "group" 表示总部级别（直接隶属于出口商/租户）
    const isExporterLevel = currentDept?.category === "group";
    return isSuperAdmin || isExporterLevel;
  }, [user, currentDept]);

  // 3. 加载中状态
  if (!(getCurrentSite() && user)) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton disabled size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
              <Loader2 className="size-4 animate-spin" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">加载中...</span>
              <span className="truncate text-xs">正在初始化站点...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // 获取用户的第一个角色作为显示角色
  const userRole = user?.roles?.[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <SiteIcon type={getCurrentSite()?.siteType} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {getCurrentSite()?.name}
                </span>
                <span className="truncate text-xs">
                  {userRole?.dataScope || userRole?.name || "用户"} ·{" "}
                  {getCurrentSite()?.domain}
                </span>
              </div>
              <ChevronDown className="ml-auto opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-80 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              当前所在部门/站点
            </DropdownMenuLabel>

            {/* 当前部门/站点 */}
            <DropdownMenuItem className="gap-3 p-3 focus:bg-transparent">
              <div className="flex size-8 items-center justify-center rounded-md border bg-primary text-primary-foreground">
                <SiteIcon
                  className="size-4"
                  type={getCurrentSite()?.siteType}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {getCurrentSite()?.name}
                  </span>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-bold text-[10px] text-primary">
                    ACTIVE
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {currentDept?.name} · {getCurrentSite()?.domain}
                </p>
              </div>
              <Check className="size-4 text-primary" />
            </DropdownMenuItem>

            {canSwitchDepts && otherDepts.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  可切换部门 ({otherDepts.length})
                </DropdownMenuLabel>
                {otherDepts.map((dept) => {
                  if (!dept.site) return null;
                  const siteType =
                    dept.category === "headquarters"
                      ? "group"
                      : dept.category === "factory"
                        ? "factory"
                        : "factory";

                  return (
                    <DropdownMenuItem
                      className="cursor-pointer gap-3 p-3 grayscale-[0.5] transition-all hover:grayscale-0"
                      key={dept.id}
                      onClick={() => switchDept(dept.id)}
                    >
                      <div className="flex size-8 items-center justify-center rounded-md border bg-background">
                        <SiteIcon className="size-4" type={siteType} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">
                            {dept.name}
                          </span>
                          {dept.category === "factory" ? (
                            <span className="rounded bg-blue-100 px-1 py-0.5 text-[10px] text-blue-700">
                              工厂
                            </span>
                          ) : (
                            <span className="rounded bg-green-100 px-1 py-0.5 text-[10px] text-green-700">
                              总部
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground/60 text-xs">
                          {dept.site.name} · {dept.site.domain}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </>
            )}

            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="rounded-md bg-muted/50 p-2 text-[11px] text-muted-foreground">
                <p className="mb-1 font-medium">💡 提示：</p>
                <ul className="list-inside list-disc space-y-0.5 opacity-80">
                  <li>切换部门后会自动刷新页面</li>
                  <li>切换后权限和数据将同步更新</li>
                </ul>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
