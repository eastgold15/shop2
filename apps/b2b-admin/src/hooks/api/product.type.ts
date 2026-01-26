import { SkuListRes } from "@/hooks/api/sku.type";
/**
 * 商品 - 前端接口类型定义
 * 用于后端接口开发参考
 */
import type { BaseSku } from "./sku.type";

// ==================== 列表查询 ====================
export interface ProductPageListRes {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
export interface Product {
  id: string;
  siteProductId: string; // 🔥 site_product 表的 ID，用于排序等操作
  name: string;
  spuCode: string;
  description: string;
  status: number;
  units: string;
  createdAt: string;
  updatedAt: string;
  price: string;
  sitePrice: string;
  hasCustomPrice: boolean;
  siteName: string;
  siteDescription: string;
  siteCategoryId: string;
  templateId: string;
  mediaIds: string[];
  videoIds: any[];
  images: Image[];
  videos: any[];
  mainImage: string;
  mainImageId: string;
  skus: SkuListRes[];
  skuCount: number;
  /** 商品规格定义 (从模板中提取的 SKU 规格属性) */
  specs?: SpecDefinition[];
}

/** 商品规格定义 */
interface SpecDefinition {
  key: string;
  label: string;
  inputType: string;
  /** 可选值列表 (例如: ["S", "M", "L"]) */
  options?: string[];
}
export interface Skus extends BaseSku {
  productId: string;
}
interface SpecJson {
  color: string;
  size: string;
}
interface Image {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  mediaType: string;
  thumbnailUrl?: any;
  isMain: boolean;
  sortOrder: number;
}
/**
 * 商品列表查询参数
 */
export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  siteCategoryId?: string;
  templateId?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "spuCode";
  sortOrder?: "asc" | "desc";
  /** 是否已收录到本站点 (true=我的商品, false=商品池) */
  isListed?: boolean;
}

/**
 * 商品列表响应
 */
export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 媒体对象类型 ====================

/**
 * 商品图片对象
 */
export interface ProductImage {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  isMain: boolean;
  sortOrder: number;
}

/**
 * 商品视频对象
 */
export interface ProductVideo {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  thumbnailUrl?: string | null;
}

/**
 * SKU简要信息
 */
export interface ProductSkuSummary {
  id: string;
  skuCode: string;
  price: string;
  stock: string;
  specJson: Record<string, any> | null;
  status: number;
  mainImage?: { url: string; isMain: boolean } | null;
  allImages?: Array<{ id: string; url: string; isMain: boolean }>;
}

// ==================== 商品实体 ====================

// ==================== 创建商品 ====================

/**
 * 创建商品请求体
 */
export interface ProductCreate {
  name: string;
  spuCode: string;
  description?: string;
  status?: number;
  units?: string;
  sitePrice?: string;
  siteName?: string;
  siteDescription?: string;
  siteCategoryId?: string;
  templateId?: string;
  mediaIds?: string[];
  videoIds?: string[];
  mainImageId?: string;
}

/**
 * 创建商品响应
 */
export interface ProductCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新商品 ====================

/**
 * 更新商品请求体
 */
export interface ProductUpdate {
  name?: string;
  spuCode?: string;
  description?: string;
  status?: number;
  units?: string;
  sitePrice?: string;
  siteName?: string;
  siteDescription?: string;
  siteCategoryId?: string;
  templateId?: string;
  mediaIds?: string[];
  videoIds?: string[];
  mainImageId?: string;
}

/**
 * 更新商品响应
 */
export interface ProductUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface ProductBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface ProductBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 商品状态枚举 ====================

/**
 * 商品状态枚举
 */
export const PRODUCT_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
