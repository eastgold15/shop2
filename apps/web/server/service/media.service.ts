import type { ServiceContext } from "~/middleware/site";

export class MediaService {
  /**
   * 根据 ID 获取单个媒体 URL
   */
  async getUrlById(id: string, ctx: ServiceContext) {
    const res = await ctx.db.query.mediaTable.findFirst({
      where: {
        id,
      },
      with: {
        metadata: true,
      },
    });

    return res?.url || null;
  }

  /**
   * 批量获取媒体 URL 列表
   */
  async getUrlsByIds(ids: string[], ctx: ServiceContext) {
    if (!ids || ids.length === 0) return [];
    const res = await ctx.db.query.mediaTable.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      with: {
        metadata: true,
      },
    });

    return res.map((item) => item.url || null);
  }
}
