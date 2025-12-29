import type { Project } from "ts-morph";

export interface GenConfig {
  skip: boolean; // 是否完全跳过
  stages: Set<"contract" | "service" | "controller">; // 需要生成的阶段
}

export interface GenContext {
  tableName: string; // "users" (文件夹名)
  pascalName: string; // "Users" (类名前缀)
  schemaKey: string; // "usersTable" (Schema 里的变量名)
  targetDir: string; // "src/modules/users"

  // ⚙️ 配置开关
  config: GenConfig;

  // 📦 产物状态 (Pipeline 中下游依赖上游的产物)
  artifacts: {
    contractFile?: string; // 契约文件路径
    contractName?: string; // "UsersContract"
    serviceFile?: string; // Service文件路径
    serviceName?: string; // "UsersService"
  };
}

export interface Task {
  name: string;
  run(project: Project, ctx: GenContext): Promise<void>;
}
