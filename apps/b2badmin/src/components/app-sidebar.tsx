"use client";

import {
  FileBox,
  Frame,
  Image as ImageIcon,
  Layers,
  type LucideIcon,
  PieChart,
  Settings,
  Shield,
  ShoppingBag,
  SquareTerminal,
  Tags,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavGroup } from "@/components/nav-group";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PERMISSIONS } from "@/config/permissions";
import { useAuthStore } from "@/stores/auth-store";

// --- 1. 菜单配置文件 (数据驱动) ---
// 以后加菜单只需要改这里，一眼就能看懂
interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  permission?: string; // 权限常量字符串
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SIDEBAR_CONFIG: NavSection[] = [
  {
    title: "概览",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: true,
      },
    ],
  },
  {
    title: "业务管理",
    items: [
      {
        title: "站点分类",
        url: "/dashboard/site-category",
        icon: Tags,
        permission: PERMISSIONS.SITE_CATEGORY_VIEW,
      },

      {
        title: "商品模版管理",
        url: "/dashboard/template",
        icon: FileBox,
        permission: PERMISSIONS.TEMPLATE_VIEW,
      },

      {
        title: "媒体管理",
        url: "/dashboard/media",
        icon: ImageIcon,
        permission: PERMISSIONS.MEDIA_VIEW,
      },
      {
        title: "商品管理",
        url: "/dashboard/product",
        icon: ShoppingBag,
        permission: PERMISSIONS.PRODUCT_VIEW,
      },
    ],
  },
  {
    title: "站点管理",
    items: [
      {
        title: "广告管理",
        url: "/dashboard/ad",
        icon: PieChart,
        permission: PERMISSIONS.AD_VIEW,
      },
      {
        title: "爆款商品卡片",
        url: "/dashboard/hero-card",
        icon: Frame,
        permission: PERMISSIONS.HERO_CARD_VIEW,
      },
      {
        title: "站点配置",
        url: "/dashboard/site-config",
        icon: Settings,
        permission: PERMISSIONS.SITE_CONFIG_VIEW,
      },
    ],
  },
  {
    title: "组织管理",
    items: [
      {
        title: "部门管理",
        url: "/dashboard/dept",
        icon: Users,
        permission: PERMISSIONS.DEPARTMENT_VIEW,
      },
      {
        title: "用户管理",
        url: "/dashboard/user",
        icon: Users,
        permission: PERMISSIONS.USER_VIEW,
      },
      {
        title: "全局分类",
        url: "/dashboard/master-category",
        icon: Layers,
        permission: PERMISSIONS.MASTER_CATEGORY_VIEW,
      },
    ],
  },
  {
    title: "权限管理",
    items: [
      {
        title: "角色管理",
        url: "/dashboard/role",
        icon: Shield,
        permission: PERMISSIONS.ROLE_VIEW,
      },
    ],
  },
];

// --- 2. 主组件 ---
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 正确的方式：分别订阅每个值
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const user = useAuthStore((state) => state.user);

  // 核心逻辑：根据权限过滤菜单
  // 使用 useMemo 只有在权限改变时才重新计算，性能拉满
  const filteredNav = React.useMemo(() => {
    // 🛡️ 保护伞：如果用户数据还没回来，直接返回空或基础菜单
    if (!user) {
      return [];
    }

    const isSuperAdmin = user.isSuperAdmin;

    return SIDEBAR_CONFIG.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (isSuperAdmin) return true; // 超管无视一切
        if (!item.permission) return true;

        return hasPermission(item.permission);
      }),
    })).filter((section) => section.items.length > 0);

    // 确保 user 在依赖项里
  }, [user, hasPermission]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {filteredNav.map((section) => (
          <NavGroup
            items={section.items}
            key={section.title}
            title={section.title}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
