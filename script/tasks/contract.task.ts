
import { type Project, SyntaxKind, VariableDeclarationKind } from "ts-morph";
import { ensureImport, upsertObjectProperty } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

export const ContractTask: Task = {
  name: "Generating Contract",
  async run(project: Project, ctx: GenContext) {
    if (!ctx.config.stages.has("contract")) return;
    // 🔥 直接使用计算好的路径
    const file = await project.createSourceFile(ctx.paths.contract, "", { overwrite: false });

    const fileName = `${ctx.tableName}.contract.ts`;

    // const file = project.createSourceFile(filePath, "", { overwrite: true });

    // 1. Imports
    ensureImport(file, "elysia", ["t"]);
    ensureImport(file, "../../helper/utils", ["spread", "type InferDTO"]); // 假设路径
    ensureImport(file, "../../helper/query-types.model", [
      "PaginationParams",
      "SortParams",
    ]);
    ensureImport(file, "@repo/contract/table.schema", [ctx.schemaKey]);

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

    // 状态更新
    ctx.artifacts.contractName = `${ctx.pascalName}Contract`;
    console.log(`     ✅ Contract: ${ctx.paths.contract}`);
  },
};