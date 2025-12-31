// lib/api-client.ts

// 导入 auth store 以获取当前部门 ID
// 注意：这里需要在客户端组件中使用，避免 SSR 问题
let getCurrentDeptId: () => string | null = () => null;

// 在运行时设置获取函数（从 auth store）
export function setDeptIdGetter(fn: () => string | null) {
  getCurrentDeptId = fn;
}

// 1. 定义 RequestOptions，区分 Body 和 Query
// TBody: 请求体类型 (POST/PUT 用)
// TQuery: 查询参数类型 (GET列表筛选用)
type RequestOptions<
  TBody = undefined,
  TQuery = Record<string, string | number>,
> = Omit<RequestInit, "body"> & {
  params?: TQuery; // 这里现在是强类型的
  body?: TBody;
  token?: string;
};

// 2. 核心 request 函数
async function request<
  TRes,
  TBody = undefined,
  TQuery = Record<string, string | number>,
>(
  endpoint: string,
  { params, body, token, ...options }: RequestOptions<TBody, TQuery> = {}
): Promise<TRes> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`
  );

  // 处理 Query Params
  if (params) {
    Object.entries(params as Record<string, any>).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.append(k, String(v));
      }
    });
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // 🔥 添加 x-current-dept-id header（从 auth store 获取当前部门 ID）
  const currentDeptId = getCurrentDeptId();
  if (currentDeptId) {
    headers.set("x-current-dept-id", currentDeptId);
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request Failed");
  }

  return response.json() as Promise<TRes>;
}

// 3. 导出增强后的快捷方法
export const api = {
  // GET: 接收 <返回类型, 查询参数类型>
  // TBody 设为 never，防止你在 GET 里传 body
  get: <TRes, TQuery = Record<string, string | number>>(
    url: string,
    opts?: RequestOptions<never, TQuery>
  ) => request<TRes, never, TQuery>(url, { ...opts, method: "GET" }),

  // POST: 接收 <返回类型, 请求体类型>
  // POST 通常不需要复杂的 Query Param，如果有特殊需求也可以扩展
  post: <TRes, TBody>(url: string, body: TBody, opts?: RequestOptions<TBody>) =>
    request<TRes, TBody>(url, { ...opts, method: "POST", body }),

  // PUT: 接收 <返回类型, 请求体类型>
  put: <TRes, TBody>(url: string, body: TBody, opts?: RequestOptions<TBody>) =>
    request<TRes, TBody>(url, { ...opts, method: "PUT", body }),

  // DELETE: 支持 body（用于批量删除）和 query
  delete: <TRes, TBody = undefined>(
    url: string,
    body?: TBody,
    opts?: RequestOptions<TBody>
  ) => request<TRes, TBody>(url, { ...opts, method: "DELETE", body }),

  // PATCH: 支持 body（用于部分更新）
  patch: <TRes, TBody>(url: string, body: TBody, opts?: RequestOptions<TBody>) =>
    request<TRes, TBody>(url, { ...opts, method: "PATCH", body }),
};
