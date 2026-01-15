import { useAuthStore } from "@/stores/auth-store";
import type { PermissionType } from "@/types/permission";

interface HasProps {
  permission: PermissionType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 权限控制组件
 * @param permission 需要的权限，如 PERMISSIONS.USERS_VIEW
 * @param children 有权限时显示的内容
 * @param fallback 无权限时显示的内容（默认为 null）
 *
 * @example
 * import { PERMISSIONS } from "@/types/permission";
 * <Has permission={PERMISSIONS.USERS_CREATE}>
 *   <Button>创建用户</Button>
 * </Has>
 */
export function Has({ permission, children, fallback = null }: HasProps) {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 角色检查组件
interface HasRoleProps {
  role: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasRole({ role, children, fallback = null }: HasRoleProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <>{fallback}</>;
  }

  const userRole = user.roles[0].name;
  const requiredRoles = Array.isArray(role) ? role : [role];

  if (!(userRole && requiredRoles.includes(userRole))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 站点类型检查组件
interface HasSiteTypeProps {
  siteType: "factory" | "group";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 工厂站专属内容组件
 * 只有当前站点是工厂站时才显示内容
 */
export function HasFactory({
  children,
  fallback = null,
}: Omit<HasSiteTypeProps, "siteType">) {
  const getCurrentSite = useAuthStore((state) => state.getCurrentSite);
  const site = getCurrentSite();

  if (site?.siteType !== "factory") {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * 集团站专属内容组件
 * 只有当前站点是集团站时才显示内容
 */
export function HasGroup({
  children,
  fallback = null,
}: Omit<HasSiteTypeProps, "siteType">) {
  const getCurrentSite = useAuthStore((state) => state.getCurrentSite);
  const site = getCurrentSite();

  if (site?.siteType !== "group") {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
