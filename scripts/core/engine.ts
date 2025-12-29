// scripts/core/engine.ts

import * as crypto from "node:crypto";
import * as path from "node:path";
import * as fs from "fs-extra";
import {
  type ClassDeclaration,
  type IndentationText,
  Project,
  Scope,
  type SourceFile,
} from "ts-morph";

const SNAPSHOT_DIR = path.resolve(process.cwd(), "./auto-gen/snapshots");

export interface GeneratorContext {
  tableName: string; // 例如 "users"
  pascalName: string; // 例如 "Users"
  schemaKey: string; // 例如 "usersTable"
  targetDir: string; // 目标目录
}

export interface IGeneratorPlugin {
  name: string;
  generate(project: Project, ctx: GeneratorContext): Promise<void>;
}

export class SmartCodeEngine {
  readonly project: Project;
  private readonly snapshots: Record<string, string> = {};
  private readonly snapshotPath = path.join(SNAPSHOT_DIR, "schema-hash.json");

  constructor() {
    this.project = new Project({
      manipulationSettings: {
        indentationText: 2 as unknown as IndentationText, // 2空格缩进
        useTrailingCommas: true,
      },
    });
    fs.ensureDirSync(SNAPSHOT_DIR);
    if (fs.existsSync(this.snapshotPath)) {
      this.snapshots = fs.readJSONSync(this.snapshotPath);
    }
  }

  // 计算 Schema 的 Hash，用于快照对比
  // private computeHash(content: any): string {
  //   return crypto
  //     .createHash("md5")
  //     .update(JSON.stringify(content))
  //     .digest("hex");
  // }

  // 计算 Schema 的 Hash，用于快照对比
  private computeHash(content: any): string {
    // 使用自定义的序列化函数来处理循环引用
    const seen = new WeakSet();

    const stringify = (obj: any): string => {
      if (obj === null || typeof obj !== "object") {
        return JSON.stringify(obj);
      }

      if (seen.has(obj)) {
        return "[Circular]";
      }
      seen.add(obj);

      if (Array.isArray(obj)) {
        const result = obj.map((item) => stringify(item));
        seen.delete(obj);
        return `[${result.join(",")}]`;
      }

      const keys = Object.keys(obj).sort();
      const result = keys.map((key) => {
        // 跳过函数和Symbol类型的属性
        if (typeof obj[key] === "function" || typeof obj[key] === "symbol") {
          return `${JSON.stringify(key)}:"[Function]"`;
        }
        return `${JSON.stringify(key)}:${stringify(obj[key])}`;
      });

      seen.delete(obj);
      return `{${result.join(",")}}`;
    };

    return crypto.createHash("md5").update(stringify(content)).digest("hex");
  }
  // 核心：加载或创建源文件
  loadSourceFile(filePath: string): SourceFile {
    if (fs.existsSync(filePath)) {
      return this.project.addSourceFileAtPath(filePath);
    }
    return this.project.createSourceFile(filePath, "", { overwrite: true });
  }

  // 核心：保存所有更改并更新快照
  async save(schemaMap: Record<string, any>) {
    await this.project.save();

    // 更新快照
    for (const [key, val] of Object.entries(schemaMap)) {
      this.snapshots[key] = this.computeHash(val);
    }
    fs.writeJSONSync(this.snapshotPath, this.snapshots, { spaces: 2 });
    console.log("✨ 所有文件已通过 AST 同步完成，快照已更新。");
  }

  // 检查是否需要更新 (快照对比)
  needsUpdate(key: string, content: any): boolean {
    const newHash = this.computeHash(content);
    return this.snapshots[key] !== newHash;
  }
}

/**
 * 🛠️ AST 辅助函数：智能合并方法
 * 如果方法存在且有 @generated 标记 -> 更新
 * 如果方法存在且无标记 -> 跳过 (用户自定义)
 * 如果方法不存在 -> 创建
 */
export function upsertMethod(
  classDec: ClassDeclaration,
  methodName: string,
  methodBody: string,
  params: { name: string; type: string }[] = [],
  returnType?: string,
  isAsync = true
) {
  const existingMethod = classDec.getMethod(methodName);

  // 使用单行JSDoc注释，避免多行注释格式问题
  const docText =
    "🤖 [Auto-Generated] Do not edit this tag to keep updates. @generated";

  // 1. 如果方法不存在，直接创建
  if (!existingMethod) {
    const method = classDec.addMethod({
      name: methodName,
      parameters: params,
      returnType,
      isAsync,
      scope: Scope.Public,
      statements: methodBody,
    });
    method.addJsDoc(docText);
    console.log(`   └─ ➕ 新增方法: ${methodName}`);
    return;
  }

  // 2. 如果存在，检查是否有 @generated 标记
  const jsDocs = existingMethod.getJsDocs();
  const isGenerated = jsDocs.some((doc) =>
    doc.getInnerText().includes("@generated")
  );

  if (isGenerated) {
    // 3. 有标记，进行覆盖更新 - 先清理现有JSDoc，再添加新的
    existingMethod.getJsDocs().forEach((doc) => doc.remove());
    existingMethod.setBodyText(methodBody);
    existingMethod.setReturnType(returnType || "any");
    existingMethod.addJsDoc(docText);
    console.log(`   └─ 🔄 更新方法: ${methodName}`);
  } else {
    // 4. 无标记，视为用户自定义代码，跳过
    console.log(`   └─ 🛡️ 跳过自定义方法: ${methodName}`);
  }
}
