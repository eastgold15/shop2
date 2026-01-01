/**
 * 商品 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

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

/**
 * 商品实体（完整响应）
 */
export interface Product {
  id: string;
  name: string;
  spuCode: string;
  description?: string | null;
  status: number;
  units?: string | null;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 站点相关字段
  sitePrice?: string | null;
  siteName?: string | null;
  siteDescription?: string | null;
  siteCategoryId?: string | null;

  // 模板关联
  templateId?: string | null;

  // 媒体ID（用于编辑）
  mediaIds: string[];
  videoIds: string[];

  // 媒体数据
  images: ProductImage[];
  videos: ProductVideo[];
  mainImage?: string | null;
  mainImageId?: string | null;

  // SKU 数据
  skus: ProductSkuSummary[];
  skuCount: number;
}

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

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
