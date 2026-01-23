import type { ServiceContext } from "~/middleware/site";

export class HeroCardService {
  /**
   * 查询当前有效的 Hero Cards (带站点隔离)
   */
  async findCurrent(ctx: ServiceContext) {
    const res = await ctx.db.query.heroCardTable.findMany({
      where: {
        isActive: true,
        siteId: ctx.site.id,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return res;
  }
}
