# 项目命名规范文档

> **目标**: 实现从数据库到前端的自动化代码生成

## 📋 目录

1. [数据库层](#1-数据库层)
2. [契约层 (Contract)](#2-契约层-contract)
3. [服务层 (Service)](#3-服务层-service)
4. [控制器层 (Controller)](#4-控制器层-controller)
5. [前端 API Hooks](#5-前端-api-hooks)
6. [权限命名](#6-权限命名)
7. [完整示例](#7-完整示例)

---

## 1. 数据库层

### 1.1 表名规范

**规则**: `模块_实体名` (全小写 + 下划线 + **单数**)

| 业务模块 | 表名示例 | 说明 |
|---------|---------|------|
| 系统模块 | `sys_tenant` | 系统租户表 |
| 系统模块 | `sys_dept` | 系统部门表 |
| 站点模块 | `site` | 站点表 |
| 站点模块 | `site_category` | 站点分类表 |
| 产品模块 | `product` | 产品表 |
| 产品模块 | `product_site_category` | 产品站点分类关联表 |
| 媒体模块 | `media` | 媒体表 |
| 用户模块 | `user_site_role` | 用户站点角色关联表 |

**注意事项**:
- ✅ 使用 **单数** 形式: `site` ❌ `sites`
- ✅ 全小写 + 下划线分隔: `site_category` ❌ `SiteCategory`
- ✅ 关联表: `父表_子表` 如 `product_media`
- ✅ 系统表加 `sys_` 前缀

### 1.2 Drizzle Schema 定义

**文件**: `packages/contract/src/table.schema.ts`

**变量命名**: `{实体名}Table` (驼峰式 + Table 后缀)

```typescript
// ✅ 正确示例
export const tenantTable = p.pgTable("sys_tenant", { ... });
export const siteTable = p.pgTable("site", { ... });
export const siteCategoryTable = p.pgTable("site_category", { ... });
export const productTable = p.pgTable("product", { ... });
export const productSiteCategoryTable = p.pgTable("product_site_category", { ... });

// ❌ 错误示例
export const SitesTable = p.pgTable("sites", { ... }); // ❌ 复数
export const site_categoryTable = p.pgTable("site_category", { ... }); // ❌ 下划线变量名
```

### 1.3 字段命名规范

**规则**: `snake_case` (全小写 + 下划线)

```typescript
export const siteCategoryTable = p.pgTable("site_category", {
  id: idUuid,
  name: p.varchar("name", { length: 200 }).notNull(),
  parent_id: p.uuid("parent_id"), // ✅ snake_case
  sort_order: p.integer("sort_order").default(0),
  is_active: p.boolean("is_active").default(true),
  created_at: createdAt,
  updated_at: updatedAt,
});
```

**特殊字段**:
- 主键: `id` (uuid)
- 外键: `{实体}_id` 如 `parent_id`, `site_id`, `user_id`
- 时间戳: `created_at`, `updated_at`
- 布尔值: `is_{形容词}` 如 `is_active`, `is_public`

---

## 2. 契约层 (Contract)

### 2.1 文件命名

**规则**: `{实体名}.contract.ts` (全小写 + kebab-case)

**位置**: `packages/contract/src/modules/`

```
packages/contract/src/modules/
├── tenant.contract.ts
├── department.contract.ts
├── site.contract.ts
├── site-category.contract.ts  ❌ 不用下划线
├── sitecategory.contract.ts    ✅ 正确 (合并为一个词)
├── product.contract.ts
├── product-media.contract.ts   ✅ 关联表用连字符
├── user.contract.ts
└── user-role.contract.ts
```

**转换规则**:
- 数据库 `site_category` → 文件名 `sitecategory.contract.ts` (去掉下划线)
- 数据库 `product_media` → 文件名 `productmedia.contract.ts` (去掉下划线)

### 2.2 契约导出命名

```typescript
// sitecategory.contract.ts
export const SiteCategoryContract = {
  Response: t.Object({ ... }),
  Create: t.Object({ ... }),
  Update: t.Partial(t.Object({ ... })),
  ListQuery: t.Object({ ... }),
  ListResponse: t.Object({ ... }),
  // 自定义扩展
  TreeResponse: t.Object({ ... }),
  MoveRequest: t.Object({ ... }),
} as const;

export type SiteCategoryContract = InferDTO<typeof SiteCategoryContract>;
```

**命名模式**: `{实体名}Contract` (PascalCase + Contract 后缀)

### 2.3 类型导出

```typescript
// 自动生成的基础类型
export type SiteCategoryResponse = SiteCategoryContract["Response"];
export type SiteCategoryCreate = SiteCategoryContract["Create"];
export type SiteCategoryUpdate = SiteCategoryContract["Update"];
export type SiteCategoryListQuery = SiteCategoryContract["ListQuery"];
export type SiteCategoryListResponse = SiteCategoryContract["ListResponse"];

// 自定义扩展类型
export type SiteCategoryTreeResponse = SiteCategoryContract["TreeResponse"];
export type SiteCategoryMoveRequest = SiteCategoryContract["MoveRequest"];
```

---

## 3. 服务层 (Service)

### 3.1 文件命名

**规则**: `{实体名}.service.ts` (全小写，对应表名去掉下划线)

**位置**: `apps/api/src/services/`

```
apps/api/src/services/
├── tenant.service.ts
├── department.service.ts
├── site.service.ts
├── sitecategory.service.ts      // site_category → sitecategory
├── product.service.ts
├── productmedia.service.ts      // product_media → productmedia
└── userrole.service.ts          // user_site_role → usersiterole
```

### 3.2 类命名

```typescript
export class SiteCategoryService {
  async findAll(query, ctx) { ... }
  async findOne(id, ctx) { ... }
  async create(body, ctx) { ... }
  async update(id, body, ctx) { ... }
  async delete(id, ctx) { ... }

  // 自定义业务方法
  async getTree(ctx) { ... }
  async moveCategory(id, newParentId, ctx) { ... }
  async toggleStatus(id, ctx) { ... }
}
```

**命名模式**: `{实体名}Service` (PascalCase + Service 后缀)

### 3.3 标准方法签名

```typescript
class XxxService {
  // 列表查询
  async findAll(
    query: XxxContract["ListQuery"],
    ctx: ServiceContext
  ): Promise<XxxContract["ListResponse"]> { ... }

  // 创建
  async create(
    body: XxxContract["Create"],
    ctx: ServiceContext
  ): Promise<XxxContract["Response"]> { ... }

  // 更新
  async update(
    id: string,
    body: XxxContract["Update"],
    ctx: ServiceContext
  ): Promise<XxxContract["Response"]> { ... }

  // 删除
  async delete(
    id: string,
    ctx: ServiceContext
  ): Promise<XxxContract["Response"]> { ... }

  // 自定义方法命名: 动词 + 名词
  async get{扩展名}(ctx) { ... }           // GET /xxx/{扩展名}
  async {动作}{名词}(id, params, ctx) { ... }  // PATCH /xxx/:id/{动作}
}
```

---

## 4. 控制器层 (Controller)

### 4.1 文件命名

**规则**: `{实体名}.controller.ts`

**位置**: `apps/api/src/controllers/`

```
apps/api/src/controllers/
├── tenant.controller.ts
├── department.controller.ts
├── site.controller.ts
├── sitecategory.controller.ts
└── user.controller.ts
```

### 4.2 路由命名

```typescript
export const sitecategoryController = new Elysia({
  prefix: "/sitecategory",  // ✅ 全小写，对应表名(去掉下划线)
  tags: ["SiteCategory"],   // ✅ PascalCase，用于 API 文档分组
})
  .get("/", ...)           // GET /sitecategory
  .post("/", ...)          // POST /sitecategory
  .put("/:id", ...)        // PUT /sitecategory/:id
  .delete("/:id", ...)     // DELETE /sitecategory/:id
```

**prefix 规则**: `/实体名` (全小写，去掉下划线)

| 数据库表 | prefix | 示例路由 |
|---------|--------|---------|
| `site` | `/site` | `GET /site` |
| `site_category` | `/sitecategory` | `GET /sitecategory` |
| `product_media` | `/productmedia` | `GET /productmedia` |
| `user_site_role` | `/usersiterole` | `GET /usersiterole` |

### 4.3 控制器变量命名

```typescript
// ✅ 正确
export const sitecategoryController = new Elysia({ prefix: "/sitecategory" })
export const userController = new Elysia({ prefix: "/user" })
export const productmediaController = new Elysia({ prefix: "/productmedia" })

// ❌ 错误
export const siteCategoryController = ...  // ❌ 不要大写
export const site_categoriesController = ... // ❌ 不要用下划线
```

**命名模式**: `{实体名}controller` (全小写)

### 4.4 路由定义

```typescript
export const sitecategoryController = new Elysia({ prefix: "/sitecategory" })
  .use(dbPlugin)
  .use(authGuardMid)
  // 基础 CRUD
  .get("/", ({ query, user, db, currentDeptId }) =>
    sitecategoryService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["SITECATEGORY_VIEW"],  // 权限常量
      query: SiteCategoryContract.ListQuery,
      detail: {
        summary: "获取站点分类列表",
        description: "分页查询站点分类数据，支持搜索和排序",
        tags: ["SiteCategory"],
      },
    }
  )
  .post("/", ({ body, user, db, currentDeptId }) =>
    sitecategoryService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["SITECATEGORY_CREATE"],
      body: SiteCategoryContract.Create,
      detail: {
        summary: "创建站点分类",
        tags: ["SiteCategory"],
      },
    }
  )
  // 自定义路由
  .get("/tree", ({ user, db, currentDeptId }) =>
    sitecategoryService.getTree({ db, user, currentDeptId }),
    {
      allPermissions: ["SITECATEGORY_VIEW"],
      detail: {
        summary: "获取站点分类树形结构",
        tags: ["SiteCategory"],
      },
    }
  )
  .patch("/:id/move", ({ params, body, user, db, currentDeptId }) =>
    sitecategoryService.moveCategory(params.id, body.newParentId, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({ newParentId: t.Optional(t.String()) }),
      allPermissions: ["SITECATEGORY_EDIT"],
      detail: {
        summary: "移动站点分类",
        tags: ["SiteCategory"],
      },
    }
  );
```

---

## 5. 前端 API Hooks

### 5.1 文件命名

**规则**: `{实体名}.ts` (全小写，对应后端路由)

**位置**: `apps/b2badmin/src/hooks/api/`

```
apps/b2badmin/src/hooks/api/
├── tenant.ts
├── department.ts
├── site.ts
├── sitecategory.ts           // /sitecategory 路由
├── product.ts
├── productmedia.ts           // /productmedia 路由
└── userrole.ts               // /usersiterole 路由
```

### 5.2 类型文件 (可选)

**规则**: `{实体名}.type.ts` (用于前端自定义类型)

```
apps/b2badmin/src/hooks/api/
├── sitecategory.ts
├── sitecategory.type.ts      // 前端扩展类型
├── user.ts
└── user.type.ts              // 前端扩展类型
```

### 5.3 Hook 命名规范

```typescript
// Query Hooks (获取数据)
export function useSiteCategoryList(
  params?: typeof SiteCategoryContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: ["sitecategory", "list", params],
    queryFn: () => api.get<SiteCategoryListResponse>("/api/v1/sitecategory", params),
    enabled,
  });
}

export function useSiteCategoryTree(enabled = true) {
  return useQuery({
    queryKey: ["sitecategory", "tree"],
    queryFn: () => api.get<SiteCategoryTreeResponse>("/api/v1/sitecategory/tree"),
    enabled,
  });
}

// Mutation Hooks (修改数据)
export function useCreateSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SiteCategoryCreate) =>
      api.post<SiteCategoryResponse>("/api/v1/sitecategory", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitecategory"] });
    },
  });
}

export function useUpdateSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SiteCategoryUpdate }) =>
      api.put<SiteCategoryResponse>(`/api/v1/sitecategory/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitecategory"] });
    },
  });
}

export function useDeleteSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<SiteCategoryResponse>(`/api/v1/sitecategory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitecategory"] });
    },
  });
}

// 自定义业务 Hooks
export function useMoveSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newParentId }: { id: string; newParentId?: string }) =>
      api.patch(`/api/v1/sitecategory/${id}/move`, { newParentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitecategory"] });
    },
  });
}

export function useToggleSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/v1/sitecategory/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitecategory"] });
    },
  });
}
```

**命名模式**:
- Query: `use{实体名}{操作}` 如 `useSiteCategoryList`, `useSiteCategoryTree`
- Mutation: `use{动词}{实体名}` 如 `useCreateSiteCategory`, `useUpdateSiteCategory`

**动词对照表**:

| 操作 | Query Hook | Mutation Hook |
|-----|-----------|--------------|
| 列表 | `use{Entity}List` | - |
| 详情 | `use{Entity}` / `use{Entity}Detail` | - |
| 创建 | - | `useCreate{Entity}` |
| 更新 | - | `useUpdate{Entity}` |
| 删除 | - | `useDelete{Entity}` |
| 批量删除 | - | `useBatchDelete{Entities}` |
| 自定义 | `use{Entity}{Custom}` | `use{Custom}{Entity}` |

### 5.4 Query Key 规范

```typescript
// ✅ 标准格式
["{entity}", "{action}", params?]

// 示例
["sitecategory", "list", { page: 1 }]
["sitecategory", "tree"]
["user", "detail", "123"]
["product", "search", { keyword: "phone" }]
```

---

## 6. 权限命名

### 6.1 权限常量格式

**规则**: `{模块}_{操作}` (全大写 + 下划线)

```typescript
export const PERMISSIONS = {
  // 基础 CRUD
  SITECATEGORY_VIEW: "SITECATEGORY_VIEW",
  SITECATEGORY_CREATE: "SITECATEGORY_CREATE",
  SITECATEGORY_EDIT: "SITECATEGORY_EDIT",
  SITECATEGORY_DELETE: "SITECATEGORY_DELETE",

  // 特殊权限
  SITES_MANAGE: "SITES_MANAGE",
  TENANTS_MANAGE: "TENANTS_MANAGE",
  SUPER: "*",
} as const;
```

### 6.2 模块映射

| 数据库表 | 模块前缀 | 示例权限 |
|---------|---------|---------|
| `site` | `SITE` | `SITE_VIEW`, `SITE_CREATE` |
| `site_category` | `SITECATEGORY` | `SITECATEGORY_VIEW`, `SITECATEGORY_EDIT` |
| `product` | `PRODUCT` | `PRODUCT_VIEW`, `PRODUCT_DELETE` |
| `user_site_role` | `USITESITEROLE` 或 `USER_ROLE` | `USER_ROLE_VIEW` |

**转换规则**:
- 去掉下划线，合并为大写: `site_category` → `SITECATEGORY`
- 关联表可选简化: `user_site_role` → `USER_ROLE`

---

## 7. 完整示例

### 示例: 站点分类 (Site Category)

#### 7.1 数据库层

```typescript
// table.schema.ts
export const siteCategoryTable = p.pgTable("site_category", {
  id: idUuid,
  name: p.varchar("name", { length: 200 }).notNull(),
  description: p.text("description"),
  parent_id: p.uuid("parent_id").references(() => siteCategoryTable.id),
  sort_order: p.integer("sort_order").default(0),
  is_active: p.boolean("is_active").default(true),
  tenant_id: p.uuid("tenant_id").references(() => tenantTable.id),
  dept_id: p.uuid("dept_id").references(() => departmentTable.id),
  created_at: createdAt,
  updated_at: updatedAt,
});
```

#### 7.2 契约层

```typescript
// modules/sitecategory.contract.ts
import { t } from "elysia";
import { type InferDTO, spread } from "../helper/utils";
import { siteCategoryTable } from "../table.schema";

export const SiteCategoryFields = spread(siteCategoryTable, "select");

export const SiteCategoryContract = {
  Response: t.Object({ ...SiteCategoryFields }),
  Create: t.Object({
    name: t.String(),
    description: t.Optional(t.String()),
    parentId: t.Optional(t.String()),
    sortOrder: t.Optional(t.Number()),
    isActive: t.Optional(t.Boolean()),
  }),
  Update: t.Partial(t.Object({
    name: t.String(),
    description: t.String(),
    parentId: t.String(),
    sortOrder: t.Number(),
    isActive: t.Boolean(),
  })),
  ListQuery: t.Object({
    search: t.Optional(t.String()),
  }),
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...SiteCategoryFields })),
    total: t.Number(),
  }),
  // 自定义扩展
  TreeResponse: t.Object({
    ...SiteCategoryFields,
    children: t.Optional(t.Array(t.Any())),
  }),
} as const;

export type SiteCategoryContract = InferDTO<typeof SiteCategoryContract>;
```

#### 7.3 服务层

```typescript
// services/sitecategory.service.ts
export class SiteCategoryService {
  async findAll(query: SiteCategoryContract["ListQuery"], ctx: ServiceContext) {
    const { search } = query;
    const scopeObj = ctx.getScopeObj();
    return await ctx.db.query.siteCategoryTable.findMany({
      where: {
        deptId: scopeObj.deptId,
        tenantId: scopeObj.tenantId,
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
      },
    });
  }

  async getTree(ctx: ServiceContext) {
    const scopeObj = ctx.getScopeObj();
    const categories = await ctx.db.query.siteCategoryTable.findMany({
      where: {
        deptId: scopeObj.deptId,
        tenantId: scopeObj.tenantId,
      },
      orderBy: { sortOrder: "asc" },
    });
    // 构建树形结构...
    return treeData;
  }

  async moveCategory(id: string, newParentId: string | null, ctx: ServiceContext) {
    // 移动逻辑...
  }
}
```

#### 7.4 控制器层

```typescript
// controllers/sitecategory.controller.ts
export const sitecategoryController = new Elysia({
  prefix: "/sitecategory",
  tags: ["SiteCategory"],
})
  .use(dbPlugin)
  .use(authGuardMid)
  .get("/", ...,
    {
      allPermissions: ["SITECATEGORY_VIEW"],
      query: SiteCategoryContract.ListQuery,
      detail: {
        summary: "获取站点分类列表",
        tags: ["SiteCategory"],
      },
    }
  )
  .get("/tree", ...,
    {
      allPermissions: ["SITECATEGORY_VIEW"],
      detail: {
        summary: "获取站点分类树形结构",
        tags: ["SiteCategory"],
      },
    }
  )
  .patch("/:id/move", ...,
    {
      allPermissions: ["SITECATEGORY_EDIT"],
      detail: {
        summary: "移动站点分类",
        tags: ["SiteCategory"],
      },
    }
  );
```

#### 7.5 前端 Hooks

```typescript
// hooks/api/sitecategory.ts
export function useSiteCategoryList(
  params?: typeof SiteCategoryContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: ["sitecategory", "list", params],
    queryFn: () => api.get<SiteCategoryListResponse>("/api/v1/sitecategory", params),
    enabled,
  });
}

export function useSiteCategoryTree(enabled = true) {
  return useQuery({
    queryKey: ["sitecategory", "tree"],
    queryFn: () => api.get<SiteCategoryTreeResponse[]>("/api/v1/sitecategory/tree"),
    enabled,
  });
}

export function useMoveSiteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newParentId }: { id: string; newParentId?: string }) =>
      api.patch(`/api/v1/sitecategory/${id}/move`, { newParentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitecategory"] });
    },
  });
}
```

#### 7.6 权限配置

```typescript
// config/permissions.ts
export const PERMISSIONS = {
  SITECATEGORY_VIEW: "SITECATEGORY_VIEW",
  SITECATEGORY_CREATE: "SITECATEGORY_CREATE",
  SITECATEGORY_EDIT: "SITECATEGORY_EDIT",
  SITECATEGORY_DELETE: "SITECATEGORY_DELETE",
} as const;

// 使用
import { PERMISSIONS } from "@/config/permissions";

allPermissions: [PERMISSIONS.SITECATEGORY_VIEW]
```

---

## 8. 自动化转换规则

### 8.1 表名 → 各层命名

| 数据库表名 | Schema 变量 | Contract 文件 | Service 文件 | Controller 变量 | 路由 prefix | Hook 文件 | 权限前缀 |
|-----------|------------|--------------|-------------|----------------|-------------|-----------|---------|
| `site` | `siteTable` | `site.contract.ts` | `site.service.ts` | `siteController` | `/site` | `site.ts` | `SITE` |
| `site_category` | `siteCategoryTable` | `sitecategory.contract.ts` | `sitecategory.service.ts` | `sitecategoryController` | `/sitecategory` | `sitecategory.ts` | `SITECATEGORY` |
| `product_media` | `productMediaTable` | `productmedia.contract.ts` | `productmedia.service.ts` | `productmediaController` | `/productmedia` | `productmedia.ts` | `PRODUCTMEDIA` |
| `user_site_role` | `userSiteRoleTable` | `usersiterole.contract.ts` | `usersiterole.service.ts` | `usersiteroleController` | `/usersiterole` | `usersiterole.ts` | `USER_ROLE` |

### 8.2 转换算法

```typescript
// 1. 表名 → Schema 变量
function tableNameToSchema(tableName: string): string {
  return tableName.replace(/_([a-z])/g, (_, c) => c.toUpperCase()) + "Table";
}
// "site_category" → "siteCategoryTable"

// 2. 表名 → 文件名 (全小写，去掉下划线)
function tableNameToFile(tableName: string): string {
  return tableName.replace(/_/g, "");
}
// "site_category" → "sitecategory"

// 3. 表名 → PascalCase (用于类型)
function tableNameToPascalCase(tableName: string): string {
  return tableName
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
// "site_category" → "SiteCategory"

// 4. 表名 → 权限前缀 (全大写，去掉下划线)
function tableNameToPermissionPrefix(tableName: string): string {
  return tableName.replace(/_/g, "").toUpperCase();
}
// "site_category" → "SITECATEGORY"

// 5. Schema 变量 → 表名 (反推)
function schemaToTableName(schemaName: string): string {
  return schemaName.replace(/([A-Z])/g, "_$1").toLowerCase().replace("table", "");
}
// "siteCategoryTable" → "site_category"
```

---

## 9. 总结

### 9.1 核心原则

1. **数据库表**: `snake_case` + **单数**
2. **Schema 变量**: `camelCase` + `Table` 后缀
3. **文件名**: 全小写，去掉下划线
4. **类型名**: `PascalCase` + 类型后缀
5. **路由**: 全小写，对应文件名
6. **权限**: `UPPER_CASE` + 下划线分隔

### 9.2 一致性检查清单

- [ ] 数据库表使用单数形式
- [ ] Schema 变量以 `Table` 结尾
- [ ] Contract 文件以 `.contract.ts` 结尾
- [ ] Service 文件以 `.service.ts` 结尾
- [ ] Controller 变量全小写 + `controller` 后缀
- [ ] 路由 prefix 全小写，无下划线
- [ ] Hook 命名遵循 `use{Entity}{Action}` 模式
- [ ] 权限常量全大写 + 下划线

---

## 附录: 快速参考表

| 层级 | 命名规则 | 示例 |
|-----|---------|------|
| **数据库表** | `snake_case` + 单数 | `site_category` |
| **Schema** | `camelCase` + `Table` | `siteCategoryTable` |
| **Contract 文件** | `lowercase` + `.contract.ts` | `sitecategory.contract.ts` |
| **Contract 导出** | `PascalCase` + `Contract` | `SiteCategoryContract` |
| **Service 文件** | `lowercase` + `.service.ts` | `sitecategory.service.ts` |
| **Service 类** | `PascalCase` + `Service` | `SiteCategoryService` |
| **Controller 文件** | `lowercase` + `.controller.ts` | `sitecategory.controller.ts` |
| **Controller 变量** | `lowercase` + `controller` | `sitecategoryController` |
| **路由 prefix** | `/lowercase` | `/sitecategory` |
| **路由 tags** | `PascalCase` | `"SiteCategory"` |
| **Hook 文件** | `lowercase.ts` | `sitecategory.ts` |
| **Hook Query** | `use{Entity}{Action}` | `useSiteCategoryList` |
| **Hook Mutation** | `use{Action}{Entity}` | `useCreateSiteCategory` |
| **权限常量** | `UPPER_SNAKE_CASE` | `SITECATEGORY_VIEW` |
