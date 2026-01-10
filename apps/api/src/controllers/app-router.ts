/**
 * 🤖 【路由挂载器 - 自动生成】
 * --------------------------------------------------------
 * 🛠️ 静态链式调用，保证 Eden Treaty 类型推断完美。
 * --------------------------------------------------------
 */
import type { Elysia } from "elysia";

import { adController } from "./ad.controller";
import { customerController } from "./customer.controller";
import { dailyInquiryCounterController } from "./daily-inquiry-counter.controller";
import { departmentController } from "./department.controller";
import { heroCardController } from "./hero-card.controller";
import { inquiryController } from "./inquiry.controller";
import { masterCategoryController } from "./master-category.controller";
import { mediaController } from "./media.controller";
import { permissionController } from "./permission.controller";
import { productController } from "./product.controller";
import { quotationController } from "./quotation.controller";
import { roleController } from "./role.controller";
import { siteController } from "./site.controller";
import { siteCategoryController } from "./site-category.controller";
import { siteConfigController } from "./site-config.controller";
import { siteProductController } from "./site-product.controller";
import { skuController } from "./sku.controller";
import { templateController } from "./template.controller";
import { templateKeyController } from "./template-key.controller";
import { templateValueController } from "./template-value.controller";
import { tenantController } from "./tenant.controller";
import { userController } from "./user.controller";

export const appRouter = (app: Elysia) =>
  app
    .use(adController)
    .use(customerController)
    .use(dailyInquiryCounterController)
    .use(departmentController)
    .use(heroCardController)
    .use(inquiryController)
    .use(masterCategoryController)
    .use(mediaController)
    .use(permissionController)
    .use(productController)
    .use(quotationController)
    .use(roleController)
    .use(siteController)
    .use(siteCategoryController)
    .use(siteConfigController)
    .use(siteProductController)
    .use(templateController)
    .use(templateKeyController)
    .use(templateValueController)
    .use(tenantController)
    .use(userController)
    .use(skuController);
