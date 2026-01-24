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

/**
 * 获取 SKU 列表
 */
export function useSkuList(
  params?: typeof SkuContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: skuKeys.list(params),
    queryFn: () =>
      api.get<any, typeof SkuContract.ListQuery.static>("/api/v1/sku/list", {
        params,
      }),
    enabled,
  });
}

/**
 * 获取单个 SKU 详情（用于编辑回显）
 */
export function useSkuDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: skuKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/sku/${id}`),
    enabled,
  });
}

/**
 * 批量创建 SKU
 */
export function useBatchCreateSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      skus,
    }: {
      productId: string;
      skus: typeof SkuContract.BatchCreate.static;
    }) =>
      api.post<any, typeof SkuContract.BatchCreate.static>(
        `/api/v1/sku/product/${productId}/batch`,
        skus
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
    },
  });
}

/**
 * 更新单个 SKU
 */
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
      queryClient.invalidateQueries({
        queryKey: skuKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 删除单个 SKU
 */
export function useDeleteSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/sku/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
    },
  });
}

/**
 * 批量删除 SKU
 */
export function useBatchDeleteSku() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete<any, typeof SkuContract.BatchDelete.static>(
        "/api/v1/sku/batch",
        { ids }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skuKeys.lists() });
    },
  });
}

/**
 * 获取所有SKU（用于SKU管理页面，返回站点所有SKU及关联商品信息）
 */
export function useAllSkusForManagement(productId: string, enabled = true) {
  return useQuery({
    queryKey: ["sku", "all", "management"],
    queryFn: () =>
      api.get<any, typeof SkuContract.ListQuery.static>("/api/v1/sku/list", {
        params: { page: 1, limit: 1000, productId }, // 获取所有数据，前端自行过滤
      }),
    staleTime: 2 * 60 * 1000, // 2分钟
    enabled,
  });
}
