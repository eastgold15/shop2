import { type DepartmentContract, departmentTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class DepartmentService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: DepartmentContract["Create"], ctx: ServiceContext) {
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
      .insert(departmentTable)
      .values(insertData)
      .returning();
    return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(
    query: DepartmentContract["ListQuery"],
    ctx: ServiceContext
  ) {
    const { search } = query;

    const res = await ctx.db.query.departmentTable.findMany({
      where: {
        tenantId: ctx.user.context.tenantId!,
        ...(search ? { originalName: { ilike: `%${search}%` } } : {}),
      },
    });
    return res;
  }

  public async update(
    id: string,
    body: DepartmentContract["Update"],
    ctx: ServiceContext
  ) {
    const updateData = { ...body, updatedAt: new Date() };
    const [res] = await ctx.db
      .update(departmentTable)
      .set(updateData)
      .where(eq(departmentTable.id, id))
      .returning();
    return res;
  }

  public async delete(id: string, ctx: ServiceContext) {
    const [res] = await ctx.db
      .delete(departmentTable)
      .where(eq(departmentTable.id, id))
      .returning();
    return res;
  }
}
