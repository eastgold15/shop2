import { UseQueryOptions } from "@tanstack/react-query";
/**
 * 权限 API Hooks
 */

import { PermissionContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const permissionKeys = {
  all: ["permission"] as const,
  lists: () => [...permissionKeys.all, "list"] as const,
  list: (params: any) => [...permissionKeys.lists(), params] as const,
};
interface PermissionListRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

// --- 1. 列表查询 (GET) ---
type usePermissionsListOptions = Omit<
  UseQueryOptions<PermissionListRes[], Error>,
  "queryKey" | "queryFn"
>;

export function usePermissionsList(
  query?: typeof PermissionContract.ListQuery.static,
  options?: usePermissionsListOptions
) {
  return useQuery({
    queryKey: permissionKeys.list(query),
    queryFn: () =>
      api.get<PermissionListRes[]>("/api/v1/permission", {
        params: query,
      }),
    ...options,
  });
}

// --- 2. 更新权限 (PUT) ---
export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof PermissionContract.Update.static;
    }) =>
      api.put<any, typeof PermissionContract.Update.static>(
        `/api/v1/permission/${id}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
  });
}
