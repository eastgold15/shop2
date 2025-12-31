import type {
  PermissionContract,
  RolePermissionsContract,
} from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rpc } from "@/lib/rpc";
import { handleEden } from "@/lib/utils/base";
import { api } from "./api-client";

// 权限相关 hooks
export function usePermissionsList(
  query?: typeof PermissionContract.ListQuery.static
) {
  return useQuery({
    queryKey: ["permissions", "list", query],
    queryFn: async () =>
      await handleEden(
        rpc.api.v1.permission.get({
          query,
        })
      ),
  });
}

export function usePermissionCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: typeof PermissionContract.Create.static) =>
      await handleEden(rpc.api.v1.permission.post(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

export function usePermissionDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      await handleEden(rpc.api.v1.permission({ id }).delete()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

// 角色权限关联 hooks
export function useRolePermissionsList(
  query: typeof RolePermissionsContract.ListQuery.static
) {
  return useQuery({
    queryKey: ["rolepermissions", "list", query],
    queryFn: async () =>
      await handleEden(rpc.api.v1.rolepermissions.get({ query })),
    enabled: !!query.roleId,
  });
}

export function useRolePermissionCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: typeof RolePermissionsContract.Create.static) =>
      await handleEden(rpc.api.v1.rolepermissions.post(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolepermissions"] });
    },
  });
}

export function useRolePermissionDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      await handleEden(rpc.api.v1.rolepermissions({ id }).delete()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolepermissions"] });
    },
  });
}

// 批量更新角色权限
/**
 * @generated
 */
export function usePermissionList(
  params?: PermissionContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: permissionKeys.list(params),
    queryFn: () =>
      api.get<any, PermissionContract["ListQuery"]>("/api/v1/permission", {
        params,
      }),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function usePermissionDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/permission/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PermissionContract["Create"]) =>
      api.post<any, PermissionContract["Create"]>("/api/v1/permission", data),
    onSuccess: () => {
      toast.success("Permission创建成功");
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建Permission失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: PermissionContract["Update"];
    }) =>
      api.put<any, PermissionContract["Update"]>(
        `/api/v1/permission/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("Permission更新成功");
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: permissionKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新Permission失败");
    },
  });
}
/**
 * @generated
 */
export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/permission/${id}`),
    onSuccess: () => {
      toast.success("Permission删除成功");
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除Permission失败");
    },
  });
}
export function useBatchUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: typeof RolePermissionsContract.BatchUpdate.static
    ) => await handleEden(rpc.api.v1.rolepermissions.batch.update.post(data)),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rolepermissions", variables.roleId],
      });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/**
 * @generated
 */
export const permissionKeys = {
  all: ["permission"] as const,
  lists: () => [...permissionKeys.all, "list"] as const,
  list: (params?: PermissionContract["ListQuery"]) =>
    [...permissionKeys.lists(), params] as const,
  details: () => [...permissionKeys.all, "detail"] as const,
  detail: (id: string) => [...permissionKeys.details(), id] as const,
};
