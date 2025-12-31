import { type InquiryContract, inquiryTable } from "@repo/contract";
import { and, eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class InquiryService {
  public async create(
    body: InquiryContract["Create"],
    inquiryNum: string,
    ctx: ServiceContext
  ) {
    const insertData = {
      ...body,
      inquiryNum,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.tenantId!, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db
      .insert(inquiryTable)
      .values(insertData)
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(
    query: InquiryContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { limit = 10, page = 0, sort, ...filters } = query;
    const whereConditions = [];
    // 租户隔离
    if (ctx.user?.tenantId)
      whereConditions.push(eq(inquiryTable.tenantId, ctx.user.tenantId));

    const data = await ctx.db
      .select()
      .from(inquiryTable)
      .where(and(...whereConditions))
      .limit(limit)
      .offset((page - 1) * limit);
    const total = await ctx.db.$count(inquiryTable, and(...whereConditions));
    return { data, total };
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: InquiryContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(inquiryTable)
      .set(updateData)
      .where(eq(inquiryTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(inquiryTable)
      .where(eq(inquiryTable.id, id))
      .returning();
    return res;
  }
}
