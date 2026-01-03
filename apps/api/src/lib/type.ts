import type { db } from "~/db/connection";
import type { UserDto } from "~/middleware/auth";

// // 用户类型（从 middleware 的 db.query.userTable.findFirst 返回）
// export type ServiceUser = typeof userTable.$inferSelect & {
//   roles: Array<{
//     dataScope: "all" | "dept_and_child" | "dept_only" | "self";
//     permissions: Array<{ name: string }>;
//   }>;

// };

export type DBtype = typeof db;

export interface ServiceContext {
  db: DBtype;
  user: UserDto;
  // 用户当前选中的部门ID（用于切换部门/站点操作）
  // 如果未指定，则使用用户的默认 deptId
  currentDeptId: string;
}
