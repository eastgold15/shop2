/**
 * 工厂 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 工厂列表查询参数
 */
export interface FactoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name" | "code";
  sortOrder?: "asc" | "desc";
}

/**
 * 工厂列表响应
 */
export interface FactoryListResponse {
  data: Factory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 工厂实体 ====================

/**
 * 工厂实体
 */
export interface Factory {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  website?: string | null;
  isActive: boolean;
  isVerified: boolean;
  exporterId: string;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 关联数据
  exporter?: {
    id: string;
    name: string;
  };
  users?: FactoryUser[];
}

/**
 * 工厂用户关联
 */
export interface FactoryUser {
  id: string;
  userId: string;
  factoryId: string;
  role: "admin" | "staff";
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// ==================== 创建工厂 ====================

/**
 * 创建工厂请求体
 */
export interface FactoryCreate {
  name: string;
  code: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  website?: string;
  isActive?: boolean;
  exporterId: string;
}

/**
 * 创建工厂响应
 */
export interface FactoryCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新工厂 ====================

/**
 * 更新工厂请求体
 */
export interface FactoryUpdate {
  name?: string;
  code?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  website?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

/**
 * 更新工厂响应
 */
export interface FactoryUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface FactoryBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface FactoryBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 工厂用户管理 ====================

/**
 * 添加工厂用户请求体
 */
export interface AddFactoryUserRequest {
  userId: string;
  role: "admin" | "staff";
}

/**
 * 添加工厂用户响应
 */
export interface AddFactoryUserResponse {
  id: string;
  message: string;
}

/**
 * 移除工厂用户响应
 */
export interface RemoveFactoryUserResponse {
  message: string;
}
