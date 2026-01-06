/**
 * SKU - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================
export interface SkuListRes {
  id: string;
  skuCode: string;
  stock: number;
  specJson: Record<string, string> | null;
  price: number;
  originalPrice: string;
  isActive: boolean;
  isCustomized: boolean;
  marketPrice?: any;
  costPrice?: any;
  weight?: any;
  volume?: any;
  mainImage?: MainImage;
  allImages: MainImage[];
}
interface MainImage {
  skuId: string;
  mediaId: string;
  url: string;
  isMain: boolean;
}



/**
 * SKU列表查询参数
 */
export interface SkuListQuery {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  status?: number;
  sortBy?: "createdAt" | "updatedAt" | "skuCode" | "price";
  sortOrder?: "asc" | "desc";
}

/**
 * SKU列表响应
 */
export interface SkuListResponse {
  data: SkuRes[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== SKU实体 ====================

/**
 * SKU实体
 */
export interface SkuRes {
  id: string;
  skuCode: string;
  price: number;
  marketPrice?: number | null;
  costPrice?: number | null;
  weight?: number | null;
  volume?: number | null;
  stock: number;
  specJson: Record<string, any> | null;
  status: number;
  productId: string;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 关联数据
  product?: {
    id: string;
    name: string;
    spuCode: string;
    siteCategoryId: string;
    siteCategory?: {
      name: string;
    };
  };
}

/**
 * SKU创建/编辑表单数据
 */
export interface SkuFormData {
  id?: string;
  skuCode: string;
  price: string | number;
  marketPrice?: string | number | null;
  costPrice?: string | number | null;
  weight?: string | number | null;
  volume?: string | number | null;
  stock: string | number;
  specJson?: Record<string, string> | null;
  status?: number;
  allImages?: Array<{ id: string; url: string; isMain: boolean }>;
}

// ==================== 创建SKU ====================

/**
 * 创建SKU请求体
 */
export interface SkuCreate {
  skuCode: string;
  price: number;
  marketPrice?: number;
  costPrice?: number;
  weight?: number;
  volume?: number;
  stock: number;
  specJson?: Record<string, any>;
  status?: number;
  productId: string;
  imageIds?: string[];
  mainImageId?: string;
}

/**
 * 创建SKU响应
 */
export interface SkuCreateResponse {
  id: string;
  message: string;
}

// ==================== 批量创建SKU ====================

/**
 * 批量创建SKU请求体
 */
export interface SkuBatchCreateRequest {
  skus: Array<{
    skuCode: string;
    price: number;
    marketPrice?: number;
    costPrice?: number;
    weight?: number;
    volume?: number;
    stock: number;
    specJson?: Record<string, any>;
    status?: number;
    imageIds?: string[];
    mainImageId?: string;
  }>;
  productId: string;
}

/**
 * 批量创建SKU响应
 */
export interface SkuBatchCreateResponse {
  created: string[];
  message: string;
}

// ==================== 更新SKU ====================

/**
 * 更新SKU请求体
 */
export interface SkuUpdate {
  skuCode?: string;
  price?: number;
  marketPrice?: number;
  costPrice?: number;
  weight?: number;
  volume?: number;
  stock?: number;
  specJson?: Record<string, any>;
  status?: number;
  imageIds?: string[];
  mainImageId?: string;
}

/**
 * 更新SKU响应
 */
export interface SkuUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface SkuBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface SkuBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 商品列表（用于SKU选择） ====================

/**
 * 用于SKU管理的商品简化列表
 */
export interface ProductsForSkuResponse {
  data: Array<{
    id: string;
    name: string;
    spuCode: string;
  }>;
}

// ==================== SKU状态枚举 ====================

/**
 * SKU状态枚举
 */
export const SKU_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

export type SkuStatus = (typeof SKU_STATUS)[keyof typeof SKU_STATUS];
