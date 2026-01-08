import { Treaty } from "@elysiajs/eden";
import { useMutation } from "@tanstack/react-query";
import { rpc } from "@/lib/rpc";
import { handleEden } from "@/lib/utils/base";

// 类型定义
export type InquiryCreateRes = NonNullable<Treaty.Data<typeof rpc.inquiry.post>>;

export function useInquiryMutation() {
  return useMutation({
    mutationFn: async (args: Parameters<typeof rpc.inquiry.post>[0]) =>
      handleEden(await rpc.inquiry.post(args)),
  });
}
