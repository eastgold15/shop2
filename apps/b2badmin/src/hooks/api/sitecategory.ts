/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { SiteCategoryContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const sitecategoryKeys = {
  all: ["sitecategory"] as const,
  lists: () => [...sitecategoryKeys.all, "list"] as const,
  list: (params: any) => [...sitecategoryKeys.lists(), params] as const,
  details: () => [...sitecategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...sitecategoryKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof SiteCategoryContract.ListQuery.static
export function useSiteCategoryList(
  params?: typeof SiteCategoryContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: sitecategoryKeys.list(params),
    queryFn: () =>
      api.get<any, typeof SiteCategoryContract.ListQuery.static>(
        "/api/v1/sitecategory",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useSiteCategoryDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: sitecategoryKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/sitecategory/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof SiteCategoryContract.Create.static
export function useCreateSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SiteCategoryContract.Create.static) =>
      api.post<any, typeof SiteCategoryContract.Create.static>(
        "/api/v1/sitecategory",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sitecategoryKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof SiteCategoryContract.Update.static
export function useUpdateSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof SiteCategoryContract.Update.static;
    }) =>
      api.put<any, typeof SiteCategoryContract.Update.static>(
        `/api/v1/sitecategory/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sitecategoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sitecategoryKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/sitecategory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sitecategoryKeys.lists() });
    },
  });
}
