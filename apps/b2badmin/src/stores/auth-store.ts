import { create } from "zustand";
import { persist } from "zustand/middleware";

// 新的用户信息类型（基于后端返回）
interface UserInfo {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  department?: {
    id: string;
    name: string;
    category: "headquarters" | "factory" | "office";
    site?: {
      id: string;
      name: string;
      domain: string;
    };
  };
  roles?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

// 可切换部门类型
interface SwitchableDepartment {
  current: {
    id: string;
    name: string;
    category: string;
    site?: {
      id: string;
      name: string;
      domain: string;
    };
  };
  departments: Array<{
    id: string;
    name: string;
    category: string;
    parentId: string;
    site?: {
      id: string;
      name: string;
      domain: string;
    };
  }>;
}

// /me 端点返回类型
interface MeResponse {
  user: UserInfo;
  switchableDept: SwitchableDepartment;
}

interface AuthState {
  // --- 原始状态 ---
  user: UserInfo | null;
  currentDept: SwitchableDepartment["current"] | null; // 当前部门
  currentDeptId: string | null; // 落地 localStorage 的部门 ID
  switchableDept: SwitchableDepartment | null; // 可切换的部门列表

  // --- 操作方法 ---
  setAuth: (data: MeResponse) => void;
  clearAuth: () => void;

  /** 切换部门：更新部门 ID 并触发刷新 */
  switchDept: (deptId: string) => void;

  /** 获取当前站点的信息（兼容旧的组件） */
  getCurrentSite: () => {
    id: string;
    name: string;
    domain: string;
    siteType?: string;
  } | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      currentDept: null,
      currentDeptId: null,
      switchableDept: null,

      setAuth: (data) => {
        set({
          user: data.user,
          currentDept: data.switchableDept.current,
          currentDeptId: data.switchableDept.current.id,
          switchableDept: data.switchableDept,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          currentDept: null,
          currentDeptId: null,
          switchableDept: null,
        });
      },

      switchDept: (deptId) => {
        set({ currentDeptId: deptId });
        // 部门 ID 变化后，需要重新从后端获取该部门的权限和站点信息
        // 最简单的办法是刷新页面，让根组件的 useMe 重新带着新 DeptId 发起请求
        window.location.reload();
      },

      // 兼容旧组件，获取当前站点信息
      getCurrentSite: () => {
        const { currentDept } = get();
        if (!currentDept?.site) return null;

        // 将 category 映射到 siteType
        const siteTypeMap: Record<string, string> = {
          headquarters: "group",
          factory: "factory",
          office: "factory",
        };

        return {
          id: currentDept.site.id,
          name: currentDept.site.name,
          domain: currentDept.site.domain,
          siteType: siteTypeMap[currentDept.category || ""] || "factory",
        };
      },
    }),
    {
      name: "auth-storage",
      // 只持久化 currentDeptId，不持久化用户信息和权限
      partialize: (state) => ({ currentDeptId: state.currentDeptId }),
    }
  )
);
