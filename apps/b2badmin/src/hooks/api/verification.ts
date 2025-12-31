/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { VerificationContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const verificationKeys = {
  all: ["verification"] as const,
  lists: () => [...verificationKeys.all, "list"] as const,
  list: (params?: VerificationContract["ListQuery"]) =>
    [...verificationKeys.lists(), params] as const,
  details: () => [...verificationKeys.all, "detail"] as const,
  detail: (id: string) => [...verificationKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useVerificationList(
  params?: VerificationContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: verificationKeys.list(params),
    queryFn: () =>
      api.get<any, VerificationContract["ListQuery"]>("/api/v1/verification", {
        params,
      }),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useVerificationDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: verificationKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/verification/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerificationContract["Create"]) =>
      api.post<any, VerificationContract["Create"]>(
        "/api/v1/verification",
        data
      ),
    onSuccess: () => {
      toast.success("Verification创建成功");
      queryClient.invalidateQueries({ queryKey: verificationKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建Verification失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: VerificationContract["Update"];
    }) =>
      api.put<any, VerificationContract["Update"]>(
        `/api/v1/verification/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("Verification更新成功");
      queryClient.invalidateQueries({ queryKey: verificationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: verificationKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新Verification失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/verification/${id}`),
    onSuccess: () => {
      toast.success("Verification删除成功");
      queryClient.invalidateQueries({ queryKey: verificationKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除Verification失败");
    },
  });
}
