/**
 * 🤖 【B2B Controller - 自动生成基类】
 * --------------------------------------------------------
 * ⚠️ 请勿手动修改此文件，下次运行会被覆盖。
 * 💡 如需自定义，请删除下方的 @generated 标记，或新建一个 controller。
 * --------------------------------------------------------
 */

import { userTable } from "@repo/contract";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { dbPlugin } from "~/db/connection";
import { authGuardMid } from "~/middleware/auth";
import { UserContract } from "../../../../packages/contract/src/modules/user.contract";
import { UserService } from "../services/user.service";

const userService = new UserService();

export const userController = new Elysia({ prefix: "/user" })
  .use(dbPlugin)
  .use(authGuardMid)

  .get(
    "/me",
    async ({ user }) => {
      const res = await userService.getSwitchableDepartments(user);
      return {
        user,
        switchableDept: res,
      };
    },
    {
      requireDept: false,
      detail: {
        summary: "获取当前用户信息",
        description:
          "返回当前登录用户的详细信息，包括基础信息、权限范围、关联站点和角色",
        tags: ["User"],
      },
    }
  )

  .get(
    "/",
    ({ query, user, db, currentDeptId }) =>
      userService.list(query, { db, user, currentDeptId }),
    {
      allPermissions: ["USER_VIEW"],
      requireDept: true,
      query: UserContract.ListQuery,
      detail: {
        summary: "获取User列表",
        description: "分页查询User数据，支持搜索和排序",
        tags: ["User"],
      },
    }
  )



  /**
   * 创建用户（新版本）
   * 支持选择角色、部门，如果是业务员还可以选择负责的主分类
   */
  .post(
    "/",
    async ({ body, user, db, currentDeptId }) =>
      userService.create(body, { db, user, currentDeptId }),
    {
      allPermissions: ["USER_CREATE"],
      requireDept: true,
      body: UserContract.Create,
      detail: {
        summary: "创建用户（推荐使用）",
        description:
          "创建新用户并分配角色和部门。如果是业务员角色，可以分配负责的主分类。根据站点类型自动设置数据权限范围。",
        tags: ["User"],
      },
    }
  )

  .put(
    "/:id",
    ({ params, body, user, db, currentDeptId }) =>
      userService.update(params.id, body, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      body: UserContract.Update,
      allPermissions: ["USER_EDIT"],
      requireDept: true,
      detail: {
        summary: "更新User",
        description: "根据ID更新User信息",
        tags: ["User"],
      },
    }
  )

  .delete(
    "/:id",
    ({ params, user, db, currentDeptId }) =>
      userService.delete(params.id, { db, user, currentDeptId }),
    {
      params: t.Object({ id: t.String() }),
      allPermissions: ["USER_DELETE"],
      requireDept: true,
      detail: {
        summary: "删除User",
        description: "根据ID删除User记录",
        tags: ["User"],
      },
    }
  )
  // 更新当前用户个人资料
  .put(
    "/profile",
    async ({ body, user, db }) => {
      const updatedUser = await db
        .update(userTable)
        .set({
          name: body.name,
          phone: body.phone,
        })
        .where(eq(userTable.id, user.id))
        .returning();

      return updatedUser[0];
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        phone: t.Optional(t.String()),
      }),
      detail: {
        summary: "更新当前用户个人资料",
        description: "允许用户更新自己的个人信息，包括姓名、电话、地址和城市",
        tags: ["User"],
      },
    }
  );

// // 获取账号设置所需的完整信息（用户+站点+出口商/工厂）
// .get(
//   "/settings",
//   async ({ user, currentSite, db }) => {
//     // 获取出口商或工厂信息
//     let company = null;
//     if (currentSite?.siteType === "exporter" && currentSite.exporterId) {
//       company = await db.query.exportersTable.findFirst({
//         where: { id: currentSite.exporterId },
//       });
//     } else if (currentSite?.siteType === "factory" && currentSite.factoryId) {
//       company = await db.query.factoriesTable.findFirst({
//         where: { id: currentSite.factoryId },
//       });
//     }

//     return {
//       user,
//       site: currentSite,
//       company,
//     };
//   },
//   {
//     detail: {
//       summary: "获取账号设置信息",
//       description:
//         "获取账号设置页面所需的完整信息，包括用户信息、站点信息和关联的出口商/工厂信息",
//       tags: ["Users"],
//     },
//   }
// )

// // 更新当前用户的站点信息和出口商/工厂信息
// .put(
//   "/me/site",
//   async ({ body, user, currentSite, db }) => {
//     if (!currentSite) {
//       throw new Error("No current site found");
//     }

//     // 1. 先更新站点信息
//     const updatedSite = await db
//       .update(siteTable)
//       .set({
//         name: body.siteName,
//         domain: body.domain,
//       })
//       .where(eq(siteTable.id, currentSite.id))
//       .returning();

//     // 2. 根据站点类型更新对应的出口商或工厂信息
//     if (currentSite.siteType === "exporter" && currentSite.exporterId) {
//       // 更新出口商信息
//       const updatedExporter = await db
//         .update(exportersTable)
//         .set({
//           name: body.companyName,
//           code: body.companyCode,
//           address: body.companyAddress,
//           website: body.website,
//         })
//         .where(eq(exportersTable.id, currentSite.exporterId))
//         .returning();

//       return {
//         site: updatedSite[0],
//         exporter: updatedExporter[0],
//       };
//     }
//     if (currentSite.siteType === "factory" && currentSite.factoryId) {
//       // 更新工厂信息
//       const updatedFactory = await db
//         .update(factoriesTable)
//         .set({
//           name: body.companyName,
//           code: body.companyCode,
//           address: body.companyAddress,
//           website: body.website,
//           contactPhone: body.contactPhone,
//         })
//         .where(eq(factoriesTable.id, currentSite.factoryId))
//         .returning();

//       return {
//         site: updatedSite[0],
//         factory: updatedFactory[0],
//       };
//     }

//     return updatedSite[0];
//   },
//   {
//     body: t.Object({
//       siteName: t.Optional(t.String()),
//       domain: t.Optional(t.String()),
//       companyName: t.Optional(t.String()),
//       companyCode: t.Optional(t.String()),
//       companyAddress: t.Optional(t.String()),
//       website: t.Optional(t.String()),
//       contactPhone: t.Optional(t.String()),
//     }),
//     detail: {
//       summary: "更新当前用户的站点和公司信息",
//       description:
//         "允许用户更新自己所属站点和关联的出口商/工厂信息，根据站点类型自动判断更新出口商或工厂",
//       tags: ["Users"],
//     },
//   }
// )
