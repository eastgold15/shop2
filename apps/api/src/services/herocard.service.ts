import { type HeroCardContract, heroCardTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { type ServiceContext } from "../lib/type";

export class HeroCardService {
  public async create(body: HeroCardContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user?.tenantId ? { tenantId: ctx.user.tenantId } : {}),
      ...(ctx.user?.id ? { createdBy: ctx.user.id } : {}),
      ...(ctx.currentDeptId ? { deptId: ctx.currentDeptId } : {}),
      ...(ctx.user ? { siteId: ctx.user.department.site.id } : {}),
    };
    const [res] = await ctx.db
      .insert(heroCardTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async findAll(
    query: HeroCardContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.heroCardTable.findMany({
      where: {
        deptId: ctx.currentDeptId,
        tenantId: ctx.user.tenantId!,
        ...(search
          ? {
              OR: [
                { title: { ilike: `%${search}%` } },
                { description: { ilike: `%${search}%` } },
              ],
            }
          : {}),
      },
      with: {
        media: true,
      },
      orderBy: {
        sortOrder: "asc",
        createdAt: "desc",
      },
    });
    return res;
  }

  public async update(
    id: string,
    body: HeroCardContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(heroCardTable)
      .set(updateData)
      .where(eq(heroCardTable.id, id))
      .returning();
    return res;
  }

  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(heroCardTable)
      .where(eq(heroCardTable.id, id))
      .returning();
    return res;
  }

  /**
   * 创建 Hero Card
   */
  async createHeroCard(data: any, mediaId: string | null, ctx: ServiceContext) {
    return await this.create(
      {
        ...data,
        mediaId,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
        backgroundClass: data.backgroundClass ?? "bg-blue-50",
      },
      ctx
    );
  }

  /**
   * 更新排序
   */
  async updateSortOrder(
    items: Array<{ id: string; sortOrder: number }>,
    ctx: ServiceContext
  ) {
    await ctx.db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(heroCardTable)
          .set({ sortOrder: item.sortOrder })
          .where(eq(heroCardTable.id, item.id));
      }
    });

    return { success: true };
  }

  /**
   * 切换状态
   */
  async toggleStatus(id: string, ctx: ServiceContext) {
    const card = await ctx.db.query.heroCardTable.findFirst({
      where: {
        id,
        deptId: ctx.currentDeptId,
        tenantId: ctx.user.tenantId!,
      },
    });
    if (!card) throw new HttpError.NotFound("记录不存在");
    const [updated] = await ctx.db
      .update(heroCardTable)
      .set({ isActive: !card.isActive })
      .where(eq(heroCardTable.id, id))
      .returning();

    return {
      id: updated.id,
      isActive: updated.isActive,
      message: updated.isActive ? "已激活" : "已停用",
    };
  }
}
