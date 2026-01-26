/**
 * 模板相关类型定义
 */

/**
 * 模板选项类型
 */
export interface TemplateOption {
  id?: string;
  value: string;
}

/**
 * 模板字段类型
 */
export interface TemplateField {
  id?: string;
  key: string;
  inputType: "text" | "number" | "select" | "multiselect";
  isRequired: boolean;
  isSkuSpec: boolean;
  value: string;
  options: TemplateOption[];
}

/**
 * 完整的模板类型（用于编辑）
 */
export interface Template {
  id: string;
  name: string;
  masterCategoryId: string;
  fields: TemplateField[];
}

/**
 * 模板表单数据类型
 */
export interface TemplateFormData {
  name: string;
  masterCategoryId: string;
  fields: TemplateField[];
}
