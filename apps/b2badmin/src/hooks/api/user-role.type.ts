/**
 * 用户角色分配 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 用户站点角色列表查询参数
 */
export interface UserSiteRoleListQuery {
  page?: number;
  limit?: number;
  userId?: string;
  siteId?: string;
  roleId?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

/**
 * 用户站点角色列表响应
 */
export interface UserSiteRoleListResponse {
  data: UserSiteRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 用户站点角色实体 ====================

/**
 * 用户站点角色关联实体
 */
export interface UserSiteRole {
  id: string;
  userId: string;
  siteId: string;
  roleId: string;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 关联数据
  user?: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
  site?: {
    id: string;
    name: string;
  };
  role?: {
    id: string;
    name: string;
    type: "system" | "custom";
  };
}

// ==================== 分配用户角色 ====================

/**
 * 分配用户站点角色请求体
 */
export interface AssignUserRoleRequest {
  userId: string;
  siteId: string;
  roleId: string;
}

/**
 * 分配用户站点角色响应
 */
export interface AssignUserRoleResponse {
  id: string;
  message: string;
}

// ==================== 批量分配 ====================

/**
 * 批量分配用户角色请求体
 */
export interface BatchAssignUserRoleRequest {
  assignments: Array<{
    userId: string;
    siteId: string;
    roleId: string;
  }>;
}

/**
 * 批量分配用户角色响应
 */
export interface BatchAssignUserRoleResponse {
  successful: string[];
  failed: Array<{
    userId: string;
    siteId: string;
    error: string;
  }>;
  message: string;
}

// ==================== 取消角色分配 ====================

/**
 * 取消角色分配响应
 */
export interface UnassignUserRoleResponse {
  message: string;
}

// ==================== 用户角色统计 ====================

/**
 * 用户角色统计响应
 */
export interface UserRoleStatsResponse {
  totalAssignments: number;
  assignmentsByRole: Array<{
    roleId: string;
    roleName: string;
    count: number;
  }>;
  assignmentsBySite: Array<{
    siteId: string;
    siteName: string;
    count: number;
  }>;
}

// ==================== 可用选项 ====================

/**
 * 用于下拉选择的角色选项
 */
export interface RoleOption {
  id: string;
  name: string;
  type: "system" | "custom";
}

/**
 * 用于下拉选择的站点选项
 */
export interface SiteOption {
  id: string;
  name: string;
}

/**
 * 用于下拉选择的用户选项
 */
export interface UserOption {
  id: string;
  name: string;
  email: string;
}
