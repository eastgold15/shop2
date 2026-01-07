import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query/query-keys";
import { rpc } from "@/lib/rpc";

export interface SiteCategoryTreeRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  parentId?: any;
  sortOrder: number;
  siteId: string;
  masterCategoryId?: any;
  children?: Child[];
}
interface Child {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  parentId: string;
  sortOrder: number;
  siteId: string;
  masterCategoryId?: any;
}

export function useSiteCategoryQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const { data, error } = await rpc.sitecategories.get();
      if (error) {
        toast.error((error.value as any)?.message || "获取分类目录失败");
      }
      return data!
    },
    staleTime: 5 * 60 * 1000, // 5分钟
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
}

export interface SiteCategoryDetailRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  parentId?: any;
  sortOrder: number;
  siteId: string;
  description?: string;
  masterCategoryId?: string;
}

export function useCategoryDetailQuery(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.categories.desc(id),
    queryFn: async () => {
      const { data, error } = await rpc.sitecategories({ id }).get();
      if (error) {
        toast.error(error.value?.message || "获取分类目录详情失败");
      }
      return data! as SiteCategoryDetailRes
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5分钟
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
