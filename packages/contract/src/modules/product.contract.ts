import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { productTable } from "../table.schema";
import { ProductTemplateFields } from "./product-template.contract";
import { SiteProductInsertFields } from "./site-product.contract";

export const ProductInsertFields = spread(productTable, "insert");

export const ProductFields = spread(productTable, "select");
export const ProductContract = {
  Response: t.Object({
    ...ProductFields,
  }),

  Create: t.Object({
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
    // 商品独有属性（简单键值对）
    customAttributes: t.Optional(t.Record(t.String(), t.String())),
  }),

  // 更新分两种
  Update: t.Partial(
    t.Object({
      name: ProductFields.name,
      description: ProductFields.description,
      spuCode: ProductFields.spuCode,
      status: ProductFields.status,
      templateId: ProductTemplateFields.templateId,
      seoTitle: SiteProductInsertFields.seoTitle,
      siteCategoryId: t.String(),
      // 商品媒体关联
      mediaIds: t.Optional(t.Array(t.String())), // 商品图片ID列表
      mainImageId: t.Optional(t.String()), // 主图ID
      videoIds: t.Optional(t.Array(t.String())), // 视频ID列表
      // 商品独有属性（简单键值对）
      customAttributes: t.Optional(t.Record(t.String(), t.String())),
    })
  ),

  Patch: t.Partial(
    t.Object({
      ...t.Omit(t.Object(ProductInsertFields), [
        "id",
        "createdAt",
        "updatedAt",
        "siteId",
        "tenantId", // 不允许修改租户
        "deptId", // 不允许修改部门
        "createdBy", // 不允许修改创建者
      ]).properties,
      mediaIds: t.Optional(t.Array(t.String())),
      mainImageId: t.Optional(t.String()),
      videoIds: t.Optional(t.Array(t.String())),
      // 商品独有属性（简单键值对）
      customAttributes: t.Optional(t.Record(t.String(), t.String())),
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(ProductInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
    categoryId: t.Optional(t.String()),
  }),
} as const;

export type ProductContract = InferDTO<typeof ProductContract>;
