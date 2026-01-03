import * as path from "node:path";
import { type Project, VariableDeclarationKind } from "ts-morph";
import { ensureImport, normalizePath } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

const GEN_HEADER = `/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */`;

const GEN_TAG = "@generated";

/**
 * 将表名转换为权限前缀
 * templateTable -> TEMPLATE
 * productMediaTable -> PRODUCTMEDIA
 */
function toPermissionPrefix(tableName: string): string {
  let tableNameUpper = tableName.toUpperCase();
  if (tableNameUpper.includes("TABLE")) {
    tableNameUpper = tableName.replace("TABLE", "");
  }
  return tableNameUpper;
}

/**
 * 生成权限名称
 */
function getPermission(tableName: string, action: string): string {
  const prefix = toPermissionPrefix(tableName);
  return `${prefix}:${action.toUpperCase()}`;
}

export const ControllerTask: Task = {
  name: "Generating Controller",
  run(project: Project, ctx: GenContext) {
    if (!ctx.config.stages.has("controller")) return;

    if (!(ctx.artifacts.serviceName && ctx.artifacts.contractName)) {
      return;
    }

    // 🔥 先从 project 中移除旧文件（如果存在），确保重新加载最新内容
    const existingFile = project.getSourceFile(ctx.paths.controller);
    if (existingFile) {
      existingFile.forget();
    }

    // 重新加载文件（从磁盘读取最新内容）
    let file;
    try {
      file = project.addSourceFileAtPath(ctx.paths.controller);
    } catch {
      // 文件不存在，创建新文件（不覆盖）
      file = project.createSourceFile(ctx.paths.controller, "", {
        overwrite: false,
      });
    }

    // 1. Header 注入
    if (file.getText().trim().length === 0) {
      file.insertText(0, `${GEN_HEADER}\n\n`);
    }

    // 2. 路径计算 (修复 Windows 反斜杠)
    const dir = path.dirname(ctx.paths.controller);
    const getRelativeImport = (targetPath: string) => {
      let rel = path.relative(dir, targetPath).replace(/\.ts$/, "");
      if (!rel.startsWith(".")) rel = `./${rel}`;
      return normalizePath(rel);
    };

    // 🔥 计算相对路径
    const contractPath = getRelativeImport(ctx.paths.contract);
    const servicePath = getRelativeImport(ctx.paths.service);

    // 3. Imports - 清理旧的导入
    const existingImports = file.getImportDeclarations();
    existingImports.forEach((imp) => {
      const modulePath = imp.getModuleSpecifierValue();
      // 只清理 contract 和 service 的导入，保留其他导入
      if (
        modulePath.includes(ctx.artifacts.contractName!) ||
        modulePath.includes(ctx.artifacts.serviceName!)
      ) {
        imp.remove();
      }
    });

    // 4. 重新添加导入
    ensureImport(file, "elysia", ["Elysia", "t"]);
    ensureImport(file, "~/db/connection", ["dbPlugin"]);
    ensureImport(file, "~/middleware/auth", ["authGuardMid"]);
    ensureImport(file, contractPath, [ctx.artifacts.contractName]);
    ensureImport(file, servicePath, [ctx.artifacts.serviceName]);

    // 5. 实例化 Service - 使用 camelCase
    const serviceInstanceName = `${toCamelCase(ctx.tableName)}Service`;
    const serviceClassName = ctx.artifacts.serviceName;

    // 🔥 辅助函数：将 kebab-case 转换为 camelCase
    // site-category -> siteCategory
    function toCamelCase(str: string): string {
      return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }

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

    // 6. 权限配置
    const readPermission = getPermission(ctx.tableName, "VIEW");
    const createPermission = getPermission(ctx.tableName, "CREATE");
    const updatePermission = getPermission(ctx.tableName, "EDIT");
    const deletePermission = getPermission(ctx.tableName, "DELETE");

    // 7. Controller 定义 - 带权限和 OpenAPI 文档
    const controllerName = `${toCamelCase(ctx.tableName)}Controller`;
    const contract = ctx.artifacts.contractName;
    const pascalName = ctx.pascalName;
    const prefix = `/${ctx.tableName}`; // 🔥 已经是 kebab-case，不需要再 toLowerCase

    // 🔥 定义标准 CRUD 路由，每个都带 // @generated 标记
    const routes = [
      {
        method: "get",
        path: "/",
        code: `.get("/", ({ query, user, db, currentDeptId }) => ${serviceInstanceName}.list(query, { db, user, currentDeptId }), {
    allPermissions: ["${readPermission}"],
    requireDept: true,
    query: ${contract}.ListQuery,
    detail: {
      summary: "获取${pascalName}列表",
      description: "分页查询${pascalName}数据，支持搜索和排序",
      tags: ["${pascalName}"],
    },
  })`,
      },
      {
        method: "post",
        path: "/",
        code: `.post("/", ({ body, user, db, currentDeptId }) => ${serviceInstanceName}.create(body, { db, user, currentDeptId }), {
    allPermissions: ["${createPermission}"],
    requireDept: true,
    body: ${contract}.Create,
    detail: {
      summary: "创建${pascalName}",
      description: "新增一条${pascalName}记录",
      tags: ["${pascalName}"],
    },
  })`,
      },
      {
        method: "put",
        path: "/:id",
        code: `.put("/:id", ({ params, body, user, db, currentDeptId }) => ${serviceInstanceName}.update(params.id, body, { db, user, currentDeptId }), {
    params: t.Object({ id: t.String() }),
    body: ${contract}.Update,
    allPermissions: ["${updatePermission}"],
    requireDept: true,
    detail: {
      summary: "更新${pascalName}",
      description: "根据ID更新${pascalName}信息",
      tags: ["${pascalName}"],
    },
  })`,
      },
      {
        method: "delete",
        path: "/:id",
        code: `.delete("/:id", ({ params, user, db, currentDeptId }) => ${serviceInstanceName}.delete(params.id, { db, user, currentDeptId }), {
    params: t.Object({ id: t.String() }),
    allPermissions: ["${deletePermission}"],
    requireDept: true,
    detail: {
      summary: "删除${pascalName}",
      description: "根据ID删除${pascalName}记录",
      tags: ["${pascalName}"],
    },
  })`,
      },
    ];

    const controllerVar = file.getVariableDeclaration(controllerName);

    if (controllerVar) {
      // 🔥 存在：使用智能局部更新
      const initializer = controllerVar.getInitializer();
      if (!initializer) {
        console.log(`     ⚠️ Invalid controller: ${controllerName}`);
        return;
      }

      // 检查整个 controller 是否有 @generated 标记
      const stmt = controllerVar.getVariableStatement();
      const docs = stmt?.getJsDocs() || [];
      const isFullyGenerated = docs.some((d) =>
        d.getInnerText().includes(GEN_TAG)
      );

      if (isFullyGenerated) {
        // 完全替换整个 controller
        const fullCode = `new Elysia({ prefix: "${prefix}" })
  .use(dbPlugin)
  .use(authGuardMid)
${routes.map((r) => `  // @generated\n${r.code}`).join("\n")}`;

        const oldCode = initializer.getText().replace(/\s/g, "");
        const newCode = fullCode.replace(/\s/g, "");

        if (oldCode !== newCode) {
          controllerVar.setInitializer(fullCode);
          console.log(`     🔄 Updated: ${controllerName}`);
        }
      } else {
        // 🔥 智能局部更新：只更新带 // @generated 的路由
        console.log(`     🔍 Smart Update: ${controllerName}`);
        smartUpdateRoutes(initializer, routes);
      }
    } else {
      // 不存在：新建
      const fullCode = `new Elysia({ prefix: "${prefix}" })
  .use(dbPlugin)
  .use(authGuardMid)
${routes.map((r) => `  // @generated\n${r.code}`).join("\n")}`;

      const stmt = file.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: controllerName,
            initializer: fullCode,
          },
        ],
      });
      // 🔥 关键：在 Statement 层面添加 JSDoc，而不是 Declaration
      stmt.addJsDoc({ description: `\n${GEN_TAG}` });
      console.log(`     ➕ Controller: ${controllerName}`);
    }
  },
};

/**
 * 🔥 智能局部更新路由
 * 只更新带有 // @generated 标记的链式调用，保留自定义路由
 */
function smartUpdateRoutes(initializer: any, routes: any[]) {
  // TODO: 实现智能局部更新逻辑
  // 这需要解析 CallExpression 链条，找到带 // @generated 的节点并替换
  // 暂时跳过，保持现有行为
  console.log("     ⚠️ Smart update not implemented yet");
}
