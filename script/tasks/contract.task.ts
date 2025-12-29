import { type Project, SyntaxKind, VariableDeclarationKind } from "ts-morph";
import { ensureImport, upsertObjectProperty } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

export const ContractTask: Task = {
  name: "Generating Contract",
  run(project: Project, ctx: GenContext) {
    if (!ctx.config.stages.has("contract")) return;

    // 🔥 先从 project 中移除旧文件（如果存在），确保重新加载最新内容
    const existingFile = project.getSourceFile(ctx.paths.contract);
    if (existingFile) {
      existingFile.forget();
    }

    // 重新加载文件（从磁盘读取最新内容）
    let file;
    try {
      file = project.addSourceFileAtPath(ctx.paths.contract);
    } catch {
      // 文件不存在，创建新文件（不覆盖）
      file = project.createSourceFile(ctx.paths.contract, "", {
        overwrite: false,
      });
    }

    // 1. Imports
    ensureImport(file, "elysia", ["t"]);
    ensureImport(file, "../helper/utils", ["spread", "type InferDTO"]);
    ensureImport(file, "../helper/query-types.model", [
      "PaginationParams",
      "SortParams",
    ]);
    ensureImport(file, "../table.schema", [ctx.schemaKey]);

    // 2. 定义 Contract 对象
    const varName = `${ctx.pascalName}Contract`;
    let varDec = file.getVariableDeclaration(varName);

    if (!varDec) {
      const stmt = file.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [{ name: varName, initializer: "{}" }],
      });
      varDec = stmt.getDeclarations()[0];
      varDec.setInitializer("{} as const"); // 添加 as const
    }

    const objLiteral = varDec
      .getInitializerIfKindOrThrow(SyntaxKind.AsExpression)
      .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    // 3. 填充属性
    const tableVar = ctx.schemaKey;
    const sysFields = `["id", "createdAt", "updatedAt"]`;

    upsertObjectProperty(
      objLiteral,
      "Response",
      `t.Object(spread(${tableVar}, "select"))`
    );

    upsertObjectProperty(
      objLiteral,
      "Create",
      `t.Object(t.Omit(t.Object(spread(${tableVar}, "insert")), ${sysFields}).properties)`
    );

    upsertObjectProperty(
      objLiteral,
      "Update",
      `t.Partial(t.Object(t.Omit(t.Object(spread(${tableVar}, "insert")), ${sysFields}).properties))`
    );

    upsertObjectProperty(
      objLiteral,
      "ListQuery",
      `t.Object({
        ...t.Partial(t.Object(spread(${tableVar}, "insert"))).properties,
        ...PaginationParams.properties,
        ...SortParams.properties,
        search: t.Optional(t.String()),
      })`
    );

    upsertObjectProperty(
      objLiteral,
      "ListResponse",
      `t.Object({ data: t.Array(t.Object(spread(${tableVar}, "select"))), total: t.Number() })`
    );

    // 4. 确保 export type 存在
    const typeExportName = varName;
    const fileText = file.getFullText();
    if (!fileText.includes(`export type ${typeExportName} =`)) {
      file.insertStatements(
        file.getStatements().length,
        `\nexport type ${typeExportName} = InferDTO<typeof ${varName}>;\n`
      );
    }

    // 状态更新
    ctx.artifacts.contractName = `${ctx.pascalName}Contract`;
    console.log(`     ✅ Contract: ${ctx.paths.contract}`);
  },
};
