import { t } from "elysia";
import { PaginationParams, SortParams } from "../helper/query-types.model";
import { type InferDTO, spread } from "../helper/utils";
import { productTable } from "../table.schema";
import { ProductTemplateFields } from "./product-template.contract";
import { SiteProductInsertFields } from "./site-product.contract";

/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductInsertFields = spread(productTable, "insert");
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const ProductFields = spread(productTable, "select");
export const ProductContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...ProductFields,
  }),

  Create: t.Object({
    ...t.Omit(t.Object(ProductInsertFields), [
      "id",
      "createdAt",
      "updatedAt",
      "tenantId", // 后端从 ctx.user.context.tenantId 注入
      "deptId", // 后端从 ctx.currentDeptId 注入
      "createdBy", // 后端从 ctx.user.id 注入
    ]).properties,
    // 站点ID
    siteCategoryId: t.Optional(t.String()),
    // 商品媒体关联
    mediaIds: t.Optional(t.Array(t.String())), // 商品图片ID列表
    mainImageId: t.Optional(t.String()), // 主图ID
    videoIds: t.Optional(t.Array(t.String())), // 视频ID列表
  }),

  // 更新分两种
  Update: t.Partial(
    t.Object({
      name: ProductFields.name,
      description: ProductFields.description,
      spuCode: ProductFields.spuCode,
      status: ProductFields.status,
      units: ProductFields.units,
      templateId: ProductTemplateFields.templateId,

      seoTitle: SiteProductInsertFields.seoTitle,
      siteCategoryId: t.String(),
      // 商品媒体关联
      mediaIds: t.Optional(t.Array(t.String())), // 商品图片ID列表
      mainImageId: t.Optional(t.String()), // 主图ID
      videoIds: t.Optional(t.Array(t.String())), // 视频ID列表
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
    })
  ),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(ProductInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...ProductFields })),
    total: t.Number(),
  }),
} as const;

export type ProductContract = InferDTO<typeof ProductContract>;
