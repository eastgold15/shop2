import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  /** The base URL of the server (optional if you're using the same domain) */
});
