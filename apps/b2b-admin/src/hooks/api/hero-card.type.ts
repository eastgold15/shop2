/**
 * 首页展示卡片 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================
export interface HeroCardRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundClass: string;
  sortOrder: number;
  isActive: boolean;
  mediaId: string;
  tenantId: string;
  deptId: string;
  createdBy: string;
  isPublic: boolean;
  siteId: string;
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
  thumbnailUrl: string;
  mediaType: string;
  tenantId: string;
  deptId: string;
  createdBy: string;
  isPublic: boolean;
}
/**
 * 首页展示卡片列表查询参数
 */
export interface HeroCardListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

/**
 * 首页展示卡片列表响应
 */
export interface HeroCardListResponse {
  data: HeroCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 首页展示卡片实体 ====================

/**
 * 首页展示卡片实体
 */
export interface HeroCard {
  id: string;
  title: string;
  description?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  backgroundClass?: string | null;
  sortOrder: number;
  isActive?: boolean | null;
  mediaId?: string | null;
  mediaUrl?: string | null; // 媒体文件URL
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}

// ==================== 创建首页展示卡片 ====================

/**
 * 创建首页展示卡片请求体
 */
export interface HeroCardCreate {
  title: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundClass?: string;
  sortOrder?: number;
  isActive?: boolean;
  mediaId?: string;
}

/**
 * 创建首页展示卡片响应
 */
export interface HeroCardCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新首页展示卡片 ====================

/**
 * 更新首页展示卡片请求体
 */
export interface HeroCardUpdate {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundClass?: string;
  sortOrder?: number;
  isActive?: boolean;
  mediaId?: string;
}

/**
 * 更新首页展示卡片响应
 */
export interface HeroCardUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface HeroCardBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface HeroCardBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 切换状态 ====================

/**
 * 切换首页展示卡片状态响应
 */
export interface HeroCardToggleStatusResponse {
  id: string;
  isActive: boolean;
  message: string;
}

// ==================== 类型常量 ====================

/**
 * 背景样式类枚举
 */
export const BACKGROUND_CLASSES = {
  BLUE_50: "bg-blue-50",
  GREEN_50: "bg-green-50",
  PURPLE_50: "bg-purple-50",
  PINK_50: "bg-pink-50",
  YELLOW_50: "bg-yellow-50",
  INDIGO_50: "bg-indigo-50",
  RED_50: "bg-red-50",
  GRAY_50: "bg-gray-50",
} as const;

export type BackgroundClass =
  (typeof BACKGROUND_CLASSES)[keyof typeof BACKGROUND_CLASSES];
