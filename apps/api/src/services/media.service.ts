import { type MediaContract, mediaTable } from "@repo/contract";
import { and, eq, inArray, like, sql } from "drizzle-orm";
import { HttpError } from "elysia-http-problem-json";
import { StorageFactory } from "~/lib/media/storage/StorageFactory";
import { type ServiceContext } from "../lib/type";

export class MediaService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: MediaContract["Create"], ctx: ServiceContext) {
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
    const [res] = await ctx.db
      .insert(mediaTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async list(query: MediaContract["ListQuery"], ctx: ServiceContext) {
    const { search } = query;

    const res = await ctx.db.query.mediaTable.findMany({
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
    body: MediaContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(mediaTable)
      .set(updateData)
      .where(eq(mediaTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(mediaTable)
      .where(eq(mediaTable.id, id))
      .returning();
    return res;
  }

  /**
   * 处理文件上传逻辑
   */
  async upload(file: File, ctx: ServiceContext, category = "general") {
    const storage = StorageFactory.createStorageFromEnv();

    // 1. 生成唯一文件名
    const fileName = file.name || "unknown";
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${fileName}`;

    // 2. 物理上传
    const uploadResult = await storage.uploadFile(
      file,
      uniqueName,
      category,
      file.type
    );

    // 3. 直接插入数据库
    const insertData = {
      url: uploadResult.url || "",
      storageKey: uploadResult.key || uniqueName,
      originalName: fileName,
      mimeType: file.type,
      category,
      isPublic: true,
      status: true,
      // 自动注入租户信息
      tenantId: ctx.user?.context.tenantId ?? "",
      createdBy: ctx.user?.id,
    };

    const [res] = await ctx.db
      .insert(mediaTable)
      .values(insertData)
      .returning();
    return res;
  }

  /**
   * 获取媒体列表（带筛选）
   */
  async mediaList(
    query: { category?: string; search?: string; ids?: string[] },
    ctx: ServiceContext
  ) {
    const filters: any[] = [];

    // 租户隔离
    if (ctx.user?.context.tenantId)
      filters.push(eq(mediaTable.tenantId, ctx.user.context.tenantId!));

    if (query.category) filters.push(eq(mediaTable.category, query.category));
    if (query.search)
      filters.push(like(mediaTable.originalName, `%${query.search}%`));
    if (query.ids && query.ids.length > 0)
      filters.push(inArray(mediaTable.id, query.ids));

    const files = await ctx.db
      .select()
      .from(mediaTable)
      .where(and(...filters))
      .orderBy(sql`${mediaTable.createdAt} desc`);

    const storage = StorageFactory.createStorageFromEnv();
    return files.map((file: any) => ({
      ...file,
      url: storage.getPublicUrl(file.storageKey),
    }));
  }

  /**
   * 物理删除文件
   */
  async deletePhysical(id: string, ctx: ServiceContext) {
    // 1. 先查出记录
    const whereConditions: any[] = [eq(mediaTable.id, id)];
    if (ctx.user?.context.tenantId)
      whereConditions.push(eq(mediaTable.tenantId, ctx.user.context.tenantId!));

    const [file] = await ctx.db
      .select()
      .from(mediaTable)
      .where(and(...whereConditions))
      .limit(1);

    if (!file) throw new HttpError.NotFound("文件不存在或无权访问");

    // 2. 删除物理文件
    const storage = StorageFactory.createStorageFromEnv();
    await storage.deleteFile(file.storageKey);

    // 3. 调用 delete 方法
    return await this.delete(id, ctx);
  }

  /**
   * 批量物理删除
   */
  async batchDeletePhysical(ids: string[], ctx: ServiceContext) {
    const whereConditions: any[] = [inArray(mediaTable.id, ids)];
    if (ctx.user?.context.tenantId)
      whereConditions.push(eq(mediaTable.tenantId, ctx.user.context.tenantId!));

    // 1. 查找所有符合条件的文件
    const files = await ctx.db
      .select()
      .from(mediaTable)
      .where(and(...whereConditions));

    if (files.length === 0) throw new HttpError.NotFound("未找到可删除的文件");

    // 2. 物理删除
    const storage = StorageFactory.createStorageFromEnv();
    await Promise.all(files.map((f: any) => storage.deleteFile(f.storageKey)));

    // 3. 数据库批量删除
    await ctx.db.delete(mediaTable).where(and(...whereConditions));

    return { count: files.length };
  }
}
