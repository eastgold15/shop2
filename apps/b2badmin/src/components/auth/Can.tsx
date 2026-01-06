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
