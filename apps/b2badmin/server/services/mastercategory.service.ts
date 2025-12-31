import {
  type MasterCategoryContract,
  masterCategoryTable,
} from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class MasterCategoryService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(
    body: MasterCategoryContract["Create"],
    ctx: ServiceContext
  ) {
    const insertData = {
      ...body,
      // 自动注入租户信息
      ...(ctx.user
        ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id }
        : {}),
    };
    const [res] = await ctx.db
      .insert(masterCategoryTable)
      .values(insertData)
      .returning();
    return res;
  }

  public async findAll(
    query: MasterCategoryContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const data = await ctx.db.query.masterCategoryTable.findMany({
      where: {
        tenantId: ctx.user.tenantId!,
        ...(query.isActive !== undefined && query.isActive !== null
          ? { isActive: query.isActive }
          : {}),
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return data;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(
    id: string,
    body: MasterCategoryContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(masterCategoryTable)
      .set(updateData)
      .where(eq(masterCategoryTable.id, id))
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(masterCategoryTable)
      .where(eq(masterCategoryTable.id, id))
      .returning();
    return res;
  }
}
