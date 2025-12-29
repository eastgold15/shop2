import * as path from "node:path";
import type { Project } from "ts-morph";
import { ensureImport, upsertMethod } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

export const ServiceTask: Task = {
  name: "Generating Service",
  async run(project: Project, ctx: GenContext) {
    if (!ctx.config.stages.has("service")) return;

    // 依赖检查
    if (!ctx.artifacts.contractName) {
      console.warn("   ⚠️ Missing Contract, skipping Service.");
      return;
    }

    const fileName = `${ctx.tableName}.service.ts`;
    const filePath = await path.join(ctx.targetDir, fileName);
    const file = project.createSourceFile(filePath, "", { overwrite: false });

    // 1. Imports
    ensureImport(file, "drizzle-orm", ["eq", "and", "desc"]);
    ensureImport(file, "@repo/contract/table.schema", [ctx.schemaKey]);
    ensureImport(file, "../_lib/types", ["ServiceContext"]); // 假设通用类型
    // 🔥 引用刚刚生成的 Contract
    ensureImport(file, `./${ctx.tableName}.contract`, [
      ctx.artifacts.contractName,
    ]);

    // 2. Class 定义
    const className = `${ctx.pascalName}Service`;
    let classDec = file.getClass(className);
    if (!classDec) {
      classDec = file.addClass({ name: className, isExported: true });
    }

    const contract = ctx.artifacts.contractName;

    // 3. 生成方法
    upsertMethod(
      classDec,
      "create",
      `const insertData = {
        ...body,
        // 自动注入租户信息
        ...(ctx.auth ? { tenantId: ctx.auth.tenantId, createdBy: ctx.auth.userId } : {})
      };
      const [res] = await ctx.db.insert(${ctx.schemaKey}).values(insertData).returning();
      return res;`,
      [
        { name: "body", type: `${contract}["Create"]` },
        { name: "ctx", type: "ServiceContext" },
      ]
    );

    upsertMethod(
      classDec,
      "findAll",
      `const { limit = 10, offset = 0, sort, ...filters } = query;
      const whereConditions = [];
      // 租户隔离
      if (ctx.auth?.tenantId) whereConditions.push(eq(${ctx.schemaKey}.tenantId, ctx.auth.tenantId));
      
      const data = await ctx.db.select().from(${ctx.schemaKey})
        .where(and(...whereConditions))
        .limit(limit).offset(offset);
      const total = await ctx.db.$count(${ctx.schemaKey}, and(...whereConditions));
      return { data, total };`,
      [
        { name: "query", type: `${contract}["ListQuery"]` },
        { name: "ctx", type: "ServiceContext" },
      ]
    );

    upsertMethod(
      classDec,
      "update",
      `const updateData = { ...body, updatedAt: new Date() };
       const [res] = await ctx.db.update(${ctx.schemaKey})
         .set(updateData)
         .where(eq(${ctx.schemaKey}.id, id))
         .returning();
       return res;`,
      [
        { name: "id", type: "string" },
        { name: "body", type: `${contract}["Update"]` },
        { name: "ctx", type: "ServiceContext" },
      ]
    );

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

    // 4. 更新上下文
    ctx.artifacts.serviceFile = fileName;
    ctx.artifacts.serviceName = className;
  },
};
