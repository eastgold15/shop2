import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { OpenAPI } from "~/lib/auth-openapi";
import { localeMiddleware } from "~/middleware/locale";
import { appRouter } from "./controllers/app-router";
import { dbPlugin } from "./db/connection";
import { auth } from "./lib/auth";
import { envConfig } from "./lib/env";
import { authGuardMid } from "./middleware/auth";
import { loggerPlugin } from "./middleware/logger";
import { errorSuite } from "./utils/err/errorSuite.plugin";

const api = new Elysia({ name: "api", prefix: "/api" })
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        info: {
          title: "Gin Shopping API",
          version: "1.0.71",
          description: "基于 Elysia + Drizzle + TypeScript 的电商后端 API",
        },
        tags: [],
      },
      references: fromTypes(
        "src/server.ts",
        {
          // 关键：指定项目根目录，以便编译器能找到 tsconfig.json 和其他文件
          // 这里使用 import.meta.dir (Bun) 或 process.cwd()
          projectRoot: process.cwd(),
          // 如果你的 tsconfig 在根目录
          tsconfigPath: "tsconfig.json",
          debug: process.env.NODE_ENV !== "production",
        }
      ),
    })
  )
  .group("/v1", (app) => app.use(authGuardMid).use(appRouter))

export const server = new Elysia({ name: "server" })
  // 1. 日志插件 (注入 ctx.log 和自动记录 HTTP 响应)
  .use(loggerPlugin)
  // 2. 核心错误处理插件 (拦截所有错误，进行转换和手动日志记录)
  .use(errorSuite)
  .use(localeMiddleware) // 在全局级别添加语言中间件
  .use(
    cors({
      origin: [...envConfig.TRUSTED_ORIGINS.split(",")],
      credentials: true,
    })
  )
  .use(dbPlugin)
  .mount("/", auth.handler) // 使用 Better Auth 认证中间件
  .get("/", () => ({ message: "Hello Elysia api" }))
  .use(api)
  .listen(envConfig.PORT);
