// scripts/main.ts
import * as path from "node:path";
import * as dbSchema from "../packages/contract/src/table.schema"; // 你的 Schema
import { SmartCodeEngine } from "./core/engine";
import { ServiceGenerator } from "./plugins/service.plugin";
import { existsSync } from "fs-extra";
// 引入其他 generator...

const engine = new SmartCodeEngine();

// 注册插件
const plugins = [
  new ServiceGenerator(),
  // new ControllerGenerator(), 
  // new ContractGenerator()
];

// 目标目录配置
const OUTPUT_DIRS = {
  B2B: path.resolve(__dirname, "../apps/b2badmin/server/modules"),
  WEB: path.resolve(__dirname, "../apps/web/server/modules"),
};

async function run() {
  const tableEntries = Object.entries(dbSchema).filter(([key]) => key.endsWith("Table"));

  for (const [key, schemaObj] of tableEntries) {
    const rawName = key.replace("Table", "");
    const tableName = rawName.toLowerCase(); // users
    const pascalName = rawName.charAt(0).toUpperCase() + rawName.slice(1); // Users

    // 1. 检查 Schema 变更 (快照对比)
    // 注意：这里简单用 key 做对比，实际应该对比 schemaObj 的结构 Hash
    // 如果你修改了表结构，这里需要感知到
    const needsUpdate = engine.needsUpdate(key, schemaObj);

    // 检查目标文件是否存在
    const targetFilePath = path.join(OUTPUT_DIRS.B2B, tableName, `${tableName}.service.ts`);
    const fileExists = existsSync(targetFilePath);

    // 如果Schema未变更且文件存在，则跳过
    if (!needsUpdate && fileExists) {
      console.log(`⏩ [SKIP] Schema 未变更且文件已存在: ${tableName}`);
      continue;
    }

    console.log(`\n📦 Processing Table: ${tableName}`);

    const ctx = {
      tableName,
      pascalName,
      schemaKey: key,
      targetDir: path.join(OUTPUT_DIRS.B2B, tableName), // 这里以 B2B 为例
    };

    // 2. 运行所有插件
    for (const plugin of plugins) {
      console.log(`  👉 Running ${plugin.name}...`);
      await plugin.generate(engine.project, ctx);
    }
  }

  // 3. 保存更改并写入磁盘
  await engine.save(Object.fromEntries(tableEntries));
}

run().catch(console.error);