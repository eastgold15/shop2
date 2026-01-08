import env from "env-var";

export const envConfig = {
  SERVERPORT: env.get("SERVERPORT").default(4000).asPortNumber(),
  // 必填项：必须存在且非空字符串
  DATABASE_URL: env.get("DATABASE_URL").default("").asString(),
  BETTER_AUTH_SECRET: env.get("BETTER_AUTH_SECRET").asString(),
  TRUSTED_ORIGINS: env.get("TRUSTED_ORIGINS").default("").asString(),

  // 合法URL校验
  BETTER_AUTH_BASE_URL: env.get("BETTER_AUTH_BASE_URL").asUrlString(),

  // GitHub OAuth 必填项
  GITHUB_CLIENT_ID: env.get("GITHUB_CLIENT_ID").asString(),
  GITHUB_CLIENT_SECRET: env.get("GITHUB_CLIENT_SECRET").asString(),

  // 邮件服务（可选，带默认值/可选配置）
  EMAIL: {
    HOST: env.get("EMAIL_HOST").default("smtp.gmail.com").asString(),
    PORT: env.get("EMAIL_PORT").asPortNumber(), // 可选，无默认值，非法值返回undefined
    USER: env.get("EMAIL_USER").asString(),
    PASSWORD: env.get("EMAIL_PASSWORD").asString(),
    FROM: env.get("EMAIL_FROM").asString(),
  },

  // 阿里云凭证（带默认值）
  ALIBABA_CLOUD: {
    ACCESS_KEY_ID: env
      .get("ALIBABA_CLOUD_ACCESS_KEY_ID")
      .default("xxxx")
      .asString(),
    ACCESS_KEY_SECRET: env
      .get("ALIBABA_CLOUD_ACCESS_KEY_SECRET")
      .default("dddd")
      .asString(),
  },

  // OSS 配置（可选，无默认值）
  OSS: {
    ACCESS_KEY_ID: env.get("ACCESS_KEY_ID").asString(),
    SECRET_ACCESS_KEY: env.get("SECRET_ACCESS_KEY").asString(),
    BUCKET: env.get("BUCKET").asString(),
    REGION: env.get("REGION").asString(),
    ENDPOINT: env.get("ENDPOINT").asString(),
    DOMAIN: env.get("DOMAIN").asString(),
  },

  // 其他配置（带默认值）
  AUTH_COOKIE: env
    .get("AUTH_COOKIE")
    .default("better-auth.session-token")
    .asString(),
  SERVER_URL_KEY: env.get("SERVER_URL_KEY").default("x-url").asString(),
};
