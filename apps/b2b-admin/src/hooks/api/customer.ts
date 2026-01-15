/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { CustomerContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const customerKeys = {
  all: ["customer"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params: any) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof CustomerContract.ListQuery.static
export function useCustomerList(
  params?: typeof CustomerContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () =>
      api.get<any, typeof CustomerContract.ListQuery.static>(
        "/api/v1/customer",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useCustomerDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/customer/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof CustomerContract.Create.static
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof CustomerContract.Create.static) =>
      api.post<any, typeof CustomerContract.Create.static>(
        "/api/v1/customer",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof CustomerContract.Update.static
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof CustomerContract.Update.static;
    }) =>
      api.put<any, typeof CustomerContract.Update.static>(
        `/api/v1/customer/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/customer/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
