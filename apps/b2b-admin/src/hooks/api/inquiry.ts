/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { InquiryContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const inquiryKeys = {
  all: ["inquiry"] as const,
  lists: () => [...inquiryKeys.all, "list"] as const,
  list: (params: any) => [...inquiryKeys.lists(), params] as const,
  details: () => [...inquiryKeys.all, "detail"] as const,
  detail: (id: string) => [...inquiryKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof InquiryContract.ListQuery.static
export function useInquiryList(
  params?: typeof InquiryContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: inquiryKeys.list(params),
    queryFn: () =>
      api.get<any, typeof InquiryContract.ListQuery.static>("/api/v1/inquiry", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useInquiryDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: inquiryKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/inquiry/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof InquiryContract.Create.static
export function useCreateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof InquiryContract.Create.static) =>
      api.post<any, typeof InquiryContract.Create.static>(
        "/api/v1/inquiry",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof InquiryContract.Update.static
export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof InquiryContract.Update.static;
    }) =>
      api.put<any, typeof InquiryContract.Update.static>(
        `/api/v1/inquiry/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: inquiryKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/inquiry/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() });
    },
  });
}
