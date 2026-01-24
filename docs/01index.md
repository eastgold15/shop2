>本文档利用AI 的分层推理能力，手动构建上下文，链接采用obsidian的链接，需要的内容去索引对应的上下文。

[[项目愿景]]
本项目是一个外贸电商网站，使用一个后台管理完成对多个不同网站进行管理，后台管理是一个前后端分离项目，客户端是一个全栈一体项目。

## 项目核心架构

### 三层 RBAC 权限架构

本项目采用**三层RBAC（基于角色的访问控制）**架构，实现了"出口商-工厂-站点"的完整隔离和协作体系：

1. **租户层 (Tenant)** - 物理隔离层，代表完整的出口商企业
2. **部门层 (Department)** - 组织架构层，区分总部、工厂、办事处
3. **站点层 (Site)** - 展示层，支持集团站点和工厂独立站
4. **用户角色层 (User-Role-Site)** - 权限控制层，实现精细化的数据访问控制

详见 [[实体.md]] 中的权限系统详细设计。

### 多站点架构特点

- **资产与展示解耦**：商品属于工厂，站点通过映射表引用商品
- **站点类型**：集团站点（可聚合所有工厂商品）和工厂站点（仅展示本厂商品）
- **权限控制**：基于站点的用户角色分配，支持跨站点权限管理

详见 [[shop-Docs/multi-site-architecture|multi-site-architecture]]

[[核心技术栈]]

### SSOT 瀑布流 (SSOT Waterfall)
全栈系统开发以数据库为唯一事实来源（Single Source of Truth），数据流向为：
- **数据库层 (DB Layer)** - [[命名系统]] 中定义的表结构
- **对象关系映射层 (ORM Layer)** - Drizzle ORM 1.0
- **契约层 (Contract Layer)** - 自动生成的类型定义和契约
- **服务层 (Service Layer)** - 业务逻辑实现
- **控制器层 (Controller Layer)** - Elysia 路由和请求处理
- **应用程序接口钩子层 (API-Hooks Layer)** - 前端 TanStack Query 集成

[[模块依赖图]]




[[项目依赖文档]] : dirzzle  eden  


[[命名系统]]
[[shop-Docs/model-naming-standards|model-naming-standards]]

