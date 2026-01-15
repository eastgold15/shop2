/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { MediaContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";
import { Media, MediaPageListRes } from "./media.type";

// --- Query Keys ---
export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  list: (params: any) => [...mediaKeys.lists(), params] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (id: string) => [...mediaKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof MediaContract.ListQuery.static
export function useMediaList(
  params?: typeof MediaContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: () =>
      api.get<Media[], typeof MediaContract.ListQuery.static>("/api/v1/media", {
        params,
      }),
    enabled,
  });
}
export function useMediaPageList(
  params?: typeof MediaContract.PageListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: () =>
      api.get<MediaPageListRes, typeof MediaContract.PageListQuery.static>(
        "/api/v1/media/page-list",
        {
          params,
        }
      ),
    enabled,
  });
}
// --- 2. 单个详情 (GET) ---
/**
 * @generated
 */
export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/media/${id}`),
    onSuccess: () => {
      toast.success("Media删除成功");
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除Media失败");
    },
  });
}
// TRes = any
export function useMediaDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: mediaKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/media/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof MediaContract.Create.static
export function useCreateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof MediaContract.Create.static) =>
      api.post<any, typeof MediaContract.Create.static>("/api/v1/media", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

// --- 4. 上传文件 (POST) ---
// TRes = any
export function useBatchUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { files: File[]; category?: string }) => {
      const formData = new FormData();
      // 支持多个文件上传
      data.files.forEach((file) => {
        formData.append("files", file);
      });
      if (data.category) {
        formData.append("category", data.category);
      }
      return api.post<any, any>("/api/v1/media/upload", formData as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof MediaContract.Update.static
export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof MediaContract.Update.static;
    }) =>
      api.put<any, typeof MediaContract.Update.static>(
        `/api/v1/media/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: mediaKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useBatchDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string | string[]) =>
      api.delete<any, any>("/api/v1/media/batch", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}
