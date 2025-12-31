import type { userTable } from "@repo/contract";
import type { db } from "~/db/connection";

// 用户类型（从 middleware 的 db.query.userTable.findFirst 返回）
export type ServiceUser = typeof userTable.$inferSelect & {
  roles: Array<{
    dataScope: "all" | "dept_and_child" | "dept_only" | "self";
    permissions: Array<{ name: string }>;
  }>;
};

export interface ServiceContext {
  db: typeof db;
  user: ServiceUser;
  getScopeObj: () => Promise<{
    tenantId: string;
    deptId: string | { in: string[] };
    createdBy: string;
  }>;
}
