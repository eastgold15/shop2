/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { DepartmentContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const departmentKeys = {
  all: ["department"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (params?: DepartmentContract["ListQuery"]) =>
    [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useDepartmentList(
  params?: DepartmentContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: () =>
      api.get<any, DepartmentContract["ListQuery"]>("/api/v1/department", {
        params,
      }),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useDepartmentDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/department/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentContract["Create"]) =>
      api.post<any, DepartmentContract["Create"]>("/api/v1/department", data),
    onSuccess: () => {
      toast.success("Department创建成功");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建Department失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: DepartmentContract["Update"];
    }) =>
      api.put<any, DepartmentContract["Update"]>(
        `/api/v1/department/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("Department更新成功");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: departmentKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新Department失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/department/${id}`),
    onSuccess: () => {
      toast.success("Department删除成功");
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除Department失败");
    },
  });
}
