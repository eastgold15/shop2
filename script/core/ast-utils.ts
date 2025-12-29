import {
  type ClassDeclaration,
  Node,
  type ObjectLiteralExpression,
  Scope,
  type SourceFile,
  SyntaxKind,
} from "ts-morph";

const GEN_TAG = "@generated";
// 注意：保持格式一致，方便正则匹配
const DOC_BLOCK = `/** [Auto-Generated] Do not edit this tag to keep updates. ${GEN_TAG} */`;

/**
 * 🛠️ 确保 Import 存在（支持 type 和普通导入聚合）
 */
export function ensureImport(
  file: SourceFile,
  moduleSpecifier: string,
  namedImports: string[],
  isTypeOnly = false
) {
  let decl = file.getImportDeclaration(
    (d) => d.getModuleSpecifierValue() === moduleSpecifier
  );
  if (!decl) {
    decl = file.addImportDeclaration({ moduleSpecifier });
  }

  const existingNamed = decl.getNamedImports().map((n) => n.getName());
  for (const name of namedImports) {
    if (!existingNamed.includes(name)) {
      // ts-morph 的 addNamedImport 会自动处理 type 关键字
      decl.addNamedImport({ name, isTypeOnly });
    }
  }
}

/**
 * 🔥 [核心修复] 通用检查节点是否包含 @generated 标记
 * 使用 getLeadingCommentRanges() 直接读取节点前方的所有注释文本
 * 这种方法比 getJsDocs 更底层，能捕获 leadingTrivia 写入的注释
 */
function checkIsGenerated(node: Node): boolean {
  // 1. 获取该节点之前的所有注释范围
  const ranges = node.getLeadingCommentRanges();

  // 2. 遍历所有注释块
  for (const range of ranges) {
    const text = range.getText();
    // 3. 只要有一个注释包含 @generated，就认为是自动生成的
    if (text.includes(GEN_TAG)) {
      return true;
    }
  }

  return false;
}

/**
 * 🛠️ [修正版] 智能更新对象属性 (用于 Contract)
 * 使用 getLeadingCommentRanges() 来精准获取注释
 */
export function upsertObjectProperty(
  objLiteral: ObjectLiteralExpression,
  key: string,
  value: string
) {
  const prop = objLiteral.getProperty(key);

  // 1. 新增
  if (!prop) {
    objLiteral.addPropertyAssignment({
      name: key,
      initializer: value,
      // 使用 writer 写入带有换行的注释
      leadingTrivia: (writer) => writer.writeLine(DOC_BLOCK),
    });
    console.log(`     ➕ Property: ${key}`);
    return;
  }

  // 2. 检查标记
  if (prop.isKind(SyntaxKind.PropertyAssignment)) {
    const isGenerated = checkIsGenerated(prop);

    if (isGenerated) {
      // 对比 initializer 文本（忽略空格差异）
      const currentText = prop.getInitializer()?.getText().replace(/\s+/g, '');
      const newText = value.replace(/\s+/g, '');

      if (currentText !== newText) {
        prop.setInitializer(value);
        console.log(`     🔄 Updated: ${key}`);
      }
    } else {
      console.log(`     🛡️ Skipped (Custom): ${key}`);
    }
  }
}

/**
 * 🛠️ [修正版] 智能更新类方法 (用于 Service/Controller)
 */
export function upsertMethod(
  classDec: ClassDeclaration,
  name: string,
  body: string,
  params: { name: string; type: string }[] = [],
  returnType?: string
) {
  const method = classDec.getMethod(name);

  // 1. 新增
  if (!method) {
    classDec.addMethod({
      name,
      parameters: params,
      returnType,
      isAsync: true,
      scope: Scope.Public,
      statements: body,
      leadingTrivia: (w) => w.writeLine(DOC_BLOCK),
    });
    console.log(`     ➕ Method: ${name}`);
    return;
  }

  // 2. 检查标记
  // ClassMethod 支持直接 getJsDocs()，但为了统一逻辑，也使用通用检查
  const isGenerated = checkIsGenerated(method) || method.getJsDocs().some(d => d.getInnerText().includes(GEN_TAG));

  if (isGenerated) {
    method.setBodyText(body);
    // 更新参数类型以防 Schema 变更
    method.getParameters().forEach((p) => p.remove());
    params.forEach((p) => method.addParameter(p));
    if (returnType) method.setReturnType(returnType);
    console.log(`     🔄 Updated: ${name}`);
  } else {
    console.log(`     🛡️ Skipped (Custom): ${name}`);
  }
}

/**
 * 工具方法：提取节点前置 JSDoc 纯文本（保留用于 pipeline 中的表级 JSDoc 解析）
 * @param node 任意节点（通常是 VariableDeclaration）
 * @returns 纯净的 JSDoc 文本
 */
export function getLeadingJSDocText(node: Node): string {
  // 对于 VariableDeclaration，注释通常在 VariableStatement 上
  let targetNode = node;
  if (Node.isVariableDeclaration(node)) {
    const stmt = node.getVariableStatement();
    if (stmt) targetNode = stmt;
  }

  // 使用 getLeadingCommentRanges 获取紧邻节点的注释
  const ranges = targetNode.getLeadingCommentRanges();

  // 从后往前找，找到最后一个 JSDoc 块（/** ... */）
  for (let i = ranges.length - 1; i >= 0; i--) {
    const range = ranges[i];
    const text = range.getText();

    // 检查是否是 JSDoc 格式 (/** ... */)
    if (text.startsWith("/**")) {
      // 去除注释标记，提取纯文本
      return text
        .replace(/^\/\*\*+/, "")
        .replace(/\*+\/$/, "")
        .replace(/^\s*\*\s*/gm, "")
        .trim();
    }
  }

  return "";
}
