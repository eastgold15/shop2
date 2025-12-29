// scripts/plugins/service.plugin.ts

import * as path from "node:path";
import type { Project, SourceFile } from "ts-morph";
import {
  type GeneratorContext,
  type IGeneratorPlugin,
  upsertMethod,
} from "../core/engine";
import { existsSync } from "node:fs";
export class ServiceGenerator implements IGeneratorPlugin {
  name = "ServiceGenerator";



  async generate(project: Project, ctx: GeneratorContext) {

    const filePath = path.join(ctx.targetDir, `${ctx.tableName}.service.ts`);
    const sourceFile = existsSync(filePath)
      ? project.getSourceFileOrThrow(filePath)
      : project.createSourceFile(filePath, "", { overwrite: true });

    // 1. 确保 Imports 存在
    this.ensureImports(sourceFile, ctx);

    // 2. 获取或创建 Class
    const className = `${ctx.pascalName}Service`;
    let classDec = sourceFile.getClass(className);
    if (!classDec) {
      classDec = sourceFile.addClass({
        name: className,
        isExported: true,
      });
    }

    // 3. 生成 CRUD 方法 (精细化 AST 更新)

    // --- findAll ---
    upsertMethod(
      classDec,
      "findAll",
      // 直接生成具体的 Drizzle 查询代码，不依赖 BaseService
      `const { limit = 10, offset = 0, sort, ...filters } = query;
      
      const whereConditions = [];
      // 自动注入租户/站点隔离
      if (ctx.siteId) whereConditions.push(eq(${ctx.schemaKey}.siteId, ctx.siteId));
      if (ctx.auth?.tenantId) whereConditions.push(eq(${ctx.schemaKey}.tenantId, ctx.auth.tenantId));

      const data = await ctx.db
        .select()
        .from(${ctx.schemaKey})
        .where(and(...whereConditions))
        .limit(limit)
        .offset(offset);
        
      const total = await ctx.db.$count(${ctx.schemaKey}, and(...whereConditions));
      
      return { data, total };`,
      [
        { name: "query", type: `${ctx.pascalName}Contract["ListQuery"]` },
        { name: "ctx", type: "ServiceContext" },
      ]
    );

    // --- create ---
    upsertMethod(
      classDec,
      "create",
      `const insertData = {
        ...body,
        id: undefined, // 确保 ID 由数据库生成
        updatedAt: new Date(),
        createdAt: new Date(),
        // 自动注入审计字段
        ...(ctx.siteId ? { siteId: ctx.siteId } : {}),
        ...(ctx.auth ? { tenantId: ctx.auth.tenantId, createdBy: ctx.auth.userId } : {})
      };
      
      const [res] = await ctx.db.insert(${ctx.schemaKey}).values(insertData).returning();
      return res;`,
      [
        { name: "body", type: `${ctx.pascalName}Contract["Create"]` },
        { name: "ctx", type: "ServiceContext" },
      ]
    );

    // --- update ---
    upsertMethod(
      classDec,
      "update",
      `// 自动注入更新时间
       const updateData = { ...body, updatedAt: new Date() };
       
       const [res] = await ctx.db
         .update(${ctx.schemaKey})
         .set(updateData)
         .where(eq(${ctx.schemaKey}.id, id))
         .returning();
         
       return res;`,
      [
        { name: "id", type: "string" },
        { name: "body", type: `${ctx.pascalName}Contract["Update"]` },
        { name: "ctx", type: "ServiceContext" },
      ]
    );

    // --- delete ---
    upsertMethod(
      classDec,
      "delete",
      `const [res] = await ctx.db.delete(${ctx.schemaKey}).where(eq(${ctx.schemaKey}.id, id)).returning();
       return res;`,
      [
        { name: "id", type: "string" },
        { name: "ctx", type: "ServiceContext" },
      ]
    );

    return await Promise.resolve();
  }

  private ensureImports(sourceFile: SourceFile, ctx: GeneratorContext) {
    // 使用 AST 检查并添加 import，避免重复
    const requiredImports = [
      { named: ["eq", "and", "desc", "asc"], module: "drizzle-orm" },
      { named: [ctx.schemaKey], module: "@repo/contract" }, // 假设路径
      {
        named: [`${ctx.pascalName}Contract`],
        module: "@repo/contract",
      },
      { named: ["ServiceContext"], module: "../_lib/types" }, // 你的通用类型定义
    ];

    requiredImports.forEach((imp) => {
      const decl = sourceFile.getImportDeclaration(
        (d) => d.getModuleSpecifierValue() === imp.module
      );
      if (decl) {
        // 如果已存在，检查 named import 是否缺失并补全
        imp.named.forEach((name) => {
          const hasNamed = decl
            .getNamedImports()
            .some((n) => n.getName() === name);
          if (!hasNamed) decl.addNamedImport(name);
        });
      } else {
        sourceFile.addImportDeclaration({
          namedImports: imp.named,
          moduleSpecifier: imp.module,
        });
      }
    });
  }
}
