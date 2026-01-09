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
      // --- Web 应用（前后端一体） ---
      name: "web",
      cwd: path.resolve(ROOT_PATH, "./apps/web"),
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
      error_file: "./logs/web-error.log",
      out_file: "./logs/web-out.log",
      merge_logs: true,
    },
    {
      // --- B2B Admin 前端 ---
      name: "b2badmin",
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
        PORT: 9002,
      },
      error_file: "./logs/b2badmin-error.log",
      out_file: "./logs/b2badmin-out.log",
      merge_logs: true,
    },
    {
      // --- API 服务（B2B 后端） ---
      name: "api",
      cwd: path.resolve(ROOT_PATH, "./apps/api"),
      script: "bun",
      args: "run ./dist/index.js",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        SERVERPORT: 9012,
      },
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      merge_logs: true,
      // ⚠️ 调试建议：先注释掉下面这三行，确保能跑起来再开启
      // wait_ready: true,
      // listen_timeout: 10000,
      // ready_pattern: /server running/i,
    },
  ],
};
