# Railway 部署指南

## 1. 部署准备

### 构建命令
```bash
bun run build
```

### 启动命令
```bash
bun run start
```

## 2. Railway 环境变量配置

在 Railway 项目设置的 Variables 中添加以下环境变量：

### 必填变量
- `PORT`: 3000（Railway 自动分配端口，但需要设置）
- `BETTER_AUTH_SECRET`: 随机生成的密钥（使用 `openssl rand -base64 32` 生成）
- `NEXT_PUBLIC_API_URL`: 你的后端 API 服务地址

### 可选变量（邮件服务）
- `EMAIL_HOST`: smtp.163.com
- `EMAIL_PORT`: 465
- `EMAIL_USER`: 你的邮箱地址
- `EMAIL_PASSWORD`: 邮箱授权码（不是邮箱密码）
- `EMAIL_FROM`: 发件人地址

## 3. 部署步骤

1. 登录 Railway 账号
2. 创建新项目或选择现有项目
3. 连接 GitHub 仓库，选择 `shop/monorepo` 或相应仓库
4. 在项目设置中配置环境变量（见上方）
5. 启动部署

## 4. 注意事项

- 确保后端 API 服务已先部署，并获取其 Railway 域名
- 将 `NEXT_PUBLIC_API_URL` 更新为实际的 API 服务地址
- 邮件服务需要使用邮箱的授权码，而不是登录密码
- 生产环境建议使用专门的邮件服务（如 SendGrid、Resend 等）
