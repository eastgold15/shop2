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
import { DailyInquiryCounterContract } from "../../../../packages/contract/src/modules/daily-inquiry-counter.contract";
import { DailyInquiryCounterService } from "../services/daily-inquiry-counter.service";

const dailyInquiryCounterService = new DailyInquiryCounterService();
/**
 * @generated
 */
export const dailyInquiryCounterController = new Elysia({
  prefix: "/daily-inquiry-counter",
})
  .use(dbPlugin)
  .use(authGuardMid)
  // @generated
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      dailyInquiryCounterService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["DAILY_INQUIRY_COUNTER:VIEW"],
      requireDept: true,
      query: DailyInquiryCounterContract.ListQuery,
      detail: {
        summary: "获取DailyInquiryCounter列表",
        description: "分页查询DailyInquiryCounter数据，支持搜索和排序",
        tags: ["DailyInquiryCounter"],
      },
    }
  )
  // @generated
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      dailyInquiryCounterService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["DAILY_INQUIRY_COUNTER:CREATE"],
      requireDept: true,
      body: DailyInquiryCounterContract.Create,
      detail: {
        summary: "创建DailyInquiryCounter",
        description: "新增一条DailyInquiryCounter记录",
        tags: ["DailyInquiryCounter"],
      },
    }
  )
  // @generated
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      dailyInquiryCounterService.update(params.id, body, {
        db,
        user,
        currentDeptId,
      }),
    {
      params: t.Object({ id: t.String() }),
      body: DailyInquiryCounterContract.Update,
      allPermissions: ["DAILY_INQUIRY_COUNTER:EDIT"],
      requireDept: true,
      detail: {
        summary: "更新DailyInquiryCounter",
        description: "根据ID更新DailyInquiryCounter信息",
        tags: ["DailyInquiryCounter"],
      },
    }
  )
  // @generated
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      dailyInquiryCounterService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["DAILY_INQUIRY_COUNTER:DELETE"],
      requireDept: true,
      detail: {
        summary: "删除DailyInquiryCounter",
        description: "根据ID删除DailyInquiryCounter记录",
        tags: ["DailyInquiryCounter"],
      },
    }
  );
