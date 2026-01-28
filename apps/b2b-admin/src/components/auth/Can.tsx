// components/auth/can.tsx
import { useAuthStore } from "@/stores/auth-store";
import type { PermissionType } from "@/types/permission";

interface CanProps {
  permission?: PermissionType;
  anyPermission?: PermissionType[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can = ({
  permission,
  anyPermission,
  children,
  fallback = null,
}: CanProps) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  let allowed = false;

  if (permission) {
    allowed = hasPermission(permission);
  }

  return allowed ? children : fallback;
};

interface SiteBoundaryProps {
  // 排除掉的类型。比如 exclude={['GROUP']} 表示集团站看不到
  exclude?: ("group" | "factory")[];
  // 仅限某些类型看到
  only?: ("group" | "factory")[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// 站点边界组件，根据当前站点类型判断是否渲染子组件
export const SiteBoundary = ({
  exclude,
  only,
  children,
  fallback = null,
}: SiteBoundaryProps) => {
  // 假设你的 authStore 里存了当前站点的 site 信息
  const siteType = useAuthStore((state) => state.getCurrentSite()?.siteType);

  if (!siteType) return fallback;

  let isAllowed = true;

  // 如果定义了 only，当前类型必须在 only 列表中
  if (only) {
    isAllowed = only.includes(siteType);
  }

  // 如果定义了 exclude，当前类型不能在 exclude 列表中
  if (exclude) {
    isAllowed = isAllowed && !exclude.includes(siteType);
  }

  return isAllowed ? children : fallback;
};
