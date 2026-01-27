import { t } from "elysia";
import { PaginationParams, SortParams } from "../../helper/query-types.model";
import { spread, InferDTO } from "../../helper/utils";
import { newsletterSubscriptionTable } from "../../table.schema";


/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const NewsletterSubscriptionInsertFields = spread(
  newsletterSubscriptionTable,
  "insert"
);
/** [Auto-Generated] Do not edit this tag to keep updates. @generated */
export const NewsletterSubscriptionFields = spread(
  newsletterSubscriptionTable,
  "select"
);

export const NewsletterContract = {
  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  Response: t.Object({
    ...NewsletterSubscriptionFields,
  }),

  // 订阅请求
  Subscribe: t.Object({
    email: t.String({ format: "email", minLength: 1, maxLength: 255 }),
  }),

  // 订阅响应
  SubscribeResponse: t.Object({
    success: t.Boolean(),
    message: t.String(),
  }),

  // 取消订阅
  Unsubscribe: t.Object({
    email: t.String({ format: "email" }),
  }),

  // 检查订阅状态
  CheckSubscription: t.Object({
    email: t.String({ format: "email" }),
  }),

  CheckSubscriptionResponse: t.Object({
    isSubscribed: t.Boolean(),
    isActive: t.Boolean(),
  }),

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListQuery: t.Object({
    ...t.Partial(t.Object(NewsletterSubscriptionInsertFields)).properties,
    ...PaginationParams.properties,
    ...SortParams.properties,
    search: t.Optional(t.String()),
  }),

  /** [Auto-Generated] Do not edit this tag to keep updates. @generated */
  ListResponse: t.Object({
    data: t.Array(t.Object({ ...NewsletterSubscriptionFields })),
    total: t.Number(),
  }),
} as const;

export type NewsletterContract = InferDTO<typeof NewsletterContract>;
