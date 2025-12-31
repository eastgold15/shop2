/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { MediaContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  list: (params: any) => [...mediaKeys.lists(), params] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (id: string) => [...mediaKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof MediaContract.ListQuery.static
export function useMediaList(
  params?: typeof MediaContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: () =>
      api.get<any, typeof MediaContract.ListQuery.static>("/api/v1/media", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useMediaDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: mediaKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/media/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof MediaContract.Create.static
export function useCreateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof MediaContract.Create.static) =>
      api.post<any, typeof MediaContract.Create.static>("/api/v1/media", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof MediaContract.Update.static
export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof MediaContract.Update.static;
    }) =>
      api.put<any, typeof MediaContract.Update.static>(
        `/api/v1/media/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: mediaKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}
