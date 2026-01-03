import { type TemplateKeyContract, templateKeyTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class TemplateKeyService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(
    body: TemplateKeyContract["Create"],
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
      .insert(templateKeyTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async findAll(
    query: TemplateKeyContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.templateKeyTable.findMany({
      where: {
        ...(search ? { key: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: TemplateKeyContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(templateKeyTable)
      .set(updateData)
      .where(eq(templateKeyTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(templateKeyTable)
      .where(eq(templateKeyTable.id, id))
      .returning();
    return res;
  }
}
