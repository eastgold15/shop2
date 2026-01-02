export type QueryOptions = {
    filters?: QueryFilter[];
    sort?: SortOption[];
};
export type TreeNodeRaw = {
    id: string | number;
    parentId?: string | number | null;
    [key: string]: any;
};
export type TreeNode<T = any> = T & {
    children?: TreeNode<T>[];
};
export type QueryFilter = {
    field: string;
    operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "nin";
    value: any;
};
export type SortOption = {
    field: string;
    direction: "asc" | "desc";
};
export type CreateOptions = {
    validate?: boolean;
    transaction?: any;
};
export type UpdateOptions = {
    validate?: boolean;
    transaction?: any;
};
export type DeleteOptions = {
    transaction?: any;
    force?: boolean;
};
export type QueryBuilderOptions = {
    table: string;
    selects?: string[];
    joins?: Array<{
        table: string;
        on: string;
        type: "left" | "right" | "inner";
    }>;
    where?: Record<string, any>;
    orderBy?: Array<{
        column: string;
        direction: "asc" | "desc";
    }>;
    groupBy?: string[];
    having?: Record<string, any>;
};
export type TransactionOptions = {
    isolationLevel?: "read_uncommitted" | "read_committed" | "repeatable_read" | "serializable";
    timeout?: number;
};
export type BatchOptions = {
    batchSize?: number;
    delay?: number;
    retryCount?: number;
    onError?: "continue" | "stop";
};
export type CacheOptions = {
    key: string;
    ttl?: number;
    tags?: string[];
};
