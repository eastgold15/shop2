import { type CallExpression, type Project } from "ts-morph";
import { ensureImport } from "../core/ast-utils";
import type { GenContext, Task } from "../core/types";

const GEN_TAG = "@generated";
const DOC_BLOCK = `// [Auto-Generated] Do not edit this tag to keep updates. ${GEN_TAG}`;

const GEN_HEADER = `/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * 🚀 基于后端 Controller 实际路由扫描生成（仅包含 // @generated 标记的路由）
 * ⚠️ 带标记的 Hooks 会被自动更新，手动修改请移除 // @generated 标记
 * 💡 如需自定义 Hooks，请移除对应函数的 // @generated 标记或在其他文件中封装
 * --------------------------------------------------------
 */`;

/**
 * 检查路由调用是否包含 @generated 标记
 */
function checkIsGeneratedRoute(call: CallExpression): boolean {
  const leadingTrivia = call.getLeadingCommentRanges();
  for (const range of leadingTrivia) {
    if (range.getText().includes(GEN_TAG)) {
      return true;
    }
  }
  return false;
}

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

    // 根据路由动态生成 Keys，支持标准方法和自定义方法
    // list -> list, pagelist -> pagelist, detail -> detail, tree -> tree, move -> move, etc.
    const customKeys = routes
      .map((r) => {
        const key = r.queryKeyTag;
        // 标准方法已有固定的 key，这里生成自定义方法的 key
        if (["list", "pagelist", "detail"].includes(key)) return null;

        // 根据是否有参数决定 key 的签名
        // 例如: tree(ctx) 无参数 -> tree: () => [...]
        // 例如: move(id, newParentId, ctx) 有参数 -> move: (params) => [...]
        const hasParams = r.hasParams || r.method !== "get";
        return `${key}: ${hasParams ? "(params?: any)" : "()"} => [...${queryKeyVar}.all, '${key}'${hasParams ? ", params" : ""}] as const`;
      })
      .filter(Boolean)
      .join("\n  ");

    const queryKeysCode = `
// --- Query Keys ---
export const ${queryKeyVar} = {
  all: ["${entityName}"] as const,
  lists: () => [...${queryKeyVar}.all, "list"] as const,
  list: (params: any) => [...${queryKeyVar}.lists(), params] as const,
  pagelist: (params: any) => [...${queryKeyVar}.lists(), "pagelist", params] as const,
  details: () => [...${queryKeyVar}.all, "detail"] as const,
  detail: (id: string) => [...${queryKeyVar}.details(), id] as const,${customKeys ? `\n  ${customKeys}` : ""}
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
    // 🔥 只处理带 // @generated 标记的路由
    if (!checkIsGeneratedRoute(call)) {
      continue;
    }

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

    // 💡 智能推断 Hook 名称和 Query Key
    // 根据 Service 标准方法：
    // GET / -> list -> useSiteCategoryList
    // GET /pagelist -> pagelist -> useSiteCategoryPagelist
    // GET /:id -> detail -> useSiteCategoryDetail
    // POST / -> create -> useCreateSiteCategory
    // PUT /:id -> update -> useUpdateSiteCategory
    // PATCH /:id -> patch -> usePatchSiteCategory
    // DELETE /:id -> delete -> useDeleteSiteCategory
    // PATCH /:id/status -> patchStatus -> usePatchSiteCategoryStatus
    // PATCH /:id/move -> move -> useMoveSiteCategory

    let hookAction = "";
    let queryKeyTag = "";
    const isIdRoute = routePath.includes(":id");
    const cleanPath = routePath
      .replace("/:id", "")
      .replace(/^\/+/, "") // remove leading slashes
      .replace(/\/+$/, ""); // remove trailing slashes

    if (method === "get") {
      if (routePath === "/" || routePath === "") {
        hookAction = "List";
        queryKeyTag = "list";
      } else if (cleanPath === "pagelist") {
        hookAction = "Pagelist";
        queryKeyTag = "pagelist";
      } else if (isIdRoute && cleanPath === "") {
        hookAction = "Detail";
        queryKeyTag = "detail";
      } else {
        // 自定义 GET 方法: /tree, /stats/daily
        hookAction = toPascalCase(cleanPath.replace(/\//g, "_"));
        queryKeyTag = toCamelCase(cleanPath.replace(/\//g, "_"));
      }
    }
    // Mutation 方法
    else if (method === "post" && (routePath === "/" || routePath === "")) {
      hookAction = "Create";
      queryKeyTag = "create";
    } else if (method === "put" && isIdRoute && cleanPath === "") {
      hookAction = "Update";
      queryKeyTag = "update";
    } else if (method === "patch") {
      if (cleanPath === "") {
        // PATCH /:id -> patch
        hookAction = "Patch";
        queryKeyTag = "patch";
      } else {
        // PATCH /:id/status -> patchStatus, PATCH /:id/move -> move
        const actionName = cleanPath.replace(/^_+/, ""); // remove leading underscores
        hookAction = toPascalCase(actionName);
        queryKeyTag = toCamelCase(actionName);
      }
    } else if (method === "delete" && isIdRoute) {
      hookAction = "Delete";
      queryKeyTag = "delete";
    } else {
      // 其他自定义方法
      hookAction = toPascalCase(cleanPath || method);
      queryKeyTag = toCamelCase(cleanPath || method);
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
// --- ${route.hookName} (GET ${route.path}) ---
export function ${route.hookName}(
  params?: typeof ${contractName}.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: ${queryKeyVar}.list(params),
    queryFn: () => api.get<any, typeof ${contractName}.ListQuery.static>(${urlStr}, { params }),
    enabled,
  });
}`;
    }
    // Pagelist
    if (route.queryKeyTag === "pagelist") {
      return `
// --- ${route.hookName} (GET ${route.path}) ---
export function ${route.hookName}(
  params?: typeof ${contractName}.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: ${queryKeyVar}.pagelist(params),
    queryFn: () => api.get<any, typeof ${contractName}.ListQuery.static>(${urlStr}, { params }),
    enabled,
  });
}`;
    }
    // Detail
    if (route.queryKeyTag === "detail") {
      return `
// --- ${route.hookName} (GET ${route.path}) ---
export function ${route.hookName}(id: string, enabled = !!id) {
  return useQuery({
    queryKey: ${queryKeyVar}.detail(id),
    queryFn: () => api.get<any>(\`${urlTemplate}\`),
    enabled,
  });
}`;
    }
    // Custom GET (e.g. Tree)
    return `
// --- ${route.hookName} (GET ${route.path}) ---
export function ${route.hookName}(params?: any, enabled = true) {
  return useQuery({
    queryKey: ${queryKeyVar}.${route.queryKeyTag}(params),
    queryFn: () => api.get<any>(${urlStr}, { params }),
    enabled,
  });
}`;
  }

  // 2. Mutation Hooks (POST/PUT/PATCH/DELETE)
  const isPut = route.method === "put";
  const isPatch = route.method === "patch";
  const isDelete = route.method === "delete";
  const isIdOnlyPatch =
    isPatch && route.hasParams && route.path.match(/\/:id$/);

  // 参数类型和 API 调用
  let payloadType = "any";
  let payloadArg = "data";
  let apiCall = "";
  let mutationFnType = "";

  // POST / -> Create
  if (route.queryKeyTag === "create") {
    payloadType = `typeof ${contractName}.Create.static`;
    mutationFnType = payloadType;
    apiCall = `api.post<any, ${payloadType}>(${urlStr}, data)`;
  }
  // PUT /:id -> Update
  else if (isPut && route.hasParams) {
    payloadType = `typeof ${contractName}.Update.static`;
    mutationFnType = `{ id: string; data: ${payloadType} }`;
    payloadArg = "{ id, data }";
    apiCall = `api.put<any, ${payloadType}>(\`${urlTemplate}\`, data)`;
  }
  // PATCH /:id -> Patch (局部更新)
  else if (isIdOnlyPatch) {
    payloadType = `typeof ${contractName}.Patch.static`;
    mutationFnType = `{ id: string; data: ${payloadType} }`;
    payloadArg = "{ id, data }";
    apiCall = `api.patch<any, ${payloadType}>(\`${urlTemplate}\`, data)`;
  }
  // DELETE /:id -> Delete
  else if (isDelete) {
    mutationFnType = "string";
    payloadArg = "id";
    apiCall = `api.delete<any>(\`${urlTemplate}\`)`;
  }
  // PATCH /:id/xxx, PUT /:id/xxx 等自定义方法
  else {
    mutationFnType = "any";
    // 如果路径包含 :id，参数应该是 { id, ...data }
    payloadArg = route.hasParams ? "{ id, ...data }" : "data";
    apiCall = `api.${route.method}<any, any>(\`${urlTemplate}\`, data)`;
  }

  return `
// --- ${route.hookName} (${route.method.toUpperCase()} ${route.path}) ---
export function ${route.hookName}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (${payloadArg}: ${mutationFnType}) => ${apiCall},
    onSuccess: (_, variables) => {
      // 如果有 id，同时失效列表和详情缓存
      if (typeof variables === "object" && "id" in variables) {
        queryClient.invalidateQueries({ queryKey: ${queryKeyVar}.lists() });
        queryClient.invalidateQueries({
          queryKey: ${queryKeyVar}.detail((variables as any).id),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ${queryKeyVar}.lists() });
      }
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
