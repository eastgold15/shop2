/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { DailyInquiryCounterContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const dailyinquirycounterKeys = {
  all: ["dailyinquirycounter"] as const,
  lists: () => [...dailyinquirycounterKeys.all, "list"] as const,
  list: (params: any) => [...dailyinquirycounterKeys.lists(), params] as const,
  details: () => [...dailyinquirycounterKeys.all, "detail"] as const,
  detail: (id: string) => [...dailyinquirycounterKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof DailyInquiryCounterContract.ListQuery.static
export function useDailyInquiryCounterList(
  params?: typeof DailyInquiryCounterContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: dailyinquirycounterKeys.list(params),
    queryFn: () =>
      api.get<any, typeof DailyInquiryCounterContract.ListQuery.static>(
        "/api/v1/dailyinquirycounter",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useDailyInquiryCounterDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: dailyinquirycounterKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/dailyinquirycounter/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof DailyInquiryCounterContract.Create.static
export function useCreateDailyInquiryCounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof DailyInquiryCounterContract.Create.static) =>
      api.post<any, typeof DailyInquiryCounterContract.Create.static>(
        "/api/v1/dailyinquirycounter",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dailyinquirycounterKeys.lists(),
      });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof DailyInquiryCounterContract.Update.static
export function useUpdateDailyInquiryCounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof DailyInquiryCounterContract.Update.static;
    }) =>
      api.put<any, typeof DailyInquiryCounterContract.Update.static>(
        `/api/v1/dailyinquirycounter/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: dailyinquirycounterKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: dailyinquirycounterKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteDailyInquiryCounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<any>(`/api/v1/dailyinquirycounter/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dailyinquirycounterKeys.lists(),
      });
    },
  });
}
