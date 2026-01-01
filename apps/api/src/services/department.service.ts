import { type DepartmentContract, departmentTable } from "@repo/contract";
import { eq, and, desc } from "drizzle-orm";
import { type ServiceContext } from "../lib/type";

export class DepartmentService {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async create(body: DepartmentContract["Create"], ctx: ServiceContext) {
      const insertData = {
              ...body,
              // 自动注入租户信息
              ...(ctx.user ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id } : {})
            };
            const [res] = await ctx.db.insert(departmentTable).values(insertData).returning();
            return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async findAll(query: DepartmentContract["ListQuery"], ctx: ServiceContext) {
      const {  sort, ...filters } = query;

            const res = await ctx.db.query.departmentTable.findMany({
              where: {
                deptId: ctx.currentDeptId,
                tenantId: ctx.user.tenantId!,
              },
              orderBy: {
              createdAt: "desc",
            },
          })

           return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async update(id: string, body: DepartmentContract["Update"], ctx: ServiceContext) {
      const updateData = { ...body, updatedAt: new Date() };
             const [res] = await ctx.db.update(departmentTable)
               .set(updateData)
               .where(eq(departmentTable.id, id))
               .returning();
             return res;
  }

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  public async delete(id: string, ctx: ServiceContext) {
      const [res] = await ctx.db.delete(departmentTable).where(eq(departmentTable.id, id)).returning();
             return res;
  }
}
