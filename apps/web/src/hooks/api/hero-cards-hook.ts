import { Treaty } from "@elysiajs/eden";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query/query-keys";
import { rpc } from "@/lib/rpc";

// 类型定义
export type HeroCardListRes = NonNullable<Treaty.Data<typeof rpc.herocards.current.get>>;

/**
 * 获取当前有效 Hero Cards 的 Hook
 * 最多返回 4 条卡片数据
 */
export function useCurrentHeroCardsList() {
  return useQuery({
    queryKey: queryKeys.heroCards.current(),
    queryFn: async () => {
      const { data, error } = await rpc.herocards.current.get();
      if (error) {
        toast.error(error.value as string);
      }
      return data! as HeroCardListRes;
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
