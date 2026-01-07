import { Treaty } from "@elysiajs/eden";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query/query-keys";
import { rpc } from "@/lib/rpc";

export function useCurrentMediaQuery(
  id: string,
  options?: Partial<UseQueryOptions<string, Error>>
) {
  return useQuery({
    queryKey: queryKeys.media.url(id),
    queryFn: async () => {
      // Eden Treaty 路由参数语法：使用点号访问动态路由段
      const { data, error } = await rpc.media.url({ id }).get();
      if (error) {
        toast.error(error.value?.message || "获取媒体URL失败");
      }
      return data!;
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    retry: 2,
    refetchOnWindowFocus: false,
    // 规范 7: 健壮的启用逻辑
    // 只有当 id 存在且外部没有手动禁用时才运行
    enabled: !!id && options?.enabled !== false,
    ...options, // 允许外部覆盖默认配置
  });
}
export type MediaListRes = NonNullable<Treaty.Data<typeof rpc.media.urls.get>>;
export function useCurrentMediasQuery(ids: string[]) {
  return useQuery({
    queryKey: queryKeys.media.urls(ids),
    queryFn: async () => {
      // Eden Treaty 路由参数语法：使用点号访问动态路由段
      const { data, error } = await rpc.media.urls.get({
        query: { ids },
      });
      if (error) {
        toast.error(error.value?.message || "获取媒体URL失败");
      }
      return data!;
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: ids.length > 0,
  });
}
