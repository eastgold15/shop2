/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { TemplateKeyContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const templatekeyKeys = {
  all: ["templatekey"] as const,
  lists: () => [...templatekeyKeys.all, "list"] as const,
  list: (params: any) => [...templatekeyKeys.lists(), params] as const,
  details: () => [...templatekeyKeys.all, "detail"] as const,
  detail: (id: string) => [...templatekeyKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof TemplateKeyContract.ListQuery.static
export function useTemplateKeyList(
  params?: typeof TemplateKeyContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: templatekeyKeys.list(params),
    queryFn: () =>
      api.get<any, typeof TemplateKeyContract.ListQuery.static>(
        "/api/v1/templatekey",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useTemplateKeyDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: templatekeyKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/templatekey/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof TemplateKeyContract.Create.static
export function useCreateTemplateKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof TemplateKeyContract.Create.static) =>
      api.post<any, typeof TemplateKeyContract.Create.static>(
        "/api/v1/templatekey",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatekeyKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof TemplateKeyContract.Update.static
export function useUpdateTemplateKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof TemplateKeyContract.Update.static;
    }) =>
      api.put<any, typeof TemplateKeyContract.Update.static>(
        `/api/v1/templatekey/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templatekeyKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: templatekeyKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteTemplateKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/templatekey/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatekeyKeys.lists() });
    },
  });
}
