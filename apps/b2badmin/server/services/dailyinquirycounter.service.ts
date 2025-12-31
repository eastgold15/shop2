// import {
//   type DailyInquiryCounterContract,
//   dailyInquiryCounterTable,
// } from "@repo/contract";
// import { and, eq } from "drizzle-orm";
// import { type ServiceContext } from "../lib/type";

// export class DailyInquiryCounterService {
//   /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
//   public async create(
//     body: DailyInquiryCounterContract["Create"],
//     ctx: ServiceContext
//   ) {
//     const insertData = {
//       ...body,
//       // 自动注入租户信息
//       ...(ctx.user
//         ? { tenantId: ctx.user.tenantId, createdBy: ctx.user.id }
//         : {}),
//     };
//     const [res] = await ctx.db
//       .insert(dailyInquiryCounterTable)
//       .values(insertData)
//       .returning();
//     return res;
//   }

//   /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
//   public async findAll(
//     query: DailyInquiryCounterContract["ListQuery"],
//     ctx: ServiceContext
//   ) {
//     const { limit = 10, page = 0, sort, ...filters } = query;
//     const whereConditions = [];
//     // 租户隔离
//     if (ctx.user?.tenantId)
//       whereConditions.push(
//         eq(dailyInquiryCounterTable.tenantId, ctx.user.tenantId)
//       );

//     const data = await ctx.db
//       .select()
//       .from(dailyInquiryCounterTable)
//       .where(and(...whereConditions))
//       .limit(limit)
//       .offset((page - 1) * limit);
//     const total = await ctx.db.$count(
//       dailyInquiryCounterTable,
//       and(...whereConditions)
//     );
//     return { data, total };
//   }

//   /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
//   public async update(
//     id: string,
//     body: DailyInquiryCounterContract["Update"],
//     ctx: ServiceContext
//   ) {
//     const updateData = { ...body, updatedAt: new Date() };
//     const [res] = await ctx.db
//       .update(dailyInquiryCounterTable)
//       .set(updateData)
//       .where(eq(dailyInquiryCounterTable.id, id))
//       .returning();
//     return res;
//   }

//   /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
//   public async delete(id: string, ctx: ServiceContext) {
//     const [res] = await ctx.db
//       .delete(dailyInquiryCounterTable)
//       .where(eq(dailyInquiryCounterTable.id, id))
//       .returning();
//     return res;
//   }
// }
