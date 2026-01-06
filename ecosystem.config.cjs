"use strict";
/**
 * PM2 生态系统配置文件 - 生产环境
 *
 * 使用方式：
 * - 启动所有应用: pm2 start ecosystem.config.cjs
 * - 只启动 api: pm2 start ecosystem.config.cjs --only api
 * - 只启动 b2badmin: pm2 start ecosystem.config.cjs --only b2badmin
 * - 重启所有: pm2 restart ecosystem.config.cjs
 * - 停止所有: pm2 stop ecosystem.config.cjs
 * - 删除所有: pm2 delete ecosystem.config.cjs
 * - 查看日志: pm2 logs
 * - 监控: pm2 monit
 * - 保存进程列表: pm2 save
 * - 开机自启: pm2 startup
 */

const path = require("node:path");
const ROOT_PATH = __dirname;
module.exports = {
  apps: [
    {
      // --- API 服务 ---
      name: "api",
      // 1. 关键：设置正确的工作目录，Bun 会去这个目录下找 .env 文件
      cwd: path.resolve(ROOT_PATH, "./apps/api"),
      script: "bun",
      args: "run ./dist/index.js",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        SERVERPORT: 9000,
      },
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      merge_logs: true,
      // ⚠️ 调试建议：先注释掉下面这三行，确保能跑起来再开启
      // wait_ready: true,
      // listen_timeout: 10000,
      // ready_pattern: /server running/i,
    },
    {
      // --- B2B Admin ---
      name: "b2badmin",
      // 关键修改 1: 假设 next 被提升到了根目录 node_modules
      // 使用 path.resolve 定位到根目录的 next 可执行文件
      cwd: path.resolve(ROOT_PATH, "./apps/b2badmin"),
      script: "bun",
      args: "run start",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 9001,
      },
      error_file: "./logs/b2badmin-error.log",
      out_file: "./logs/b2badmin-out.log",
      merge_logs: true,
    },
  ],
};
