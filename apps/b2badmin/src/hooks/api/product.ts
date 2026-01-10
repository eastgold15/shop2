import { ProductContract, SiteProductContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";
import { ProductPageListRes } from "./product.type";

// --- Query Keys ---
export const productKeys = {
  all: ["product"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: any) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  skus: (id: string) => [...productKeys.all, "sku", id] as const,
};

/**
 * 获取商品分页列表（包含媒体和SKU）
 */
export function useProductPageList(
  params?: typeof SiteProductContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () =>
      api.get<ProductPageListRes, typeof SiteProductContract.ListQuery.static>(
        "/api/v1/product/page-list",
        {
          params,
        }
      ),
    enabled,
  });
}

/**
 * 获取商品的 SKU 列表
 */
export function useProductSkus(productId: string, enabled = !!productId) {
  return useQuery({
    queryKey: productKeys.skus(productId),
    queryFn: () => api.get<any>(`/api/v1/product/${productId}/sku`),
    enabled,
  });
}

/**
 * 创建商品（支持站点隔离和模板绑定）- 只能是工厂创建
 */
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

/**
 * 更新商品（全量关联更新）
 * 支持两种模式：全局商品（工厂）和站点商品（集团）
 */
export function useUpdateProduct() {
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
        `/api/v1/product/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.skus(variables.id),
      });
    },
  });
}

/**
 * 批量删除商品
 */
export function useBatchDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete<any, { ids: string[] }>("/api/v1/product/batch/delete", {
        ids,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/**
 * 删除单个商品
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/product/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
