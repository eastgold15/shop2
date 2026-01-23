/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { RoleContract } from "@repo/contract";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "./api-client";
import { RoleDetailRes, RoleListRes } from "./role.type";

// --- Query Keys ---
export const roleKeys = {
  all: ["role"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (params: any) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof RoleContract.ListQuery.static
export function useRoleList(
  params?: typeof RoleContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () =>
      api.get<RoleListRes[], typeof RoleContract.ListQuery.static>(
        "/api/v1/role",
        {
          params,
        }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
type useRoleDetailOptions = Omit<
  UseQueryOptions<RoleDetailRes>,
  "queryKey" | "queryFn"
>;

export function useRoleDetail(id: string, option?: useRoleDetailOptions) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => api.get<RoleDetailRes>(`/api/v1/role/${id}`),
    enabled: !!id,
    ...option,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof RoleContract.Create.static
export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof RoleContract.Create.static) =>
      api.post<any, typeof RoleContract.Create.static>("/api/v1/role", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof RoleContract.Update.static
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof RoleContract.Update.static;
    }) =>
      api.put<any, typeof RoleContract.Update.static>(
        `/api/v1/role/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/role/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
}

// --- 6. 设置角色权限 (PUT) ---
export function useSetRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      permissionIds,
    }: {
      id: string;
      permissionIds: string[];
    }) =>
      api.put<any, { permissionIds: string[] }>(
        `/api/v1/role/${id}/permissions`,
        { permissionIds }
      ),
    onSuccess: (_, variables) => {
      // 只失效该角色的详情查询，不需要失效列表（角色列表数据没有变化）
      queryClient.invalidateQueries({
        queryKey: roleKeys.detail(variables.id),
      });
    },
  });
}
