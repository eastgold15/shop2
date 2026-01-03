import {
  type SkuContract,
  skuTable,
  mediasTable,
  productTable,
  skuMediaTable,
  productSiteCategoryTable,
} from "@repo/contract";
import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { type ServiceContext } from "../lib/type";

export class SkuService {
  /**
   * 批量创建SKU
   */
  public async batchCreateSkus(
    ctx: ServiceContext,
    productId: string,
    skus: any[]
  ) {
    // 检查SKU编码是否重复
    const skuCodes = skus.map((s) => s.skuCode);
    const existingSkus = await ctx.db
      .select({
        skuCode: skuTable.skuCode,
      })
      .from(skuTable)
      .where(
        and(
          eq(skuTable.productId, productId),
          inArray(skuTable.skuCode, skuCodes)
        )
      );

    if (existingSkus.length > 0) {
      throw new HttpError.Conflict(
        `SKU编码已存在: ${existingSkus.map((s: any) => s.skuCode).join(", ")}`
      );
    }

    // 创建SKU
    const result = await ctx.db.transaction(async (tx) => {
      const createdSkus = await tx
        .insert(skuTable)
        .values(
          skus.map((sku) => ({
            skuCode: sku.skuCode,
            productId,
            price: String(sku.price),
            stock: String(sku.stock || "0"),
            specJson: JSON.stringify(sku.specJson),
            status: 1,
            tenantId: ctx.user.context.tenantId!,
            deptId: ctx.currentDeptId,
          }))
        )
        .returning();

      // 批量创建SKU和媒体的关联
      for (let i = 0; i < skus.length; i++) {
        const sku = skus[i];
        const createdSku = createdSkus[i];

        if (sku.mediaIds && sku.mediaIds.length > 0) {
          await tx.insert(skuMediaTable).values(
            sku.mediaIds.map((mediaId: any, index: any) => ({
              skuId: createdSku.id,
              mediaId,
              isMain: index === 0, // 第一张作为主图
              sortOrder: index,
            }))
          );
        }
      }

      return createdSkus;
    });

    return result;
  }

  /**
   * 创建单个SKU
   */
  public async createSkuWithMedia(
    ctx: ServiceContext,
    skuData: any,
    productId: string,
    mediaId?: string
  ) {
    const result = await ctx.db.transaction(async (tx) => {
      const [sku] = await tx
        .insert(skuTable)
        .values({
          ...skuData,
          productId,
          tenantId: ctx.user.context.tenantId!,
          deptId: ctx.currentDeptId,
        })
        .returning();

      // 如果提供了mediaId，创建SKU和媒体的关联
      if (mediaId) {
        await tx.insert(skuMediaTable).values({
          skuId: sku.id,
          mediaId,
        });
      }

      return sku;
    });

    return result;
  }

  /**
   * 更新SKU及媒体关联
   */
  public async updateSkuWithMedia(
    ctx: ServiceContext,
    id: string,
    body: any
  ) {
    let updated;
    // 如果要更新mediaId
    if (body.mediaId !== undefined) {
      // 更新SKU的媒体关联
      await ctx.db.transaction(async (tx) => {
        // 删除原有的关联
        await tx.delete(skuMediaTable).where(eq(skuMediaTable.skuId, id));

        // 创建新的关联（如果mediaId不为空）
        if (body.mediaId) {
          await tx.insert(skuMediaTable).values({
            skuId: id,
            mediaId: body.mediaId,
          });
        }
      });

      // 从body中移除mediaId，因为它不应该更新到skus表中
      const { mediaId: _, ...updateData } = body;

      // 更新SKU
      updated = await ctx.db
        .update(skuTable)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(skuTable.id, id))
        .returning();
    } else {
      // 更新SKU
      updated = await ctx.db
        .update(skuTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(skuTable.id, id))
        .returning();
    }

    return updated[0];
  }

  /**
   * 单个 SKU 更新（含媒体关联全量替换）
   */
  public async updateSingleSku(ctx: ServiceContext, id: string, body: any) {
    const { mediaIds, mainImageId, ...updateData } = body;

    return await ctx.db.transaction(async (tx) => {
      // 1. 安全性检查：确保 SKU 存在
      const [existingSku] = await tx
        .select()
        .from(skuTable)
        .where(eq(skuTable.id, id))
        .limit(1);

      if (!existingSku) {
        throw new HttpError.NotFound("SKU 不存在");
      }

      // 2. 更新 SKU 基础信息
      if (Object.keys(updateData).length > 0) {
        // 处理数值类型转换
        const formattedData = {
          ...updateData,
          price: updateData.price?.toString(),
          stock: updateData.stock?.toString(),
          marketPrice: updateData.marketPrice?.toString(),
          costPrice: updateData.costPrice?.toString(),
          updatedAt: new Date(),
        };

        await tx.update(skuTable).set(formattedData).where(eq(skuTable.id, id));
      }

      // 3. 处理媒体关联更新 (如果传了 mediaIds)
      if (mediaIds !== undefined) {
        // a. 先删除该 SKU 旧的所有图片关联
        await tx.delete(skuMediaTable).where(eq(skuMediaTable.skuId, id));

        // b. 插入新的关联
        if (mediaIds.length > 0) {
          const mediaRelations = mediaIds.map(
            (mediaId: string, index: number) => ({
              skuId: id,
              mediaId,
              // 如果传了 mainImageId 则匹配，否则默认第一张为主图
              isMain: mainImageId ? mediaId === mainImageId : index === 0,
              sortOrder: index,
            })
          );

          await tx.insert(skuMediaTable).values(mediaRelations);
        }
      }

      return { success: true, id };
    });
  }

  /**
   * 获取SKU列表
   */
  public async getSkusList(ctx: ServiceContext, query: any) {
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
    let queryBuilder = ctx.db
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
      );

    if (baseConditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...baseConditions));
    }

    // 排序与分页
    const items = await queryBuilder
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
              mediaId: mediasTable.id,
              url: mediasTable.url,
              isMain: skuMediaTable.isMain,
            })
            .from(skuMediaTable)
            .innerJoin(mediasTable, eq(skuMediaTable.mediaId, mediasTable.id))
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

  /**
   * 获取SKU详情
   */
  public async getSkuDetail(ctx: ServiceContext, id: string) {
    // 获取SKU基本信息
    const [sku] = await ctx.db
      .select({
        id: skuTable.id,
        skuCode: skuTable.skuCode,
        productId: skuTable.productId,
        price: skuTable.price,
        marketPrice: skuTable.marketPrice,
        costPrice: skuTable.costPrice,
        weight: skuTable.weight,
        volume: skuTable.volume,
        stock: skuTable.stock,
        specJson: skuTable.specJson,
        extraAttributes: skuTable.extraAttributes,
        status: skuTable.status,
        createdAt: skuTable.createdAt,
        updatedAt: skuTable.updatedAt,
      })
      .from(skuTable)
      .where(eq(skuTable.id, id))
      .limit(1);

    if (!sku) {
      throw new HttpError.NotFound("SKU不存在");
    }

    // 获取商品名称
    const [product] = await ctx.db
      .select({
        name: productTable.name,
      })
      .from(productTable)
      .where(eq(productTable.id, sku.productId))
      .limit(1);

    // 获取所有关联的图片
    const images = await ctx.db
      .select({
        id: mediasTable.id,
        url: mediasTable.url,
        storageKey: mediasTable.storageKey,
        category: mediasTable.category,
        isMain: skuMediaTable.isMain,
        sortOrder: skuMediaTable.sortOrder,
      })
      .from(skuMediaTable)
      .leftJoin(mediasTable, eq(skuMediaTable.mediaId, mediasTable.id))
      .where(eq(skuMediaTable.skuId, sku.id))
      .orderBy(skuMediaTable.sortOrder);

    return {
      ...sku,
      product: product
        ? {
            id: sku.productId,
            name: product.name,
          }
        : null,
      values: [], // 暂时返回空数组
      images: images.filter((img: any) => img.url), // 过滤掉没有URL的图片
      mainImage: images.find((img: any) => img.isMain) || images[0] || null, // 主图或第一张图
      specJson: sku.specJson ? sku.specJson : null,
      extraAttributes: sku.extraAttributes ? sku.extraAttributes : null,
      price: Number.parseFloat(sku.price || "0"),
      marketPrice: sku.marketPrice ? Number.parseFloat(sku.marketPrice) : null,
      costPrice: sku.costPrice ? Number.parseFloat(sku.costPrice) : null,
      weight: sku.weight ? Number.parseFloat(sku.weight) : null,
      volume: sku.volume ? Number.parseFloat(sku.volume) : null,
      stock: sku.stock ? Number.parseFloat(sku.stock) : null,
    };
  }

  /**
   * 获取商品下的SKU列表
   */
  public async getSkusByProduct(ctx: ServiceContext, productId: string) {
    const skus = await ctx.db
      .select({
        id: skuTable.id,
        skuCode: skuTable.skuCode,
        price: skuTable.price,
        marketPrice: skuTable.marketPrice,
        costPrice: skuTable.costPrice,
        stock: skuTable.stock,
        specJson: skuTable.specJson,
        status: skuTable.status,
      })
      .from(skuTable)
      .where(eq(skuTable.productId, productId))
      .orderBy(skuTable.createdAt);

    // 获取图片信息
    const skuIds = skus.map((s: any) => s.id);
    const images =
      skuIds.length > 0
        ? await ctx.db
            .select({
              skuId: skuMediaTable.skuId,
              id: mediasTable.id,
              url: mediasTable.url,
              storageKey: mediasTable.storageKey,
              category: mediasTable.category,
              isMain: skuMediaTable.isMain,
              sortOrder: skuMediaTable.sortOrder,
            })
            .from(skuMediaTable)
            .leftJoin(mediasTable, eq(skuMediaTable.mediaId, mediasTable.id))
            .where(inArray(skuMediaTable.skuId, skuIds))
            .orderBy(skuMediaTable.sortOrder)
        : [];

    // 将图片按 SKU ID 分组
    const imageMap = images.reduce(
      (map: any, img: any) => {
        if (img.url) {
          // 只有有URL的图片才添加
          if (!map[img.skuId]) {
            map[img.skuId] = [];
          }
          map[img.skuId].push(img);
        }
        return map;
      },
      {} as Record<string, any[]>
    );

    return skus.map((sku: any) => {
      const skuImages = imageMap[sku.id] || [];
      return {
        ...sku,
        images: skuImages,
        mainImage:
          skuImages.find((img: any) => img.isMain) || skuImages[0] || null,
        specJson: sku.specJson ? sku.specJson : null,
        price: Number.parseFloat(sku.price || "0"),
        marketPrice: sku.marketPrice
          ? Number.parseFloat(sku.marketPrice)
          : null,
        costPrice: sku.costPrice ? Number.parseFloat(sku.costPrice) : null,
        stock: sku.stock ? Number.parseFloat(sku.stock) : null,
      };
    });
  }

  /**
   * 更新SKU的媒体关联
   */
  public async updateSkuMedia(
    ctx: ServiceContext,
    id: string,
    mediaIds: string[],
    mainImageIndex?: number
  ) {
    // 验证媒体文件是否存在
    if (mediaIds && mediaIds.length > 0) {
      const existingMedia = await ctx.db
        .select({
          id: mediasTable.id,
        })
        .from(mediasTable)
        .where(inArray(mediasTable.id, mediaIds));

      if (existingMedia.length !== mediaIds.length) {
        throw new HttpError.NotFound("部分媒体文件不存在");
      }
    }

    // 更新媒体关联
    await ctx.db.transaction(async (tx) => {
      // 删除原有的关联
      await tx.delete(skuMediaTable).where(eq(skuMediaTable.skuId, id));

      // 创建新的关联（如果提供了mediaIds）
      if (mediaIds && mediaIds.length > 0) {
        await tx.insert(skuMediaTable).values(
          mediaIds.map((mediaId, index) => ({
            skuId: id,
            mediaId,
            isMain: index === mainImageIndex || index === 0, // 根据指定索引或第一张作为主图
            sortOrder: index,
          }))
        );
      }
    });

    return {
      message: "媒体关联更新成功",
    };
  }

  /**
   * 批量删除SKU
   */
  public async batchDelete(ids: string[], ctx: ServiceContext) {
    // 删除SKU
    const result = await ctx.db
      .delete(skuTable)
      .where(inArray(skuTable.id, ids))
      .returning();

    return { count: result.length };
  }

  /**
   * 验证商品是否存在
   */
  public async validateProductExists(
    ctx: ServiceContext,
    productId: string
  ): Promise<boolean> {
    const [product] = await ctx.db
      .select({
        id: productTable.id,
      })
      .from(productTable)
      .where(eq(productTable.id, productId))
      .limit(1);

    return !!product;
  }

  /**
   * 检查SKU编码是否重复
   */
  public async checkSkuCodeExists(
    ctx: ServiceContext,
    skuCode: string,
    productId: string,
    excludeId?: string
  ): Promise<boolean> {
    const conditions = [
      eq(skuTable.productId, productId),
      eq(skuTable.skuCode, skuCode),
    ];

    if (excludeId) {
      conditions.push(sql`${skuTable.id} != ${excludeId}`);
    }

    const [existing] = await ctx.db
      .select({ id: skuTable.id })
      .from(skuTable)
      .where(and(...conditions))
      .limit(1);

    return !!existing;
  }

  /**
   * 验证媒体是否存在
   */
  public async validateMediaExists(
    ctx: ServiceContext,
    mediaId: string
  ): Promise<boolean> {
    const [image] = await ctx.db
      .select({
        id: mediasTable.id,
      })
      .from(mediasTable)
      .where(eq(mediasTable.id, mediaId))
      .limit(1);

    return !!image;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: SkuContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? {
            tenantId: ctx.user.context.tenantId!,
            createdBy: ctx.user.id,
            deptId: ctx.currentDeptId,
          }
        : {}),
    };
    const [res] = await ctx.db.insert(skuTable).values(insertData).returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(query: SkuContract["ListQuery"], ctx: ServiceContext) {
    const { search } = query;

    const res = await ctx.db.query.skuTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { originalName: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: SkuContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(skuTable)
      .set(updateData)
      .where(eq(skuTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(skuTable)
      .where(eq(skuTable.id, id))
      .returning();
    return res;
  }
}
