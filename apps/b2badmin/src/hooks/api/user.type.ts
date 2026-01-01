/**
 * 用户 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 用户列表查询参数
 */
export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  role?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
}

/**
 * 用户列表响应
 */
export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 用户实体 ====================

/**
 * 用户实体
 */
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 扩展字段（可能为null）
  phone?: string | null;
  avatar?: string | null;

  // 关联数据
  roles?: UserRole[];
  siteRoles?: UserSiteRole[];
}

/**
 * 用户角色关联（简化）
 */
export interface UserRole {
  id: string;
  role: {
    id: string;
    name: string;
    type: string;
  };
}

/**
 * 站点角色关联（简化）
 */
export interface UserSiteRole {
  id: string;
  site: {
    id: string;
    name: string;
  };
  role: {
    id: string;
    name: string;
    type: string;
  };
}

// ==================== 创建用户 ====================

/**
 * 创建用户请求体
 */
export interface UserCreate {
  name: string;
  email: string;
  password: string;
  phone?: string;
  isActive?: boolean;
}

/**
 * 创建用户响应
 */
export interface UserCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新用户 ====================

/**
 * 更新用户请求体
 */
export interface UserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

/**
 * 更新用户响应
 */
export interface UserUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface UserBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface UserBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 重置密码 ====================

/**
 * 重置密码请求体
 */
export interface UserResetPasswordRequest {
  userId: string;
  newPassword: string;
}

/**
 * 重置密码响应
 */
export interface UserResetPasswordResponse {
  message: string;
}
