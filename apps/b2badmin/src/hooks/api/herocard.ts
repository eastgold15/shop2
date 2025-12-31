/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { HeroCardContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// --- Query Keys ---
export const herocardKeys = {
  all: ["herocard"] as const,
  lists: () => [...herocardKeys.all, "list"] as const,
  list: (params: any) => [...herocardKeys.lists(), params] as const,
  details: () => [...herocardKeys.all, "detail"] as const,
  detail: (id: string) => [...herocardKeys.details(), id] as const,
};

// --- 1. 列表查询 (GET) ---
// TRes = any, TQuery = typeof HeroCardContract.ListQuery.static
export function useHeroCardList(
  params?: typeof HeroCardContract.ListQuery.static,
  enabled = true
) {
  return useQuery({
    queryKey: herocardKeys.list(params),
    queryFn: () =>
      api.get<any, typeof HeroCardContract.ListQuery.static>(
        "/api/v1/herocard",
        { params }
      ),
    enabled,
  });
}

// --- 2. 单个详情 (GET) ---
// TRes = any
export function useHeroCardDetail(id: string, enabled = !!id) {
  return useQuery({
    queryKey: herocardKeys.detail(id),
    queryFn: () => api.get<any>(`/api/v1/herocard/${id}`),
    enabled,
  });
}

// --- 3. 创建 (POST) ---
// TRes = any, TBody = typeof HeroCardContract.Create.static
export function useCreateHeroCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: typeof HeroCardContract.Create.static) =>
      api.post<any, typeof HeroCardContract.Create.static>(
        "/api/v1/herocard",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
    },
  });
}

// --- 4. 更新 (PUT) ---
// TRes = any, TBody = typeof HeroCardContract.Update.static
export function useUpdateHeroCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: typeof HeroCardContract.Update.static;
    }) =>
      api.put<any, typeof HeroCardContract.Update.static>(
        `/api/v1/herocard/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: herocardKeys.detail(variables.id),
      });
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteHeroCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/herocard/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
    },
  });
}
