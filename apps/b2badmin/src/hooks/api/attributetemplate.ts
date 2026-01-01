/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { TemplateContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";

// --- Query Keys ---
export const attributetemplateKeys = {
  all: ["attributetemplate"] as const,
  lists: () => [...attributetemplateKeys.all, "list"] as const,
  list: (params: any) => [...attributetemplateKeys.lists(), params] as const,
  details: () => [...attributetemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...attributetemplateKeys.details(), id] as const,
};

// 获取模板列表
export function useListTemplates(
  query?: typeof TemplateContract.ListQuery.static
) {
  return useQuery({
    queryKey: ["templates", query],
    queryFn: async () =>
      api.get<any, typeof TemplateContract.ListQuery.static>(
        "/api/v1/template",
        { params: query || {} }
      ),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// 创建模板
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: typeof TemplateContract.Create.static) =>
      api.post<any, typeof TemplateContract.Create.static>(
        "/api/v1/template",
        data
      ),
    onSuccess: () => {
      toast.success("模板创建成功");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建模板失败");
    },
  });
}

// 更新模板
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: typeof TemplateContract.Update.static;
    }) =>
      api.put<any, typeof TemplateContract.Update.static>(
        `/api/v1/template/${id}`,
        data
      ),
    onSuccess: (_, { id }) => {
      toast.success("模板更新成功");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", id] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新模板失败");
    },
  });
}

// 删除模板
export function useDeleteTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      api.delete<any>(`/api/v1/template/${id}`),
    onSuccess: () => {
      toast.success("模板删除成功");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除模板失败");
    },
  });
}
