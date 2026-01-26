"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { useMe } from "@/hooks/api/user";
import { useAuthStore } from "@/stores/auth-store";

// 定义不需要鉴权的白名单路径
const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password"];

// 用户Provider组件
export function UserProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPage = PUBLIC_PATHS.includes(pathname);

  // 用于跟踪上一个用户 ID，检测账号切换
  const previousUserIdRef = useRef<string | null>(null);

  // 1. 发起请求（仅在非公共页面时才查询用户信息）
  const { data, error, isLoading } = useMe({
    retry: false,
    enabled: !isPublicPage,
  });

  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // 2. 结构化副作用处理：监听 data 和 error
  useEffect(() => {
    if (data) {
      const currentUserId = data.user?.id;

      // 🔥 关键修复：检测账号切换
      // 如果当前用户 ID 与上一次不同，说明用户切换了账号
      if (
        previousUserIdRef.current &&
        previousUserIdRef.current !== currentUserId
      ) {
        // 账号已切换，强制刷新页面以清除所有缓存
        window.location.reload();
        return;
      }

      // 更新 ref
      previousUserIdRef.current = currentUserId;

      // 成功：一次性同步所有 Store
      setAuth(data);
    } else if (error) {
      // 失败：清理并重定向
      clearAuth();
      previousUserIdRef.current = null;
      if (!isPublicPage) {
        router.push("/login");
      }
    }
  }, [data, error, isPublicPage, setAuth, clearAuth, router]);

  // 3. 渲染控制
  if (isPublicPage) return <>{children}</>;
  if (isLoading)
    return (
      <div className="h-screen w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  if (!data) return null;

  return <>{children}</>;
}
