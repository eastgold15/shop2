import {
  Node,
  type ObjectLiteralExpression,
  type Project,
  VariableDeclarationKind,
} from "ts-morph";
import {
  ensureImport,
  upsertExportedConst,
  upsertObjectProperty,
} from "../core/ast-utils";
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

    const tableVar = ctx.schemaKey; // e.g. "usersTable"
    // ============================================================
    // 2. 生成外部基础变量 (Base Variables)
    // ============================================================
    const fieldsVarName = `${ctx.pascalName}Fields`; // e.g. UsersFields
    const insertFieldsVarName = `${ctx.pascalName}InsertFields`; // e.g. UsersInsertFields

    // 生成 export const UsersFields = spread(usersTable, "select");
    upsertExportedConst(file, fieldsVarName, `spread(${tableVar}, "select")`);

    // 生成 export const UsersInsertFields = spread(usersTable, "insert");
    upsertExportedConst(
      file,
      insertFieldsVarName,
      `spread(${tableVar}, "insert")`
    );
    // ============================================================
    // 3. 生成 Contract 对象 (引用上面的变量)
    // ============================================================

    //  定义 Contract 对象
    const varName = `${ctx.pascalName}Contract`;
    let varDec = file.getVariableDeclaration(varName);

    if (!varDec) {
      const stmt = file.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [{ name: varName, initializer: "{}" }],
      });
      varDec = stmt.getDeclarations()[0];
      varDec.setInitializer("{}");
    }

    // 🔥【核心修复】智能获取 ObjectLiteralExpression
    // 兼容: const A = {}  和  const A = {} as const
    const initializer = varDec.getInitializer();
    let objLiteral: ObjectLiteralExpression | undefined;

    if (initializer) {
      if (Node.isObjectLiteralExpression(initializer)) {
        // 情况 A: const UserContract = { ... }
        objLiteral = initializer;
      } else if (Node.isAsExpression(initializer)) {
        // 情况 B: const UserContract = { ... } as const
        const expression = initializer.getExpression();
        if (Node.isObjectLiteralExpression(expression)) {
          objLiteral = expression;
        }
      }
    }

    if (!objLiteral) {
      console.error(`❌ 无法解析 ${varName} 的对象结构，请检查代码格式。`);
      return;
    }

    const sysFields = `["id", "createdAt", "updatedAt"]`;
    const updateOmitFields = `["id", "createdAt", "updatedAt", "siteId"]`;
    // 4. 填充 Response, Create, Update, ListQuery, ListResponse
    // Response: 使用对象展开引用外部变量
    // t.Object({ ...UsersFields })
    upsertObjectProperty(
      objLiteral,
      "Response",
      `t.Object({
        ...${fieldsVarName}
      })`
    );

    // Create: 引用 UsersInsertFields
    // t.Object({ ...t.Omit(t.Object(UsersInsertFields), [...]).properties })
    upsertObjectProperty(
      objLiteral,
      "Create",
      `t.Object({
        ...t.Omit(t.Object(${insertFieldsVarName}), ${sysFields}).properties
      })`
    );

    // Update
    upsertObjectProperty(
      objLiteral,
      "Update",
      `t.Partial(t.Object({
        ...t.Omit(t.Object(${insertFieldsVarName}), ${updateOmitFields}).properties
      }))`
    );

    // ListQuery: 使用 InsertFields (通常查询参数和插入字段有关，或者是 SelectFields)
    // 这里依然使用 InsertFields 的 Partial
    upsertObjectProperty(
      objLiteral,
      "ListQuery",
      `t.Object({
        ...t.Partial(t.Object(${insertFieldsVarName})).properties,
        ...PaginationParams.properties,
        ...SortParams.properties,
        search: t.Optional(t.String()),
      })`
    );

    // ListResponse
    upsertObjectProperty(
      objLiteral,
      "ListResponse",
      `t.Object({
        data: t.Array(t.Object({ ...${fieldsVarName} })),
        total: t.Number(),
      })`
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
