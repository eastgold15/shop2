import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DeptInfo, MeRes, UserInfo } from "@/hooks/api/user.type";

interface AuthState {
  // --- 原始状态 ---
  user: UserInfo | null;
  currentDeptId: string | null; // 这是唯一的“主键”，持久化全靠它

  // Cache (这些是接口返回的派生数据，不需要持久化，刷新后重新 fetchMe 获取)
  currentDept: DeptInfo | null;
  switchableDepts: DeptInfo[] | null;

  // Actions
  setAuth: (data: MeRes) => void;
  clearAuth: () => void;
  /** 切换部门：更新部门 ID 并触发刷新 */
  switchDept: (deptId: string) => void;

  // Getters (Computed)
  /** 获取当前用户的权限列表 */
  getPermissions: () => string[];
  /** 检查是否有指定权限 */
  hasPermission: (permission: string) => boolean;
  /** 获取当前租户 ID */
  getTenantId: () => string | null;
  getCurrentSite: () => DeptInfo["site"] | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // --- Initial State ---
      user: null,
      // 🌟 优雅点 1: 初始值直接给 null。
      // persist 中间件会在 store 初始化的一瞬间，自动从 localStorage 读取并覆盖这里。
      // 不需要你自己去 localStorage.getItem()。
      currentDeptId: null,
      currentDept: null,
      switchableDepts: null,

      // --- Actions ---
      setAuth: (data) => {
        set({
          user: data.user,
          currentDept: data.switchableDept.current,
          // 确保 ID 同步
          currentDeptId: data.switchableDept.current.id,
          switchableDepts: data.switchableDept.switchableDepartments,
        });
        // 🌟 优雅点 2: 不需要手动 setItem，persist 中间件监听到 state 变化会自动存。
      },
      clearAuth: () => {
        set({
          user: null,
          currentDept: null,
          currentDeptId: null,
          switchableDepts: null,
        });
      },

      switchDept: (deptId) => {
        // 更新 State，persist 会自动同步到 LocalStorage
        set({ currentDeptId: deptId });

        // 强制刷新 (确保 API Client 下次初始化能读到新的 Storage)
        // 使用 setTimeout 确保 persist 写入动作在 EventLoop 中已完成（虽然 localStorage 是同步的，但这更稳妥）
        setTimeout(() => {
          window.location.reload();
        }, 0);
      },

      // --- Getters ---
      getPermissions: () => get().user?.permissions || [],
      hasPermission: (permission) => {
        const perms = get().getPermissions();
        if (!perms.length) return false;
        return perms.includes("*") || perms.includes(permission);
      },

      getTenantId: () => get().user?.context.tenantId || null,

      // 既然 currentDept 已经在 state 里了，Site 就可以动态获取
      getCurrentSite: () => get().currentDept?.site || null,
    }),
    {
      name: "auth-storage",
      // 只持久化 currentDeptId，不持久化用户信息和权限
      partialize: (state) => ({ currentDeptId: state.currentDeptId }),
    }
  )
);
