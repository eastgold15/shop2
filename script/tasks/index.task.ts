import type { Project } from "ts-morph";
import type { GenContext, Task } from "../core/types";

// 全局收集所有契约信息
const contracts: Array<{ fileName: string; pascalName: string }> = [];

export const IndexTask: Task = {
  name: "Generating Index",
  run(project: Project, ctx: GenContext) {
    if (!ctx.config.stages.has("contract")) return;

    // 收集契约信息
    contracts.push({
      fileName: `${ctx.tableName}.contract`,
      pascalName: ctx.pascalName,
    });

    ctx.artifacts.contractName = `${ctx.pascalName}Contract`;
  },
};

/**
 * 在所有契约生成完成后调用，生成 index.ts
 */
export function generateIndexFile(project: Project, indexFilePath: string) {
  let indexFile = project.getSourceFile(indexFilePath);
  if (!indexFile) {
    indexFile = project.createSourceFile(indexFilePath, "", {
      overwrite: true,
    });
  }

  // 清空现有内容 - 先获取所有语句再移除
  const statements = [...indexFile.getStatements()];
  statements.forEach((stmt) => stmt.remove());

  // 生成导入和导出语句
  const importStatements: string[] = [];
  const exportContracts: string[] = [];
  const exportTypes: string[] = [];

  for (const contract of contracts) {
    const fileName = contract.fileName;
    const pascalName = contract.pascalName;
    const contractName = `${pascalName}Contract`;

    importStatements.push(`export { ${contractName} } from "./${fileName}";`);
    exportContracts.push(`  ${contractName},`);
    exportTypes.push(`  export type { ${contractName} } from "./${fileName}";`);
  }

  // 生成文件内容
  const content = `// Auto-generated index file for all contracts
${importStatements.join("\n")}

// 统一导出所有契约对象
export const contracts = {
${exportContracts.join("\n")}};

// 统一导出所有契约类型
${exportTypes.join("\n")}
`;

  indexFile.replaceWithText(content);
  console.log(`\n✅ Generated index.ts with ${contracts.length} contracts`);

  // 清空收集器
  contracts.length = 0;
}
