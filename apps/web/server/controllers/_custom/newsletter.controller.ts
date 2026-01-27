import { NewsletterContract } from "@repo/contract";
import Elysia from "elysia";
import { dbPlugin } from "~/db/connection";
import { siteMiddleware } from "~/middleware/site";
import { newsletterService } from "~/service";

export const newsletterController = new Elysia({
  prefix: "/newsletter",
})
  .use(dbPlugin)
  .use(siteMiddleware)
  .post(
    "/subscribe1",
    async ({ db, site, body }) => {
      return await newsletterService.subscribe(
        { db, site },
        body.email
      );
    },
    {
      body: NewsletterContract.Subscribe,
      detail: {
        tags: ["Newsletter"],
        summary: "订阅 Newsletter",
        description: "用户订阅 Newsletter，支持重复检测和重新激活",
      },
    }
  )
  .post(
    "/unsubscribe1",
    async ({ db, site, body }) => {
      return await newsletterService.unsubscribe(
        { db, site },
        body.email
      );
    },
    {
      body: NewsletterContract.Unsubscribe,
      detail: {
        tags: ["Newsletter"],
        summary: "取消订阅 Newsletter",
        description: "用户取消 Newsletter 订阅",
      },
    }
  )
  .get(
    "/check",
    async ({ db, site, query }) => {
      return await newsletterService.checkSubscription(
        { db, site },
        query.email
      );
    },
    {
      query: NewsletterContract.CheckSubscription,
      detail: {
        tags: ["Newsletter"],
        summary: "检查订阅状态",
        description: "检查指定邮箱的订阅状态",
      },
    }
  );
