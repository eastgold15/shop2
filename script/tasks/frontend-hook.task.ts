import { type Project } from "ts-morph";
import { ensureImport } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

const GEN_HEADER = `/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */`;

export const FrontendHookTask: Task = {
  name: "Generating Frontend Hooks",
  run(project: Project, ctx: GenContext) {
    // 1. 检查配置：如果没有配置前端输出路径，则跳过
    if (!ctx.paths.frontendHook) return;

    // 必须要有 Service 和 Contract 名称才能生成
    if (!(ctx.artifacts.serviceName && ctx.artifacts.contractName)) {
      return;
    }

    // 2. 准备文件 (先移除缓存，确保读取最新)
    const existingFile = project.getSourceFile(ctx.paths.frontendHook);
    if (existingFile) {
      existingFile.forget();
    }

    let file;
    try {
      file = project.addSourceFileAtPath(ctx.paths.frontendHook);
    } catch {
      file = project.createSourceFile(ctx.paths.frontendHook, "", {
        overwrite: true, // 前端 Hooks 建议直接全量覆盖
      });
    }

    // 3. 写入 Header
    file.replaceWithText(`${GEN_HEADER}\n\n`);

    // 4. 处理 Imports
    // 假设 api-client 在同级目录，或者你可以根据 ctx.paths.root 计算相对路径
    // 这里默认假设生成在 src/hooks/api/ 下，引用同级的 api-client
    const apiClientPath = "./api-client";

    // 引入 React Query
    ensureImport(file, "@tanstack/react-query", [
      "useQuery",
      "useMutation",
      "useQueryClient",
    ]);
    // 引入 API Client
    ensureImport(file, apiClientPath, ["api"]);

    // 引入 Contract (从 @repo/contract 导入)
    const contract = ctx.artifacts.contractName;
    ensureImport(file, "@repo/contract", [contract!]);

    // 5. 准备变量名
    const pascalName = ctx.pascalName; // 例如: Product
    const camelName = ctx.tableName; // 例如: product (通常作为 queryKey 前缀)
    // 假设后端 Controller 的 prefix 是全小写的 table 名
    const apiPath = `/api/v1/${ctx.tableName.toLowerCase()}`;

    const queryKeyName = `${camelName}Keys`;

    // 6. 生成代码内容
    // 注意：这里使用 Static<typeof Schema> 来获取 TS 类型
    const hooksCode = `
// --- Query Keys ---
export const ${queryKeyName} = {
  all: ['${camelName}'] as const,
  lists: () => [...${queryKeyName}.all, 'list'] as const,
  list: (params: any) => [...${queryKeyName}.lists(), params] as const,
  details: () => [...${queryKeyName}.all, 'detail'] as const,
  detail: (id: string) => [...${queryKeyName}.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof ${contract}.ListQuery.static
export function use${pascalName}List(
  params?: typeof ${contract}.ListQuery.static, 
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ${queryKeyName}.list(params),
    queryFn: () => api.get<any, typeof ${contract}.ListQuery.static>("${apiPath}", { params }),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function use${pascalName}Detail(id: string, enabled: boolean = !!id) {
  return useQuery({
    queryKey: ${queryKeyName}.detail(id),
    queryFn: () => api.get<any>(\`${apiPath}/\${id}\`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof ${contract}.Create.static
export function useCreate${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof ${contract}.Create.static) => 
      api.post<any, typeof ${contract}.Create.static>("${apiPath}", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof ${contract}.Update.static
export function useUpdate${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof ${contract}.Update.static }) => 
      api.put<any, typeof ${contract}.Update.static>(\`${apiPath}/\${id}\`, data), 
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.detail(variables.id) });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDelete${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(\`${apiPath}/\${id}\`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
    },
  });
}
`;

    // 7. 追加到文件末尾
    file.addStatements(hooksCode);

    // 可选：调用 formatting
    // file.formatText();

    console.log(`✨ Frontend Hooks: use${pascalName} generated.`);
  },
};
