/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { AdContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

// --- Query Keys ---
export const adKeys = {
  all: ["ad"] as const,
  lists: () => [...adKeys.all, "list"] as const,
  list: (params: any) => [...adKeys.lists(), params] as const,
  details: () => [...adKeys.all, "detail"] as const,
  detail: (id: string) => [...adKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof AdContract.ListQuery.static
export function useAdList(
  params?: typeof AdContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: adKeys.list(params),
    queryFn: () =>
      api.get<any, typeof AdContract.ListQuery.static>("/api/v1/ad", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useAdDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: adKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/ad/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof AdContract.Create.static
export function useCreateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof AdContract.Create.static) =>
      api.post<any, typeof AdContract.Create.static>("/api/v1/ad", data),
    onSuccess: () => {
      toast.success("广告创建成功");
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建广告失败");
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof AdContract.Update.static
export function useUpdateAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof AdContract.Update.static;
    }) =>
      api.put<any, typeof AdContract.Update.static>(`/api/v1/ad/${id}`, data),
    onSuccess: (_, variables) => {
      toast.success("广告更新成功");
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adKeys.detail(variables.id) });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新广告失败");
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteAd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/ad/${id}`),
    onSuccess: () => {
      toast.success("广告删除成功");
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除广告失败");
    },
  });
}

// --- 批量删除 ---
export function useAdBatchDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete<any, { ids: string[] }>("/api/v1/ad/batch", { ids }),
    onSuccess: () => {
      toast.success("批量删除成功");
      queryClient.invalidateQueries({ queryKey: adKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "批量删除失败");
    },
  });
}
