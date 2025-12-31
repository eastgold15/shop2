/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { ProductSiteCategoryContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const productsitecategoryKeys = {
  all: ["productsitecategory"] as const,
  lists: () => [...productsitecategoryKeys.all, "list"] as const,
  list: (params?: ProductSiteCategoryContract["ListQuery"]) =>
    [...productsitecategoryKeys.lists(), params] as const,
  details: () => [...productsitecategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...productsitecategoryKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useProductSiteCategoryList(
  params?: ProductSiteCategoryContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: productsitecategoryKeys.list(params),
    queryFn: () =>
      api.get<any, ProductSiteCategoryContract["ListQuery"]>(
        "/api/v1/productsitecategory",
        { params }
      ),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useProductSiteCategoryDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: productsitecategoryKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/productsitecategory/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateProductSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductSiteCategoryContract["Create"]) =>
      api.post<any, ProductSiteCategoryContract["Create"]>(
        "/api/v1/productsitecategory",
        data
      ),
    onSuccess: () => {
      toast.success("ProductSiteCategory创建成功");
      queryClient.invalidateQueries({
        queryKey: productsitecategoryKeys.lists(),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建ProductSiteCategory失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateProductSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProductSiteCategoryContract["Update"];
    }) =>
      api.put<any, ProductSiteCategoryContract["Update"]>(
        `/api/v1/productsitecategory/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("ProductSiteCategory更新成功");
      queryClient.invalidateQueries({
        queryKey: productsitecategoryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: productsitecategoryKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新ProductSiteCategory失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteProductSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<any>(`/api/v1/productsitecategory/${id}`),
    onSuccess: () => {
      toast.success("ProductSiteCategory删除成功");
      queryClient.invalidateQueries({
        queryKey: productsitecategoryKeys.lists(),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除ProductSiteCategory失败");
    },
  });
}
