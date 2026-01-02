import { type CallExpression, type Project } from "ts-morph";
import { ensureImport } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

const GEN_HEADER = `/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * 🚀 基于后端 Controller 实际路由扫描生成
 * ⚠️ 每次运行 gen 命令都会覆盖此文件
 * --------------------------------------------------------
 */`;

/**
 * 路由元数据接口
 */
interface RouteMeta {
  method: string; // get, post, put ...
  path: string; // /, /:id, /tree, /:id/move
  hookName: string; // useUserList, useUserDetail
  queryKeyTag: string; // list, detail, tree
  hasParams: boolean; // 是否有 :id
  isMutation: boolean; // 是否是修改类操作
}

export const FrontendHookTask: Task = {
  name: "Scanning & Generating Hooks",
  run(project: Project, ctx: GenContext) {
    if (!ctx.paths.frontendHook) return;
    if (!ctx.artifacts.contractName) return;

    // 1. 🔥 核心步骤：先读取生成的 Controller 文件
    // 必须确保 ControllerTask 已经跑完，或者文件已经存在
    const controllerFile = project.getSourceFile(ctx.paths.controller);
    if (!controllerFile) {
      console.warn(`⚠️ Controller file not found: ${ctx.paths.controller}`);
      return;
    }

    // 2. 解析 Controller AST，提取路由信息
    const routes = parseControllerRoutes(controllerFile, ctx.pascalName);
    if (routes.length === 0) return;

    // 3. 准备前端 Hook 文件
    const hookFilePath = ctx.paths.frontendHook;
    const existingHookFile = project.getSourceFile(hookFilePath);
    if (existingHookFile) existingHookFile.forget();

    let file;
    try {
      file = project.createSourceFile(hookFilePath, "", { overwrite: true });
    } catch {
      return;
    }

    file.insertText(0, `${GEN_HEADER}\n\n`);

    // 4. 基础设置
    const entityName = ctx.tableName; // e.g., sitecategory
    const pascalName = ctx.pascalName; // e.g., SiteCategory
    const contractName = ctx.artifacts.contractName; // e.g., SiteCategoryContract
    // 假设 api-client 在同级或上级，这里简化为 api-client
    const apiClientPath = "./api-client";

    ensureImport(file, "@tanstack/react-query", [
      "useQuery",
      "useMutation",
      "useQueryClient",
    ]);
    ensureImport(file, apiClientPath, ["api"]);
    ensureImport(file, "@repo/contract", [contractName]);

    // 5. 生成 Query Keys 对象
    const camelName = pascalName.charAt(0).toLowerCase() + pascalName.slice(1);
    const queryKeyVar = `${camelName}Keys`;

    // 动态生成 Keys：除了基础的 all/lists/details，还要把扫描到的自定义路由加进去
    const customKeys = routes
      .filter((r) => r.queryKeyTag !== "list" && r.queryKeyTag !== "detail")
      .map(
        (r) =>
          `${r.queryKeyTag}: (params?: any) => [...${queryKeyVar}.all, '${r.queryKeyTag}', params] as const,`
      )
      .join("\n  ");

    const queryKeysCode = `
    export const ${queryKeyVar} = {
      all: ['${entityName}'] as const,
      lists: () => [...${queryKeyVar}.all, 'list'] as const,
      list: (params: any) => [...${queryKeyVar}.lists(), params] as const,
      details: () => [...${queryKeyVar}.all, 'detail'] as const,
      detail: (id: string) => [...${queryKeyVar}.details(), id] as const,
      ${customKeys}
    };`;

    file.addStatements(queryKeysCode);

    // 6. 遍历路由生成 Hooks
    const statements: string[] = [];

    // 获取 prefix (从 parseControllerRoutes 内部其实更好拿，这里简单处理)
    // 假设 parseControllerRoutes 返回的 path 已经是基于 controller prefix 拼接好的完整 API 路径
    // 如果不是，我们需要在下面 parse 时把 prefix 拼进去。
    // 为了稳健，我们让 parseControllerRoutes 返回完整路径。

    for (const route of routes) {
      statements.push(
        generateHookCode(route, contractName, queryKeyVar, pascalName)
      );
    }

    file.addStatements(statements.join("\n"));
    console.log(
      `     ✨ Scanned ${routes.length} routes -> Generated Hooks: ${hookFilePath}`
    );
  },
};

/**
 * 🛠️ AST 解析器：扫描 Controller 获取路由
 */
function parseControllerRoutes(
  sourceFile: any,
  entityPascalName: string
): RouteMeta[] {
  const routes: RouteMeta[] = [];

  // 1. 找到 Controller 变量定义 (e.g. const userController = ...)
  const varDecls = sourceFile.getVariableDeclarations();
  const controllerDecl = varDecls.find((v: any) =>
    v.getName().toLowerCase().includes("controller")
  );

  if (!controllerDecl) return [];

  // 2. 获取初始化部分 (new Elysia({ prefix: '/...' }).get(...).post(...))
  let expression = controllerDecl.getInitializer();

  // 3. 提取 Prefix
  let apiPrefix = "";

  // 我们需要回溯链式调用，找到最底层的 new Elysia(...)
  // ts-morph 的 getInitializer() 返回的是整个链式调用的最外层
  // 我们需要一层层 .getExpression() 剥洋葱，直到找到 new Elysia

  const callStack: CallExpression[] = [];

  while (expression && expression.getKindName() === "CallExpression") {
    callStack.push(expression as CallExpression);
    // 向下一层剥 ( .get(...) 的左边是 .use(...) )
    expression = (expression as CallExpression).getExpression();
    if (expression.getKindName() === "PropertyAccessExpression") {
      // a.b() -> expression 是 a.b, expression.expression 是 a
      expression = (expression as any).getExpression();
    }
  }

  // 此时 expression 应该是 new Elysia(...)
  if (expression && expression.getKindName() === "NewExpression") {
    const args = (expression as any).getArguments();
    if (
      args.length > 0 &&
      args[0].getKindName() === "ObjectLiteralExpression"
    ) {
      const prefixProp = args[0].getProperty("prefix");
      if (prefixProp?.getInitializer()) {
        apiPrefix = prefixProp.getInitializer().getText().replace(/['"]/g, "");
      }
    }
  }

  // 默认加上 /api/v1 如果 controller 里只是 /user (根据你的项目约定)
  // 如果你的 controller prefix 已经是全路径，则不需要。这里假设 controller 写的是 /user
  const fullPrefix = `/api/v1${apiPrefix}`;

  // 4. 反向遍历调用栈 (从里到外: .get -> .post -> ...)
  // 注意：CallStack 是从最外层(最后调用的)开始的，我们要倒序或者顺序都可以，关键是解析
  for (const call of callStack) {
    // 获取方法名: get, post, put, delete, patch
    const propertyAccess = call.getExpression();
    if (propertyAccess.getKindName() !== "PropertyAccessExpression") continue;

    const method = (propertyAccess as any).getName(); // "get", "post"
    const allowedMethods = ["get", "post", "put", "delete", "patch"];

    if (!allowedMethods.includes(method)) continue;

    // 获取路径参数: .get("/", ...)
    const args = call.getArguments();
    if (args.length === 0) continue;

    const pathArg = args[0];
    let routePath = "";
    if (pathArg.getKindName() === "StringLiteral") {
      routePath = pathArg.getText().replace(/['"]/g, "");
    }

    // 💡 智能推断 Hook 名称
    // 组合: method + routePath
    // GET / -> List
    // GET /:id -> Detail
    // POST / -> Create
    // PUT /:id -> Update
    // DELETE /:id -> Delete
    // GET /tree -> Tree
    // PATCH /:id/move -> Move

    let hookAction = "";
    let queryKeyTag = "";
    const isIdRoute = routePath.includes(":id");
    const cleanPath = routePath.replace("/:id", "").replace(/^\//, ""); // remove leading slash

    if (method === "get") {
      if (routePath === "/" || routePath === "") {
        hookAction = "List";
        queryKeyTag = "list";
      } else if (isIdRoute && cleanPath === "") {
        hookAction = "Detail";
        queryKeyTag = "detail";
      } else {
        // e.g. /tree -> Tree, /stats/daily -> StatsDaily
        hookAction = toPascalCase(cleanPath);
        queryKeyTag = toCamelCase(cleanPath);
      }
    }
    // Mutation
    else if (method === "post" && (routePath === "/" || routePath === "")) {
      hookAction = "Create";
    } else if (method === "put" && isIdRoute) {
      hookAction = "Update";
    } else if (method === "delete" && isIdRoute) {
      hookAction = "Delete";
    } else {
      // PATCH /:id/move -> Move
      hookAction = toPascalCase(cleanPath || method); // fallback to method name
    }

    // 构造完整 API 路径 (处理 :id)
    // 这里的 path 用于 api-client 调用，需要把 :id 换成 ${id} 模板字符串逻辑在 generateHookCode 处理
    // 我们这里存原始 path: /tree 或 /:id

    routes.push({
      method,
      path: `${fullPrefix}${routePath}`, // /api/v1/sitecategory/tree
      // 修正语序：useSiteCategoryList (Entity+Action) vs useMoveSiteCategory (Action+Entity)
      // 你的规范：Query -> use{Entity}{Action}, Mutation -> use{Action}{Entity}
      hookName:
        method === "get"
          ? `use${entityPascalName}${hookAction}`
          : `use${hookAction}${entityPascalName}`,
      queryKeyTag,
      hasParams: isIdRoute,
      isMutation: method !== "get",
    });
  }

  return routes;
}

/**
 * 🛠️ 代码生成器
 */
function generateHookCode(
  route: RouteMeta,
  contractName: string,
  queryKeyVar: string,
  entityName: string
) {
  // 处理 URL 模板: /api/v1/user/:id -> `/api/v1/user/${id}`
  const urlTemplate = route.path.replace(/:([a-zA-Z0-9_]+)/g, "${$1}");
  const isTemplate = urlTemplate.includes("${");
  const urlStr = isTemplate ? `\`${urlTemplate}\`` : `"${route.path}"`;

  // 1. Query Hooks (GET)
  if (!route.isMutation) {
    // List
    if (route.queryKeyTag === "list") {
      return `
export function ${route.hookName}(
  params?: ${contractName}['ListQuery'],
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ${queryKeyVar}.list(params),
    queryFn: () => api.get<${contractName}['ListResponse'], ${contractName}['ListQuery']>(${urlStr}, { params }),
    enabled,
  });
}`;
    }
    // Detail
    if (route.queryKeyTag === "detail") {
      return `
export function ${route.hookName}(id: string, enabled: boolean = !!id) {
  return useQuery({
    queryKey: ${queryKeyVar}.detail(id),
    queryFn: () => api.get<${contractName}['Response']>(${urlStr}),
    enabled,
  });
}`;
    }
    // Custom GET (e.g. Tree)
    return `
export function ${route.hookName}(params?: any, enabled: boolean = true) {
  return useQuery({
    queryKey: [ ...${queryKeyVar}.all, '${route.queryKeyTag}', params],
    queryFn: () => api.get<any>(${urlStr}, { params }),
    enabled,
  });
}`;
  }

  // 2. Mutation Hooks (POST/PUT/DELETE/PATCH)
  const isUpdate = route.method === "put" || route.method === "patch";
  const isDelete = route.method === "delete";

  // 参数类型推断
  let payloadType = "any";
  let payloadArg = "data";
  let apiCall = "";

  if (route.hookName.includes("Create")) {
    payloadType = `${contractName}['Create']`;
    apiCall = `api.post<${contractName}['Response'], ${payloadType}>(${urlStr}, data)`;
  } else if (isUpdate && route.hasParams) {
    payloadType = `${contractName}['Update']`;
    payloadArg = "{ id, data }";
    apiCall = `api.${route.method}<${contractName}['Response'], ${payloadType}>(${urlStr}, data)`; // urlStr contains ${id}
  } else if (isDelete) {
    payloadArg = "id";
    apiCall = `api.delete<${contractName}['Response']>(${urlStr})`;
  } else {
    // Custom Mutation (e.g. Move)
    // 假设参数是 { id, ...rest }
    payloadArg = route.hasParams ? "{ id, ...data }" : "data";
    apiCall = `api.${route.method}(${urlStr}, data)`;
  }

  return `
export function ${route.hookName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (${payloadArg}: ${route.hasParams && isUpdate ? `{ id: string; data: ${payloadType} }` : route.hasParams && !isUpdate ? "string" : payloadType}) => 
      ${apiCall},
    onSuccess: () => {
      // 简单粗暴：让整个实体的缓存失效
      queryClient.invalidateQueries({ queryKey: ${queryKeyVar}.all });
    },
  });
}`;
}

// 辅助函数
function toPascalCase(str: string) {
  return str
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}
function toCamelCase(str: string) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
