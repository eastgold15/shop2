/**
 * 🤖 【路由挂载器 - 自动生成】
 * --------------------------------------------------------
 * 🛠️ 静态链式调用，保证 Eden Treaty 类型推断完美。
 * --------------------------------------------------------
 */
import type { Elysia } from "elysia";

import { accountController } from "./account.controller";
import { adController } from "./ad.controller";
import { customerController } from "./customer.controller";
import { dailyinquirycounterController } from "./dailyinquirycounter.controller";
import { herocardController } from "./herocard.controller";
import { inquiryController } from "./inquiry.controller";
import { mastercategoryController } from "./mastercategory.controller";
import { mediaController } from "./media.controller";
import { mediametadataController } from "./mediametadata.controller";
import { productController } from "./product.controller";
import { quotationController } from "./quotation.controller";
import { roleController } from "./role.controller";
import { siteController } from "./site.controller";
import { sitecategoryController } from "./sitecategory.controller";
import { siteconfigController } from "./siteconfig.controller";
import { siteproductController } from "./siteproduct.controller";
import { skuController } from "./sku.controller";
import { skumediaController } from "./skumedia.controller";
import { templateController } from "./template.controller";
import { templatekeyController } from "./templatekey.controller";
import { templatevalueController } from "./templatevalue.controller";
import { tenantController } from "./tenant.controller";
import { userController } from "./user.controller";
import { userroleController } from "./userrole.controller";

export const appRouter = (app: Elysia) =>
  app
    .use(accountController)
    .use(adController)
    .use(customerController)
    .use(dailyinquirycounterController)
    .use(herocardController)
    .use(inquiryController)
    .use(mastercategoryController)
    .use(mediaController)
    .use(mediametadataController)
    .use(productController)
    .use(quotationController)
    .use(roleController)
    .use(siteController)
    .use(sitecategoryController)
    .use(siteconfigController)
    .use(siteproductController)
    .use(skuController)
    .use(skumediaController)
    .use(templateController)
    .use(templatekeyController)
    .use(templatevalueController)
    .use(tenantController)
    .use(userController)
    .use(userroleController);
