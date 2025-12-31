/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { TemplateContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const templateKeys = {
  all: ["template"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (params: any) => [...templateKeys.lists(), params] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof TemplateContract.ListQuery.static
export function useTemplateList(
  params?: typeof TemplateContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: templateKeys.list(params),
    queryFn: () =>
      api.get<any, typeof TemplateContract.ListQuery.static>(
        "/api/v1/template",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useTemplateDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/template/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof TemplateContract.Create.static
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof TemplateContract.Create.static) =>
      api.post<any, typeof TemplateContract.Create.static>(
        "/api/v1/template",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof TemplateContract.Update.static
export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof TemplateContract.Update.static;
    }) =>
      api.put<any, typeof TemplateContract.Update.static>(
        `/api/v1/template/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: templateKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/template/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}
