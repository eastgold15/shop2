import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { productTable, siteProductTable } from "../table.schema";

import { ProductTemplateFields } from "./product-template.contract";

const autoFields = ["id", "createdAt", "updatedAt", "siteId"];

export const SiteProductInsertFields = spread(siteProductTable, "insert");


export const SiteProductFields = spread(siteProductTable, "select");
const ProductFields = spread(productTable, "select");
export const SiteProductContract = {

  Response: t.Object({
    ...SiteProductFields,
  }),

  Create: t.Object({
    productId: t.String(),
    siteName: ProductFields.name,
    siteDescription: ProductFields.description,
    spuCode: ProductFields.spuCode,
    status: t.Optional(ProductFields.status),

    templateId: ProductTemplateFields.templateId,
    seoTitle: t.Optional(SiteProductInsertFields.seoTitle),
    siteCategoryId: t.String(),
    // 商品媒体关联
    mediaIds: t.Optional(t.Array(t.String())), // 商品图片ID列表
    mainImageId: t.Optional(t.String()), // 主图ID
    videoIds: t.Optional(t.Array(t.String())), // 视频ID列表
  }),

  Update: t.Partial(
    t.Object({
      siteName: SiteProductInsertFields.siteName,
      siteDescription: SiteProductInsertFields.siteDescription,
      spuCode: ProductFields.spuCode,
      status: ProductFields.status,

      templateId: ProductTemplateFields.templateId,
      seoTitle: SiteProductInsertFields.seoTitle,
      siteCategoryId: t.Optional(t.String()),
      // 商品媒体关联
      mediaIds: t.Optional(t.Array(t.String())), // 商品图片ID列表
      mainImageId: t.Optional(t.String()), // 主图ID
      videoIds: t.Optional(t.Array(t.String())), // 视频ID列表
      customAttributes: t.Optional(t.Record(t.String(), t.String())),
    })
  ),

  ListQuery: t.Object({
    ...t.Partial(t.Object(SiteProductInsertFields)).properties,
    siteCategoryId: t.Optional(t.String()),
    ...PaginationParams.properties,
    ...SortParams.properties,
    isListed: t.Optional(t.Boolean()),
    search: t.Optional(t.String()),
  }),
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...SiteProductFields })),
    total: t.Number(),
  }),
} as const;

export type SiteProductContract = InferDTO<typeof SiteProductContract>;
