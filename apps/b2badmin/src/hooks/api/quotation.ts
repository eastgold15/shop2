/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { QuotationContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const quotationKeys = {
  all: ["quotation"] as const,
  lists: () => [...quotationKeys.all, "list"] as const,
  list: (params: any) => [...quotationKeys.lists(), params] as const,
  details: () => [...quotationKeys.all, "detail"] as const,
  detail: (id: string) => [...quotationKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof QuotationContract.ListQuery.static
export function useQuotationList(
  params?: typeof QuotationContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: quotationKeys.list(params),
    queryFn: () =>
      api.get<any, typeof QuotationContract.ListQuery.static>(
        "/api/v1/quotation",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useQuotationDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: quotationKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/quotation/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof QuotationContract.Create.static
export function useCreateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof QuotationContract.Create.static) =>
      api.post<any, typeof QuotationContract.Create.static>(
        "/api/v1/quotation",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof QuotationContract.Update.static
export function useUpdateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof QuotationContract.Update.static;
    }) =>
      api.put<any, typeof QuotationContract.Update.static>(
        `/api/v1/quotation/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: quotationKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/quotation/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
    },
  });
}
