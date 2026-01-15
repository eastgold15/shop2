/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在函数上方删除 @generated 标记。
 * --------------------------------------------------------
 */

import { MediaMetadataContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

/**
 * @generated
 */
export const mediametadataKeys = {
  all: ["mediametadata"] as const,
  lists: () => [...mediametadataKeys.all, "list"] as const,
  list: (params?: MediaMetadataContract["ListQuery"]) =>
    [...mediametadataKeys.lists(), params] as const,
  details: () => [...mediametadataKeys.all, "detail"] as const,
  detail: (id: string) => [...mediametadataKeys.details(), id] as const,
};
/**
 * @generated
 */
export function useMediaMetadataList(
  params?: MediaMetadataContract["ListQuery"],
  enabled?: boolean
) {
  return useQuery({
    queryKey: mediametadataKeys.list(params),
    queryFn: () =>
      api.get<any, MediaMetadataContract["ListQuery"]>(
        "/api/v1/media-metadata",
        { params }
      ),
    enabled: enabled ?? true,
  });
}
/**
 * @generated
 */
export function useMediaMetadataDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: mediametadataKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/media-metadata/${id}`),
    enabled: enabled ?? !!id,
  });
}
/**
 * @generated
 */
export function useCreateMediaMetadata() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MediaMetadataContract["Create"]) =>
      api.post<any, MediaMetadataContract["Create"]>(
        "/api/v1/media-metadata",
        data
      ),
    onSuccess: () => {
      toast.success("MediaMetadata创建成功");
      queryClient.invalidateQueries({ queryKey: mediametadataKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建MediaMetadata失败");
    },
  });
}
/**
 * @generated
 */
export function useUpdateMediaMetadata() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: MediaMetadataContract["Update"];
    }) =>
      api.put<any, MediaMetadataContract["Update"]>(
        `/api/v1/media-metadata/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("MediaMetadata更新成功");
      queryClient.invalidateQueries({ queryKey: mediametadataKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: mediametadataKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新MediaMetadata失败");
    },
  });
}
/**
 * @generated
 */
export function useDeleteMediaMetadata() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/media-metadata/${id}`),
    onSuccess: () => {
      toast.success("MediaMetadata删除成功");
      queryClient.invalidateQueries({ queryKey: mediametadataKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除MediaMetadata失败");
    },
  });
}
