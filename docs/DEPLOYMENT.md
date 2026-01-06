# 生产环境部署指南

本文档描述如何使用 PM2 在生产环境中部署和运行项目。

## 前置要求

### 必需工具
- **Node.js**: >= 18.x
- **Bun**: >= 1.3.0
- **PM2**: 全局安装
  ```bash
  bun pm2 -g
  # 或
  npm install -g pm2
  ```

### 服务器环境
- Linux 服务器（推荐 Ubuntu 20.04+）
- PostgreSQL 数据库（远程或本地）
- 足够的磁盘空间用于日志和应用文件

## 部署步骤

### 1. 克隆代码并安装依赖

```bash
# 克隆项目
git clone <your-repository-url> shop
cd shop

# 安装依赖
bun install
```

### 2. 配置环境变量

为生产环境创建 `.env.production` 文件：

```bash
# API 服务配置（apps/api/.env.production）
DATABASE_URL=postgresql://user:password@host:5432/dbname
SERVERPORT=9000
NODE_ENV=production

# B2B Admin 配置（apps/b2badmin/.env.production）
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
PORT=9001
NODE_ENV=production
```

### 3. 构建项目

```bash
# 构建所有应用
bun run build

# 或分别构建
cd apps/api && bun run build
cd ../b2badmin && bun run build
```

### 4. 创建日志目录

```bash
# 在项目根目录创建日志目录
mkdir -p logs
```

### 5. 使用 PM2 启动应用

项目已配置好 `ecosystem.config.cjs`，包含以下应用：
- **api**: API 服务（端口 9000）
- **b2badmin**: B2B 后台管理系统（端口 9001）

#### 启动所有应用

```bash
pm2 start ecosystem.config.cjs
```

#### 启动单个应用

```bash
# 只启动 API
pm2 start ecosystem.config.cjs --only api

# 只启动 B2B Admin
pm2 start ecosystem.config.cjs --only b2badmin
```

#### 其他 PM2 管理命令

```bash
# 查看所有进程状态
pm2 list

# 查看日志
pm2 logs

# 查看特定应用日志
pm2 logs api
pm2 logs b2badmin

# 实时监控
pm2 monit

# 重启所有应用
pm2 restart ecosystem.config.cjs

# 重启单个应用
pm2 restart api
pm2 restart b2badmin

# 停止所有应用
pm2 stop ecosystem.config.cjs

# 停止单个应用
pm2 stop api
pm2 stop b2badmin

# 删除所有应用
pm2 delete ecosystem.config.cjs

# 删除单个应用
pm2 delete api
pm2 delete b2badmin
```

### 6. 设置开机自启

```bash
# 保存当前进程列表
pm2 save

# 生成开机自启脚本（执行后会提示运行的命令）
pm2 startup
```

执行 `pm2 startup` 后，按照提示复制并运行输出的命令，通常类似：

```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your_username --hp /home/your_username
```

## 应用信息

### API 服务

- **名称**: api
- **端口**: 9000
- **工作目录**: `./apps/api`
- **启动命令**: `bun run ./dist/index.js`
- **内存限制**: 500M
- **日志文件**:
  - 错误日志: `./logs/api-error.log`
  - 输出日志: `./logs/api-out.log`

### B2B Admin 服务

- **名称**: b2badmin
- **端口**: 9001
- **工作目录**: `./apps/b2badmin`
- **启动命令**: `bun run start`
- **内存限制**: 500M
- **日志文件**:
  - 错误日志: `./logs/b2badmin-error.log`
  - 输出日志: `./logs/b2badmin-out.log`

## Nginx 反向代理配置（推荐）

建议使用 Nginx 作为反向代理，配置示例如下：

```nginx
# API 服务
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# B2B Admin 服务
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

配置 HTTPS（使用 Let's Encrypt）：

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取并自动配置 SSL 证书
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com
```

## 日志管理

### 查看实时日志

```bash
# 查看所有日志
pm2 logs

# 只查看错误日志
pm2 logs --err

# 只查看输出日志
pm2 logs --out

# 查看最后 100 行
pm2 logs --lines 100
```

### 日志轮转

PM2 默认会自动管理日志，但如需自定义轮转策略：

```bash
# 安装 PM2 logrotate
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

## 故障排查

### 应用无法启动

1. 检查日志文件：
   ```bash
   pm2 logs
   ```

2. 检查端口占用：
   ```bash
   sudo lsof -i :9000
   sudo lsof -i :9001
   ```

3. 检查环境变量：
   ```bash
   pm2 env 0  # 查看 API 环境
   pm2 env 1  # 查看 B2B Admin 环境
   ```

### 内存问题

如果应用因内存超出限制而重启：

1. 查看内存使用情况：
   ```bash
   pm2 monit
   ```

2. 调整内存限制（修改 `ecosystem.config.cjs` 中的 `max_memory_restart`）

### 数据库连接问题

1. 检查数据库连接字符串是否正确
2. 确保数据库服务器可访问
3. 检查防火墙规则

## 更新部署

当需要更新应用时：

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装新依赖
bun install

# 3. 重新构建
bun run build

# 4. 重启应用（使用 PM2）
pm2 restart ecosystem.config.cjs

# 或分别重启
pm2 restart api
pm2 restart b2badmin
```

## 监控和告警

### 使用 PM2 Plus（可选）

PM2 Plus 提供更强大的监控功能：

```bash
# 链接到 PM2 Plus
pm2 link <public_key> <secret_key>
```

### 常用监控命令

```bash
# 实时监控
pm2 monit

# 查看详细信息
pm2 show api
pm2 show b2badmin

# 查看资源使用
pm2 describe api
pm2 describe b2badmin
```

## 安全建议

1. **防火墙配置**: 只开放必要的端口（80, 443）
2. **定期更新**: 保持系统和依赖包更新
3. **备份**: 定期备份数据库和应用文件
4. **监控**: 设置日志监控和告警
5. **HTTPS**: 生产环境必须使用 HTTPS
6. **环境变量**: 不要在代码中硬编码敏感信息

## 备份策略

### 数据库备份

```bash
# 使用 pg_dump 备份
pg_dump -h host -U user -d dbname > backup_$(date +%Y%m%d).sql

# 定时备份（添加到 crontab）
0 2 * * * pg_dump -h host -U user -d dbname > /backups/db_$(date +\%Y\%m\%d).sql
```

### 应用备份

```bash
# 备份应用代码和配置
tar -czf shop_backup_$(date +%Y%m%d).tar.gz shop/
```

## 性能优化建议

1. **启用 Gzip 压缩**: 在 Nginx 配置中启用
2. **静态资源缓存**: 配置 Nginx 缓存策略
3. **数据库连接池**: 优化 Drizzle 连接池配置
4. **CDN**: 使用 CDN 加速静态资源
5. **负载均衡**: 使用 PM2 集群模式（如需）

## 支持

如有问题，请检查：
1. PM2 日志文件
2. 应用日志文件（`./logs/` 目录）
3. PM2 文档: https://pm2.keymetrics.io/
