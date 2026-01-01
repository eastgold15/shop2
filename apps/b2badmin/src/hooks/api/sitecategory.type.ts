/**
 * 站点分类 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 站点分类列表查询参数
 */
export interface SiteCategoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
  siteId?: string;
  sortBy?: "sortOrder" | "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

/**
 * 站点分类列表响应
 */
export interface SiteCategoryListResponse {
  data: SiteCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 树形结构 ====================

/**
 * 站点分类树形节点（带children）
 */
export interface SiteCategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  masterCategoryId?: string | null;
  sortOrder: number;
  isActive: boolean;
  siteId?: string;
  createdAt: string;
  updatedAt: string;
  children?: SiteCategoryTree[];
}

// ==================== 站点分类实体 ====================

/**
 * 站点分类实体
 */
export interface SiteCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  masterCategoryId?: string | null;
  sortOrder: number;
  isActive: boolean;
  siteId?: string;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}

// ==================== 创建站点分类 ====================

/**
 * 创建站点分类请求体
 */
export interface SiteCategoryCreate {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  masterCategoryId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 创建站点分类响应
 */
export interface SiteCategoryCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新站点分类 ====================

/**
 * 更新站点分类请求体
 */
export interface SiteCategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  masterCategoryId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 更新站点分类响应
 */
export interface SiteCategoryUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface SiteCategoryBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface SiteCategoryBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 树形结构查询 ====================

/**
 * 站点分类树形响应
 */
export interface SiteCategoryTreeResponse {
  data: SiteCategoryTree[];
}

// ==================== 工具类型 ====================

/**
 * 分类选项（用于选择器）
 */
export interface SiteCategoryOption {
  value: string;
  label: string;
  level: number;
  parentId?: string | null;
}
