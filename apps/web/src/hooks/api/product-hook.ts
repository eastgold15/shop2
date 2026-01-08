"use client";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { rpc } from "@/lib/rpc";

// 类型定义 - Product List 返回的是 SiteProduct 列表
export type ProductListItem = {
  siteProductId: string;
  displayName: string;
  displayDesc: string;
  isFeatured: boolean | null;
  sortOrder: number | null;
  productId: string;
  spuCode: string;
  units: string | null;
  minPrice: string;
  mainMedia: string;
};

export type ProductListRes = {
  items: ProductListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

/**
 * 获取商品列表
 */
export function useProductList(
  params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    name?: string;
  } = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      // 过滤掉 undefined 的参数
      const cleanParams = Object.fromEntries(
        Object.entries({
          page: 1, // 默认值
          limit: 10,
          ...params,
        }).filter(([_, v]) => v !== undefined)
      );

      const { data, error } = await rpc.products.get({
        query: cleanParams as any,
      });

      if (error) {
        toast.error(error.value?.message || "获取商品列表失败");
      }
      return data!;
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}


const peoductDetail = async (id: string) => {
  return await rpc.products({ id }).get();
}
export type ProductDetailRes = NonNullable<
  Treaty.Data<typeof peoductDetail>
>;

/**
 * 获取单个商品详情
 */
export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      const { data, error } = await peoductDetail(id);
      if (error) {
        toast.error(error.value?.message || "获取商品详情失败");
      }
      return data! as unknown as ProductDetailRes
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    retry: 2,
  });
}

