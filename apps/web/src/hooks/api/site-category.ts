import type { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query/query-keys";
import { rpc } from "@/lib/rpc";
import {
  SiteCategoryDetailRes,
  SiteCategoryProductRes,
} from "./site-category.type";

// 类型定义

export type SiteCategoryListRes = NonNullable<
  Treaty.Data<typeof rpc.site_category.get>
>;

export function useSiteCategoryList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const { data, error } = await rpc.site_category.get();
      if (error) {
        toast.error((error.value as any)?.message || "获取分类目录失败");
      }
      return data! as SiteCategoryListRes;
    },
    staleTime: 5 * 60 * 1000, // 5分钟
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
}

// 获取分类目录详情
export function useSiteCategoryDetail(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.categories.desc(id),
    queryFn: async () => {
      const { data, error } = await rpc.site_category.detail({ id }).get();
      if (error) {
        toast.error(error.value?.message || "获取分类目录详情失败");
      }
      return data! as unknown as SiteCategoryDetailRes;
    },
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000, // 5分钟
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useSiteCategoryProducts(
  id: string,
  params: { page: number; limit: number } = { page: 1, limit: 10 },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["category-products", id, params],
    queryFn: async () => {
      const { data, error } = await rpc.site_category
        .category({ id })
        .get({ query: params });

      if (error) {
        toast.error(error.value?.message || "获取分类商品失败");
      }
      return data! as unknown as SiteCategoryProductRes[];
    },
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
