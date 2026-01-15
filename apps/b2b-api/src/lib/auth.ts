import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from "@repo/contract";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { envConfig } from "~/lib/env";
import { db } from "../db/connection";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email/email";

// 将正则表达式移到顶层以提高性能
const URL_REPLACE_REGEX = /^(\w+:\/\/[^/]+)(\/.*)$/;
/**
 * Better-Auth 核心配置
 * 结合了 Drizzle ORM、邮箱验证、GitHub 社交登录以及自定义用户字段
 */
export const auth = betterAuth({

  // 服务端基础 URL，用于生成认证链接（邮件链接等）
  baseURL: envConfig.BETTER_AUTH_BASE_URL,
  // 用于加密会话和令牌的密钥，必须严格保密
  secret: envConfig.BETTER_AUTH_SECRET,

  // 插件配置：自动生成 OpenAPI (Swagger) 文档接口
  plugins: [openAPI()],

  // 数据库适配器：连接 Drizzle ORM
  database: drizzleAdapter(db, {
    provider: "pg", // 数据库类型
    schema: {
      user: userTable, // 用户基本信息表
      account: accountTable, // 第三方登录账号关联表
      session: sessionTable, // 用户会话表
      verification: verificationTable, // 验证码/验证链接表
    },
  }),

  advanced: {
    database: {
      // 禁用自动生成 ID，使用数据库自身的默认值（如 cuid 或 uuid）
      generateId: false,
    },
    useSecureCookies: true, // 强制开启，因为 Railway 外部是 HTTPS
    // 开发/特定环境下禁用来源检查，解决跨域或内网穿透时的访问限制
    disableOriginCheck: true,
    debug: true,
  },

  // 策略：常规邮箱密码登录
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // 注册后自动登录
    requireEmailVerification: false, // 暂时不需要邮箱验证即可登录
    // 重置密码邮件回调
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
      });
    },
  },

  // 邮箱验证配置
  emailVerification: {
    sendOnSignUp: false, // 注册时不自动发送验证邮件（由业务逻辑手动触发）
    sendVerificationEmail: async ({ user, url }) => {
      /**
       * 路径修正逻辑：
       * 由于后端接口通常挂载在 /api 下，这里将原链接手动插入 /api 前缀
       * 例如：http://localhost/auth/verify -> http://localhost/api/auth/verify
       */
      const newUrls = url.replace(URL_REPLACE_REGEX, "$1/api$2");
      console.log("验证邮件链接重定向至:", newUrls);

      await sendVerificationEmail({
        to: user.email,
        verificationUrl: newUrls,
      });
    },
  },

  // 自定义用户信息字段：扩展数据库 user 表的列
  user: {
    additionalFields: {
      // 多租户 ID，用于数据隔离
      tenantId: {
        type: "string",
        required: true, // 强制必填
        input: true, // 允许前端在注册接口中传入
      },
      // 部门 ID
      deptId: {
        type: "string",
        required: true,
        input: true,
      },
      // 扩展字段：手机号、职位、WhatsApp 账号
      phone: { type: "string", required: false, input: true },
      position: { type: "string", required: false, input: true },
      whatsapp: { type: "string", required: false, input: true },
    },
  },

  // 社交平台登录配置
  socialProviders: {
    github: {
      clientId: envConfig.GITHUB_CLIENT_ID!,
      clientSecret: envConfig.GITHUB_CLIENT_SECRET,
      // 动态开关：只有当环境变量配置了 ID 和 Secret 时才启用 GitHub 登录
      enabled: !!(envConfig.GITHUB_CLIENT_ID && envConfig.GITHUB_CLIENT_SECRET),
    },
  },

  // 安全配置：受信任的跨域来源
  // 将环境变量中的逗号分隔字符串转为数组
  trustedOrigins: [...envConfig.TRUSTED_ORIGINS.split(",")],

  // 会话管理策略
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 会话有效期：7 天
    updateAge: 60 * 60 * 24, // 刷新频率：每 24 小时更新一次数据库中的会话活跃时间
  },
});
