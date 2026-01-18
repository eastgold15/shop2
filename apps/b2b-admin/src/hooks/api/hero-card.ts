/**
 * 🤖 【Frontend Hooks - 自动生成】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请在 hooks/api 目录下新建文件进行封装。
 * --------------------------------------------------------
 */

import { HeroCardContract } from "@repo/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api-client";
import { HeroCardRes } from "./hero-card.type";

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
      api.get<HeroCardRes[], typeof HeroCardContract.ListQuery.static>(
        "/api/v1/hero-card",
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
    queryFn: () => api.get<any>(`/api/v1/hero-card/${id}`),
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
        "/api/v1/hero-card/",
        data
      ),
    onSuccess: () => {
      toast.success("首页展示卡片创建成功");
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "创建首页展示卡片失败");
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
        `/api/v1/hero-card/${id}`,
        data
      ),
    onSuccess: (_, variables) => {
      toast.success("首页展示卡片更新成功");
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: herocardKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新首页展示卡片失败");
    },
  });
}

// --- 5. 删除 (DELETE) ---
// TRes = any
export function useDeleteHeroCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<any>(`/api/v1/hero-card/${id}`),
    onSuccess: () => {
      toast.success("首页展示卡片删除成功");
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "删除首页展示卡片失败");
    },
  });
}

// --- 批量更新排序 ---
export function useHeroCardUpdateSort() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: Array<{ id: string; sortOrder: number }>) =>
      api.patch<any, { items: Array<{ id: string; sortOrder: number }> }>(
        "/api/v1/hero-card/sort",
        { items }
      ),
    onSuccess: () => {
      toast.success("排序更新成功");
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新排序失败");
    },
  });
}

// --- 切换激活状态 ---
export function useHeroCardToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.patch<any, {}>(`/api/v1/hero-card/${id}/toggle`, {}),
    onSuccess: () => {
      toast.success("状态更新成功");
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新状态失败");
    },
  });
}

// --- 批量删除 (DELETE /batch) ---
export function useHeroCardBatchDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      api.delete<any, { ids: string[] }>("/api/v1/hero-card/batch", { ids }),
    onSuccess: () => {
      toast.success("批量删除成功");
      queryClient.invalidateQueries({ queryKey: herocardKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || "批量删除失败");
    },
  });
}
