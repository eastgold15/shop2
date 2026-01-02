/**
 * TypeBox 查询类型定义 - 参数分离与组合
 *
 * 设计理念：
 * 1. 契约层组合：BusinessQuery + PaginationParams + SortParams = CompleteQuery
 * 2. 前端分离：组件内部可以方便地将完整查询拆分为各部分使用
 * 3. 类型安全：全程 TypeScript 类型推导，零运行时错误
 * 4. TypeBox 集成：与 Elysia 框架完全兼容的验证系统
 */
import type { Static } from "@sinclair/typebox";
export declare const SortParams: import("@sinclair/typebox").TObject<{
    sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    sortOrder: import("@sinclair/typebox").TOptional<import("elysia/type-system/types").TUnionEnum<["asc", "desc"]>>;
}>;
export type SortParams = Static<typeof SortParams>;
export declare const PaginationParams: import("@sinclair/typebox").TObject<{
    page: import("@sinclair/typebox").TNumber;
    limit: import("@sinclair/typebox").TNumber;
}>;
export type PaginationParams = Static<typeof PaginationParams>;
export declare const BaseQueryParams: import("@sinclair/typebox").TObject<{
    search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    fields: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type BaseQueryParams = Static<typeof BaseQueryParams>;
export type ExtractBusinessQuery<T> = Omit<T, keyof PaginationParams | keyof SortParams | keyof BaseQueryParams>;
export type ExtractPaginationParams<T> = Pick<T, keyof T & keyof PaginationParams>;
export type ExtractSortParams<T> = Pick<T, keyof T & keyof SortParams>;
export type ExtractBaseQueryParams<T> = Pick<T, keyof T & keyof BaseQueryParams>;
/**
 * 将完整的查询对象拆分为各个部分
 * @param query 完整的查询对象
 * @returns 拆分后的各部分对象
 */
export declare function splitListQuery<T extends Record<string, any>>(query: T): {
    business: ExtractBusinessQuery<T>;
    pagination: PaginationParams;
    sort: SortParams;
};
export declare function splitListQueryNoPage<T extends Record<string, any>>(query: T): {
    business: ExtractBusinessQuery<T>;
    sort: SortParams;
};
