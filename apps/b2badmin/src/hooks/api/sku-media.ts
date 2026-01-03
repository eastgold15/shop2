/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { SkuMediaContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const skumediaKeys = {
  all: ["skumedia"] as const,
  lists: () => [...skumediaKeys.all, "list"] as const,
  list: (params: any) => [...skumediaKeys.lists(), params] as const,
  details: () => [...skumediaKeys.all, "detail"] as const,
  detail: (id: string) => [...skumediaKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof SkuMediaContract.ListQuery.static
export function useSkuMediaList(
  params?: typeof SkuMediaContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: skumediaKeys.list(params),
    queryFn: () =>
      api.get<any, typeof SkuMediaContract.ListQuery.static>(
        "/api/v1/sku-media",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useSkuMediaDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: skumediaKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/sku-media/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof SkuMediaContract.Create.static
export function useCreateSkuMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SkuMediaContract.Create.static) =>
      api.post<any, typeof SkuMediaContract.Create.static>(
        "/api/v1/sku-media",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skumediaKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof SkuMediaContract.Update.static
export function useUpdateSkuMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof SkuMediaContract.Update.static;
    }) =>
      api.put<any, typeof SkuMediaContract.Update.static>(
        `/api/v1/sku-media/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: skumediaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: skumediaKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteSkuMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/sku-media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skumediaKeys.lists() });
    },
  });
}
