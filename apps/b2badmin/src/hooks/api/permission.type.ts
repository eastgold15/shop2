/**
 * 权限 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 权限列表查询参数
 */
export interface PermissionListQuery {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "module";
  sortOrder?: "asc" | "desc";
}

/**
 * 权限列表响应
 */
export interface PermissionListResponse {
  data: Permission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 权限实体 ====================

/**
 * 权限实体
 */
export interface Permission {
  id: string;
  name: string; // 格式: MODULE_ACTION (如: PRODUCT_VIEW, USER_MANAGE)
  code: string;
  module: string; // 模块: USER, PRODUCT, SKU, ORDER, SITE, MEDIA, AD, etc.
  description?: string | null;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}

// ==================== 创建权限 ====================

/**
 * 创建权限请求体
 */
export interface PermissionCreate {
  name: string;
  code: string;
  module: string;
  description?: string;
}

/**
 * 创建权限响应
 */
export interface PermissionCreateResponse {
  id: string;
  message: string;
}

// ==================== 批量删除 ====================

/**
 * 批量删除请求体
 */
export interface PermissionBatchDeleteRequest {
  ids: string[];
}

/**
 * 批量删除响应
 */
export interface PermissionBatchDeleteResponse {
  deletedCount: number;
  message: string;
}

// ==================== 权限模块枚举 ====================

/**
 * 权限模块枚举
 */
export const PERMISSION_MODULES = {
  USER: "USER",
  PRODUCT: "PRODUCT",
  SKU: "SKU",
  ORDER: "ORDER",
  SITE: "SITE",
  MEDIA: "MEDIA",
  ADVERTISEMENT: "ADVERTISEMENT",
  FACTORY: "FACTORY",
  EXPORTER: "EXPORTER",
  SYSTEM: "SYSTEM",
  CATEGORY: "CATEGORY",
  TEMPLATE: "TEMPLATE",
  INQUIRY: "INQUIRY",
  QUOTATION: "QUOTATION",
} as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[keyof typeof PERMISSION_MODULES];

// ==================== 权限操作枚举 ====================

/**
 * 权限操作枚举
 */
export const PERMISSION_ACTIONS = {
  VIEW: "VIEW",
  CREATE: "CREATE",
  EDIT: "EDIT",
  DELETE: "DELETE",
  MANAGE: "MANAGE",
  EXPORT: "EXPORT",
  IMPORT: "IMPORT",
  APPROVE: "APPROVE",
} as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

// ==================== 权限分组 ====================

/**
 * 权限分组显示名称
 */
export const PERMISSION_GROUP_NAMES: Record<string, string> = {
  USER: "用户管理",
  PRODUCT: "商品管理",
  SKU: "SKU管理",
  ORDER: "订单管理",
  SITE: "站点管理",
  MEDIA: "媒体管理",
  ADVERTISEMENT: "广告管理",
  FACTORY: "工厂管理",
  EXPORTER: "出口商管理",
  SYSTEM: "系统管理",
  CATEGORY: "分类管理",
  TEMPLATE: "模板管理",
  INQUIRY: "询价管理",
  QUOTATION: "报价管理",
};

/**
 * 权限操作显示名称
 */
export const PERMISSION_ACTION_NAMES: Record<string, string> = {
  VIEW: "查看",
  CREATE: "创建",
  EDIT: "编辑",
  DELETE: "删除",
  MANAGE: "管理",
  EXPORT: "导出",
  IMPORT: "导入",
  APPROVE: "审批",
};
