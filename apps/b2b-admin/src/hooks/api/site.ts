/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { SiteContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const siteKeys = {
  all: ["site"] as const,
  lists: () => [...siteKeys.all, "list"] as const,
  list: (params: any) => [...siteKeys.lists(), params] as const,
  details: () => [...siteKeys.all, "detail"] as const,
  detail: (id: string) => [...siteKeys.details(), id] as const,
};
import { SiteListRes } from './site.type'
// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof SiteContract.ListQuery.static
export function useSiteList(
  params?: typeof SiteContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: siteKeys.list(params),
    queryFn: () =>
      api.get<SiteListRes[], typeof SiteContract.ListQuery.static>("/api/v1/site", {
        params,
      }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useSiteDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: siteKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/site/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof SiteContract.Create.static
export function useCreateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SiteContract.Create.static) =>
      api.post<any, typeof SiteContract.Create.static>("/api/v1/site", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof SiteContract.Update.static
export function useUpdateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof SiteContract.Update.static;
    }) =>
      api.put<any, typeof SiteContract.Update.static>(
        `/api/v1/site/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: siteKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/site/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.lists() });
    },
  });
}
