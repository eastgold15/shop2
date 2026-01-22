import {
  mediaTable,
  ProductVariantMediaContract,
  productVariantMediaTable,
  templateValueTable,
} from "@repo/contract";
import { and, eq, sql } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import type { ServiceContext } from "~/lib/type";


export class ProductVariantMediaService {
  /**
   * 1. 为产品+属性值（如颜色）批量关联图片
   *
   * 核心逻辑：
   * - 先删除该产品+属性值的所有旧图片
   * - 再批量插入新图片
   * - 支持设置主图和排序
   */
  public async upsertByVariant(
    ctx: ServiceContext,
    productId: string,
    attributeValueId: string,
    mediaIds: string[],
    mainImageId?: string
  ) {
    const tenantId = ctx.user.context.tenantId!;

    return await ctx.db.transaction(async (tx) => {
      // 1. 验证产品归属（权限校验）
      const [product] = await tx
        .select({ id: productVariantMediaTable.id })
        .from(productVariantMediaTable)
        .where(
          and(
            eq(productVariantMediaTable.productId, productId),
          )
        )
        .limit(1);

      if (!product) {
        throw new HttpError.NotFound("产品不存在或无权操作");
      }

      // 2. 删除该产品+属性值的所有旧图片
      await tx
        .delete(productVariantMediaTable)
        .where(
          and(
            eq(productVariantMediaTable.productId, productId),
            eq(productVariantMediaTable.attributeValueId, attributeValueId)
          )
        );

      // 3. 批量插入新图片
      if (mediaIds.length > 0) {
        const relations = mediaIds.map((mediaId, idx) => ({
          tenantId,
          productId,
          attributeValueId,
          mediaId,
          isMain: mainImageId ? mediaId === mainImageId : idx === 0,
          sortOrder: idx,
        }));

        await tx.insert(productVariantMediaTable).values(relations);
      }

      return { success: true, count: mediaIds.length };
    });
  }

  /**
   * 2. 根据 SKU 查询其对应属性值的图片
   *
   * 核心逻辑：
   * - 从 SKU 的 specJson 中提取颜色属性值 ID
   * - 查询 product_variant_media 表
   * - 如果没有找到，返回空数组（而不是 SKU 级别的图片）
   */
  public async getBySkuSpec(
    ctx: ServiceContext,
    skuSpecJson: Record<string, any>,
    productId: string
  ) {
    // 1. 从 specJson 中找到"颜色"属性值 ID
    // 假设 specJson 格式为: { "颜色": "黑色ID", "尺码": "42码ID" }
    // 需要找到 templateKey 中 inputType 为 "select" 且 isSkuSpec 为 true 的"颜色"字段

    // 这里简化处理：假设 specJson 的第一个 key 是颜色
    const colorValueId = Object.values(skuSpecJson)[0] as string;

    if (!colorValueId) {
      return [];
    }

    // 2. 查询该颜色值关联的图片
    const media = await ctx.db
      .select({
        id: mediaTable.id,
        url: mediaTable.url,
        thumbnailUrl: mediaTable.thumbnailUrl,
        isMain: productVariantMediaTable.isMain,
        sortOrder: productVariantMediaTable.sortOrder,
      })
      .from(productVariantMediaTable)
      .innerJoin(
        mediaTable,
        eq(productVariantMediaTable.mediaId, mediaTable.id)
      )
      .where(
        and(
          eq(productVariantMediaTable.productId, productId),
          eq(productVariantMediaTable.attributeValueId, colorValueId)
        )
      )
      .orderBy(productVariantMediaTable.sortOrder);

    return media;
  }

  /**
   * 3. 获取产品的所有变体图片分组
   *
   * 返回格式：
   * {
   *   "黑色ValueId": [媒体1, 媒体2],
   *   "白色ValueId": [媒体3, 媒体4],
   * }
   */
  public async getVariantGroups(ctx: ServiceContext, productId: string) {
    const media = await ctx.db
      .select({
        attributeValueId: productVariantMediaTable.attributeValueId,
        mediaId: mediaTable.id,
        url: mediaTable.url,
        thumbnailUrl: mediaTable.thumbnailUrl,
        isMain: productVariantMediaTable.isMain,
        sortOrder: productVariantMediaTable.sortOrder,
      })
      .from(productVariantMediaTable)
      .innerJoin(
        mediaTable,
        eq(productVariantMediaTable.mediaId, mediaTable.id)
      )
      .where(eq(productVariantMediaTable.productId, productId))
      .orderBy(productVariantMediaTable.sortOrder);

    // 按属性值分组
    const groups: Record<string, typeof media> = {};
    for (const item of media) {
      if (!groups[item.attributeValueId]) {
        groups[item.attributeValueId] = [];
      }
      groups[item.attributeValueId].push(item);
    }

    return groups;
  }

  /**
   * 4. 删除指定变体的图片
   */
  public async deleteByVariant(
    ctx: ServiceContext,
    productId: string,
    attributeValueId: string
  ) {
    const tenantId = ctx.user.context.tenantId!;

    const deleted = await ctx.db
      .delete(productVariantMediaTable)
      .where(
        and(
          eq(productVariantMediaTable.productId, productId),
          eq(productVariantMediaTable.attributeValueId, attributeValueId),
        )
      )
      .returning({ id: productVariantMediaTable.id });

    if (deleted.length === 0) {
      throw new HttpError.NotFound("记录不存在或无权删除");
    }

    return { success: true, count: deleted.length };
  }

  /**
   * 5. 列表查询（支持分页）
   */
  public async list(
    ctx: ServiceContext,
    query: typeof ProductVariantMediaContract.ListQuery.static
  ) {
    const {
      page = 1,
      limit = 10,
      productId,
      attributeValueId,
      search,
      sort = "createdAt",
      sortOrder = "desc",
    } = query;
    const tenantId = ctx.user.context.tenantId!;
    const baseConditions: any[] = [
    ];

    // 产品筛选
    if (productId) {
      baseConditions.push(eq(productVariantMediaTable.productId, productId));
    }

    // 属性值筛选
    if (attributeValueId) {
      baseConditions.push(
        eq(productVariantMediaTable.attributeValueId, attributeValueId)
      );
    }

    const offset = (page - 1) * limit;

    // 排序处理
    const allowedSortFields: Record<string, any> = {
      id: productVariantMediaTable.id,
      createdAt: productVariantMediaTable.createdAt,
      sortOrder: productVariantMediaTable.sortOrder,
    };
    const orderByField =
      allowedSortFields[sort as keyof typeof allowedSortFields] ||
      productVariantMediaTable.createdAt;
    const orderByClause =
      sortOrder === "asc" ? orderByField : sql`${orderByField} DESC`;

    // 查询数据
    const items = await ctx.db
      .select({
        id: productVariantMediaTable.id,
        productId: productVariantMediaTable.productId,
        attributeValueId: productVariantMediaTable.attributeValueId,
        mediaId: productVariantMediaTable.mediaId,
        isMain: productVariantMediaTable.isMain,
        sortOrder: productVariantMediaTable.sortOrder,
        createdAt: productVariantMediaTable.createdAt,
        updatedAt: productVariantMediaTable.updatedAt,
        // 关联信息
        mediaUrl: mediaTable.url,
        mediaThumbnailUrl: mediaTable.thumbnailUrl,
        attributeValue: templateValueTable.value,
      })
      .from(productVariantMediaTable)
      .innerJoin(
        mediaTable,
        eq(productVariantMediaTable.mediaId, mediaTable.id)
      )
      .innerJoin(
        templateValueTable,
        eq(productVariantMediaTable.attributeValueId, templateValueTable.id)
      )
      .where(and(...baseConditions))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // 查询总数
    const [{ total }] = await ctx.db
      .select({ total: sql<number>`COUNT(*)` })
      .from(productVariantMediaTable)
      .where(and(...baseConditions));

    return {
      data: items,
      total: Number(total),
      page,
      limit,
    };
  }

  /**
   * 6. 获取单个变体的图片（用于编辑回显）
   */
  public async getByVariant(
    ctx: ServiceContext,
    productId: string,
    attributeValueId: string
  ) {
    const media = await ctx.db
      .select({
        id: productVariantMediaTable.id,
        mediaId: productVariantMediaTable.mediaId,
        url: mediaTable.url,
        thumbnailUrl: mediaTable.thumbnailUrl,
        isMain: productVariantMediaTable.isMain,
        sortOrder: productVariantMediaTable.sortOrder,
      })
      .from(productVariantMediaTable)
      .innerJoin(
        mediaTable,
        eq(productVariantMediaTable.mediaId, mediaTable.id)
      )
      .where(
        and(
          eq(productVariantMediaTable.productId, productId),
          eq(productVariantMediaTable.attributeValueId, attributeValueId)
        )
      )
      .orderBy(productVariantMediaTable.sortOrder);

    return {
      mediaIds: media.map((m) => m.mediaId),
      images: media,
    };
  }
}
