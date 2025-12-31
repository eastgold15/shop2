/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { ProductTemplateContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const producttemplateKeys = {
  all: ["producttemplate"] as const,
  lists: () => [...producttemplateKeys.all, "list"] as const,
  list: (params?: ProductTemplateContract["ListQuery"]) =>
    [...producttemplateKeys.lists(), params] as const,
  details: () => [...producttemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...producttemplateKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useProductTemplateList(
  params?: ProductTemplateContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: producttemplateKeys.list(params),
    queryFn: () =>
      api.get<any, ProductTemplateContract["ListQuery"]>(
        "/api/v1/producttemplate",
        { params }
      ),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useProductTemplateDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: producttemplateKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/producttemplate/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateProductTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductTemplateContract["Create"]) =>
      api.post<any, ProductTemplateContract["Create"]>(
        "/api/v1/producttemplate",
        data
      ),
    onSuccess: () => {
      toast.success("ProductTemplate创建成功");
      queryClient.invalidateQueries({ queryKey: producttemplateKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建ProductTemplate失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateProductTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProductTemplateContract["Update"];
    }) =>
      api.put<any, ProductTemplateContract["Update"]>(
        `/api/v1/producttemplate/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("ProductTemplate更新成功");
      queryClient.invalidateQueries({ queryKey: producttemplateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: producttemplateKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新ProductTemplate失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteProductTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<any>(`/api/v1/producttemplate/${id}`),
    onSuccess: () => {
      toast.success("ProductTemplate删除成功");
      queryClient.invalidateQueries({ queryKey: producttemplateKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除ProductTemplate失败");
    },
  });
}
