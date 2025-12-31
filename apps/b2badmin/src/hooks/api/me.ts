/**
 * 获取当前用户信息和可切换部门列表
 * 这个 hook 会在 UserProvider 中自动调用
 */
import { useQuery } from "@tanstack/react-query";
import { api } from "./api-client";

export interface UserInfo {
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

export interface SwitchableDepartment {
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

export interface MeResponse {
  user: UserInfo;
  switchableDept: SwitchableDepartment;
}

/**
 * 获取当前用户信息
 * @param enabled 是否启用查询，默认为 true
 */
export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<MeResponse> =>
      await api.get<MeResponse>("/api/v1/user/me"),
    staleTime: 1000 * 60 * 5, // 5 分钟
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

export type UserMeRes = MeResponse;
