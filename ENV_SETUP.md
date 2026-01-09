# 环境变量配置指南

## 📋 概述

本项目包含三个应用，环境变量采用独立管理策略，每个应用维护自己的环境变量配置。

## 🚀 应用架构

| 应用 | 类型 | 开发环境端口 | 生产环境端口 | 说明 |
|------|------|-------------|-------------|------|
| **apps/web** | 前后端一体化 | 8001 | 9001 | 独立的 Web 应用，内置 API 服务 |
| **apps/b2badmin** | 前端 | 8002 | 9002 | B2B 管理后台前端，连接到独立的 API 服务 |
| **apps/api** | 后端 API | 8012 | 9012 | 为 b2badmin 提供后端 API 服务 |

## 📦 环境变量文件结构

每个应用包含以下环境变量文件：

```
apps/
├── web/
│   ├── .env                  # 实际使用的环境变量（会被 .gitignore 忽略）
│   ├── .env.development      # 开发环境配置
│   ├── .env.production       # 生产环境配置
│   └── .env.example          # 配置模板
├── b2badmin/
│   ├── .env
│   ├── .env.development
│   ├── .env.production
│   └── .env.example
└── api/
    ├── .env
    ├── .env.development
    ├── .env.production
    └── .env.example
```

## 🔧 开发环境配置

### 1. 启动数据库

```bash
# 使用 Docker Compose 启动 PostgreSQL
bun run docker:compose
```

数据库连接信息：
- 主机：`localhost:5444`
- 用户名：`shop`
- 密码：`shop`
- 数据库：`shop`

### 2. 启动应用

#### Web 应用（前后端一体化，端口 8001）

```bash
cd apps/web
bun run dev
```

访问：http://localhost:8001

环境变量：
- 端口：8001
- API URL：指向自己（http://localhost:8001）
- 数据库：本地数据库（localhost:5444）

#### B2B Admin 前端（端口 8002）

```bash
cd apps/b2badmin
bun run dev
```

访问：http://localhost:8002

环境变量：
- 端口：8002
- API URL：指向 API 服务（http://localhost:8012）
- 数据库：本地数据库（localhost:5444）

#### B2B API 服务（端口 8012）

```bash
cd apps/api
bun run dev
```

访问：http://localhost:8012/api

环境变量：
- 端口：8012
- CORS：允许 http://localhost:8001 和 http://localhost:8002
- 数据库：本地数据库（localhost:5444）

### 3. CORS 配置说明

开发环境的 CORS 配置允许以下源访问 API：

- `http://localhost:8001` - Web 应用
- `http://localhost:8002` - B2B Admin 前端

配置位置：`apps/api/.env.development` 中的 `TRUSTED_ORIGINS`

## 🚢 生产环境配置

### 1. PM2 部署

使用 PM2 管理所有应用：

```bash
# 启动所有应用
pm2 start ecosystem.config.cjs

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启所有应用
pm2 restart ecosystem.config.cjs

# 只重启特定应用
pm2 restart web
pm2 restart b2badmin
pm2 restart api

# 停止所有应用
pm2 stop ecosystem.config.cjs

# 删除所有应用
pm2 delete ecosystem.config.cjs
```

### 2. 生产环境端口分配

- **Web 应用**：9001
- **B2B Admin 前端**：9002
- **B2B API 服务**：9012

### 3. 生产环境域名配置

在生产环境中，请将以下占位符替换为实际域名：

#### Web 应用（apps/web/.env.production）

```env
# 将 YOUR_DOMAIN 替换为实际的生产域名
APP_URL=https://YOUR_DOMAIN
BETTER_AUTH_BASE_URL=https://YOUR_DOMAIN
NEXT_PUBLIC_API_URL=https://YOUR_DOMAIN
```

#### B2B Admin 前端（apps/b2badmin/.env.production）

```env
# 将 ADMIN_DOMAIN 替换为实际的管理后台域名
APP_URL=https://ADMIN_DOMAIN

# 将 API_DOMAIN 替换为实际的 API 域名
NEXT_PUBLIC_API_URL=https://API_DOMAIN:9012
```

#### B2B API 服务（apps/api/.env.production）

```env
# 将 API_DOMAIN 替换为实际的 API 域名
BETTER_AUTH_BASE_URL=https://API_DOMAIN:9012

# CORS 配置：只允许生产域名访问
TRUSTED_ORIGINS=https://YOUR_DOMAIN,https://ADMIN_DOMAIN
```

### 4. 生产环境数据库配置

```env
# 远程数据库连接
DATABASE_URL=postgres://user:password@remote-host:5432/database
```

## ⚠️ 重要注意事项

### 1. 环境变量安全

- 永远不要将 `.env` 文件提交到 Git 仓库
- 生产环境的密钥和密码必须使用强密码
- 定期轮换密钥和密码

### 2. CORS 安全

- 生产环境的 `TRUSTED_ORIGINS` 必须只包含允许访问的域名
- 不要在生产环境使用 `*` 允许所有源
- 定期审查 CORS 配置

### 3. 调试配置

- 生产环境必须关闭调试功能：
  ```env
  DEBUG=false
  ENABLE_SOURCE_MAPS=false
  LOG_LEVEL=error
  ```

### 4. 数据库连接

- 开发环境和生产环境使用不同的数据库
- 生产环境数据库连接字符串必须包含真实的凭据

## 🛠️ 故障排查

### 1. 端口冲突

如果遇到端口冲突，检查是否有其他服务占用了以下端口：
- 开发环境：8001, 8002, 8012
- 生产环境：9001, 9002, 9012

使用以下命令检查端口占用：
```bash
# Windows
netstat -ano | findstr :8001
netstat -ano | findstr :8002
netstat -ano | findstr :8012

# Linux/Mac
lsof -i :8001
lsof -i :8002
lsof -i :8012
```

### 2. CORS 错误

如果遇到 CORS 错误：
1. 检查 `apps/api/.env.development` 或 `.env.production` 中的 `TRUSTED_ORIGINS`
2. 确保前端应用的 URL 已添加到允许列表
3. 重启 API 服务使配置生效

### 3. 数据库连接失败

如果遇到数据库连接失败：
1. 确认数据库已启动：`bun run docker:compose`
2. 检查数据库连接字符串是否正确
3. 确认数据库用户名、密码和主机地址正确

## 📚 参考资源

- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [Elysia 环境变量](https://elysiajs.com/)
- [PM2 文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Better Auth 文档](https://www.better-auth.com/)

## 📞 技术支持

如遇到问题，请检查：
1. 环境变量文件是否正确配置
2. 端口是否被占用
3. 数据库是否正常运行
4. CORS 配置是否正确

---

**最后更新时间**：2026-01-09
