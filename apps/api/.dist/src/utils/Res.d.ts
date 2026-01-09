/**
 * 前端用的响应类型定义
 * 错误也使用这个
 */
export type CommonRes<T> = {
  code: number;
  message: string;
  data: T;
};
/**
 * // 成功响应函数
 * 错误也使用这个响应函数
 * @param data 数据
 * @param code
 * @param message
 * @returns
 */
export declare function commonRes<T>(
  data: T,
  code?: number,
  message?: string
): CommonRes<T>;
/**
 * 创建符合项目规范的分页响应
 * 复用 pageRes 函数
 * @param data 数据数组
 * @param total 总数
 * @param page 当前页码
 * @param limit 每页大小
 * @param message 响应消息
 * @returns 符合项目规范的分页响应
 */
export declare function pageRes<T>(
  data: T[],
  total: number,
  page?: number,
  limit?: number,
  message?: string
): CommonRes<{
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}>;
/**
 * 前端用的分页响应类型定义
 */
export type PageRes<T> = {
  code: number;
  message: string;
  data: PageData<T>;
};
export type PaginationQuery = {
  page: number;
  limit: number;
};
export type PageData<T> = {
  items: T[];
  meta: PageMeta;
};
export type PageMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
