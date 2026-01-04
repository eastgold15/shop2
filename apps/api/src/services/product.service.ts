import {
  mediaTable,
  productMasterCategoryTable,
  productMediaTable,
  productTable,
  productTemplateTable,
  SiteProductContract,
  siteCategoryTable,
  siteProductTable,
  skuMediaTable,
  skuTable,
  templateTable,
} from "@repo/contract";
import { and, asc, eq, inArray, like, or, sql } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { type ServiceContext } from "../lib/type";

export class ProductService {
  /**
   * 创建商品（支持站点隔离和模板绑定）
   */
  public async create(body: any, ctx: ServiceContext) {
    const {
      name,
      spuCode,
      description,
      status = 1,
      units,
      siteCategoryId,
      templateId,
      price,
      siteName,
      siteDescription,
      seoTitle,
      // 媒体字段
      mediaIds, // 商品图片ID列表
      mainImageId, // 主图ID
      videoIds, // 视频ID列表
    } = body;

    const siteId = ctx.user.context.site.id;
    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点，无法创建商品");
    }

    return await ctx.db.transaction(async (tx) => {
      // 1. 验证站点分类
      const [siteCategory] = await tx
        .select()
        .from(siteCategoryTable)
        .where(
          and(
            eq(siteCategoryTable.id, siteCategoryId),
            eq(siteCategoryTable.siteId, siteId)
          )
        )
        .limit(1);

      if (!siteCategory) {
        throw new HttpError.NotFound(
          `站点分类不存在${siteCategoryId}，站点ID:${siteId}`
        );
      }

      // 2. 验证模板（如果提供）
      if (templateId) {
        const [template] = await tx
          .select()
          .from(templateTable)
          .where(eq(templateTable.id, templateId))
          .limit(1);

        if (!template) {
          throw new HttpError.NotFound("模板不存在");
        }

        // 如果站点分类关联了主分类，验证模板是否属于该主分类  模板有主分类，商品的主分类是一致的
        if (
          siteCategory.masterCategoryId &&
          template.masterCategoryId !== siteCategory.masterCategoryId
        ) {
          throw new HttpError.BadRequest("模板不属于该站点分类对应的主分类");
        }
      }

      // 3. 创建商品（全局商品）
      const [product] = await tx
        .insert(productTable)
        .values({
          name,
          spuCode,
          description,
          status,
          units,
          tenantId: ctx.user.context.tenantId!,
          deptId: ctx.currentDeptId,
          createdBy: ctx.user.id,
        })
        .returning();

      // 4. 关联模板（如果提供）
      if (templateId) {
        await tx.insert(productTemplateTable).values({
          productId: product.id,
          templateId,
        });
      }

      // 5. 关联主分类（如果站点分类关联了主分类）
      if (siteCategory.masterCategoryId) {
        await tx.insert(productMasterCategoryTable).values({
          productId: product.id,
          masterCategoryId: siteCategory.masterCategoryId,
        });
      }

      // 6. 关联媒体（图片和视频）
      const allMediaIds = [...(mediaIds || []), ...(videoIds || [])];

      if (allMediaIds.length > 0) {
        // 验证媒体是否存在
        const existingMedia = await tx
          .select()
          .from(mediaTable)
          .where(inArray(mediaTable.id, allMediaIds));

        const foundIds = existingMedia.map((m) => m.id);
        const notFound = allMediaIds.filter((id) => !foundIds.includes(id));

        if (notFound.length > 0) {
          throw new HttpError.NotFound(`媒体 ID ${notFound.join(", ")} 不存在`);
        }

        // 构建媒体关联数据
        const mediaRelations: any[] = [];

        // 处理图片（sortOrder 从 0 开始）
        if (mediaIds && mediaIds.length > 0) {
          mediaIds.forEach((mediaId: string, index: number) => {
            mediaRelations.push({
              productId: product.id,
              mediaId,
              isMain: mediaId === mainImageId,
              sortOrder: index,
            });
          });
        }

        // 处理视频（sortOrder 设为 -1）
        if (videoIds && videoIds.length > 0) {
          videoIds.forEach((mediaId: string, index: number) => {
            mediaRelations.push({
              productId: product.id,
              mediaId,
              isMain: false,
              sortOrder: -1 - index, // -1, -2, -3... 保持顺序
            });
          });
        }

        if (mediaRelations.length > 0) {
          await tx.insert(productMediaTable).values(mediaRelations);
        }
      }

      // 7. 创建站点商品关联（根据站点类型采用不同策略）
      const siteType = ctx.user.context.site.siteType || "group";

      const [siteProduct] = await tx
        .insert(siteProductTable)
        .values({
          siteId,
          productId: product.id,
          // 工厂模式：强制同步基础数据
          // 集团模式：允许自定义覆盖
          sitePrice: price ? price.toString() : null,
          siteName: siteType === "factory" ? name : siteName || name,
          siteDescription:
            siteType === "factory"
              ? description
              : siteDescription || description,
          siteCategoryId,
          seoTitle,
          isVisible: true,
        })
        .returning();

      return {
        product,
        siteProduct,
      };
    });
  }

  /**
   * 管理端获取站点商品列表（包含媒体和SKU）
   */
  public async pagelist(
    query: typeof SiteProductContract.ListQuery.static,
    ctx: ServiceContext
  ) {
    const { page = 1, limit = 10, search, siteCategoryId, isVisible } = query;

    const siteId = ctx.user.context.site.id;
    const siteType = ctx.user.context.site.siteType || "group";

    // 构建查询条件
    const conditions = [
      eq(siteProductTable.siteId, siteId),
      ...(isVisible ? [eq(siteProductTable.isVisible, isVisible)] : []),
    ];

    if (search) {
      conditions.push(
        or(
          like(productTable.name, `%${search}%`),
          like(productTable.description, `%${search}%`)
        )!
      );
    }

    if (siteCategoryId) {
      conditions.push(eq(siteProductTable.siteCategoryId, siteCategoryId));
    }

    // 查询商品数据 - 根据站点类型使用不同的价格逻辑
    // 注意：productTable 没有 price 字段，所有价格都在 siteProductTable
    const result = await ctx.db
      .select({
        id: productTable.id,
        // 名称：工厂用原名，集团可以用 siteName 覆盖
        name:
          siteType === "factory"
            ? productTable.name
            : sql<string>`COALESCE(${siteProductTable.siteName}, ${productTable.name})`,
        spuCode: productTable.spuCode,
        description: productTable.description,
        status: productTable.status,
        units: productTable.units,
        createdAt: productTable.createdAt,
        updatedAt: productTable.updatedAt,
        // 价格逻辑：
        // 工厂站点：直接用 sitePrice（因为工厂创建时已强制同步）
        // 集团站点：用 sitePrice（可能是自定义的，也可能是继承工厂的）
        // 如果 sitePrice 为 null，返回 '0'
        price: sql<string>`COALESCE(${siteProductTable.sitePrice}, '0')`,
        sitePrice: siteProductTable.sitePrice,
        // 是否有自定义价格（集团站点用）
        // 工厂站点总是 hasCustomPrice=false（因为是源头，不是"自定义"）
        hasCustomPrice:
          siteType === "factory"
            ? sql<boolean>`false`
            : sql<boolean>`CASE WHEN ${siteProductTable.sitePrice} IS NOT NULL THEN true ELSE false END`,
        siteName: siteProductTable.siteName,
        siteDescription: siteProductTable.siteDescription,
        siteCategoryId: siteProductTable.siteCategoryId,
      })
      .from(siteProductTable)
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      .limit(Number(limit))
      .offset((page - 1) * limit)
      .where(and(...conditions));

    // 获取商品ID列表
    const productIds = result.map((p) => p.id);

    // 批量查询商品媒体（图片和视频）
    const mediaMap = new Map<
      string,
      { images: any[]; videos: any[]; mainImage: any }
    >();
    if (productIds.length > 0) {
      const mediaRelations = await ctx.db
        .select({
          productId: productMediaTable.productId,
          mediaId: productMediaTable.mediaId,
          isMain: productMediaTable.isMain,
          sortOrder: productMediaTable.sortOrder,
          // 媒体信息
          mediaUrl: mediaTable.url,
          mediaOriginalName: mediaTable.originalName,
          mediaMimeType: mediaTable.mimeType,
          mediaType: mediaTable.mediaType,
          thumbnailUrl: mediaTable.thumbnailUrl,
        })
        .from(productMediaTable)
        .innerJoin(mediaTable, eq(productMediaTable.mediaId, mediaTable.id))
        .where(inArray(productMediaTable.productId, productIds))
        .orderBy(asc(productMediaTable.sortOrder));

      // 整理媒体数据
      for (const product of result) {
        mediaMap.set(product.id, { images: [], videos: [], mainImage: null });
      }

      for (const media of mediaRelations) {
        const productMedia = mediaMap.get(media.productId);
        if (!productMedia) continue;

        const mediaInfo = {
          id: media.mediaId,
          url: media.mediaUrl,
          originalName: media.mediaOriginalName,
          mimeType: media.mediaMimeType,
          mediaType: media.mediaType,
          thumbnailUrl: media.thumbnailUrl,
          isMain: media.isMain,
          sortOrder: media.sortOrder,
        };

        // sortOrder >= 0 是图片，< 0 是视频
        if (media.sortOrder >= 0) {
          productMedia.images.push(mediaInfo);
          if (media.isMain) {
            productMedia.mainImage = mediaInfo;
          }
        } else {
          productMedia.videos.push(mediaInfo);
        }
      }

      // 如果没有主图，使用第一张图片
      for (const product of result) {
        const productMedia = mediaMap.get(product.id);
        if (
          productMedia &&
          !productMedia.mainImage &&
          productMedia.images.length > 0
        ) {
          productMedia.mainImage = productMedia.images[0];
        }
      }
    }

    // 批量查询 SKU 数据
    const skuMap = new Map<string, any[]>();
    // 批量查询模板关联
    const templateMap = new Map<string, string>();
    if (productIds.length > 0) {
      // 查询模板
      const templates = await ctx.db
        .select({
          productId: productTemplateTable.productId,
          templateId: productTemplateTable.templateId,
        })
        .from(productTemplateTable)
        .where(inArray(productTemplateTable.productId, productIds));

      for (const template of templates) {
        templateMap.set(template.productId, template.templateId);
      }

      // 查询 SKU
      const skus = await ctx.db
        .select({
          id: skuTable.id,
          productId: skuTable.productId,
          skuCode: skuTable.skuCode,
          price: skuTable.price,
          marketPrice: skuTable.marketPrice,
          costPrice: skuTable.costPrice,
          stock: skuTable.stock,
          specJson: skuTable.specJson,
          status: skuTable.status,
        })
        .from(skuTable)
        .where(inArray(skuTable.productId, productIds));

      // 收集所有 SKU ID
      const skuIds = skus.map((s) => s.id);

      // 查询 SKU 媒体关联
      const skuMediaMap = new Map<string, any[]>();
      if (skuIds.length > 0) {
        const skuMediaRelations = await ctx.db
          .select({
            skuId: skuMediaTable.skuId,
            mediaId: skuMediaTable.mediaId,
            isMain: skuMediaTable.isMain,
            sortOrder: skuMediaTable.sortOrder,
            // 媒体信息
            mediaUrl: mediaTable.url,
            mediaOriginalName: mediaTable.originalName,
            mediaMimeType: mediaTable.mimeType,
            mediaType: mediaTable.mediaType,
            thumbnailUrl: mediaTable.thumbnailUrl,
          })
          .from(skuMediaTable)
          .innerJoin(mediaTable, eq(skuMediaTable.mediaId, mediaTable.id))
          .where(inArray(skuMediaTable.skuId, skuIds))
          .orderBy(asc(skuMediaTable.sortOrder));

        // 整理 SKU 媒体数据
        for (const sku of skus) {
          skuMediaMap.set(sku.id, []);
        }

        for (const media of skuMediaRelations) {
          const mediaList = skuMediaMap.get(media.skuId);
          if (!mediaList) continue;

          mediaList.push({
            id: media.mediaId,
            url: media.mediaUrl,
            originalName: media.mediaOriginalName,
            mimeType: media.mediaMimeType,
            mediaType: media.mediaType,
            thumbnailUrl: media.thumbnailUrl,
            isMain: media.isMain,
            sortOrder: media.sortOrder,
          });
        }
      }

      for (const sku of skus) {
        if (!skuMap.has(sku.productId)) {
          skuMap.set(sku.productId, []);
        }
        // 为每个 SKU 附加媒体数据
        skuMap.get(sku.productId)!.push({
          ...sku,
          media: skuMediaMap.get(sku.id) || [],
        });
      }
    }

    // 组合数据
    const enrichedResult = result.map((product) => {
      const media = mediaMap.get(product.id) || {
        images: [],
        videos: [],
        mainImage: null,
      };
      const skus = skuMap.get(product.id) || [];
      // 提取 mediaIds 和 videoIds
      const mediaIds = media.images.map((img: any) => img.id);
      const videoIds = media.videos.map((vid: any) => vid.id);

      return {
        ...product,
        // 模板 ID
        templateId: templateMap.get(product.id) || null,
        // 媒体 ID 列表（用于编辑）
        mediaIds,
        videoIds,
        // 媒体数据（用于展示）
        images: media.images,
        videos: media.videos,
        mainImage: media.mainImage?.url || null,
        mainImageId: media.mainImage?.id || null,
        // SKU 数据
        skus,
        skuCount: skus.length,
      };
    });

    // 替换 getSiteProducts 最后的总数计算部分
    const [{ count }] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(siteProductTable)
      .innerJoin(productTable, eq(siteProductTable.productId, productTable.id))
      .where(and(...conditions));
    return {
      data: enrichedResult,
      total: Number(count), // 这里的 count 是真实的数据库总数
      page: Number(page),
      limit: Number(limit),
    };
  }

  /**
   * 更新商品（全量关联更新）
   */
  public async update(productId: string, body: any, ctx: ServiceContext) {
    const {
      // 1. 基础信息
      name,
      spuCode,
      description,
      status,
      units,
      // 2. 站点特定信息
      price,
      siteName,
      siteDescription,
      seoTitle,
      siteCategoryId,
      // 3. 关联 ID
      templateId,
      // 4. 媒体数据
      mediaIds,
      mainImageId,
      videoIds,
      // 5. SKU 列表 (全量覆盖更新方案)
      skus,
    } = body;

    const siteId = ctx.user.context.site?.id;
    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }

    return await ctx.db.transaction(async (tx) => {
      // --- 阶段 A: 权限与存在性验证 ---
      const [siteProduct] = await tx
        .select()
        .from(siteProductTable)
        .where(
          and(
            eq(siteProductTable.productId, productId),
            eq(siteProductTable.siteId, siteId)
          )
        )
        .limit(1);

      if (!siteProduct) {
        throw new HttpError.NotFound("商品不存在或无权访问");
      }

      // --- 阶段 B & C: 根据站点类型执行不同的更新策略 ---
      const siteType = ctx.user.context.site.siteType || "group";

      if (siteType === "factory") {
        // 【工厂模式 - 双写同步策略】
        // 工厂是数据源头，需要同时更新 productTable 和 siteProductTable
        // 这样查询层可以统一从 siteProductTable 查询，逻辑更简洁

        // B1. 更新源头表 (productTable) - 记录基础信息
        // 注意：productTable 不存储 price，价格是站点级别数据，存在 siteProductTable
        const productUpdate: any = {};
        if (name !== undefined) productUpdate.name = name;
        if (spuCode !== undefined) productUpdate.spuCode = spuCode;
        if (description !== undefined) productUpdate.description = description;
        if (status !== undefined) productUpdate.status = status;
        if (units !== undefined) productUpdate.units = units;

        if (Object.keys(productUpdate).length > 0) {
          await tx
            .update(productTable)
            .set({ ...productUpdate, updatedAt: new Date() })
            .where(eq(productTable.id, productId));
        }

        // C1. 同步更新站点商品表 (siteProductTable) - 强制保持一致
        // 工厂模式下，siteName/sitePrice 必须与源头保持同步
        await tx
          .update(siteProductTable)
          .set({
            siteName: name, // 强制同步源头名称
            siteDescription: description, // 强制同步描述
            sitePrice: price ? price.toString() : null, // 强制同步价格
            seoTitle,
            siteCategoryId,
          })
          .where(
            and(
              eq(siteProductTable.productId, productId),
              eq(siteProductTable.siteId, siteId)
            )
          );
      } else {
        // 【集团/收录模式 - 覆盖策略】
        // 只更新 siteProductTable，允许自定义名称和价格
        // productTable 保持原厂数据不变

        // B2. 基础字段更新（仅非覆盖字段）
        const productUpdate: any = {};
        if (spuCode !== undefined) productUpdate.spuCode = spuCode;
        if (status !== undefined) productUpdate.status = status;
        if (units !== undefined) productUpdate.units = units;

        if (Object.keys(productUpdate).length > 0) {
          await tx
            .update(productTable)
            .set({ ...productUpdate, updatedAt: new Date() })
            .where(eq(productTable.id, productId));
        }

        // C2. 站点商品表更新（允许覆盖）
        await tx
          .update(siteProductTable)
          .set({
            siteName: siteName || name, // 允许自定义名称，回退到原名
            siteDescription: siteDescription || description, // 允许自定义描述
            sitePrice: price ? price.toString() : null, // 允许自定义价格
            seoTitle,
            siteCategoryId,
          })
          .where(
            and(
              eq(siteProductTable.productId, productId),
              eq(siteProductTable.siteId, siteId)
            )
          );
      }

      // 如果更新了站点分类，同步更新主分类关联
      if (siteCategoryId) {
        const [category] = await tx
          .select()
          .from(siteCategoryTable)
          .where(eq(siteCategoryTable.id, siteCategoryId))
          .limit(1);
        if (category?.masterCategoryId) {
          await tx
            .delete(productMasterCategoryTable)
            .where(eq(productMasterCategoryTable.productId, productId));
          await tx.insert(productMasterCategoryTable).values({
            productId,
            masterCategoryId: category.masterCategoryId,
          });
        }
      }

      // --- 阶段 D: 媒体全量替换 (Images & Videos) ---
      if (mediaIds !== undefined || videoIds !== undefined) {
        await tx
          .delete(productMediaTable)
          .where(eq(productMediaTable.productId, productId));

        const allMediaIds = [...(mediaIds || []), ...(videoIds || [])];
        if (allMediaIds.length > 0) {
          const mediaRelations: any[] = [];
          // 图片处理 (sortOrder >= 0)
          mediaIds?.forEach((id: string, idx: number) => {
            mediaRelations.push({
              productId,
              mediaId: id,
              isMain: id === mainImageId,
              sortOrder: idx,
            });
          });
          // 视频处理 (sortOrder < 0)
          videoIds?.forEach((id: string, idx: number) => {
            mediaRelations.push({
              productId,
              mediaId: id,
              isMain: false,
              sortOrder: -1 - idx,
            });
          });
          await tx.insert(productMediaTable).values(mediaRelations);
        }
      }

      // --- 阶段 E: SKU Diff 更新（增量更新策略）---
      // 逻辑：对比现有 SKU 与传入 SKU，执行：删除移除的、更新存在的、插入新增的
      // 好处：保持 SKU ID 不变，避免外键报错和历史数据丢失
      if (skus && Array.isArray(skus)) {
        // E1. 查询现有 SKU
        const existingSkus = await tx
          .select({ id: skuTable.id })
          .from(skuTable)
          .where(eq(skuTable.productId, productId));
        const existingIds = new Set(existingSkus.map((s) => s.id));

        // E2. 提取传入的 SKU ID（如果有）
        const incomingIds = new Set(skus.filter((s) => s.id).map((s) => s.id));

        // E3. 删除：在数据库中存在但不在传入列表中的 SKU
        const toDeleteIds = [...existingIds].filter(
          (id) => !incomingIds.has(id)
        );
        if (toDeleteIds.length > 0) {
          try {
            await tx.delete(skuTable).where(inArray(skuTable.id, toDeleteIds));
          } catch (error: any) {
            // 如果删除失败（如外键约束），给出明确错误提示
            if (error.message?.includes("foreign key constraint")) {
              throw new HttpError.Conflict(
                "无法删除已有订单引用的 SKU，请先删除相关订单"
              );
            }
            throw error;
          }
        }

        // E4. 更新或插入每个 SKU
        for (const s of skus) {
          const skuData = {
            skuCode: s.skuCode,
            price: s.price?.toString() || "0",
            stock: s.stock?.toString() || "0",
            specJson: s.specJson || {},
            status: s.status ?? 1,
          };

          if (s.id && existingIds.has(s.id)) {
            // 更新现有 SKU
            await tx
              .update(skuTable)
              .set({ ...skuData, updatedAt: new Date() })
              .where(eq(skuTable.id, s.id));
          } else {
            // 插入新 SKU
            await tx.insert(skuTable).values({
              ...skuData,
              productId,
              tenantId: ctx.user.context.tenantId!,
              deptId: ctx.currentDeptId,
            });
          }
        }
      }

      // --- 阶段 F: 模板关联更新 ---
      if (templateId !== undefined) {
        await tx
          .delete(productTemplateTable)
          .where(eq(productTemplateTable.productId, productId));
        if (templateId) {
          await tx
            .insert(productTemplateTable)
            .values({ productId, templateId });
        }
      }

      return { success: true, id: productId };
    });
  }

  /**
   * 批量删除商品
   */
  public async batchDelete(ids: string[], ctx: ServiceContext) {
    const siteId = ctx.user.context.site?.id;
    if (!siteId) {
      throw new HttpError.BadRequest("当前部门未绑定站点");
    }

    await ctx.db.transaction(async (tx) => {
      // 1. 验证商品是否属于当前站点
      const siteProducts = await tx
        .select()
        .from(siteProductTable)
        .where(
          and(
            inArray(siteProductTable.productId, ids),
            eq(siteProductTable.siteId, siteId)
          )
        );

      if (siteProducts.length === 0) {
        throw new HttpError.NotFound("未找到可删除的商品");
      }

      // 2. 删除站点商品关联
      await tx
        .delete(siteProductTable)
        .where(
          and(
            eq(siteProductTable.siteId, siteId),
            inArray(siteProductTable.productId, ids)
          )
        );
      await tx.delete(skuTable).where(inArray(skuTable.productId, ids));

      // 3. 删除其他关联数据
      await tx
        .delete(productMediaTable)
        .where(inArray(productMediaTable.productId, ids));

      await tx
        .delete(productTemplateTable)
        .where(inArray(productTemplateTable.productId, ids));

      await tx
        .delete(productMasterCategoryTable)
        .where(inArray(productMasterCategoryTable.productId, ids));

      // 4. 删除商品
      await tx.delete(productTable).where(inArray(productTable.id, ids));
    });

    return { count: ids.length, message: `成功删除 ${ids.length} 个商品` };
  }

  /**
   * 删除单个商品（复用批量删除逻辑以确保权限检查和关联数据清理）
   */
  public async delete(id: string, ctx: ServiceContext) {
    // 复用 batchDelete 方法，确保权限检查和数据清理逻辑一致
    return await this.batchDelete([id], ctx);
  }

  public async getSkuList(id: string, ctx: ServiceContext) {
    // 修复：移除数组解构，findMany 返回的是数组而不是单个对象
    const res = await ctx.db.query.skuTable.findMany({
      where: {
        productId: id,
        tenantId: ctx.user.context.tenantId!,
        deptId: ctx.currentDeptId,
      },
      with: {
        media: {
          columns: {
            mediaId: true,
            isMain: true,
          },
        },
      },
    });
    return res;
  }
}
