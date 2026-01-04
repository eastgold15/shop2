/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { SkuContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";
// --- Query Keys ---
export const skuKeys = {
  all: ["sku"] as const,
  lists: () => [...skuKeys.all, "list"] as const,
  list: (params: any) => [...skuKeys.lists(), params] as const,
  details: () => [...skuKeys.all, "detail"] as const,
  detail: (id: string) => [...skuKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof SkuContract.ListQuery.static
export function useSkuList(
  params?: typeof SkuContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: skuKeys.list(params),
    queryFn: () =>
      api.get<any, typeof SkuContract.ListQuery.static>("/api/v1/sku", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useSkuDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: skuKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/sku/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof SkuContract.Create.static
export function useCreateSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SkuContract.Create.static) =>
      api.post<any, typeof SkuContract.Create.static>("/api/v1/sku", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
    },
  });
}

export function useBatchCreateSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SkuContract.Create.static) =>
      api.post<any, typeof SkuContract.Create.static>("/api/v1/sku", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof SkuContract.Update.static
export function useUpdateSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof SkuContract.Update.static;
    }) =>
      api.put<any, typeof SkuContract.Update.static>(`/api/v1/sku/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
      queryClient.invalidateQueries({ queryKey: skuKeys.detail(variables.id) });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/sku/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
    },
  });
}
export function useBatchDeleteSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete<any, any>("/api/v1/sku/batch", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
    },
  });
}

// 获取所有SKU（用于SKU管理页面，返回站点所有SKU及关联商品信息）
export function useAllSkusForManagement(enabled = true) {
  return useQuery({
    queryKey: ["sku", "all", "management"],
    queryFn: () =>
      api.get<any, any>("/api/v1/sku", {
        params: { page: 1, limit: 1000 }, // 获取所有数据，前端自行过滤
      }),
    staleTime: 2 * 60 * 1000, // 2分钟
    enabled,
  });
}

// 获取商品列表（用于SKU创建时选择）
export function useProductsForSKU(id: string, enabled = true) {
  return useQuery({
    queryKey: ["products", "for-sku", id],
    queryFn: () => api.get<any, any>(`/api/v1/sku/${id}`),
    staleTime: 5 * 60 * 1000, // 5分钟
    enabled,
  });
}
