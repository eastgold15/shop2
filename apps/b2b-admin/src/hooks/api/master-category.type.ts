/**
 * 主分类 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 主分类列表查询参数
 */
export interface MasterCategoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
  sortBy?: "sortOrder" | "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}
export interface MasterCategoryList {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: any;
  sortOrder: number;
  isActive: boolean;
  icon: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
}
/**
 * 主分类列表响应
 */
export interface MasterCategoryListResponse {
  data: MasterCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 树形结构 ====================

/**
 * 主分类树形节点（带children）
 */
export interface MasterCategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: MasterCategoryTree[];
}

// ==================== 主分类实体 ====================

/**
 * 主分类实体
 */
export interface MasterCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}

// ==================== 创建主分类 ====================

/**
 * 创建主分类请求体
 */
export interface MasterCategoryCreate {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 创建主分类响应
 */
export interface MasterCategoryCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新主分类 ====================

/**
 * 更新主分类请求体
 */
export interface MasterCategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 更新主分类响应
 */
export interface MasterCategoryUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface MasterCategoryBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface MasterCategoryBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 树形结构查询 ====================

/**
 * 主分类树形响应
 */
export interface MasterCategoryTreeResponse {
  data: MasterCategoryTree[];
}

// ==================== 工具类型 ====================

/**
 * 分类选项（用于选择器）
 */
export interface MasterCategoryOption {
  value: string;
  label: string;
  level: number;
  parentId?: string | null;
}
