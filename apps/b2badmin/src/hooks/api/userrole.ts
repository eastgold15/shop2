/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { UserRoleContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

// --- Query Keys ---
export const userroleKeys = {
  all: ["userrole"] as const,
  lists: () => [...userroleKeys.all, "list"] as const,
  list: (params: any) => [...userroleKeys.lists(), params] as const,
  details: () => [...userroleKeys.all, "detail"] as const,
  detail: (id: string) => [...userroleKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
export function useUserRoleList(
  params?: typeof UserRoleContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: userroleKeys.list(params),
    queryFn: () =>
      api.get<any, typeof UserRoleContract.ListQuery.static>(
        "/api/v1/userrole",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
export function useUserRoleDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: userroleKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/userrole/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
export function useCreateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof UserRoleContract.Create.static) =>
      api.post<any, typeof UserRoleContract.Create.static>(
        "/api/v1/userrole",
        data
      ),
    onSuccess: () => {
      toast.success("用户角色创建成功");
      queryClient.invalidateQueries({ queryKey: userroleKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建用户角色失败");
    },
  });
}

// --- 4. 更新 (PUT) ---
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof UserRoleContract.Update.static;
    }) =>
      api.put<any, typeof UserRoleContract.Update.static>(
        `/api/v1/userrole/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("用户角色更新成功");
      queryClient.invalidateQueries({ queryKey: userroleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userroleKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新用户角色失败");
    },
  });
}

// --- 5. 删除 (DELETE) ---
export function useDeleteUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/userrole/${id}`),
    onSuccess: () => {
      toast.success("用户角色删除成功");
      queryClient.invalidateQueries({ queryKey: userroleKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除用户角色失败");
    },
  });
}
