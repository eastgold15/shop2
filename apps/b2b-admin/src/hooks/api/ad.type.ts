/**
 * 广告管理 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 广告列表查询参数
 */
export interface AdListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  type?: "banner" | "carousel" | "list";
  position?: "home-top" | "home-middle" | "sidebar";
  startDate?: string;
  endDate?: string;
}

/**
 * 广告列表响应
 */

export interface AdListRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  type: string;
  mediaId: string;
  link: string;
  position?: string;
  sortOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  tenantId: string;
  deptId: string;
  createdBy: string;
  isPublic: boolean;
  siteId: string;
  media: Media;
  mediaUrl: string;
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

// ==================== 广告实体 ====================

/**
 * 广告实体
 */
export interface Ad {
  id: string;
  title: string;
  description: string;
  type: "banner" | "carousel" | "list";
  link: string;
  position: "home-top" | "home-middle" | "sidebar";
  startDate: string; // ISO 8601 datetime string
  endDate: string; // ISO 8601 datetime string
  sortOrder: number;
  isActive: boolean;
  mediaId: string;
  mediaUrl?: string | null; // 媒体文件URL
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}

// ==================== 创建广告 ====================

/**
 * 创建广告请求体
 */
export interface AdCreate {
  title: string;
  description: string;
  type: "banner" | "carousel" | "list";
  link: string;
  position: "home-top" | "home-middle" | "sidebar";
  startDate: string; // ISO 8601 datetime string
  endDate: string; // ISO 8601 datetime string
  sortOrder?: number;
  isActive?: boolean;
  mediaId: string;
}

/**
 * 创建广告响应
 */
export interface AdCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新广告 ====================

/**
 * 更新广告请求体
 */
export interface AdUpdate {
  title?: string;
  description?: string;
  type?: "banner" | "carousel" | "list";
  link?: string;
  position?: "home-top" | "home-middle" | "sidebar";
  startDate?: string; // ISO 8601 datetime string
  endDate?: string; // ISO 8601 datetime string
  sortOrder?: number;
  isActive?: boolean;
  mediaId?: string;
}

/**
 * 更新广告响应
 */
export interface AdUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface AdBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface AdBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 切换状态 ====================

/**
 * 切换广告状态响应
 */
export interface AdToggleStatusResponse {
  id: string;
  isActive: boolean;
  message: string;
}

// ==================== 类型常量 ====================

/**
 * 广告类型枚举
 */
export const AD_TYPES = {
  BANNER: "banner",
  CAROUSEL: "carousel",
  LIST: "list",
} as const;

export type AdType = (typeof AD_TYPES)[keyof typeof AD_TYPES];

/**
 * 广告位置枚举
 */
export const AD_POSITIONS = {
  HOME_TOP: "home-top",
  HOME_MIDDLE: "home-middle",
  SIDEBAR: "sidebar",
} as const;

export type AdPosition = (typeof AD_POSITIONS)[keyof typeof AD_POSITIONS];
