// lib/api-client.ts

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
  // if (token) headers.set("Authorization", `Bearer ${token}`);

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

  // DELETE: 通常没有 body，但可能有 query
  delete: <TRes, TQuery = Record<string, string | number>>(
    url: string,
    opts?: RequestOptions<never, TQuery>
  ) => request<TRes, never, TQuery>(url, { ...opts, method: "DELETE" }),
};
