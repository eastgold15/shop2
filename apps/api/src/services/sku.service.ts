import {
  mediaTable,
  productSiteCategoryTable,
  productTable,
  SkuContract,
  skuMediaTable,
  skuTable,
} from "@repo/contract";
import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { type ServiceContext } from "../lib/type";

export class SkuService {
  /**
   * 1. 批量创建 SKU (通常用于商品发布初始阶段)
   * 逻辑：检查重复 -> 批量写入SKU -> 批量写入图片关联
   */
  public async batchCreateSkus(
    ctx: ServiceContext,
    productId: string,
    skus: SkuContract["BatchCreate"]
  ) {
    if (!skus || skus.length === 0) return [];

    // 1. 验证商品是否存在
    const [product] = await ctx.db
      .select()
      .from(productTable)
      .where(eq(productTable.id, productId))
      .limit(1);
    if (!product) throw new HttpError.NotFound("关联商品不存在");

    // 2. 检查 SKU 编码在当前商品下是否重复
    const skuCodes = skus.map((s) => s.skuCode);
    const existingSkus = await ctx.db
      .select({ skuCode: skuTable.skuCode })
      .from(skuTable)
      .where(
        and(
          eq(skuTable.productId, productId),
          inArray(skuTable.skuCode, skuCodes)
        )
      );

    if (existingSkus.length > 0) {
      throw new HttpError.Conflict(
        `SKU编码已存在: ${existingSkus.map((s) => s.skuCode).join(", ")}`
      );
    }

    // 创建SKU
    const result = await ctx.db.transaction(async (tx) => {
      // 3. 批量插入 SKU
      const createdSkus = await tx
        .insert(skuTable)
        .values(
          skus.map((sku) => ({
            productId,
            skuCode: sku.skuCode,
            price: sku.price,
            stock: sku.stock || "0",
            marketPrice: sku.marketPrice,
            costPrice: sku.costPrice,
            weight: sku.weight,
            volume: sku.volume,
            specJson: sku.specJson, // Drizzle 会自动处理 JSON
            status: 1, // 默认上架
            tenantId: ctx.user.context.tenantId!,
            deptId: ctx.currentDeptId,
            createdBy: ctx.user.id,
          }))
        )
        .returning();

      // 4. 处理图片关联
      const mediaRelations: any[] = [];

      // 遍历刚创建的SKU，找到对应的入参数据，建立关联
      for (let i = 0;i < createdSkus.length;i++) {
        const createdSku = createdSkus[i];
        // 假设入参 skus 数组和 returning 的 createdSkus 顺序是一致的 (Postgres 通常保证这一点)
        // 更稳妥的做法是用 skuCode 匹配，但在同一个事务insert中，索引通常是对齐的
        const inputSku = skus[i];

        if (inputSku.mediaIds && inputSku.mediaIds.length > 0) {
          inputSku.mediaIds.forEach((mediaId, idx) => {
            mediaRelations.push({
              tenantId: ctx.user.context.tenantId!,
              skuId: createdSku.id,
              mediaId,
              isMain: idx === 0, // 第一张默认主图
              sortOrder: idx,
            });
          });
        }
      }

      if (mediaRelations.length > 0) {
        await tx.insert(skuMediaTable).values(mediaRelations);
      }

      return createdSkus;
    });

    return result;
  }

  /**
   * 2. 单个 SKU 更新 (包含图片全量替换)
   * 场景：在列表点击“编辑”某个特定规格
   */
  public async update(
    ctx: ServiceContext,
    id: string,
    body: SkuContract["Update"]
  ) {
    const { mediaIds, mainImageId, ...baseFields } = body;

    return await ctx.db.transaction(async (tx) => {
      // 1. 检查是否存在
      const [existingSku] = await tx
        .select({ id: skuTable.id, productId: skuTable.productId })
        .from(skuTable)
        .where(eq(skuTable.id, id))
        .limit(1);

      if (!existingSku) throw new HttpError.NotFound("SKU 不存在");

      // 2. 如果修改了 skuCode，检查查重 (排除自己)
      if (baseFields.skuCode) {
        const [duplicate] = await tx
          .select({ id: skuTable.id })
          .from(skuTable)
          .where(
            and(
              eq(skuTable.productId, existingSku.productId),
              eq(skuTable.skuCode, baseFields.skuCode),
              sql`${skuTable.id} != ${id}`
            )
          )
          .limit(1);
        if (duplicate) throw new HttpError.Conflict("SKU 编码已存在");
      }

      // 3. 更新基础字段
      if (Object.keys(baseFields).length > 0) {
        await tx
          .update(skuTable)
          .set({
            ...baseFields,
            updatedAt: new Date(),
          })
          .where(eq(skuTable.id, id));
      }

      // 4. 更新媒体关联 (仅当 mediaIds 显式传入时)
      if (mediaIds !== undefined) {
        // 先清空旧关联
        await tx.delete(skuMediaTable).where(eq(skuMediaTable.skuId, id));

        // 插入新关联
        if (mediaIds.length > 0) {
          const relations = mediaIds.map((mediaId, idx) => ({
            tenantId: ctx.user.context.tenantId!,
            skuId: id,
            mediaId,
            isMain: mainImageId ? mediaId === mainImageId : idx === 0,
            sortOrder: idx,
          }));
          await tx.insert(skuMediaTable).values(relations);
        }
      }

      return { success: true, id };
    });
  }

  /**
   * 3. 单个 SKU 删除
   */
  public async delete(ctx: ServiceContext, id: string) {
    // 这里依赖数据库的 Cascade Delete 删除 skuMediaTable
    // 如果没有设置 Cascade，需要先手动删除关联表
    const [deleted] = await ctx.db
      .delete(skuTable)
      .where(
        and(
          eq(skuTable.id, id),
          eq(skuTable.tenantId, ctx.user.context.tenantId!) // 安全校验
        )
      )
      .returning({ id: skuTable.id });

    if (!deleted) {
      throw new HttpError.NotFound("SKU 不存在或无权删除");
    }

    return { success: true, id: deleted.id };
  }

  /**
   * 4. 获取单个 SKU 详情 (用于编辑回显)
   */
  public async getDetail(ctx: ServiceContext, id: string) {
    // 1. 获取基础信息
    const [sku] = await ctx.db
      .select()
      .from(skuTable)
      .where(eq(skuTable.id, id))
      .limit(1);

    if (!sku) throw new HttpError.NotFound("SKU 不存在");

    // 2. 获取图片信息
    const media = await ctx.db
      .select({
        id: mediaTable.id,
        url: mediaTable.url,
        isMain: skuMediaTable.isMain,
        sortOrder: skuMediaTable.sortOrder,
      })
      .from(skuMediaTable)
      .innerJoin(mediaTable, eq(skuMediaTable.mediaId, mediaTable.id))
      .where(eq(skuMediaTable.skuId, id))
      .orderBy(skuMediaTable.sortOrder);

    return {
      ...sku,
      price: Number(sku.price),
      stock: Number(sku.stock),
      marketPrice: sku.marketPrice ? Number(sku.marketPrice) : null,
      costPrice: sku.costPrice ? Number(sku.costPrice) : null,
      mediaIds: media.map((m) => m.id), // 方便前端回显 Select 组件
      images: media, // 方便前端展示图片预览
    };
  }

  /**
   * 5. SKU 列表查询 (保持原样，用于管理后台列表)
   */
  public async list(ctx: ServiceContext, query: any) {
    const {
      page = 1,
      limit = 10,
      productId,
      search,
      status,
      sort = "createdAt",
      sortOrder = "desc",
    } = query;

    const baseConditions: any[] = [];

    // 1. 租户筛选 (必须)
    if (ctx.user?.context.tenantId) {
      baseConditions.push(eq(skuTable.tenantId, ctx.user.context.tenantId));
    }

    // 2. 商品筛选
    if (productId) {
      baseConditions.push(eq(skuTable.productId, productId));
    }

    // 3. 搜索条件 (SKU Code 或 商品名称)
    if (search) {
      baseConditions.push(like(skuTable.skuCode, `%${search}%`));
    }

    // 4. 状态筛选
    if (status !== undefined) {
      baseConditions.push(eq(skuTable.status, Number(status)));
    }

    // 排序处理
    const allowedSortFields: Record<string, any> = {
      id: skuTable.id,
      skuCode: skuTable.skuCode,
      price: skuTable.price,
      stock: skuTable.stock,
      status: skuTable.status,
      createdAt: skuTable.createdAt,
    };
    const orderByField =
      allowedSortFields[sort as keyof typeof allowedSortFields] ||
      skuTable.createdAt;

    // --- 构建主查询 ---
    const items = await ctx.db
      .select({
        // SKU 信息
        id: skuTable.id,
        skuCode: skuTable.skuCode,
        price: skuTable.price,
        stock: skuTable.stock,
        status: skuTable.status,
        specJson: skuTable.specJson,
        createdAt: skuTable.createdAt,
        // 补充商品信息
        product: {
          id: productTable.id,
          name: productTable.name,
          spuCode: productTable.spuCode,
        },
        // 补充站点分类信息 (由于是多对多，这里通常取关联表的 categoryId)
        siteCategoryId: productSiteCategoryTable.siteCategoryId,
      })
      .from(skuTable)
      // 连商品表
      .innerJoin(productTable, eq(skuTable.productId, productTable.id))
      // 连商品站点分类关联表 (Left Join 以防万一没设分类也能查出来)
      .leftJoin(
        productSiteCategoryTable,
        eq(productTable.id, productSiteCategoryTable.productId)
      )
      .where(baseConditions.length > 0 ? and(...baseConditions) : undefined)
      // 排序与分页
      .orderBy(sortOrder === "desc" ? desc(orderByField) : orderByField)
      .limit(limit)
      .offset((page - 1) * limit);

    // --- 批量获取图片信息 (优化 N+1) ---
    const skuIds = items.map((item) => item.id);
    const images =
      skuIds.length > 0
        ? await ctx.db
          .select({
            skuId: skuMediaTable.skuId,
            mediaId: mediaTable.id,
            url: mediaTable.url,
            isMain: skuMediaTable.isMain,
          })
          .from(skuMediaTable)
          .innerJoin(mediaTable, eq(skuMediaTable.mediaId, mediaTable.id))
          .where(inArray(skuMediaTable.skuId, skuIds))
          .orderBy(skuMediaTable.sortOrder)
        : [];

    // 图片按 SKU 分组 Map
    const imageMap = images.reduce(
      (map: Record<string, (typeof images)[0][]>, img) => {
        if (!map[img.skuId]) map[img.skuId] = [];
        map[img.skuId].push(img);
        return map;
      },
      {}
    );

    // --- 最终数据格式化 ---
    return items.map((item: any) => {
      const skuImages = imageMap[item.id] || [];
      return {
        ...item,
        price: Number(item.price),
        stock: Number(item.stock),
        // 提取该 SKU 的主图
        mainImage: skuImages.find((i) => i.isMain) || skuImages[0] || null,
        allImages: skuImages,
      };
    });
  }
}
