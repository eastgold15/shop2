import { type InquiryContract, inquiryTable } from "@repo/contract";
import { eq } from "drizzle-orm";
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
        ? { tenantId: ctx.user.context.tenantId!, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db
      .insert(inquiryTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async findAll(
    query: InquiryContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.inquiryTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { customerName: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
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
