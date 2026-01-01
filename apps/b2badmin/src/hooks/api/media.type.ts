/**
 * 媒体文件 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 媒体文件列表查询参数
 */
export interface MediaListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "originalName";
  sortOrder?: "asc" | "desc";
}

/**
 * 媒体文件列表响应
 */
export interface MediaListResponse {
  data: Media[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 媒体文件实体 ====================

/**
 * 媒体文件实体
 */
export interface Media {
  id: string;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
  storageKey: string; // 存储键名
  category: string; // 文件分类: image, video, general
  url: string; // 访问URL
  originalName: string; // 原始文件名
  mimeType: string; // MIME类型
  status: boolean; // 上传状态: true=已上传, false=未上传

  // 租户隔离字段
  exporterId?: string | null;
  factoryId?: string | null;
  ownerId?: string | null;
  isPublic: boolean; // 是否公开

  // 站点关联
  siteId: string;
}

// ==================== 上传媒体 ====================

/**
 * 上传媒体请求体
 */
export interface MediaUploadRequest {
  file: File;
  category?: string;
  siteId?: string;
  isPublic?: boolean;
}

/**
 * 上传媒体响应
 */
export interface MediaUploadResponse {
  id: string;
  url: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  category: string;
  message: string;
}

// ==================== 批量上传 ====================

/**
 * 批量上传响应
 */
export interface MediaBatchUploadResponse {
  successful: MediaUploadResponse[];
  failed: Array<{
    fileName: string;
    error: string;
  }>;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface MediaBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface MediaBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 媒体分类枚举 ====================

/**
 * 媒体分类枚举
 */
export const MEDIA_CATEGORIES = {
  IMAGE: "image",
  VIDEO: "video",
  GENERAL: "general",
} as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[keyof typeof MEDIA_CATEGORIES];

// ==================== 媒体选择器相关 ====================

/**
 * 媒体选择器选项（用于组件）
 */
export interface MediaOption {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  category: MediaCategory;
  isMain?: boolean;
  sortOrder?: number;
}

/**
 * SKU媒体关联
 */
export interface SkuMedia {
  id: string;
  skuId: string;
  mediaId: string;
  isMain: boolean;
  sortOrder: number;
  createdAt: string;
  media?: Media;
}
