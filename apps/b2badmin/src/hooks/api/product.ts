/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { ProductContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const productKeys = {
  all: ["product"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: any) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof ProductContract.ListQuery.static
export function useProductPageList(
  params?: typeof ProductContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () =>
      api.get<any, typeof ProductContract.ListQuery.static>("/api/v1/product/page-list", {
        params,
      }),
    enabled,
  });
}



// --- 2. 单个详情 (GET) ---
// TRes = any
export function useProductDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/product/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof ProductContract.Create.static
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof ProductContract.Create.static) =>
      api.post<any, typeof ProductContract.Create.static>(
        "/api/v1/product",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof ProductContract.Update.static
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof ProductContract.Update.static;
    }) =>
      api.put<any, typeof ProductContract.Update.static>(
        `/api/v1/product/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/product/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// --- 6. 批量删除 (POST /batch/delete) ---
export function useProductsBatchDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.post<any, { ids: string[] }>("/api/v1/product/batch/delete", {
        ids,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
