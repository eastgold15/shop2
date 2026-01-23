/**
 * 部门 - 前端接口类型定义
 * 用于后端接口开发参考
 */

export interface DeptListRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  parentId?: string;
  name: string;
  code: string;
  category: string;
  address: string;
  contactPhone: string;
  logo?: any;
  extensions?: Extension;
  isActive: boolean;
}
interface Extension {
  mainProducts: string;
  annualRevenue: string;
  employeeCount: number;
}
/**
 * 部门列表查询参数
 */
export interface DepartmentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
  sortBy?: "createdAt" | "updatedAt" | "name" | "sortOrder";
  sortOrder?: "asc" | "desc";
}

/**
 * 部门列表响应
 */
export interface DepartmentListResponse {
  data: Department[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 部门实体 ====================

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

/**
 * 部门用户关联
 */
export interface DepartmentUser {
  id: string;
  userId: string;
  departmentId: string;
  role?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// ==================== 创建部门 ====================

/**
 * 创建部门请求体
 */
export interface DepartmentCreate {
  name: string;
  code: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 创建部门响应
 */
export interface DepartmentCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新部门 ====================

/**
 * 更新部门请求体
 */
export interface DepartmentUpdate {
  name?: string;
  code?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * 更新部门响应
 */
export interface DepartmentUpdateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface DepartmentBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface DepartmentBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 部门树形结构 ====================

/**
 * 部门树形响应
 */
export interface DepartmentTreeResponse {
  data: Department[];
}

// ==================== 部门选项 ====================

/**
 * 用于下拉选择的部门选项
 */
export interface DepartmentOption {
  id: string;
  name: string;
  code: string;
  parentId?: string | null;
}

/**
 * 部门详情响应
 */

export interface DepartmentDetailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  parentId: string;
  name: string;
  code: string;
  category: string;
  address: string;
  contactPhone: string;
  logo?: any;
  extensions?: any;
  isActive: boolean;
  users: User[];
  manager?: any;
}
interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: any;
  tenantId: string;
  deptId: string;
  phone: string;
  whatsapp?: any;
  position?: any;
  isActive: boolean;
  isSuperAdmin: boolean;
  roles: Role[];
}
interface Role {
  id: string;
  name: string;
  dataScope: string;
  description: string;
  type: string;
  priority: number;
}
