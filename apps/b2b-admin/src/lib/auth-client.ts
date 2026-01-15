import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include" // 必须开启，否则浏览器会丢弃 Set-Cookie 响应头
  }
  /** The base URL of the server (optional if you're using the same domain) */
});
