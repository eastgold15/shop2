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
import { InquiryContract } from "../../../../packages/contract/src/modules/inquiry.contract";
import { InquiryService } from "../services/inquiry.service";
import { generateInquiryNumber } from "~/modules/_lib/dayCount";

const inquiryService = new InquiryService();
/**
 * @generated
 */
export const inquiryController = new Elysia({ prefix: "/inquiry" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      inquiryService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["INQUIRY:VIEW"],
      query: InquiryContract.ListQuery,
      requireDept: true,
      detail: {
        summary: "获取Inquiry列表",
        description: "分页查询Inquiry数据，支持搜索和排序",
        tags: ["Inquiry"],
      },
    }
  )
  .post(
    "/",
    async ({ body, user, db, currentDeptId }) => {
      const inquiryNumber = await generateInquiryNumber()

      return inquiryService.create(body, inquiryNumber, { db, user, currentDeptId })
    },
    {
      allPermissions: ["INQUIRY:CREATE"],
      body: InquiryContract.Create,
      requireDept: true,
      detail: {
        summary: "创建Inquiry",
        description: "新增一条Inquiry记录",
        tags: ["Inquiry"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      inquiryService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: InquiryContract.Update,
      requireDept: true,
      allPermissions: ["INQUIRY:EDIT"],
      detail: {
        summary: "更新Inquiry",
        description: "根据ID更新Inquiry信息",
        tags: ["Inquiry"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      inquiryService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      requireDept: true,
      allPermissions: ["INQUIRY:DELETE"],
      detail: {
        summary: "删除Inquiry",
        description: "根据ID删除Inquiry记录",
        tags: ["Inquiry"],
      },
    }
  );
