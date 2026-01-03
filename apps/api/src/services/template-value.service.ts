import { type TemplateValueContract, templateValueTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class TemplateValueService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(
    body: TemplateValueContract["Create"],
    ctx: ServiceContext
  ) {
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
      .insert(templateValueTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async findAll(
    query: TemplateValueContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.templateValueTable.findMany({
      where: {},
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: TemplateValueContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(templateValueTable)
      .set(updateData)
      .where(eq(templateValueTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(templateValueTable)
      .where(eq(templateValueTable.id, id))
      .returning();
    return res;
  }

  // [Auto-Generated] Do not edit this tag to keep updates. @generated
  public async list(
    query: TemplateValueContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.templateValueTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { originalName: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }
}
