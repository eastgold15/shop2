/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { RolePermissionContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const rolepermissionKeys = {
  all: ["rolepermission"] as const,
  lists: () => [...rolepermissionKeys.all, "list"] as const,
  list: (params?: RolePermissionContract["ListQuery"]) =>
    [...rolepermissionKeys.lists(), params] as const,
  details: () => [...rolepermissionKeys.all, "detail"] as const,
  detail: (id: string) => [...rolepermissionKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useRolePermissionList(
  params?: RolePermissionContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: rolepermissionKeys.list(params),
    queryFn: () =>
      api.get<any, RolePermissionContract["ListQuery"]>(
        "/api/v1/rolepermission",
        { params }
      ),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useRolePermissionDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: rolepermissionKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/rolepermission/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateRolePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RolePermissionContract["Create"]) =>
      api.post<any, RolePermissionContract["Create"]>(
        "/api/v1/rolepermission",
        data
      ),
    onSuccess: () => {
      toast.success("RolePermission创建成功");
      queryClient.invalidateQueries({ queryKey: rolepermissionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建RolePermission失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateRolePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: RolePermissionContract["Update"];
    }) =>
      api.put<any, RolePermissionContract["Update"]>(
        `/api/v1/rolepermission/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("RolePermission更新成功");
      queryClient.invalidateQueries({ queryKey: rolepermissionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: rolepermissionKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新RolePermission失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteRolePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/rolepermission/${id}`),
    onSuccess: () => {
      toast.success("RolePermission删除成功");
      queryClient.invalidateQueries({ queryKey: rolepermissionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除RolePermission失败");
    },
  });
}
