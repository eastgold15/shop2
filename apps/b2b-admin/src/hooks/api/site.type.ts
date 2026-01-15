/**
 * 站点 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 站点列表查询参数
 */
export interface SiteListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name" | "domain";
  sortOrder?: "asc" | "desc";
}

/**
 * 站点列表响应
 */
export interface SiteListResponse {
  data: Site[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 站点实体 ====================

/**
 * 站点实体
 */
export interface Site {
  id: string;
  name: string;
  domain?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 配置
  config?: SiteConfig;
}

/**
 * 站点配置
 */
export interface SiteConfig {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
  };
  features?: {
    enableRegistration?: boolean;
    enableGuestCheckout?: boolean;
    requireApproval?: boolean;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

// ==================== 创建站点 ====================

/**
 * 创建站点请求体
 */
export interface SiteCreate {
  name: string;
  domain?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
  config?: SiteConfig;
}

/**
 * 创建站点响应
 */
export interface SiteCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新站点 ====================

/**
 * 更新站点请求体
 */
export interface SiteUpdate {
  name?: string;
  domain?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
  config?: SiteConfig;
}

/**
 * 更新站点响应
 */
export interface SiteUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface SiteBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface SiteBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 站点选项 ====================

/**
 * 用于下拉选择的站点选项
 */
export interface SiteOption {
  id: string;
  name: string;
  domain?: string;
  isActive: boolean;
}
