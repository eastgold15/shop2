import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./api-client";

/**
 * 获取商品变体媒体配置
 */
export function useProductVariantMedia(productId: string | undefined) {
  return useQuery({
    queryKey: ["product-variant-media", productId],
    queryFn: async () => {
      const response = await api.get<ProductVariantMediRes>(
        `/api/v1/product-variant/${productId}`
      );
      return response;
    },
    enabled: !!productId,
  });
}

/**
 * 保存商品变体媒体配置
 */
import { ProductVariantContract } from "@repo/contract";
import { ProductVariantMediRes } from "./product-variant.type";

type SetVariantMediaBody = ProductVariantContract["SetVariantMedia"];
export function useSetProductVariantMedia() {
  return useMutation({
    mutationFn: async (data: {
      productId: string;
      variantMedia: Array<{
        attributeValueId: string;
        mediaIds: string[];
        mainImageId?: string;
      }>;
    }) => {
      const response = await api.post<any, SetVariantMediaBody>(
        "/api/v1/product-variant",
        data
      );
      return response;
    },
  });
}
