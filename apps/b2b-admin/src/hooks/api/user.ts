/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { UserContract } from "@repo/contract";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";
import { MeRes, UserListRes } from "./user.type";

// --- Query Keys ---
export const userKeys = {
  all: ["user"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, "me"] as const,
};

// --- 0. 获取当前用户信息 (GET /me) ---

// 2. 定义 Options 类型
// Omit 掉 queryKey 和 queryFn，因为这是 hook 内部定死的，不应该被外部修改
type UseMeOptions = Omit<UseQueryOptions<MeRes>, "queryKey" | "queryFn">;

export function useMe(options?: UseMeOptions) {
  return useQuery({
    // 核心配置
    queryKey: userKeys.me(),
    queryFn: () => api.get<MeRes>("/api/v1/user/me"),
    ...options,
  });
}

export function useUserList(
  params?: typeof UserContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () =>
      api.get<UserListRes[], typeof UserContract.ListQuery.static>(
        "/api/v1/user",
        {
          params,
        }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
export function useUserDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/user/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof UserContract.Create.static) =>
      api.post<any, typeof UserContract.Create.static>("/api/v1/user", data),
    onSuccess: () => {
      toast.success("用户创建成功");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建用户失败");
    },
  });
}

// --- 4. 更新 (PUT) ---
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof UserContract.Update.static;
    }) =>
      api.put<any, typeof UserContract.Update.static>(
        `/api/v1/user/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("用户更新成功");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新用户失败");
    },
  });
}

// --- 5. 删除 (DELETE) ---
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/user/${id}`),
    onSuccess: () => {
      toast.success("用户删除成功");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除用户失败");
    },
  });
}
