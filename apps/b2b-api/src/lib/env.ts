// import { type Static, type TSchema, Type as t } from "typebox";
import env from "env-var";
export const envConfig = {
  PORT: env.get("PORT").required().asPortNumber(),
  // 必填项：必须存在且非空字符串
  DATABASE_URL: env.get("DATABASE_URL").required().asString(),
  BETTER_AUTH_SECRET: env.get("BETTER_AUTH_SECRET").required().asString(),
  TRUSTED_ORIGINS: env.get("TRUSTED_ORIGINS").required().asString(),

  // 合法URL校验
  BETTER_AUTH_BASE_URL: env.get("BETTER_AUTH_BASE_URL").required().asString(),

  // GitHub OAuth 必填项
  GITHUB_CLIENT_ID: env.get("GITHUB_CLIENT_ID").required().asString(),
  GITHUB_CLIENT_SECRET: env.get("GITHUB_CLIENT_SECRET").required().asString(),

  // 邮件服务（可选，带默认值/可选配置）
  EMAIL: {
    HOST: env.get("EMAIL_HOST").required().asString(),
    PORT: env.get("EMAIL_PORT").required().asPortNumber(), // 可选，无默认值，非法值返回undefined
    USER: env.get("EMAIL_USER").required().asString(),
    PASSWORD: env.get("EMAIL_PASSWORD").required().asString(),
    FROM: env.get("EMAIL_FROM").required().asString(),
  },

  // OSS 配置（可选，无默认值）
  OSS: {
    ACCESS_KEY_ID: env.get("ACCESS_KEY_ID").required().asString(),
    SECRET_ACCESS_KEY: env.get("SECRET_ACCESS_KEY").required().asString(),
    BUCKET: env.get("BUCKET").required().asString(),
    REGION: env.get("REGION").required().asString(),
    ENDPOINT: env.get("ENDPOINT").required().asString(),
    DOMAIN: env.get("DOMAIN").required().asString(),
  },

  // 图片域名（用于拼接图片URL）
  IMGDOMAIN: env.get("IMGDOMAIN").required().asString(),
};
// import { createEnv } from "@t3-oss/env-core";

// --- 使用 TypeBox 定义 env ---
// export const envConfig = createEnv({
//   server: {
//     // 基础配置
//     NODE_ENV: stdType(
//       t.Union(
//         ["development", "production", "test"],
//         { default: "development" }
//       )
//     ),

//     // 注意：TypeBox 中定义为 Number，stdType 里的 Value.Convert 会自动把 "8002" 转成 8002
//     PORT: stdType(t.Number({ default: 8002 })),
//     APP_NAME: stdType(t.String({ minLength: 1 })),
//     APP_HOST: stdType(t.String({ format: "uri" })),

//     // Better Auth
//     BETTER_AUTH_SECRET: stdType(t.String({ minLength: 1 })),

//     // 数据库
//     DATABASE_URL: stdType(t.String({ format: "uri" })),

//     // 邮件服务
//     EMAIL_HOST: stdType(t.String({ minLength: 1 })),
//     EMAIL_PORT: stdType(t.Number({ default: 465 })),
//     EMAIL_USER: stdType(t.String()),
//     EMAIL_PASSWORD: stdType(t.String({ minLength: 1 })),
//     EMAIL_FROM: stdType(t.String()),

//     // OSS / 存储配置
//     STORAGE_TYPE: stdType(
//       t.Union(["oss", "local"], { default: "oss" })
//     ),
//     ACCESS_KEY_ID: stdType(t.String({ minLength: 1 })),
//     SECRET_ACCESS_KEY: stdType(t.String({ minLength: 1 })),
//     BUCKET: stdType(t.String({ minLength: 1 })),
//     REGION: stdType(t.String({ minLength: 1 })),
//     ENDPOINT: stdType(t.String({ format: "uri" })),
//     DOMAIN: stdType(t.String({ format: "uri" })),

//     // 调试 (布尔值转换)
//     DEBUG: stdType(t.Boolean({ default: false })),
//     LOG_LEVEL: stdType(
//       t.Union(
//         [
//           "debug",
//           "info",
//           "warn",
//           "error",
//         ],
//         { default: "info" }
//       )
//     ),
//   },

//   clientPrefix: "NEXT_PUBLIC_",
//   client: {
//     NEXT_PUBLIC_API_URL: stdType(t.String({ format: "uri" })),
//   },

//   runtimeEnv: process.env,
//   // 建议开启，防止环境变量中有空字符串干扰默认值
//   emptyStringAsUndefined: true,
// });
// export function stdType<T extends TSchema>(schema: T) {
//   return {
//     "~standard": {
//       version: 1 as const,
//       vendor: "typebox",
//       validate: (value: unknown) => {
//         const converted = Value.Convert(schema, value);
//         const isValid = Value.Check(schema, converted);
//         if (isValid) {
//           const cleaned = Value.Clean(schema, converted);
//           return { value: cleaned as Static<T> };
//         }
//         const errors = [...Value.Errors(schema, value)];
//         return {
//           issues: errors.map((e) => ({
//             message: e.message,
//             path: [e.instancePath],
//           })),
//         };
//       },
//     },
//   };
// }

// export function stdType<T extends TSchema>(schema: T) {
//   return {
//     "~standard": {
//       version: 1 as const,
//       vendor: "typebox",
//       validate: (value: unknown) => {
//         // 1. 预处理：如果值是空的，由 TypeBox 的 default 处理
//         const converted = Value.Convert(schema, value);

//         // 2. 校验
//         const isValid = Value.Check(schema, converted);

//         if (isValid) {
//           return { value: Value.Clean(schema, converted) as Static<T> };
//         }

//         // 3. 错误信息精简
//         const errors = [...Value.Errors(schema, converted)];
//         return {
//           issues: errors.map((e) => ({
//             message: e.message,
//             // 修正：如果是根路径，直接用变量名，不要保留空字符串
//             path: e.instancePath === "" ? [] : e.instancePath.split('/').filter(Boolean),
//           })),
//         };
//       },
//     },
//   };
// }
