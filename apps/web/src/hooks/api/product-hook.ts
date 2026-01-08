"use client";
import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { rpc } from "@/lib/rpc";

// 类型定义
export type ProductListRes = NonNullable<Treaty.Data<typeof rpc.products.get>>;

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

export interface ProductDetailRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  spuCode: string;
  name: string;
  description: string;
  status: number;
  units: string;
  exporterId?: any;
  factoryId?: any;
  ownerId?: any;
  isPublic: boolean;
  siteId: string;
  productMedia: ProductMedia[];
  siteCategory: any[];
  skus: Skus[];
}
interface Skus {
  id: string;
  createdAt: string;
  updatedAt: string;
  skuCode: string;
  price: string;
  marketPrice?: any;
  costPrice?: any;
  weight: string;
  volume: string;
  stock: string;
  specJson: Record<string, string>;
  extraAttributes?: any;
  status: number;
  productId: string;
  exporterId?: any;
  factoryId?: any;
  ownerId?: any;
  isPublic: boolean;
  siteId?: any;
  media: Media[];
}

interface ProductMedia {
  productId: string;
  mediaId: string;
  isMain: boolean;
  sortOrder: number;
  media: Media;
}
interface Media {
  id: string;
  createdAt: string;
  updatedAt: string;
  storageKey: string;
  category: string;
  url: string;
  originalName: string;
  mimeType: string;
  status: boolean;
  thumbnailUrl?: any;
  mediaType: string;
  exporterId: string;
  factoryId?: any;
  ownerId?: any;
  isPublic: boolean;
  siteId: string;
}

/**
 * 获取单个商品详情
 */
export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      const { data, error } = await rpc.products({ id }).get();
      if (error) {
        toast.error(error.value?.message || "获取商品详情失败");
      }
      return data! as ProductDetailRes;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    retry: 2,
  });
}
