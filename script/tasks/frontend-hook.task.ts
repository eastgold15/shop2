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
    // 1. 检查是否有 frontendHook 路径，没有则跳过
    if (!ctx.paths.frontendHook) {
      return;
    }

    // 2. 跳过没有对应 Service/Contract 的表
    if (!(ctx.artifacts.serviceName && ctx.artifacts.contractName)) {
      return;
    }

    // 3. 准备文件 (先移除缓存，确保读取最新)
    const existingFile = project.getSourceFile(ctx.paths.frontendHook);
    if (existingFile) {
      existingFile.forget();
    }

    let file;
    try {
      file = project.addSourceFileAtPath(ctx.paths.frontendHook);
    } catch {
      file = project.createSourceFile(ctx.paths.frontendHook, "", {
        overwrite: true, // 前端 Hooks 通常是纯生成的，建议直接覆盖
      });
    }

    // 4. 写入 Header
    if (file.getText().trim().length === 0) {
      file.insertText(0, `${GEN_HEADER}\n\n`);
    }

    // 5. 计算 Import 路径
    // 假设 api-client 在 src/lib/api-client.ts
    const apiClientPath = "@/lib/rpc";

    // 引入 React Query
    ensureImport(file, "@tanstack/react-query", [
      "useQuery",
      "useMutation",
      "useQueryClient",
    ]);
    // 引入 RPC client
    ensureImport(file, apiClientPath, ["rpc"]);
    // 引入类型 (从 @repo/contract 导入)
    const contract = ctx.artifacts.contractName;
    ensureImport(file, "@repo/contract", [contract!]);
    // 引入 handleEden 工具函数
    ensureImport(file, "@/lib/utils/base", ["handleEden"]);
    // 引入 toast
    ensureImport(file, "sonner", ["toast"]);

    // 6. 准备变量名
    const pascalName = ctx.pascalName; // e.g. User
    const camelName = ctx.tableName; // e.g. user
    const apiPath = `api.v1.${camelName}`;
    const contractName = ctx.artifacts.contractName!;

    // Query Key 常量名
    const queryKeyName = `${camelName}Keys`;

    // 7. 生成代码块
    const hooksCode = `
// --- Query Keys ---
export const ${queryKeyName} = {
  all: ['${camelName}'] as const,
  lists: () => [...${queryKeyName}.all, 'list'] as const,
  list: (params: ${contractName}['ListQuery']) => [...${queryKeyName}.lists(), params] as const,
  details: () => [...${queryKeyName}.all, 'detail'] as const,
  detail: (id: string) => [...${queryKeyName}.details(), id] as const,
};

// --- 列表查询 ---
export function use${pascalName}List(params?: ${contractName}['ListQuery'], enabled?: boolean) {
  return useQuery({
    queryKey: ${queryKeyName}.list(params || {}),
    queryFn: async () => await handleEden(rpc.${apiPath}.get({ query: params })),
    enabled: enabled ?? true,
  });
}

// --- 单个详情 ---
export function use${pascalName}Detail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: ${queryKeyName}.detail(id),
    queryFn: async () => await handleEden(rpc.${apiPath}({ id }).get()),
    enabled: enabled ?? !!id,
  });
}

// --- 创建 ---
export function useCreate${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ${contractName}['Create']) =>
      await handleEden(rpc.${apiPath}.post(data)),
    onSuccess: () => {
      toast.success("${pascalName}创建成功");
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建${pascalName}失败");
    },
  });
}

// --- 更新 ---
export function useUpdate${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ${contractName}['Update'] }) =>
      await handleEden(rpc.${apiPath}({ id }).put(data)),
    onSuccess: (_, variables) => {
      toast.success("${pascalName}更新成功");
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.detail(variables.id) });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新${pascalName}失败");
    },
  });
}

// --- 删除 ---
export function useDelete${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      await handleEden(rpc.${apiPath}({ id }).delete()),
    onSuccess: () => {
      toast.success("${pascalName}删除成功");
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除${pascalName}失败");
    },
  });
}
`;

    // 8. 检查是否已存在核心变量，不存在则追加
    const fileText = file.getText();
    if (fileText.includes(`export const ${queryKeyName}`)) {
      console.log(`     🔄 Hooks existing: ${ctx.tableName} (已存在，跳过)`);
    } else {
      file.addStatements(hooksCode);
      console.log(`     ➕ Frontend Hooks: ${ctx.paths.frontendHook}`);
    }
  },
};
