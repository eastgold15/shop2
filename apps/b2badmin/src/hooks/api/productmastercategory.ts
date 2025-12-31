/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { ProductMasterCategoryContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const productmastercategoryKeys = {
  all: ["productmastercategory"] as const,
  lists: () => [...productmastercategoryKeys.all, "list"] as const,
  list: (params?: ProductMasterCategoryContract["ListQuery"]) =>
    [...productmastercategoryKeys.lists(), params] as const,
  details: () => [...productmastercategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...productmastercategoryKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useProductMasterCategoryList(
  params?: ProductMasterCategoryContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: productmastercategoryKeys.list(params),
    queryFn: () =>
      api.get<any, ProductMasterCategoryContract["ListQuery"]>(
        "/api/v1/productmastercategory",
        { params }
      ),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useProductMasterCategoryDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: productmastercategoryKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/productmastercategory/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateProductMasterCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductMasterCategoryContract["Create"]) =>
      api.post<any, ProductMasterCategoryContract["Create"]>(
        "/api/v1/productmastercategory",
        data
      ),
    onSuccess: () => {
      toast.success("ProductMasterCategory创建成功");
      queryClient.invalidateQueries({
        queryKey: productmastercategoryKeys.lists(),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建ProductMasterCategory失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateProductMasterCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProductMasterCategoryContract["Update"];
    }) =>
      api.put<any, ProductMasterCategoryContract["Update"]>(
        `/api/v1/productmastercategory/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("ProductMasterCategory更新成功");
      queryClient.invalidateQueries({
        queryKey: productmastercategoryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: productmastercategoryKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新ProductMasterCategory失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteProductMasterCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<any>(`/api/v1/productmastercategory/${id}`),
    onSuccess: () => {
      toast.success("ProductMasterCategory删除成功");
      queryClient.invalidateQueries({
        queryKey: productmastercategoryKeys.lists(),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除ProductMasterCategory失败");
    },
  });
}
