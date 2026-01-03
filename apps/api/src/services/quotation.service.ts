import { type QuotationContract, quotationTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class QuotationService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: QuotationContract["Create"], ctx: ServiceContext) {
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
      .insert(quotationTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async findAll(
    query: QuotationContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.quotationTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { refNo: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: QuotationContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(quotationTable)
      .set(updateData)
      .where(eq(quotationTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(quotationTable)
      .where(eq(quotationTable.id, id))
      .returning();
    return res;
  }
}
