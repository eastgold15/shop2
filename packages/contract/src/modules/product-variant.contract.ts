import { t } from "elysia";
import { PaginationParams, SortParams } from "..";
import { InferDTO } from "../helper/utils";

/**
 * 变体媒体管理契约
 *
 * 用于实现按颜色属性值绑定图片的功能，避免为每个 SKU 重复上传图片
 */

/**
 * 变体媒体响应类型
 */
const VariantMediaResponse = t.Object({
  productId: t.String(),
  colorAttributeKey: t.Optional(t.String()),
  variantMedia: t.Array(
    t.Object({
      attributeValueId: t.String(),
      attributeValue: t.String(),
      images: t.Array(
        t.Object({
          id: t.String(),
          url: t.String(),
          isMain: t.Boolean(),
          mediaType: t.String(),
          sortOrder: t.Number(),
        })
      ),
    })
  ),
});

export const ProductVariantContract = {
  /**
   * 获取商品变体媒体配置
   */
  GetVariantMedia: {
    body: t.Object({
      productId: t.String(),
    }),
    response: VariantMediaResponse,
  },

  /**
   * 设置商品变体媒体配置
   */
  SetVariantMedia: t.Object({
    productId: t.String(),
    variantMedia: t.Array(
      t.Object({
        attributeValueId: t.String(),
        mediaIds: t.Array(t.String()),
      })
    ),
  }),
} as const;

export type ProductVariantContract = InferDTO<typeof ProductVariantContract>;

export const ProductVariantMediaContract = {
  ListQuery: t.Object({
    search: t.Optional(t.String()),
    categoryId: t.Optional(t.String()),
    attributeValueId: t.Optional(t.String()),
    productId: t.Optional(t.String()),
    ...PaginationParams.properties,
    ...SortParams.properties,
  }),
} as const;

export type ProductVariantMediaListQuery = InferDTO<
  typeof ProductVariantMediaContract
>;
