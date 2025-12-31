/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { AccountContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const accountKeys = {
  all: ["account"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (params?: AccountContract["ListQuery"]) =>
    [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useAccountList(
  params?: AccountContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () =>
      api.get<any, AccountContract["ListQuery"]>("/api/v1/account", { params }),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useAccountDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/account/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AccountContract["Create"]) =>
      api.post<any, AccountContract["Create"]>("/api/v1/account", data),
    onSuccess: () => {
      toast.success("Account创建成功");
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建Account失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AccountContract["Update"];
    }) =>
      api.put<any, AccountContract["Update"]>(`/api/v1/account/${id}`, data),
    onSuccess: (_, variables) => {
      toast.success("Account更新成功");
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新Account失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/account/${id}`),
    onSuccess: () => {
      toast.success("Account删除成功");
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除Account失败");
    },
  });
}
