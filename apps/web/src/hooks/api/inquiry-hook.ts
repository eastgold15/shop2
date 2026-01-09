import { Treaty } from "@elysiajs/eden";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { rpc } from "@/lib/rpc";

// 类型定义
export type InquiryCreateRes = NonNullable<
  Treaty.Data<typeof rpc.inquiry.post>
>;

export function useCreateInquiry() {
  return useMutation({
    mutationFn: async (args: Parameters<typeof rpc.inquiry.post>[0]) => {
      const { data, error } = await rpc.inquiry.post(args);
      if (error) {
        toast.error(error.value as any as string);
        throw error;
      }
      return data;
    },
  });
}
