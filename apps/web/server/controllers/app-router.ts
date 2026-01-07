/**
 * 🤖 【路由挂载器 - 自动生成】
 * --------------------------------------------------------
 * 🛠️ 静态链式调用，保证 Eden Treaty 类型推断完美。
 * --------------------------------------------------------
 */
import type { Elysia } from "elysia";
import { adsController } from "./_custom/ads.controller";
import { herocardsController } from "./_custom/herocards.controller";
import { inquiryController } from "./_custom/inquiry.controller";
import { mediaController } from "./_custom/media.controller";
import { productsController } from "./_custom/products.controller";
import { sitecategoriesController } from "./_custom/sitecategories.controller";

export const appRouter = (app: Elysia) =>
  app
    .use(adsController)
    .use(productsController)

    .use(herocardsController)

    .use(mediaController)

    .use(sitecategoriesController)

    .use(inquiryController);
