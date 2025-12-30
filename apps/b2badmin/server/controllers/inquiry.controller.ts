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

const inquiryService = new InquiryService();
/**
 * @generated
 */
export const inquiryController = new Elysia({ prefix: "/inquiry" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db }) => inquiryService.findAll(query, { db, user }),
    {
      allPermissions: ["INQUIRY:VIEW"],
      query: InquiryContract.ListQuery,
      detail: {
        summary: "获取Inquiry列表",
        description: "分页查询Inquiry数据，支持搜索和排序",
        tags: ["Inquiry"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db }) => inquiryService.create(body, { db, user }),
    {
      allPermissions: ["INQUIRY:CREATE"],
      body: InquiryContract.Create,
      detail: {
        summary: "创建Inquiry",
        description: "新增一条Inquiry记录",
        tags: ["Inquiry"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, user, db }) => inquiryService.update(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      body: InquiryContract.Update,
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
    ({ params, user, db }) => inquiryService.delete(params.id, { db, user }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["INQUIRY:DELETE"],
      detail: {
        summary: "删除Inquiry",
        description: "根据ID删除Inquiry记录",
        tags: ["Inquiry"],
      },
    }
  );
