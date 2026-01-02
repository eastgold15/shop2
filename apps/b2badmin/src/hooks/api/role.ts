/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { RoleContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const roleKeys = {
  all: ["role"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (params: any) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof RoleContract.ListQuery.static
export function useRoleList(
  params?: typeof RoleContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () =>
      api.get<any, typeof RoleContract.ListQuery.static>("/api/v1/role", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useRoleDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/role/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof RoleContract.Create.static
export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof RoleContract.Create.static) =>
      api.post<any, typeof RoleContract.Create.static>("/api/v1/role", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof RoleContract.Update.static
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof RoleContract.Update.static;
    }) =>
      api.put<any, typeof RoleContract.Update.static>(
        `/api/v1/role/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: roleKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/role/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

// 别名：兼容复数形式（前端组件中使用）
export const useRolesList = useRoleList;
