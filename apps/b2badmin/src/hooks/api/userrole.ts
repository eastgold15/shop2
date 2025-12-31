/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { UserRoleContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
// TRes = any, TQuery = typeof UserRoleContract.ListQuery.static
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
// TRes = any
export function useUserRoleDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: userroleKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/userrole/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof UserRoleContract.Create.static
export function useCreateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof UserRoleContract.Create.static) =>
      api.post<any, typeof UserRoleContract.Create.static>(
        "/api/v1/userrole",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userroleKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof UserRoleContract.Update.static
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
      queryClient.invalidateQueries({ queryKey: userroleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userroleKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/userrole/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userroleKeys.lists() });
    },
  });
}
