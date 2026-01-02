import { type Project, VariableDeclarationKind } from "ts-morph";
import { ensureImport } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

const GEN_HEADER = `/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */`;

const GEN_TAG = "@generated";

export const FrontendHookTask: Task = {
  name: "Generating Frontend Hooks",
  run(project: Project, ctx: GenContext) {
    // 1. 检查配置：如果没有配置前端输出路径，则跳过
    if (!ctx.paths.frontendHook) return;

    // 2. 检查是否应该生成 frontendHook（@onlyGen contract 会跳过）
    if (!ctx.config.stages.has("frontendHook")) {
      console.log("     🛡️ Skipped (@onlyGen contract): frontendHook");
      return;
    }

    // 必须要有 Contract 名称才能生成
    if (!ctx.artifacts.contractName) {
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
      // 文件不存在，创建新文件
      file = project.createSourceFile(ctx.paths.frontendHook, "", {
        overwrite: false,
      });
    }

    // 3. 写入 Header（仅在文件为空时）
    if (file.getText().trim().length === 0) {
      file.insertText(0, `${GEN_HEADER}\n\n`);
    }

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
    // 引入 toast
    ensureImport(file, "sonner", ["toast"]);
    // 引入 Contract (从 @repo/contract 导入)
    const contract = ctx.artifacts.contractName;
    ensureImport(file, "@repo/contract", [contract!]);

    // 5. 准备变量名
    const pascalName = ctx.pascalName; // 例如: User
    const pascalNamePlural = `${pascalName}s`; // 例如: Users (复数)
    const camelName = ctx.tableName; // 例如: user
    const apiPath = `/api/v1/${camelName}`;
    const contractName = ctx.artifacts.contractName!;
    const queryKeyName = `${camelName}Keys`;

    // 6. 定义各个 Hook 函数的代码生成器
    const hooks = [
      {
        name: queryKeyName,
        kind: "variable" as const,
        code: `export const ${queryKeyName} = {
  all: ['${camelName}'] as const,
  lists: () => [...${queryKeyName}.all, 'list'] as const,
  list: (params?: ${contractName}['ListQuery']) => [...${queryKeyName}.lists(), params] as const,
  details: () => [...${queryKeyName}.all, 'detail'] as const,
  detail: (id: string) => [...${queryKeyName}.details(), id] as const,
};`,
      },
      {
        name: `use${pascalNamePlural}List`,
        kind: "function" as const,
        code: `export function use${pascalNamePlural}List(params?: ${contractName}['ListQuery'], enabled?: boolean) {
  return useQuery({
    queryKey: ${queryKeyName}.list(params),
    queryFn: () => api.get<any, ${contractName}['ListQuery']>("${apiPath}", { params }),
    enabled: enabled ?? true,
  });
}`,
      },
      {
        name: `use${pascalName}Detail`,
        kind: "function" as const,
        code: `export function use${pascalName}Detail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: ${queryKeyName}.detail(id),
    queryFn: () => api.get<any>(\`${apiPath}/\${id}\`),
    enabled: enabled ?? !!id,
  });
}`,
      },
      {
        name: `useCreate${pascalName}`,
        kind: "function" as const,
        code: `export function useCreate${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ${contractName}['Create']) =>
      api.post<any, ${contractName}['Create']>("${apiPath}", data),
    onSuccess: () => {
      toast.success("${pascalName}创建成功");
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建${pascalName}失败");
    },
  });
}`,
      },
      {
        name: `useUpdate${pascalName}`,
        kind: "function" as const,
        code: `export function useUpdate${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ${contractName}['Update'] }) =>
      api.put<any, ${contractName}['Update']>(\`${apiPath}/\${id}\`, data),
    onSuccess: (_, variables) => {
      toast.success("${pascalName}更新成功");
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.detail(variables.id) });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新${pascalName}失败");
    },
  });
}`,
      },
      {
        name: `useDelete${pascalName}`,
        kind: "function" as const,
        code: `export function useDelete${pascalName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete<any>(\`${apiPath}/\${id}\`),
    onSuccess: () => {
      toast.success("${pascalName}删除成功");
      queryClient.invalidateQueries({ queryKey: ${queryKeyName}.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除${pascalName}失败");
    },
  });
}`,
      },
    ];

    // 7. 对每个 Hook 进行处理
    for (const hook of hooks) {
      if (hook.kind === "variable") {
        // 处理变量 (如 queryKeyName)
        const varDecl = file.getVariableDeclaration(hook.name);

        if (varDecl) {
          // 存在：检查是否自动生成
          const stmt = varDecl.getVariableStatement();
          const docs = stmt?.getJsDocs() || [];
          const isGenerated = docs.some((d) =>
            d.getInnerText().includes(GEN_TAG)
          );

          if (isGenerated) {
            // 去空格对比，避免格式化导致的无限更新
            const oldCode = varDecl
              .getInitializer()
              ?.getText()
              .replace(/\s/g, "");
            const newCode = hook.code
              .replace(/export const \w+ = /, "")
              .replace(/\s/g, "");

            if (oldCode !== newCode) {
              varDecl.setInitializer(
                hook.code.replace(/export const \w+ = /, "").replace(/;$/, "")
              );
              console.log(`     🔄 Updated: ${hook.name}`);
            }
          } else {
            console.log(`     🛡️ Skipped (Custom): ${hook.name}`);
          }
        } else {
          // 不存在：新建
          const stmt = file.addVariableStatement({
            declarationKind: VariableDeclarationKind.Const,
            isExported: true,
            declarations: [
              {
                name: hook.name,
                initializer: hook.code
                  .replace(/export const \w+ = /, "")
                  .replace(/;$/, ""),
              },
            ],
          });
          // 添加 @generated 标记
          stmt.addJsDoc({ description: `\n${GEN_TAG}` });
          console.log(`     ➕ Frontend Hook: ${hook.name}`);
        }
      } else {
        // 处理函数
        const funcDecl = file.getFunction(hook.name);

        if (funcDecl) {
          // 存在：检查是否自动生成
          const docs = funcDecl.getJsDocs() || [];
          const isGenerated = docs.some((d) =>
            d.getInnerText().includes(GEN_TAG)
          );

          if (isGenerated) {
            // 去空格对比
            const oldCode = funcDecl.getText().replace(/\s/g, "");
            const newCode = hook.code.replace(/\s/g, "");

            if (oldCode !== newCode) {
              // 原地替换，保持顺序
              funcDecl.replaceWithText(hook.code);
              console.log(` 🔄 Updated: ${hook.name}`);

              // 给新添加的函数添加 @generated 标记
              const newFunc = file.getFunction(hook.name);
              if (newFunc) {
                newFunc.addJsDoc({ description: `\n${GEN_TAG}` });
              }
              console.log(`     🔄 Updated: ${hook.name}`);
            }
          } else {
            console.log(`     🛡️ Skipped (Custom): ${hook.name}`);
          }
        } else {
          // 不存在：新建
          file.insertStatements(file.getStatements().length, hook.code);
          // 给新添加的函数添加 @generated 标记
          const newFunc = file.getFunction(hook.name);
          if (newFunc) {
            newFunc.addJsDoc({ description: `\n${GEN_TAG}` });
          }
          console.log(`     ➕ Frontend Hook: ${hook.name}`);
        }
      }
    }
  },
};
