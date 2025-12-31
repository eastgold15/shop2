/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { TenantContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const tenantKeys = {
  all: ["tenant"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (params: any) => [...tenantKeys.lists(), params] as const,
  details: () => [...tenantKeys.all, "detail"] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof TenantContract.ListQuery.static
export function useTenantList(
  params?: typeof TenantContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: tenantKeys.list(params),
    queryFn: () =>
      api.get<any, typeof TenantContract.ListQuery.static>("/api/v1/tenant", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useTenantDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/tenant/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof TenantContract.Create.static
export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof TenantContract.Create.static) =>
      api.post<any, typeof TenantContract.Create.static>(
        "/api/v1/tenant",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof TenantContract.Update.static
export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof TenantContract.Update.static;
    }) =>
      api.put<any, typeof TenantContract.Update.static>(
        `/api/v1/tenant/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/tenant/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
}
