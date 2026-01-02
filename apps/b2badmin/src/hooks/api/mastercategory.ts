/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { MasterCategoryContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

// 树形节点类型

// --- Query Keys ---
export const mastercategoryKeys = {
  all: ["mastercategory"] as const,
  lists: () => [...mastercategoryKeys.all, "list"] as const,
  list: (params: any) => [...mastercategoryKeys.lists(), params] as const,
  details: () => [...mastercategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...mastercategoryKeys.details(), id] as const,
};

// 工具函数：将树形分类数据扁平化为选项列表
export function flattenCategories(
  categories: MasterCategoryContract["TreeEntity"][]
): Array<{ value: string; label: string }> {
  const result: Array<{ value: string; label: string }> = [];

  const traverse = (nodes: MasterCategoryContract["TreeEntity"][], prefix = "") => {
    for (const node of nodes) {
      const label = prefix ? `${prefix} > ${node.name}` : node.name;
      result.push({ value: node.id, label });
      if (node.children && node.children.length > 0) {
        traverse(node.children, label);
      }
    }
  };

  traverse(categories);
  return result;
}

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
        "/api/v1/mastercategory/",
        { params }
      ),
    enabled,
  });
}

// 获取主分类树
export function useMasterCategoryTree(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["mastercategory", "tree"],
    queryFn: async () => {
      const data = await api.get<MasterCategoryContract["TreeEntity"][]>("/api/v1/mastercategory/tree");
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
}

// 获取主分类列表（扁平化，用于下拉选择）
export function useMasterCategories(
  query?: Partial<typeof MasterCategoryContract.ListQuery.static>
) {
  return useQuery({
    queryKey: ["master-categories", "flat", query],
    queryFn: async () => {
      const categories = await api.get<
        any,
        Partial<typeof MasterCategoryContract.ListQuery.static>
      >("/api/v1/mastercategory/", { params: query || {} });
      return categories || [];
    },
    staleTime: 1000 * 60 * 5,
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

// 获取主分类详情（旧名称兼容）
export function useMasterCategory(id: string) {
  return useQuery({
    queryKey: ["master-category", id],
    queryFn: async () => api.get<any>(`/api/v1/mastercategory/${id}`),
    enabled: !!id,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof MasterCategoryContract.Create.static
export function useCreateMasterCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof MasterCategoryContract.Create.static) =>
      api.post<any, typeof MasterCategoryContract.Create.static>(
        "/api/v1/mastercategory/",
        data
      ),
    onSuccess: () => {
      toast.success("主分类创建成功");
      queryClient.invalidateQueries({ queryKey: mastercategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["master-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建主分类失败");
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
      toast.success("主分类更新成功");
      queryClient.invalidateQueries({ queryKey: mastercategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["master-categories"] });
      queryClient.invalidateQueries({
        queryKey: mastercategoryKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新主分类失败");
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
      toast.success("主分类删除成功");
      queryClient.invalidateQueries({ queryKey: mastercategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["master-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除主分类失败");
    },
  });
}

// 批量删除主分类
export function useMasterCategoryBatchDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete<any, { ids: string[] }>("/api/v1/mastercategory/batch", { ids }),
    onSuccess: () => {
      toast.success("批量删除成功");
      queryClient.invalidateQueries({ queryKey: mastercategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["master-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "批量删除失败");
    },
  });
}


