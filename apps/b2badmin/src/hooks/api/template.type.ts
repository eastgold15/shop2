/**
 * 属性模板 - 前端接口类型定义
 * 用于后端接口开发参考
 */

// ==================== 列表查询 ====================

/**
 * 模板列表查询参数
 */
export interface TemplateListQuery {
  page?: number;
  limit?: number;
  search?: string;
  masterCategoryId?: string;
  siteCategoryId?: string;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

/**
 * 模板列表响应
 */
export interface TemplateListResponse {
  data: Template[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== 模板字段类型 ====================

/**
 * 模板字段输入类型
 */
export type TemplateFieldInputType =
  | "text"
  | "number"
  | "select"
  | "multiselect";

/**
 * 模板字段定义
 */
export interface TemplateField {
  id: string;
  key: string; // 显示名称 (如: "颜色")
  code: string; // API代码 (如: "color")
  inputType: TemplateFieldInputType;
  value?: string; // 占位符内容
  options?: string[]; // 选项列表 (用于 select/multiselect)
  isRequired: boolean;
  isSkuSpec: boolean; // 是否作为SKU规格
}

// ==================== 模板实体 ====================

/**
 * 模板实体（完整响应）
 */
export interface Template {
  id: string;
  name: string;
  masterCategoryId: string;
  siteCategoryId?: string | null;
  fields: TemplateField[];
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string

  // 关联数据（用于列表显示）
  categoryName?: string; // 主分类名称
}

// ==================== 创建模板 ====================

/**
 * 创建模板请求体
 */
export interface TemplateCreate {
  name: string;
  masterCategoryId: string;
  siteCategoryId?: string | null;
  fields: Array<{
    key: string;
    code: string;
    inputType: TemplateFieldInputType;
    value?: string;
    options?: string[];
    isRequired: boolean;
    isSkuSpec: boolean;
  }>;
}

/**
 * 创建模板响应
 */
export interface TemplateCreateResponse {
  id: string;
  message: string;
}

// ==================== 更新模板 ====================

/**
 * 更新模板请求体
 */
export interface TemplateUpdate {
  name?: string;
  masterCategoryId?: string;
  siteCategoryId?: string | null;
  fields?: Array<{
    id?: string;
    key: string;
    code: string;
    inputType: TemplateFieldInputType;
    value?: string;
    options?: string[];
    isRequired: boolean;
    isSkuSpec: boolean;
  }>;
}

/**
 * 更新模板响应
 */
export interface TemplateUpdateResponse {
  id: string;
  message: string;
}

// ==================== 删除模板 ====================

/**
 * 删除模板响应
 */
export interface TemplateDeleteResponse {
  message: string;
}
