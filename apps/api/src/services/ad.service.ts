import { type AdContract, adTable } from "@repo/contract";
import { and, eq, inArray, desc } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { type ServiceContext } from "../lib/type";

export class AdService {
  public async create(body: AdContract["Create"], ctx: ServiceContext) {
    // 处理日期字段，如果为空或无效则使用当前时间
    const now = new Date();
    const startDate = body.startDate ? new Date(body.startDate) : now;
    const endDate = body.endDate ? new Date(body.endDate) : now;

    // 验证日期有效性
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new HttpError.BadRequest("无效的日期格式");
    }

    // 获取用户上下文信息
    const userContext = ctx.user.context!;

    // 验证必需的用户信息
    if (!userContext?.tenantId) {
      console.error("用户缺少 tenantId:", ctx.user);
      throw new HttpError.Unauthorized("用户未关联租户，请联系管理员");
    }

    if (!userContext?.site?.id) {
      console.error("用户缺少 siteId:", ctx.user);
      throw new HttpError.Unauthorized("用户未关联站点，请联系管理员");
    }

    // 过滤掉空字符串的 mediaId（让用户可选是否上传图片）
    const { mediaId, ...restBody } = body;
    const insertData = {
      ...restBody,
      // 只有当 mediaId 有值时才包含
      ...(mediaId && mediaId.trim() !== "" ? { mediaId } : {}),
      startDate,
      endDate,
      // 自动注入租户信息和站点信息
      tenantId: userContext.tenantId!,
      ...(ctx.user?.id ? { createdBy: ctx.user.id } : {}),
      ...(ctx.currentDeptId ? { deptId: ctx.currentDeptId } : {}),
      siteId: userContext.site.id,
    };

    const [ad] = await ctx.db.insert(adTable).values(insertData).returning();

    // 获取关联的 media 信息
    const adWithMedia = await ctx.db.query.adTable.findFirst({
      where: eq(adTable.id, ad.id),
      with: {
        media: true,
      },
    });

    return {
      ...adWithMedia,
      mediaUrl: (adWithMedia as any)?.media?.url || null,
    };
  }

  public async findAll(query: AdContract["ListQuery"], ctx: ServiceContext) {
    const { search, type, position, isActive } = query;
    const userContext = ctx.user.context!;

    // 验证必需的用户信息
    if (!userContext?.tenantId) {
      throw new HttpError.Unauthorized("用户未关联租户，请联系管理员");
    }

    const ads = await ctx.db.query.adTable.findMany({
      where: {
        deptId: ctx.currentDeptId,
        tenantId: userContext.tenantId!,
        ...(search ? { title: { ilike: `%${search}%` } } : {}),
        ...(type ? { type } : {}),
        ...(position ? { position } : {}),
        ...(isActive !== undefined && isActive !== null ? { isActive } : {}),
      },
      with: {
        media: true,
      },
    });

    // 转换格式，将 media 对象转换为 mediaUrl 字符串
    return ads.map((ad: any) => ({
      ...ad,
      mediaUrl: ad.media?.url || null,
    }));
  }

  public async update(
    id: string,
    body: AdContract["Update"],
    ctx: ServiceContext
  ) {
    // 处理日期字段
    const updateData: any = {
      updatedAt: new Date(),
    };

    // 只有提供了日期才更新
    if (body.startDate !== undefined) {
      const startDate = new Date(body.startDate);
      if (!isNaN(startDate.getTime())) {
        updateData.startDate = startDate;
      }
    }

    if (body.endDate !== undefined) {
      const endDate = new Date(body.endDate);
      if (!isNaN(endDate.getTime())) {
        updateData.endDate = endDate;
      }
    }

    // 复制其他字段（除了 startDate 和 endDate）
    Object.keys(body).forEach(key => {
      if (key !== 'startDate' && key !== 'endDate' && body[key as keyof typeof body] !== undefined) {
        updateData[key] = body[key as keyof typeof body];
      }
    });

    const [ad] = await ctx.db
      .update(adTable)
      .set(updateData)
      .where(eq(adTable.id, id))
      .returning();

    // 获取关联的 media 信息
    const adWithMedia = await ctx.db.query.adTable.findFirst({
      where: eq(adTable.id, ad.id),
      with: {
        media: true,
      },
    });

    return {
      ...adWithMedia,
      mediaUrl: (adWithMedia as any)?.media?.url || null,
    };
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
      const [res] = await ctx.db.delete(adTable).where(eq(adTable.id, id)).returning();
             return res;
  }

  /**
   * 批量删除广告
   */
  async batchDelete(ids: string[], ctx: ServiceContext) {
    const whereConditions: any[] = [inArray(adTable.id, ids)];
    const userContext = ctx.user.context!;

    if (userContext?.tenantId)
      whereConditions.push(eq(adTable.tenantId, userContext.tenantId!));

    // 查找所有符合条件的广告
    const ads = await ctx.db
      .select()
      .from(adTable)
      .where(and(...whereConditions));

    if (ads.length === 0) {
      throw new HttpError.NotFound("未找到可删除的广告");
    }

    // 批量删除
    await ctx.db.delete(adTable).where(and(...whereConditions));

    return { count: ads.length, message: `成功删除 ${ads.length} 个广告` };
  }
}
