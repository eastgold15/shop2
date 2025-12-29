import * as path from "node:path";
import type { Project } from "ts-morph";
import { ensureImport } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

export const ControllerTask: Task = {
  name: "Generating Controller",
  async run(project: Project, ctx: GenContext) {
    if (!ctx.config.stages.has("controller")) return;
    if (!(ctx.artifacts.serviceName && ctx.artifacts.contractName)) {
      console.warn("   ⚠️ Missing Service/Contract, skipping Controller.");
      return;
    }
    const file = await project.createSourceFile(ctx.paths.controller, "", { overwrite: false });

    // 计算相对路径
    const dir = path.dirname(ctx.paths.controller);
    const fileName = `${ctx.tableName}.controller.ts`;
    // const filePath = await path.join(ctx.targetDir, fileName);
    let contractRel = path.relative(dir, ctx.paths.contract).replace(/\.ts$/, "");
    if (!contractRel.startsWith(".")) contractRel = `./${contractRel}`;

    let serviceRel = path.relative(dir, ctx.paths.service).replace(/\.ts$/, "");
    if (!serviceRel.startsWith(".")) serviceRel = `./${serviceRel}`;


    // 1. Imports
    ensureImport(file, "elysia", ["Elysia", "t"]);
    ensureImport(file, "~/middleware/auth", ["authGuardMid"]); // 假设中间件路径
    // 引用 Service 和 Contract
    // 🔥 引用同级文件
    ensureImport(file, contractRel, [ctx.artifacts.contractName]);
    ensureImport(file, serviceRel, [ctx.artifacts.serviceName]);

    // 2. 生成 Elysia App 变量
    // 这里因为是链式调用，AST 操作比较复杂，我们简单使用替换或追加模式
    // 对于 Controller，通常建议全量生成（因为很少手动改 Controller 内部逻辑，改都在 Service）
    // 或者使用 upsert 方式维护一个 Class，然后 export new Class()

    const varName = `${ctx.tableName}Controller`;
    const service = `new ${ctx.artifacts.serviceName}()`; // 实例化 Service
    const contract = ctx.artifacts.contractName;

    // 简单起见，这里演示 Class 风格的 Controller 封装，或者直接 VariableDeclaration
    const code = `
export const ${varName} = new Elysia({ prefix: "/${ctx.tableName}" })
  .use(authGuardMid)
  /** @generated */
  .post("/", ({ body, db, auth }) => ${service}.create(body, { db, auth }), { body: ${contract}.Create })
  /** @generated */
  .get("/", ({ query, db, auth }) => ${service}.findAll(query, { db, auth }), { query: ${contract}.ListQuery })
  /** @generated */
  .put("/:id", ({ params, body, db, auth }) => ${service}.update(params.id, body, { db, auth }), { params: t.Object({ id: t.String() }), body: ${contract}.Update })
  /** @generated */
  .delete("/:id", ({ params, db, auth }) => ${service}.delete(params.id, { db, auth }), { params: t.Object({ id: t.String() }) });
    `.trim();

    // Controller 比较特殊，建议如果文件不存在则创建，如果存在则由人工维护，或者使用更复杂的 AST 查找链式调用
    // 这里采用：如果不存在则创建基础模板
    if (file.getText().length < 10) {
      file.replaceWithText(code);
      console.log(`     ✨ Created Controller: ${fileName}`);
    } else {
      console.log(
        "     🛡️ Controller exists, skipping to protect custom routes."
      );
    }
  },
};
