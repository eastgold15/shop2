/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { UserContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const userKeys = {
  all: ["user"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof UserContract.ListQuery.static
export function useUserList(
  params?: typeof UserContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () =>
      api.get<any, typeof UserContract.ListQuery.static>("/api/v1/user", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useUserDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/user/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof UserContract.Create.static
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof UserContract.Create.static) =>
      api.post<any, typeof UserContract.Create.static>("/api/v1/user", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof UserContract.Update.static
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
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/user/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
