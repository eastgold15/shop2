/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { SiteCategoryContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";



// --- Query Keys ---
export const sitecategoryKeys = {
  all: ["sitecategory"] as const,
  lists: () => [...sitecategoryKeys.all, "list"] as const,
  list: (params: any) => [...sitecategoryKeys.lists(), params] as const,
  details: () => [...sitecategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...sitecategoryKeys.details(), id] as const,
};

export function useSiteCategoryTree(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["sitecategory", "tree"],
    queryFn: async () => {
      const data = await api.get<SiteCategoryContract["TreeEntity"][]>(
        "/api/v1/sitecategory/tree"
      );
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
}

// 获取当前站点的扁平化分类列表（用于下拉选择）
// --- 1. 列表查询 (GET) ---
export function useSiteCategoryList(
  params?: typeof SiteCategoryContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: sitecategoryKeys.list(params),
    queryFn: () =>
      api.get<any, typeof SiteCategoryContract.ListQuery.static>(
        "/api/v1/sitecategory/",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
export function useSiteCategoryDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: sitecategoryKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/sitecategory/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
export function useCreateSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof SiteCategoryContract.Create.static) =>
      api.post<any, typeof SiteCategoryContract.Create.static>(
        "/api/v1/sitecategory/",
        data
      ),
    onSuccess: () => {
      toast.success("站点分类创建成功");
      queryClient.invalidateQueries({ queryKey: sitecategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建站点分类失败");
    },
  });
}

// --- 4. 更新 (PUT) ---
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
      toast.success("站点分类更新成功");
      queryClient.invalidateQueries({ queryKey: sitecategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
      queryClient.invalidateQueries({
        queryKey: sitecategoryKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新站点分类失败");
    },
  });
}

// --- 5. 删除 (DELETE) ---
export function useDeleteSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/sitecategory/${id}`),
    onSuccess: () => {
      toast.success("站点分类删除成功");
      queryClient.invalidateQueries({ queryKey: sitecategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除站点分类失败");
    },
  });
}

// 批量删除站点分类
export function useBatchDeleteSiteCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete<any, { ids: string[] }>("/api/v1/sitecategory/batch", {
        ids,
      }),
    onSuccess: () => {
      toast.success("批量删除成功");
      queryClient.invalidateQueries({ queryKey: sitecategoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "批量删除失败");
    },
  });
}

// 移动分类
export function useMoveCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newParentId }: { id: string; newParentId?: string }) =>
      api.patch<any, { newParentId?: string }>(
        `/api/v1/sitecategory/${id}/move`,
        { newParentId }
      ),
    onSuccess: () => {
      toast.success("分类移动成功");
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "移动分类失败");
    },
  });
}

// 批量更新排序
export function useUpdateCategoriesSort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: Array<{ id: string; sortOrder: number }>) =>
      api.patch<any, { items: Array<{ id: string; sortOrder: number }> }>(
        "/api/v1/sitecategory/sort",
        { items }
      ),
    onSuccess: () => {
      toast.success("排序更新成功");
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新排序失败");
    },
  });
}

// 切换激活状态
export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.patch<any, {}>(`/api/v1/sitecategory/${id}/toggle`, {}),
    onSuccess: () => {
      toast.success("状态更新成功");
      queryClient.invalidateQueries({ queryKey: ["site-categories"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新状态失败");
    },
  });
}

// 获取分类的完整路径（如：一级分类 > 二级分类 > 三级分类）
export function getCategoryPath(
  category: SiteCategoryContract["TreeEntity"],
  allCategories: SiteCategoryContract["TreeEntity"][]
): string {
  const path: string[] = [];
  let currentCategory: SiteCategoryContract["TreeEntity"] | undefined = category;

  while (currentCategory) {
    path.unshift(currentCategory.name);
    if (currentCategory.parentId) {
      currentCategory = findCategoryById(
        currentCategory.parentId,
        allCategories
      );
    } else {
      break;
    }
  }

  return path.join(" > ");
}

// 根据ID查找分类
function findCategoryById(
  id: string,
  categories: SiteCategoryContract["TreeEntity"][]
): SiteCategoryContract["TreeEntity"] | undefined {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.children) {
      const found = findCategoryById(id, category.children);
      if (found) {
        return found;
      }
    }
  }
  return;
}

// 检查分类是否有子分类
export function hasChildren(category: SiteCategoryContract["TreeEntity"]): boolean {
  return !!(category.children && category.children.length > 0);
}

// 检查是否可以删除分类（没有子分类）
export function canDeleteCategory(
  category: SiteCategoryContract["TreeEntity"],
  _allCategories: SiteCategoryContract["TreeEntity"][]
): boolean {
  if (hasChildren(category)) {
    return false;
  }
  return true;
}
