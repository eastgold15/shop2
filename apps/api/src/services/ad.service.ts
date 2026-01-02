import { type AdContract, adTable } from "@repo/contract";
import { and, eq, inArray, desc } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { type ServiceContext } from "../lib/type";

export class AdService {
  public async create(body: AdContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      // 自动注入租户信息和站点信息
      ...(ctx.user?.tenantId ? { tenantId: ctx.user.tenantId } : {}),
      ...(ctx.user?.id ? { createdBy: ctx.user.id } : {}),
      ...(ctx.user?.department?.site?.id ? { siteId: ctx.user.department.site.id } : {}),
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
      mediaUrl: adWithMedia?.media?.url || null,
    };
  }

  public async findAll(query: AdContract["ListQuery"], ctx: ServiceContext) {
    const { search, type, position, isActive } = query;
    const ads = await ctx.db.query.adTable.findMany({
      where: {
        deptId: ctx.currentDeptId,
        tenantId: ctx.user.tenantId!,
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
    return ads.map(ad => ({
      ...ad,
      mediaUrl: ad.media?.url || null,
    }));
  }

  public async update(
    id: string,
    body: AdContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = {
      ...body,
      startDate: new Date(body.startDate || ""),
      endDate: new Date(body.endDate || ""),
      updatedAt: new Date(),
    };
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
      mediaUrl: adWithMedia?.media?.url || null,
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
    if (ctx.user?.tenantId)
      whereConditions.push(eq(adTable.tenantId, ctx.user.tenantId));

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
