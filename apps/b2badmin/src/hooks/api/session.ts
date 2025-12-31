/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { SessionContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const sessionKeys = {
  all: ["session"] as const,
  lists: () => [...sessionKeys.all, "list"] as const,
  list: (params?: SessionContract["ListQuery"]) =>
    [...sessionKeys.lists(), params] as const,
  details: () => [...sessionKeys.all, "detail"] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useSessionList(
  params?: SessionContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () =>
      api.get<any, SessionContract["ListQuery"]>("/api/v1/session", { params }),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useSessionDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/session/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SessionContract["Create"]) =>
      api.post<any, SessionContract["Create"]>("/api/v1/session", data),
    onSuccess: () => {
      toast.success("Session创建成功");
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建Session失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: SessionContract["Update"];
    }) =>
      api.put<any, SessionContract["Update"]>(`/api/v1/session/${id}`, data),
    onSuccess: (_, variables) => {
      toast.success("Session更新成功");
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新Session失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/session/${id}`),
    onSuccess: () => {
      toast.success("Session删除成功");
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除Session失败");
    },
  });
}
