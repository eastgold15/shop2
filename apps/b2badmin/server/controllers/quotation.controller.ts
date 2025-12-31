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
import { QuotationContract } from "../../../../packages/contract/src/modules/quotation.contract";
import { QuotationService } from "../services/quotation.service";

const quotationService = new QuotationService();
/**
 * @generated
 */
export const quotationController = new Elysia({ prefix: "/quotation" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      quotationService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["QUOTATION:VIEW"],
      query: QuotationContract.ListQuery,
      detail: {
        summary: "获取Quotation列表",
        description: "分页查询Quotation数据，支持搜索和排序",
        tags: ["Quotation"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      quotationService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["QUOTATION:CREATE"],
      body: QuotationContract.Create,
      detail: {
        summary: "创建Quotation",
        description: "新增一条Quotation记录",
        tags: ["Quotation"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      quotationService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: QuotationContract.Update,
      allPermissions: ["QUOTATION:EDIT"],
      detail: {
        summary: "更新Quotation",
        description: "根据ID更新Quotation信息",
        tags: ["Quotation"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      quotationService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["QUOTATION:DELETE"],
      detail: {
        summary: "删除Quotation",
        description: "根据ID删除Quotation记录",
        tags: ["Quotation"],
      },
    }
  );
