/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { TemplateValueContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const templatevalueKeys = {
  all: ["templatevalue"] as const,
  lists: () => [...templatevalueKeys.all, "list"] as const,
  list: (params: any) => [...templatevalueKeys.lists(), params] as const,
  details: () => [...templatevalueKeys.all, "detail"] as const,
  detail: (id: string) => [...templatevalueKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof TemplateValueContract.ListQuery.static
export function useTemplateValueList(
  params?: typeof TemplateValueContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: templatevalueKeys.list(params),
    queryFn: () =>
      api.get<any, typeof TemplateValueContract.ListQuery.static>(
        "/api/v1/templatevalue",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useTemplateValueDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: templatevalueKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/templatevalue/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof TemplateValueContract.Create.static
export function useCreateTemplateValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof TemplateValueContract.Create.static) =>
      api.post<any, typeof TemplateValueContract.Create.static>(
        "/api/v1/templatevalue",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatevalueKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof TemplateValueContract.Update.static
export function useUpdateTemplateValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof TemplateValueContract.Update.static;
    }) =>
      api.put<any, typeof TemplateValueContract.Update.static>(
        `/api/v1/templatevalue/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templatevalueKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: templatevalueKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteTemplateValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/templatevalue/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templatevalueKeys.lists() });
    },
  });
}
