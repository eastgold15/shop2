/**
 * 用户 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================
export interface MeRes {
  user: UserInfo;
  switchableDept: SwitchableDept;
}

export interface DeptInfo {
  id: string;
  name: string;
  site: Site;
  category: string;
  parentId: string;
}
interface Site {
  id: string;
  name: string;
  domain: string;
  siteType: string;
}
interface SwitchableDept {
  current: DeptInfo;
  switchableDepartments: DeptInfo[];
}
export interface UserListRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  tenantId: string;
  deptId: string;
  phone: string;
  whatsapp?: any;
  position: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  roles: Role[];
  department: Department;
}
interface Department {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  parentId?: any;
  name: string;
  code: string;
  category: string;
  address: string;
  contactPhone: string;
  logo?: any;
  extensions?: any;
  isActive: boolean;
}
interface Role {
  id: string;
  name: string;
  dataScope: string;
  description: string;
  type: string;
  priority: number;
}
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  position: string;
  isSuperAdmin: boolean;
  context: Context;
  roles: SimpleRole[];
  permissions: string[];
}
interface SimpleRole {
  name: string;
  dataScope: string;
}
interface Context {
  tenantId: string;
  department: SimpleDepartment;
  site: Site;
}

interface SimpleDepartment {
  id: string;
  name: string;
  category: string;
  parentId?: string;
}

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
  data: UserInfo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 用户实体 ====================

// /**
//  * 用户实体
//  */
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   isActive: boolean;
//   isSuperAdmin?: boolean;
//   createdAt: string; // ISO 8601 datetime string
//   updatedAt: string; // ISO 8601 datetime string

//   // 扩展字段（可能为null）
//   phone?: string | null;
//   avatar?: string | null;

//   // 关联数据
//   roles?: UserRole[];
//   siteRoles?: UserSiteRole[];
// }

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
