/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { DailyInquiryCounterContract } from "../../../../packages/contract/src/modules/dailyinquirycounter.contract";
import { DailyInquiryCounterService } from "../services/dailyinquirycounter.service";

const dailyinquirycounterService = new DailyInquiryCounterService();
/**
 * @generated
 */
export const dailyinquirycounterController = new Elysia({
  prefix: "/dailyinquirycounter",
})
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, getScopeObj }) =>
      dailyinquirycounterService.findAll(query, { db, user, getScopeObj }),
    {
      allPermissions: ["DAILYINQUIRYCOUNTER:VIEW"],
      query: DailyInquiryCounterContract.ListQuery,
      detail: {
        summary: "获取DailyInquiryCounter列表",
        description: "分页查询DailyInquiryCounter数据，支持搜索和排序",
        tags: ["DailyInquiryCounter"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, getScopeObj }) =>
      dailyinquirycounterService.create(body, { db, user, getScopeObj }),
    {
      allPermissions: ["DAILYINQUIRYCOUNTER:CREATE"],
      body: DailyInquiryCounterContract.Create,
      detail: {
        summary: "创建DailyInquiryCounter",
        description: "新增一条DailyInquiryCounter记录",
        tags: ["DailyInquiryCounter"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, getScopeObj }) =>
      dailyinquirycounterService.update(params.id, body, {
        db,
        user,
        getScopeObj,
      }),
    {
      params: t.Object({ id: t.String() }),
      body: DailyInquiryCounterContract.Update,
      allPermissions: ["DAILYINQUIRYCOUNTER:EDIT"],
      detail: {
        summary: "更新DailyInquiryCounter",
        description: "根据ID更新DailyInquiryCounter信息",
        tags: ["DailyInquiryCounter"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, getScopeObj }) =>
      dailyinquirycounterService.delete(params.id, { db, user, getScopeObj }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["DAILYINQUIRYCOUNTER:DELETE"],
      detail: {
        summary: "删除DailyInquiryCounter",
        description: "根据ID删除DailyInquiryCounter记录",
        tags: ["DailyInquiryCounter"],
      },
    }
  );
