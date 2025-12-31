/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { AdContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const adKeys = {
  all: ["ad"] as const,
  lists: () => [...adKeys.all, "list"] as const,
  list: (params: any) => [...adKeys.lists(), params] as const,
  details: () => [...adKeys.all, "detail"] as const,
  detail: (id: string) => [...adKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof AdContract.ListQuery.static
export function useAdList(
  params?: typeof AdContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: adKeys.list(params),
    queryFn: () =>
      api.get<any, typeof AdContract.ListQuery.static>("/api/v1/ad", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useAdDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: adKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/ad/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof AdContract.Create.static
export function useCreateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof AdContract.Create.static) =>
      api.post<any, typeof AdContract.Create.static>("/api/v1/ad", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof AdContract.Update.static
export function useUpdateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof AdContract.Update.static;
    }) =>
      api.put<any, typeof AdContract.Update.static>(`/api/v1/ad/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adKeys.detail(variables.id) });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/ad/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
  });
}
