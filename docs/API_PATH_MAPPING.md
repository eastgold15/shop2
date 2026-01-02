# API 路径映射规范

## 前后端路径对应规律

### 1. 文件命名对应关系

#### 后端 Controller
- 位置：`apps/api/src/controllers/`
- 命名格式：`{module}.controller.ts`（单数，kebab-case）
- 示例：`mastercategory.controller.ts`

#### 前端 Hooks
- 位置：`apps/b2badmin/src/hooks/api/`
- 命名格式：`{module}.ts`（与 controller 文件名一致，单数，kebab-case）
- 示例：`mastercategory.ts`

#### 前端页面
- 位置：`apps/b2badmin/src/app/dashboard/`
- 命名格式：`{module}/`（与 controller 文件名一致，单数，kebab-case）
- 示例：`mastercategory/`

### 2. API 路径对应规则

#### 后端路由
```typescript
// Controller 定义
export const mastercategoryController = new Elysia({ prefix: "/mastercategory" })
```

#### 前端 API 调用
```typescript
// Hook 中的 API 路径
"/api/v1/{prefix}/"
```

### 3. 完整对应示例

| 模块 | Controller 文件 | Controller Prefix | 前端 Hook 文件 | API 路径 |
|------|----------------|------------------|----------------|----------|
| 主分类 | `mastercategory.controller.ts` | `/mastercategory` | `mastercategory.ts` | `/api/v1/mastercategory/` |
| 站点分类 | `sitecategory.controller.ts` | `/sitecategory` | `sitecategory.ts` | `/api/v1/sitecategory/` |
| 商品 | `product.controller.ts` | `/product` | `product.ts` | `/api/v1/product/` |
| SKU | `sku.controller.ts` | `/sku` | `sku.ts` | `/api/v1/sku/` |
| 媒体 | `media.controller.ts` | `/media` | `media.ts` | `/api/v1/media/` |
| 角色 | `role.controller.ts` | `/role` | `role.ts` | `/api/v1/role/` |

### 4. 路由规范

#### 列表查询
```typescript
// 前端
api.get<any, QueryType>("/api/v1/{module}/", { params })

// 后端
.get("/", ({ query }) => service.findAll(query))
```

#### 详情查询
```typescript
// 前端
api.get<any>(`/api/v1/${module}/${id}`)

// 后端
.get("/:id", ({ params }) => service.findOne(params.id))
```

#### 创建
```typescript
// 前端
api.post<any, BodyType>("/api/v1/{module}/", data)

// 后端
.post("/", ({ body }) => service.create(body))
```

#### 更新
```typescript
// 前端
api.put<any, BodyType>(`/api/v1/${module}/${id}`, data)

// 后端
.put("/:id", ({ params, body }) => service.update(params.id, body))
```

#### 删除
```typescript
// 前端
api.delete<any>(`/api/v1/${module}/${id}`)

// 后端
.delete("/:id", ({ params }) => service.delete(params.id))
```

#### 树形结构
```typescript
// 前端
api.get<TreeType[]>("/api/v1/{module}/tree")

// 后端
.get("/tree", () => service.getTree())
```

#### 批量操作
```typescript
// 前端
api.delete<any, { ids: string[] }>(`/api/v1/${module}/batch`, { ids })

// 后端
.delete("/batch", ({ body }) => service.batchDelete(body.ids))
```

### 5. 命名规范总结

1. **所有模块使用单数形式**（复数改单数）
   - ❌ `products`, `categories`, `roles`
   - ✅ `product`, `category`, `role`

2. **使用 kebab-case（短横线）**
   - ❌ `masterCategory`, `site_category`
   - ✅ `mastercategory`, `sitecategory`

3. **前后端文件名保持一致**
   - Controller: `{module}.controller.ts`
   - Hook: `{module}.ts`
   - Page: `{module}/`

4. **API 路径 = `/api/v1/{prefix}/`**
   - prefix 必须与 controller 定义的一致
   - 列表查询末尾加 `/`
   - 其他操作使用 `/:id` 或特定路径

### 6. 快速查找方法

当需要修改 API 路径时：

1. 找到后端 controller：`apps/api/src/controllers/{module}.controller.ts`
2. 查看 `prefix` 定义：`new Elysia({ prefix: "/xxx" })`
3. 在前端 hook 中替换：`/api/v1/xxx/`
4. 保持文件名与 prefix 一致

### 7. 常见错误

❌ **错误示例**：
- Controller prefix 是 `/mastercategory`，但前端调用 `/api/v1/master/`
- 文件名是 `mastercategory.ts`，但路径使用 `/master-categories/`
- 前端页面路径 `/dashboard/master-categories`，但文件在 `mastercategory/`

✅ **正确做法**：
- 所有地方统一使用 `mastercategory`（单数，kebab-case）
- API 路径：`/api/v1/mastercategory/`
- 文件名：`mastercategory.ts`, `mastercategory.controller.ts`
- 页面路径：`/dashboard/mastercategory/`
