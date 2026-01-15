/**
 * 1. 定义所有资源基础名称 (与后端 API 保持一致)
 */
export const PERMISSION_RESOURCES = [
  "TENANT",
  "DEPARTMENT",
  "USER",
  "ACCOUNT",
  "SESSION",
  "VERIFICATION",
  "ROLE",
  "PERMISSION",
  "ROLE_PERMISSION",
  "USER_SITE_ROLE",
  "EXPORTER",
  "MASTER_CATEGORY",
  "FACTORY",
  "SALESPERSON",
  "SALESPERSON_AFFILIATION",
  "SALESPERSON_CATEGORY",
  "SITE",
  "SITE_CATEGORY",
  "SITE_PRODUCT",
  "SITE_CONFIG",
  "PRODUCT",
  "PRODUCT_MASTER_CATEGORY",
  "PRODUCT_SITE_CATEGORY",
  "PRODUCT_MEDIA",
  "PRODUCT_TEMPLATE",
  "TEMPLATE",
  "TEMPLATE_KEY",
  "TEMPLATE_VALUE",
  "SKU",
  "SKU_MEDIA",
  "MEDIA",
  "MEDIA_METADATA",
  "AD",
  "HERO_CARD",
  "CUSTOMER",
  "INQUIRY",
  "QUOTATION",
  "DAILY_INQUIRY_COUNTER",
] as const; // 使用 as const 锁定字面量

/**
 * 2. 定义标准操作
 */
export type PermissionAction = "VIEW" | "CREATE" | "EDIT" | "DELETE";

/**
 * 3. 组合生成 PermissionType
 * 这行代码会自动生成类似 "USERS_VIEW" | "USERS_CREATE" ... 的联合类型
 */
type CRUDPermissions =
  `${(typeof PERMISSION_RESOURCES)[number]}_${PermissionAction}`;

/**
 * 4. 加上特殊的非标准权限
 */
export type ExtraPermissions = "SITES_MANAGE" | "TENANTS_MANAGE";

/**
 * 最终导出的权限类型
 */
export type PermissionType = CRUDPermissions | ExtraPermissions;

/**
 * 5. (可选) 导出权限常量对象，方便在代码中直接引用而非写字符串
 * 这样写：PERMISSIONS.USER_VIEW 而不是 "USER_VIEW"
 */
export const PERMISSIONS = [
  ...PERMISSION_RESOURCES.flatMap((res) => [
    `${res}_VIEW`,
    `${res}_CREATE`,
    `${res}_EDIT`,
    `${res}_DELETE`,
  ]),
  "SITES_MANAGE",
  "TENANTS_MANAGE",
].reduce(
  (acc, curr) => {
    acc[curr as PermissionType] = curr as PermissionType;
    return acc;
  },
  {} as Record<PermissionType, PermissionType>
);
