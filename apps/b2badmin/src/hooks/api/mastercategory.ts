/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { MasterCategoryContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const mastercategoryKeys = {
  all: ["mastercategory"] as const,
  lists: () => [...mastercategoryKeys.all, "list"] as const,
  list: (params: any) => [...mastercategoryKeys.lists(), params] as const,
  details: () => [...mastercategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...mastercategoryKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof MasterCategoryContract.ListQuery.static
export function useMasterCategoryList(
  params?: typeof MasterCategoryContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: mastercategoryKeys.list(params),
    queryFn: () =>
      api.get<any, typeof MasterCategoryContract.ListQuery.static>(
        "/api/v1/mastercategory",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useMasterCategoryDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: mastercategoryKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/mastercategory/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof MasterCategoryContract.Create.static
export function useCreateMasterCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof MasterCategoryContract.Create.static) =>
      api.post<any, typeof MasterCategoryContract.Create.static>(
        "/api/v1/mastercategory",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mastercategoryKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof MasterCategoryContract.Update.static
export function useUpdateMasterCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof MasterCategoryContract.Update.static;
    }) =>
      api.put<any, typeof MasterCategoryContract.Update.static>(
        `/api/v1/mastercategory/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mastercategoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: mastercategoryKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteMasterCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/mastercategory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mastercategoryKeys.lists() });
    },
  });
}
