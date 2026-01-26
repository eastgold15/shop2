/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { SiteProductContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const siteproductKeys = {
  all: ["siteproduct"] as const,
  lists: () => [...siteproductKeys.all, "list"] as const,
  list: (params: any) => [...siteproductKeys.lists(), params] as const,
  details: () => [...siteproductKeys.all, "detail"] as const,
  detail: (id: string) => [...siteproductKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof SiteProductContract.ListQuery.static
export function useSiteProductList(
  params?: typeof SiteProductContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: siteproductKeys.list(params),
    queryFn: () =>
      api.get<any, typeof SiteProductContract.ListQuery.static>(
        "/api/v1/site-product",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useSiteProductDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: siteproductKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/site-product/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof SiteProductContract.Create.static
export function useCreateSiteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SiteProductContract.Create.static) =>
      api.post<any, typeof SiteProductContract.Create.static>(
        "/api/v1/site-product",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteproductKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof SiteProductContract.Update.static
export function useUpdateSiteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof SiteProductContract.Update.static;
    }) =>
      api.put<any, typeof SiteProductContract.Update.static>(
        `/api/v1/site-product/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: siteproductKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: siteproductKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteSiteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/site-product/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteproductKeys.lists() });
    },
  });
}

// --- 6. 批量更新排序 (PUT) ---
// TRes = any, TBody = typeof SiteProductContract.BatchUpdateSortOrder.static
export function useBatchUpdateSortOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SiteProductContract.BatchUpdateSortOrder.static) =>
      api.put<any, typeof SiteProductContract.BatchUpdateSortOrder.static>(
        "/api/v1/site-product/batch/sort-order",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteproductKeys.lists() });
    },
  });
}
