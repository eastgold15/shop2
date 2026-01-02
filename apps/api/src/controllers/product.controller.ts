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
import { ProductContract } from "../../../../packages/contract/src/modules/product.contract";
import { ProductService } from "../services/product.service";

const productService = new ProductService();
/**
 * @generated
 */
export const productController = new Elysia({ prefix: "/product" })
  .use(dbPlugin)
  .use(authGuardMid)
  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      productService.findAll(query, { db, user, currentDeptId }),
    {
      allPermissions: ["PRODUCT:VIEW"],
      query: ProductContract.ListQuery,
      detail: {
        summary: "获取Product列表",
        description: "分页查询Product数据，支持搜索和排序",
        tags: ["Product"],
      },
    }
  )
  .post(
    "/",
    ({ body, user, db, currentDeptId }) =>
      productService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["PRODUCT:CREATE"],
      body: ProductContract.Create,
      detail: {
        summary: "创建Product",
        description: "新增一条Product记录",
        tags: ["Product"],
      },
    }
  )
  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      productService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: ProductContract.Update,
      allPermissions: ["PRODUCT:EDIT"],
      detail: {
        summary: "更新Product",
        description: "根据ID更新Product信息",
        tags: ["Product"],
      },
    }
  )
  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      productService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["PRODUCT:DELETE"],
      detail: {
        summary: "删除Product",
        description: "根据ID删除Product记录",
        tags: ["Product"],
      },
    }
  )
  .post(
    "/batch/delete",
    async ({ body, user, db, currentDeptId }) => {
      const { ids } = body as { ids: string[] };
      return productService.batchDelete(ids, { db, user, currentDeptId });
    },
    {
      body: t.Object({
        ids: t.Array(t.String()),
      }),
      allPermissions: ["PRODUCT:DELETE"],
      detail: {
        summary: "批量删除Product",
        description: "根据ID列表批量删除Product记录",
        tags: ["Product"],
      },
    }
  );
