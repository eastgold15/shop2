import { type CustomerContract, customerTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class CustomerService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: CustomerContract["Create"], ctx: ServiceContext) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db
      .insert(customerTable)
      .values(insertData)
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(
    query: CustomerContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { sort, ...filters } = query;

    const res = await ctx.db.query.customerTable.findMany({
      where: {
        deptId: ctx.currentDeptId,
        tenantId: ctx.user.tenantId!,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: CustomerContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(customerTable)
      .set(updateData)
      .where(eq(customerTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(customerTable)
      .where(eq(customerTable.id, id))
      .returning();
    return res;
  }
}
