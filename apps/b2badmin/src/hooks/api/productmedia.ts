/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { ProductMediaContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const productmediaKeys = {
  all: ["productmedia"] as const,
  lists: () => [...productmediaKeys.all, "list"] as const,
  list: (params?: ProductMediaContract["ListQuery"]) =>
    [...productmediaKeys.lists(), params] as const,
  details: () => [...productmediaKeys.all, "detail"] as const,
  detail: (id: string) => [...productmediaKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useProductMediaList(
  params?: ProductMediaContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: productmediaKeys.list(params),
    queryFn: () =>
      api.get<any, ProductMediaContract["ListQuery"]>("/api/v1/productmedia", {
        params,
      }),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useProductMediaDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: productmediaKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/productmedia/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateProductMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductMediaContract["Create"]) =>
      api.post<any, ProductMediaContract["Create"]>(
        "/api/v1/productmedia",
        data
      ),
    onSuccess: () => {
      toast.success("ProductMedia创建成功");
      queryClient.invalidateQueries({ queryKey: productmediaKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建ProductMedia失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateProductMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProductMediaContract["Update"];
    }) =>
      api.put<any, ProductMediaContract["Update"]>(
        `/api/v1/productmedia/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("ProductMedia更新成功");
      queryClient.invalidateQueries({ queryKey: productmediaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productmediaKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新ProductMedia失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteProductMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/productmedia/${id}`),
    onSuccess: () => {
      toast.success("ProductMedia删除成功");
      queryClient.invalidateQueries({ queryKey: productmediaKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除ProductMedia失败");
    },
  });
}
