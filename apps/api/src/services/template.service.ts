import { type TemplateContract, templateTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class TemplateService {
  public async create(body: TemplateContract["Create"], ctx: ServiceContext) {
    const [res] = await ctx.db.insert(templateTable).values(body).returning();
    return res;
  }

  public async findAll(
    query: TemplateContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;
    const res = await ctx.db.query.templateTable.findMany({
      where: {
        ...(search ? { name: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: TemplateContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(templateTable)
      .set(updateData)
      .where(eq(templateTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(templateTable)
      .where(eq(templateTable.id, id))
      .returning();
    return res;
  }
}
