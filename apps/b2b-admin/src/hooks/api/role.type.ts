/**
 * 角色 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================
export interface RoleListRes {
  id: string;
  name: string;
  dataScope: string;
  description: string;
  type: string;
  priority: number;
}

export interface RoleDetailRes {
  id: string;
  name: string;
  dataScope: string;
  description: string;
  type: string;
  priority: number;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}
/**
 * 角色列表查询参数
 */
export interface RoleListQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: "system" | "custom";
  sortBy?: "createdAt" | "updatedAt" | "name" | "priority";
  sortOrder?: "asc" | "desc";
}

/**
 * 角色列表响应
 */
export interface RoleListResponse {
  data: Role[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 角色实体 ====================

/**
 * 角色实体
 */
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  type: "system" | "custom";
  priority: number; // 优先级，数字越大优先级越高
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 关联数据
  permissions?: RolePermission[];
}

/**
 * 角色权限关联
 */
export interface RolePermission {
  id: string;
  permission: {
    id: string;
    name: string;
    code: string;
    module: string;
  };
}

// ==================== 创建角色 ====================

/**
 * 创建角色请求体
 */
export interface RoleCreate {
  name: string;
  code: string;
  description?: string;
  type?: "system" | "custom";
  priority?: number;
  permissionIds?: string[];
}

/**
 * 创建角色响应
 */
export interface RoleCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新角色 ====================

/**
 * 更新角色请求体
 */
export interface RoleUpdate {
  name?: string;
  code?: string;
  description?: string;
  type?: "system" | "custom";
  priority?: number;
}

/**
 * 更新角色响应
 */
export interface RoleUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface RoleBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface RoleBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 角色权限管理 ====================

/**
 * 设置角色权限请求体
 */
export interface RoleSetPermissionsRequest {
  permissionIds: string[];
}

/**
 * 设置角色权限响应
 */
export interface RoleSetPermissionsResponse {
  message: string;
}

// ==================== 权限列表 ====================

/**
 * 权限列表响应（用于角色分配）
 */
export interface PermissionListResponse {
  data: Permission[];
}

// ==================== 角色类型常量 ====================

/**
 * 角色类型枚举
 */
export const ROLE_TYPES = {
  SYSTEM: "system",
  CUSTOM: "custom",
} as const;

export type RoleType = (typeof ROLE_TYPES)[keyof typeof ROLE_TYPES];

/**
 * 系统预设角色代码
 */
export const SYSTEM_ROLE_CODES = {
  SUPER_ADMIN: "super_admin",
  EXPORTER_ADMIN: "exporter_admin",
  FACTORY_ADMIN: "factory_admin",
  STAFF: "staff",
} as const;
