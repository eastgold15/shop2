import { treaty } from "@elysiajs/eden";
import { app } from "@/app/api/[[...slugs]]/route";
import { env } from "@/env";
export const rpc =
  typeof process !== "undefined"
    ? treaty(app).api
    : treaty<typeof app>(`http://localhost:${env.PORT || 3000}`).api;


