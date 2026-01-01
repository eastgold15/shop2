/**
 * API 类型统一导出
 * 集中导出所有 API 相关的类型定义
 *
 * 注意：为了避免类型冲突，某些类型使用了命名空间
 */

// ==================== 无冲突的类型 ====================

// 广告相关类型
export type * from "./ad.type";

// 属性模板相关类型
export type * from "./attributetemplate";

// 工厂相关类型
export type * from "./factory.type";

// 首页卡片相关类型
export type * from "./herocard.type";

// 主分类相关类型
export type * from "./mastercategory.type";

// 媒体相关类型
export type * from "./media.type";

// 产品相关类型
export type * from "./product.type";

// 站点分类相关类型
export type * from "./sitecategory.type";

// SKU相关类型
export type * from "./sku.type";

// 模板相关类型
export type * from "./template.type";

// ==================== 有冲突的类型（需要指定来源） ====================

// 部门相关类型
export type {
  DepartmentListQuery,
  DepartmentListResponse,
  DepartmentUser,
  DepartmentCreate,
  DepartmentCreateResponse,
  DepartmentUpdate,
  DepartmentUpdateResponse,
  DepartmentBatchDeleteRequest,
  DepartmentBatchDeleteResponse,
  DepartmentTreeResponse,
  DepartmentOption,
} from "./department.type";

// 重新导出 Department 类型（添加别名避免冲突）
export type { Department as DepartmentEntity } from "./department.type";

// 权限相关类型
export type {
  PermissionListQuery,
  PermissionCreate,
  PermissionCreateResponse,
  PermissionBatchDeleteRequest,
  PermissionBatchDeleteResponse,
  PermissionModule,
  PermissionAction,
} from "./permission.type";

// 重新导出 Permission 和 PermissionListResponse（添加别名避免冲突）
export type {
  Permission as PermissionEntity,
  PermissionListResponse as PermissionListResponseEntity,
} from "./permission.type";

// 角色相关类型
export type {
  RoleListQuery,
  RolePermission,
  RoleCreate,
  RoleCreateResponse,
  RoleUpdate,
  RoleUpdateResponse,
  RoleBatchDeleteRequest,
  RoleBatchDeleteResponse,
  RoleSetPermissionsRequest,
  RoleSetPermissionsResponse,
  RoleType,
} from "./role.type";

// 重新导出 Role 类型（添加别名避免冲突）
export type { Role as RoleEntity } from "./role.type";

// 站点相关类型
export type {
  SiteListQuery,
  SiteListResponse,
  SiteCreate,
  SiteCreateResponse,
  SiteUpdate,
  SiteUpdateResponse,
  SiteBatchDeleteRequest,
  SiteBatchDeleteResponse,
} from "./site.type";

// 重新导出 Site 和 SiteOption 类型（添加别名避免冲突）
export type {
  Site as SiteEntity,
  SiteOption as SiteOptionEntity,
} from "./site.type";

// 用户相关类型
export type {
  UserListQuery,
  UserListResponse,
  UserCreate,
  UserCreateResponse,
  UserUpdate,
  UserUpdateResponse,
  UserBatchDeleteRequest,
  UserBatchDeleteResponse,
} from "./user.type";

// 重新导出 User, Department, Role, UserSiteRole, SwitchableDept 类型（添加别名避免冲突）
export type {
  User as UserEntity,
  Department as UserDepartment,
  Role as UserRole,
  UserSiteRole as UserSiteRoleEntity,
  SwitchableDept,
} from "./user.type";

// 用户角色相关类型
export type {
  UserSiteRoleListQuery,
  UserSiteRoleListResponse,
  AssignUserRoleRequest,
  AssignUserRoleResponse,
  RoleOption,
} from "./userrole.type";

// 重新导出 UserSiteRole 和 SiteOption 类型（添加别名避免冲突）
export type {
  UserSiteRole as UserSiteRoleRelation,
  SiteOption as SiteOptionRelation,
} from "./userrole.type";
