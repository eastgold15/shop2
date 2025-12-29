import * as path from "node:path";
import { type Project, VariableDeclarationKind } from "ts-morph";
import { ensureImport } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

const GEN_HEADER = `/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */`;

export const ControllerTask: Task = {
  name: "Generating Controller",
  run(project: Project, ctx: GenContext) {
    if (!ctx.config.stages.has("controller")) return;

    // 依赖检查：必须有 Service 和 Contract 才能生成 Controller
    if (!(ctx.artifacts.serviceName && ctx.artifacts.contractName)) {
      console.warn("     ⚠️ Missing Service/Contract, skipping Controller.");
      return;
    }

    // 1. 获取或创建源文件
    let file = project.getSourceFile(ctx.paths.controller);
    if (!file) {
      file = project.createSourceFile(ctx.paths.controller, "", {
        overwrite: true,
      });
    }

    // 2. 注入 Header (如果文件是空的或已生成)
    if (file.getText().length === 0 || file.getText().includes("🤖")) {
      // 简单的去重处理，避免重复添加 header
      const currentText = file.getText();
      if (!currentText.startsWith("/**")) {
        file.insertText(0, `${GEN_HEADER}\n\n`);
      }
    }

    // 3. 计算相对路径 (用于 import)
    // 目标: 从 controller 文件位置 -> 指向 contract/service 文件位置
    const dir = path.dirname(ctx.paths.controller);

    const getRelativeImport = (targetPath: string) => {
      let rel = path.relative(dir, targetPath).replace(/\.ts$/, "");
      if (!rel.startsWith(".")) rel = `./${rel}`;
      // 🔥 Windows 路径转正斜杠
      return rel.replace(/\\/g, "/");
    };

    const contractImportPath = getRelativeImport(ctx.paths.contract);
    const serviceImportPath = getRelativeImport(ctx.paths.service);

    // 4. 管理 Imports
    ensureImport(file, "elysia", ["Elysia", "t"]);
    ensureImport(file, "~/db/connection", ["dbPlugin"]); // 根据你实际项目调整
    ensureImport(file, "~/middleware/auth", ["authGuardMid"]); // 根据你实际项目调整

    // 引用 Contract
    ensureImport(file, contractImportPath, [ctx.artifacts.contractName]);
    // 引用 Service Class
    ensureImport(file, serviceImportPath, [ctx.artifacts.serviceName]);

    // 5. 实例化 Service
    // 生成代码: const service = new TenantService();
    const serviceInstanceName = "service";
    const serviceClassName = ctx.artifacts.serviceName;

    const serviceVar = file.getVariableDeclaration(serviceInstanceName);
    if (!serviceVar) {
      file.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
          {
            name: serviceInstanceName,
            initializer: `new ${serviceClassName}()`,
          },
        ],
      });
    }

    // 6. 生成 Controller
    // 变量名: tenantController
    const controllerName = `${ctx.tableName}Controller`;
    const contract = ctx.artifacts.contractName;
    const prefix = `/${ctx.tableName.toLowerCase()}`;

    // 构造完整的 Elysia 链式调用代码
    // 这里我们采用"全量覆盖 Variable Initializer"的策略，
    // 因为 Elysia 的链式调用是一个整体表达式，拆解 AST 更新非常复杂且不稳定。
    const controllerCode = `new Elysia({ prefix: "${prefix}" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get("/", ({ query, auth, db }) => ${serviceInstanceName}.findAll(query, { db, auth }), { query: ${contract}.ListQuery })
  .post("/", ({ body, auth, db }) => ${serviceInstanceName}.create(body, { db, auth }), { body: ${contract}.Create })
  .put("/:id", ({ params, body, auth, db }) => ${serviceInstanceName}.update(params.id, body, { db, auth }), { params: t.Object({ id: t.String() }), body: ${contract}.Update })
  .delete("/:id", ({ params, auth, db }) => ${serviceInstanceName}.delete(params.id, { db, auth }), { params: t.Object({ id: t.String() }) })`;

    const controllerVar = file.getVariableDeclaration(controllerName);

    // A. 新增 Controller
    if (controllerVar) {
      const stmt = controllerVar.getVariableStatement();
      const docs = stmt?.getJsDocs() || [];
      const isGenerated = docs.some((d) =>
        d.getInnerText().includes("@generated")
      );

      if (isGenerated) {
        // 对比代码是否变化，避免无效写入
        if (controllerVar.getInitializer()?.getText() !== controllerCode) {
          controllerVar.setInitializer(controllerCode);
          console.log(`     🔄 Updated: ${controllerName}`);
        }
      } else {
        console.log(`     🛡️ Skipped (Custom): ${controllerName}`);
      }
    } else {
      const stmt = file.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: controllerName,
            initializer: controllerCode,
          },
        ],
      });
      // 添加标记
      stmt.addJsDoc("@generated");
      console.log(`     ➕ Controller: ${controllerName}`);
    }

    // 更新 Context，如果有下游依赖
    // ctx.artifacts.controllerName = controllerName;
  },
};
