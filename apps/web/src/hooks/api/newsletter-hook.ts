import type { Treaty } from "@elysiajs/eden";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { rpc } from "@/lib/rpc";

// 类型定义
export type NewsletterSubscribeRes = NonNullable<
  Treaty.Data<typeof rpc.newsletter.subscribe1.post>
>;

export type NewsletterUnsubscribeRes = NonNullable<
  Treaty.Data<typeof rpc.newsletter.unsubscribe1.post>
>;

export type NewsletterCheckRes = NonNullable<
  Treaty.Data<typeof rpc.newsletter.check.get>
>;

/**
 * 订阅 Newsletter
 */
export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await rpc.newsletter.subscribe1.post({
        email,
      });

      console.log(data);
      if (error as unknown as MError) {
        return null;
      }
      toast.success("订阅成功");
      return data;
    },
  });
}

/**
 * 取消订阅 Newsletter
 */
export function useUnsubscribeNewsletter() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await rpc.newsletter.unsubscribe1.post({
        email,
      });
      if (error) {
        const errorMessage =
          typeof error.value === "string"
            ? error.value
            : (error.value as any)?.detail || "取消订阅失败";
        toast.error(errorMessage);
        throw error;
      }
      toast.success(data.message);
      return data;
    },
  });
}

/**
 * 检查订阅状态
 */
export function useCheckNewsletterSubscription(email: string) {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await rpc.newsletter.check.get({
        query: { email },
      });
      if (error) {
        const errorMessage =
          typeof error.value === "string"
            ? error.value
            : (error.value as any)?.detail || "检查失败";
        toast.error(errorMessage);
        throw error;
      }
      return data;
    },
  });
}

interface MError {
  status: number;
  value: {
    title: string;
    type: string;
    status: number;
    detail: string;
  };
}
