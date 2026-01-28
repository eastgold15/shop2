import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";
import { index, uniqueIndex } from "drizzle-orm/pg-core";

// 表名规范单数+小写 + 下划线 + 名词
// --- 1. Helper Fields (基础字段) ---
const idUuid = p.uuid("id").primaryKey().default(sql`gen_random_uuid()`);
const createdAt = p
  .timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = p
  .timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

const Audit = {
  id: idUuid,
  createdAt,
  updatedAt,
};

// --- 2. Enums (枚举定义) ---

// 部门类型：总部、工厂
export const deptCategoryEnum = p.pgEnum("dept_category", ["group", "factory"]);

// 站点类型：集团站(展示所有)、工厂站(展示特定部门)
export const siteTypeEnum = p.pgEnum("site_type", ["group", "factory"]);

// 角色数据权限范围
// 1=全部数据, 2=本部门及下级, 3=本部门
export const dataScopeEnum = p.pgEnum("data_scope", [
  "all",
  "current",
  "current_and_below",
]);

export const adTypeEnum = p.pgEnum("ads_type", ["banner", "carousel", "list"]);
export const adPositionEnum = p.pgEnum("ads_position", [
  "home-top",
  "home-middle",
  "sidebar",
]);
export const inquiryStatusEnum = p.pgEnum("inquiry_status", [
  "pending",
  "quoted",
  "sent",
  "completed",
  "cancelled",
]);
export const mediaStatusEnum = p.pgEnum("media_status", ["active", "deleted"]);
export const mediaTypeEnum = p.pgEnum("media_type", [
  "image",
  "video",
  "document",
  "audio",
  "other",
]);
export const InputTypeEnum = p.pgEnum("input_type", [
  "select",
  "text",
  "number",
  "multiselect",
]);

// --- 3. System Architecture Tables (系统架构核心表) ---

// [租户表]：原 Exporters，现在的最高层级容器
export const tenantTable = p.pgTable("sys_tenant", {
  ...Audit,
  name: p.varchar("name", { length: 200 }).notNull(),
  code: p.varchar("code", { length: 50 }).unique().notNull(), // 企业编码
  status: p.integer("status").default(1), // 1:启用, 0:停用

  // 租户扩展信息
  address: p.text("address"),
  website: p.varchar("website", { length: 500 }),
  bankInfo: p
    .json("bank_info")
    .$type<{ beneficiary: string; accountNo: string }>(),

  subscriptionPlan: p.varchar("subscription_plan").default("free"),
});

// [部门表]：原 Factories + 总部，支持树形结构
export const departmentTable = p.pgTable("sys_dept", {
  ...Audit,
  // 核心归属
  tenantId: p
    .uuid("tenant_id")
    .notNull()
    .references(() => tenantTable.id),
  parentId: p.uuid("parent_id"), // 父部门ID (自引用)

  name: p.varchar("name", { length: 200 }).notNull(),
  code: p.varchar("code", { length: 50 }),

  // 区分是 "总部" 还是 "实体工厂"
  category: deptCategoryEnum("category").default("factory").notNull(),

  // 原 Factory 表的特有字段，建议放在这里或用 extensions JSON
  address: p.text("address"),
  contactPhone: p.varchar("contact_phone", { length: 50 }),
  logo: p.varchar("logo", { length: 500 }),

  // 扩展信息 (原 businessLicense 等)
  extensions: p.json("extensions").$type<{
    businessLicense?: string;
    mainProducts?: string;
    annualRevenue?: string;
    employeeCount?: number;
  }>(),

  isActive: p.boolean("is_active").default(true),
});

// [角色表]：控制功能权限 + 数据范围
export const roleTable = p.pgTable("sys_role", {
  id: idUuid,
  name: p.text("name").notNull(),
  // 🔥 核心：数据权限范围
  dataScope: dataScopeEnum("data_scope").default("current").notNull(),
  description: p.text("description"),

  type: p
    .varchar("type", { enum: ["system", "custom"] })
    .default("custom")
    .notNull(),
  priority: p.integer("priority").default(0).notNull(),
});

// [用户表]：统一了 User 和 Salesperson
export const userTable = p.pgTable("sys_user", {
  ...Audit,
  name: p.text("name").notNull(),
  email: p.text("email").notNull().unique(),
  emailVerified: p.boolean("email_verified").default(false),
  image: p.text("image"),
  // 🔥 核心归属：决定用户在组织树的哪个位置（强制必填）
  tenantId: p
    .uuid("tenant_id")
    .notNull()
    .references(() => tenantTable.id),
  deptId: p
    .uuid("dept_id")
    .notNull()
    .references(() => departmentTable.id, { onDelete: "cascade" }),

  role: p.varchar("role", { length: 50 }),
  banned: p.boolean("banned").default(false),
  banReason: p.text("ban_reason"),
  banExpires: p.timestamp("ban_expire_at", { withTimezone: true }),

  // 原 Salesperson 字段合并
  phone: p.text("phone"),
  whatsapp: p.varchar("whatsapp", { length: 50 }),
  position: p.varchar("position", { length: 100 }), // 职位，如"销售经理"

  isActive: p.boolean("is_active").default(true),
  isSuperAdmin: p.boolean("is_super_admin").default(false),
});

export const userRoleTable = p.pgTable(
  "sys_user_role",
  {
    userId: p
      .uuid("user_id")
      .notNull()
      .unique()
      .references(() => userTable.id, { onDelete: "cascade" }),
    roleId: p
      .uuid("role_id")
      .notNull()
      .references(() => roleTable.id, { onDelete: "restrict" }),
  },
  (t) => [p.primaryKey({ columns: [t.userId, t.roleId] })]
);
// [业务员-主分类关联表]：定义业务员负责的品类范围
export const salesResponsibilityTable = p.pgTable(
  "sales_responsibility",
  {
    ...Audit, // 包含 id, createdAt, updatedAt

    // 1. 关联业务员
    userId: p
      .uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    // 2. 关联具体的站点分类
    masterCategoryId: p
      .uuid("master_category_id")
      .notNull()
      .references(() => masterCategoryTable.id, { onDelete: "cascade" }),
    siteId: p
      .uuid("site_id")
      .references(() => siteTable.id, { onDelete: "cascade" }),
    // 3. 冗余 tenantId 以便快速过滤和鉴权
    tenantId: p
      .uuid("tenant_id")
      .notNull()
      .references(() => tenantTable.id),
    // 🔥 核心字段：最后一次分到单子的时间
    lastAssignedAt: p.timestamp("last_assigned_at", { withTimezone: true }),
    // 4. (可选) 权重或优先级：如果一个分类有多个业务员，询盘优先分给谁？
    priority: p.integer("priority").default(0),

    // 5. (可选) 自动分配开关：是否参与该分类询盘的自动轮询分配
    isAutoAssign: p.boolean("is_auto_assign").default(true),
  },
  (t) => [
    // 确保同一个业务员在同一个分类下只出现一次
    p
      .unique("unique_user_category")
      .on(t.userId, t.masterCategoryId),
    // 建立索引以便快速查找某个分类下的所有业务员
    p
      .index("idx_sales_cat")
      .on(t.masterCategoryId),
    p.index("idx_sales_user").on(t.userId),
  ]
);

// --- 4. Tenant Helper (租户字段助手 - 重构版) ---
// 将原 tenantCols 拆分为三个独立对象，按需取用

/**
 * 标准版（给 Product, SKU, MasterCategory, Customer 等核心业务表用）
 * 只包含物理归属，不包含 siteId，确保资产可以在多个站点间复用
 */
export const standardCols = {
  // 硬隔离：属于哪个租户
  tenantId: p
    .uuid("tenant_id")
    .notNull()
    .references(() => tenantTable.id),

  // 软归属：数据属于哪个部门 (用于数据权限过滤)
  deptId: p.uuid("dept_id").references(() => departmentTable.id),

  // 创建人：数据是谁创建的
  createdBy: p.uuid("created_by").references(() => userTable.id, {
    onDelete: "set null",
  }),

  // 可选：是否公开（通常指是否跨部门可见）
  isPublic: p.boolean("is_public").default(false).notNull(),
};

/**
 * 站点专用版（给 HeroCard, SiteCategory, Ad, SiteConfig 等网站内容表用）
 * 继承标准版，额外强制绑定站点
 * 这些表的数据是"网站装修"的一部分，必须属于某个特定站点
 */
export const siteScopedCols = {
  ...standardCols,

  // 只有这里才加 siteId，且通常为必填
  siteId: p
    .uuid("site_id")
    .notNull()
    .references(() => siteTable.id, { onDelete: "cascade" }),
};

/**
 * 追踪专用版（给 Inquiry, Quotation 等交易/行为数据表用）
 * 继承标准版，额外绑定站点（所有订单都来自线上站点）
 */
export const trackingCols = {
  ...standardCols,

  // 订单来源站点：所有订单都来自线上，所以 notNull
  siteId: p
    .uuid("site_id")
    .notNull()
    .references(() => siteTable.id, { onDelete: "cascade" }),
};

// --- 5. Business Tables (业务表 - 已应用 tenantCols) ---

export const accountTable = p.pgTable("sys_account", {
  ...Audit,
  accountId: p.text("account_id").notNull(),
  providerId: p.text("provider_id").notNull(),
  userId: p
    .uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: p.text("access_token"),
  refreshToken: p.text("refresh_token"),
  idToken: p.text("id_token"),
  accessTokenExpiresAt: p.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: p.timestamp("refresh_token_expires_at"),
  scope: p.text("scope"),
  password: p.text("password"),
});
/**
 * @onlyGen contract
 */
export const sessionTable = p.pgTable("sys_session", {
  ...Audit,
  expiresAt: p.timestamp("expires_at").notNull(),
  token: p.text("token").notNull().unique(),
  ipAddress: p.text("ip_address"),
  userAgent: p.text("user_agent"),
  userId: p
    .uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  impersonatedBy: p.varchar("impersonated_by", { length: 255 }),
});
/**
 * @onlyGen contract
 */
export const verificationTable = p.pgTable("sys_verification", {
  ...Audit,
  identifier: p.text("identifier").notNull(),
  value: p.text("value").notNull(),
  expiresAt: p.timestamp("expires_at").notNull(),
});
/**
 * @onlyGen contract
 */
export const permissionTable = p.pgTable("sys_permission", {
  ...Audit,
  name: p.text("name").notNull(),
  description: p.text("description"),
});

/**
 * @onlyGen contract
 */
export const rolePermissionTable = p.pgTable(
  "sys_role_permission",
  {
    roleId: p
      .uuid("role_id")
      .notNull()
      .references(() => roleTable.id, { onDelete: "cascade" }),
    permissionId: p
      .uuid("permission_id")
      .notNull()
      .references(() => permissionTable.id, { onDelete: "cascade" }),
  },
  (t) => [p.primaryKey({ columns: [t.roleId, t.permissionId] })]
);

// --- Business Tables (Updates) ---

export const masterCategoryTable = p.pgTable("master_category", {
  id: idUuid,
  name: p.varchar("name", { length: 255 }).notNull(),
  slug: p.varchar("slug", { length: 100 }).notNull().unique(),
  description: p.varchar("description", { length: 255 }).notNull(),
  parentId: p.uuid("parent_id"),
  sortOrder: p.integer("sort_order").default(0),
  isActive: p.boolean("is_active").default(true),
  icon: p.varchar("icon", { length: 255 }).default(""),
  createdAt,
  updatedAt,

  tenantId: p
    .uuid("tenant_id")
    .notNull()
    .references(() => tenantTable.id),
});

export const mediaTable = p.pgTable("media", {
  ...Audit,
  storageKey: p.varchar("storage_key", { length: 255 }).notNull(),
  category: p.varchar("category").notNull(),
  url: p.varchar("url", { length: 255 }).notNull(),
  originalName: p.varchar("original_name", { length: 255 }).notNull(),
  mimeType: p.varchar("mime_type", { length: 100 }).notNull(),
  status: p.boolean("status").notNull().default(true),
  thumbnailUrl: p.text("thumbnail_url"),
  mediaType: mediaTypeEnum("media_type").default("image").notNull(),
  sortOrder: p.integer("sort_order").notNull().default(0),
  // 媒体文件是核心资产，使用 standardCols，可在多个站点复用
  ...standardCols,
});
/**
 * @onlyGen contract
 */
export const mediaMetadataTable = p.pgTable("media_metadata", {
  id: idUuid,
  fileId: p
    .uuid("file_id")
    .notNull()
    .references(() => mediaTable.id, { onDelete: "cascade" }),
  mediaType: mediaTypeEnum("media_type").notNull(),
  width: p.integer("width"),
  height: p.integer("height"),
  duration: p.integer("duration"),
  metadataJson: p.text("metadata_json").default(""),
  thumbnailKey: p.varchar("thumbnail_key", { length: 255 }),
});

// 资产
export const productTable = p.pgTable("product", {
  ...Audit,
  spuCode: p.varchar("spu_code", { length: 64 }).notNull(), // 注意：如果不唯一，去掉 unique，或者组合 unique(tenantId, spuCode)
  name: p.varchar("name", { length: 255 }).notNull(),
  description: p.text("description"),
  status: p.integer("status").notNull().default(1),
  // 商品独有属性（JSON格式，简单键值对）
  customAttributes: p.json("custom_attributes").$type<Record<string, string>>(),
  sortOrder: p.integer("sort_order").default(0),
  // 商品是核心资产，使用 standardCols，可在多个站点复用
  ...standardCols,
});
/**
 * @onlyGen contract
 */
export const productMasterCategoryTable = p.pgTable(
  "product_category",
  {
    productId: p
      .uuid("product_id")
      .notNull()
      .references(() => productTable.id),
    masterCategoryId: p
      .uuid("category_id")
      .notNull()
      .references(() => masterCategoryTable.id),
  },
  (t) => [p.primaryKey({ columns: [t.productId, t.masterCategoryId] })]
);

/**
 * @onlyGen contract  资产
 */
export const productMediaTable = p.pgTable(
  "product_media",
  {
    productId: p
      .uuid("product_id")
      .notNull()
      .references(() => productTable.id),
    mediaId: p
      .uuid("media_id")
      .notNull()
      .references(() => mediaTable.id),
    isMain: p.boolean("is_main").default(false),
    sortOrder: p.integer("sort_order").notNull().default(0),
  },
  (t) => [p.primaryKey({ columns: [t.productId, t.mediaId] })]
);
// 原子资产层(Core Assets)。
export const templateTable = p.pgTable("template", {
  id: idUuid,
  name: p.varchar("name", { length: 100 }).notNull(),
  masterCategoryId: p
    .uuid("master_category_id")
    .notNull()
    .references(() => masterCategoryTable.id),
});

export const templateKeyTable = p.pgTable("template_key", {
  id: idUuid,
  templateId: p
    .uuid("template_id")
    .notNull()
    .references(() => templateTable.id),
  key: p.varchar("key", { length: 300 }).notNull(),
  inputType: InputTypeEnum("input_type").default("select"),
  isRequired: p.boolean("is_required").default(true),
  isSkuSpec: p.boolean("is_sku_spec").default(true),
  sortOrder: p.integer("sort_order").default(0),
});

export const templateValueTable = p.pgTable("template_value", {
  id: idUuid,
  templateKeyId: p
    .uuid("template_key_id")
    .notNull()
    .references(() => templateKeyTable.id),
  value: p.text("value").notNull(),
  sortOrder: p.integer("sort_order").default(0),
});

export const productTemplateTable = p.pgTable("product_template", {
  productId: p
    .uuid("product_id")
    .primaryKey()
    .references(() => productTable.id, { onDelete: "cascade" }),
  templateId: p
    .uuid("template_id")
    .notNull()
    .references(() => templateTable.id),
});

// @skipGen  资产
export const skuTable = p.pgTable("sku", {
  ...Audit,
  skuCode: p.varchar("sku_code", { length: 100 }).notNull(),
  price: p
    .decimal("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"), // 优惠价格
  marketPrice: p.decimal("market_price", { precision: 10, scale: 2 }), // 市场价
  costPrice: p.decimal("cost_price", { precision: 10, scale: 2 }), // 成本价格
  weight: p.decimal("weight", { precision: 8, scale: 3 }).default("0.000"),
  volume: p.decimal("volume", { precision: 10, scale: 3 }).default("0.000"),
  stock: p.decimal("stock").default("0"),
  specJson: p.json("spec_json").notNull(),
  extraAttributes: p.json("extra_attributes"),
  status: p.integer("status").notNull().default(1),
  productId: p
    .uuid("product_id")
    .references(() => productTable.id, { onDelete: "cascade" })
    .notNull(),

  // SKU 是核心资产，使用 standardCols，可在多个站点复用
  ...standardCols,
});

export const skuMediaTable = p.pgTable(
  "sku_media",
  {
    skuId: p
      .uuid("sku_id")
      .notNull()
      .references(() => skuTable.id, { onDelete: "cascade" }),
    mediaId: p
      .uuid("media_id")
      .notNull()
      .references(() => mediaTable.id, { onDelete: "cascade" }),
    isMain: p.boolean("is_main").default(false),
    sortOrder: p.integer("sort_order").default(0),
  },
  (t) => [p.primaryKey({ columns: [t.skuId, t.mediaId] })]
);

// [变体媒体关联表]：实现图片与属性值（如颜色）的绑定
export const productVariantMediaTable = p.pgTable(
  "product_variant_media",
  {
    ...Audit,

    // 1. 关联产品 (SPU)
    productId: p
      .uuid("product_id")
      .notNull()
      .references(() => productTable.id, { onDelete: "cascade" }),

    // 2. 关联具体的属性值 (例如：template_value 中 "黑色" 的 ID)
    // 这样无论多少个尺码，只要是“黑色”，都共用这几张图
    attributeValueId: p
      .uuid("attribute_value_id")
      .notNull()
      .references(() => templateValueTable.id, { onDelete: "cascade" }),

    // 3. 关联媒体文件
    mediaId: p
      .uuid("media_id")
      .notNull()
      .references(() => mediaTable.id, { onDelete: "restrict" }),

    isMain: p.boolean("is_main").default(false),
    sortOrder: p.integer("sort_order").default(0),
  },
  (t) => [
    // 建立复合索引，提升查询某个颜色下图片的速度
    p
      .index("idx_variant_media")
      .on(t.productId, t.attributeValueId),
  ]
);

export const customerTable = p.pgTable("customer", {
  ...Audit,
  companyName: p.varchar("company_name", { length: 200 }).notNull(),
  name: p.varchar("contact_name", { length: 100 }),
  email: p.varchar("email", { length: 255 }),
  whatsapp: p.varchar("whatsapp", { length: 50 }),
  phone: p.varchar("phone", { length: 20 }),
  address: p.text("address"),

  // 客户是核心资产，使用 standardCols，可在多个站点复用
  ...standardCols,
});

// [站点表]：核心中的核心
export const siteTable = p.pgTable("site", {
  ...Audit,
  name: p.varchar("name", { length: 100 }).notNull(),
  trueName: p.varchar("true_name", { length: 200 }),
  description: p.text("description"),
  domain: p.varchar("domain", { length: 255 }).unique().notNull(),
  isActive: p.boolean("is_active").default(true),

  // 1. 站点属于哪个租户
  tenantId: p
    .uuid("tenant_id")
    .notNull()
    .references(() => tenantTable.id),

  // 2. 站点绑定哪个部门？（强制必填）
  // - 绑定总部：集团站，展示 tenant 下所有商品
  // - 绑定工厂：工厂站，只展示该 dept 下的商品
  boundDeptId: p
    .uuid("bound_dept_id")
    .notNull()
    .unique()
    .references(() => departmentTable.id),

  siteType: siteTypeEnum("site_type").notNull(),
});
// 站点
export const siteCategoryTable = p.pgTable("site_category", {
  ...Audit,
  ...siteScopedCols,
  name: p.varchar("name", { length: 100 }).notNull(),
  description: p.text("description"),
  parentId: p.uuid("parent_id"),
  sortOrder: p.integer("sort_order").default(0),
  isActive: p.boolean("is_active").default(true),
  masterCategoryId: p
    .uuid("master_category_id")
    .references(() => masterCategoryTable.id, { onDelete: "set null" }),
  url: p.varchar("url", { length: 500 }), // 外部链接 URL（可选）
});
// 站点商品分裂
export const siteProductSiteCategoryTable = p.pgTable(
  "site_product_category_rel", // 明确是站点商品与站点分类的关系
  {
    // 🔗 改为关联 siteProductTable 的 ID
    siteProductId: p
      .uuid("site_product_id")
      .notNull()
      .references(() => siteProductTable.id, { onDelete: "cascade" }),

    // 🔗 关联站点分类
    siteCategoryId: p
      .uuid("site_category_id")
      .notNull()
      .references(() => siteCategoryTable.id, { onDelete: "cascade" }),
  },
  (t) => [
    p.primaryKey({ columns: [t.siteProductId, t.siteCategoryId] }),
    // 索引加速：通过分类找商品（前台展示最常用）
    p
      .index("idx_rel_category")
      .on(t.siteCategoryId),
  ]
);

export const siteProductTable = p.pgTable(
  "site_product",
  {
    ...Audit,
    siteName: p.varchar("site_name", { length: 200 }),
    siteDescription: p.text("site_description"),
    isFeatured: p.boolean("is_featured").default(false),
    sortOrder: p.integer("sort_order").default(0),
    isVisible: p.boolean("is_visible").default(true),
    seoTitle: p.varchar("seo_title", { length: 200 }),
    siteId: p
      .uuid("site_id")
      .references(() => siteTable.id, { onDelete: "cascade" })
      .notNull(),
    productId: p
      .uuid("product_id")
      .references(() => productTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [
    // 1. 🔥 核心唯一索引：防止同一个站点下出现重复的同一个商品
    // 这也是 Upsert (On Conflict) 逻辑必须依赖的物理约束
    uniqueIndex("uk_site_product_unique").on(t.siteId, t.productId),

    // 3. 🚀 排序/筛选优化：按站点 + 排序/可见性
    // 场景：获取某个站点的首页推荐商品，按 sortOrder 排序
    index("idx_site_product_sort").on(t.siteId, t.sortOrder, t.isVisible),

    // 4. 🧹 级联删除优化（可选）：
    // 当你删除一个 Product 时，数据库需要查找所有关联的 site_product 来级联删除。
    // 虽然 uk_site_product_unique 包含了 productId，但它在第二个位置。
    // 如果你的商品库非常大（百万级），建议单独给 productId 加索引，加快物理删除速度。
    index("idx_site_product_pid").on(t.productId),
  ]
);

export const siteSkuTable = p.pgTable(
  "site_sku",
  {
    id: idUuid, // 自身ID

    // 归属关系
    siteId: p
      .uuid("site_id")
      .notNull()
      .references(() => siteTable.id, { onDelete: "cascade" }),
    siteProductId: p
      .uuid("site_product_id")
      .notNull()
      .references(() => siteProductTable.id, { onDelete: "cascade" }),

    // 核心关联：指向源头 SKU
    skuId: p
      .uuid("sku_id")
      .notNull()
      .references(() => skuTable.id, { onDelete: "cascade" }),

    // 站点覆写数据
    price: p.decimal("price", { precision: 10, scale: 2 }), // 站点自定义价格，为空则继承原价
    isActive: p.boolean("is_active").default(true), // 站点是否上架此规格
  },
  (t) => [uniqueIndex("uk_site_sku_unique").on(t.siteId, t.skuId)]
);

// 站点
export const adTable = p.pgTable("advertisement", {
  ...Audit,
  title: p.varchar("title", { length: 255 }).notNull(),
  description: p.varchar("description", { length: 255 }).notNull(),
  type: adTypeEnum("type").notNull(),
  mediaId: p.uuid("media_id").references(() => mediaTable.id),
  link: p.varchar("link", { length: 500 }).notNull(),
  position: adPositionEnum("ads_position").default("home-top"),
  sortOrder: p.integer("sort_order").default(0),
  isActive: p.boolean("is_active").default(true),
  startDate: p.timestamp("start_date").notNull(),
  endDate: p.timestamp("end_date").notNull(),

  // 广告是网站内容，使用 siteScopedCols，必须属于某个站点
  ...siteScopedCols,
});
// 站点
export const heroCardTable = p.pgTable("hero_card", {
  ...Audit,
  title: p.varchar("title", { length: 255 }).notNull(),
  description: p.text("description").notNull(),
  buttonText: p.varchar("button_text", { length: 100 }).notNull(),
  buttonUrl: p.varchar("button_url", { length: 500 }).notNull(),
  backgroundClass: p
    .varchar("background_class", { length: 100 })
    .default("bg-blue-50"),
  sortOrder: p.integer("sort_order").default(0),
  isActive: p.boolean("is_active").default(true),
  mediaId: p
    .uuid("media_id")
    .references(() => mediaTable.id)
    .notNull(),

  // 轮播图是网站内容，使用 siteScopedCols，必须属于某个站点
  ...siteScopedCols,
});

export const siteConfigTable = p.pgTable(
  "site_config",
  {
    ...Audit,
    key: p.varchar("key", { length: 100 }).notNull(), // 同一站点下唯一，所以 unique 要组合
    value: p.text("value").notNull().default(""),
    description: p.text("description").default(""),
    category: p.varchar("category", { length: 50 }).default("general"),
    url: p.varchar("url", { length: 255 }).default(""),
    translatable: p.boolean("translatable").default(true),
    visible: p.boolean("visible").default(false),
    siteId: p
      .uuid("site_id")
      .notNull()
      .references(() => siteTable.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("uk_site_key").on(t.siteId, t.key)]
);

// 询价
export const inquiryTable = p.pgTable("inquiry", {
  ...Audit,

  inquiryNum: p.varchar("inquiry_number", { length: 50 }).notNull(),
  customerName: p.varchar("customer_name", { length: 100 }),
  customerCompany: p.varchar("company_name", { length: 200 }).notNull(),
  customerEmail: p.varchar("email", { length: 255 }).notNull(),
  customerPhone: p.varchar("phone", { length: 50 }),
  customerWhatsapp: p.varchar("whatsapp", { length: 50 }),

  status: inquiryStatusEnum("status").default("pending").notNull(),

  // 询价关联的站点商品
  siteProductId: p
    .uuid("site_product_id")
    .references(() => siteProductTable.id, { onDelete: "set null" }),
  // 询盘关联的 SKU

  siteSkuId: p
    .uuid("site_sku_id")
    .references(() => siteSkuTable.id, { onDelete: "set null" }),

  productName: p.varchar("product_name", { length: 255 }).notNull(),
  productDescription: p.text("product_description"),
  quantity: p.integer("quantity").notNull(),
  price: p.decimal("price", { precision: 10, scale: 2 }),
  paymentMethod: p.varchar("payment_method", { length: 255 }).notNull(),
  customerRequirements: p.text("customer_requirements"),

  // 增加负责人字段
  ownerId: p
    .uuid("owner_id")
    .references(() => userTable.id, { onDelete: "set null" }),
  // 增加主分类字段（用于匹配分配逻辑）
  masterCategoryId: p
    .uuid("master_category_id")
    .references(() => masterCategoryTable.id),

  rawSnapshot: p.json("raw_snapshot").$type<{
    product: any;
    sku: any;
    siteConfig: any;
    owner: any;
  }>(),
  // 询盘是交易数据，使用 trackingCols，sourceSiteId 记录来源站点（可为空）
  ...trackingCols,
});

export const quotationTable = p.pgTable("quotation", {
  ...Audit,
  refNo: p.varchar("ref_no", { length: 50 }).notNull(),
  date: p.date("date").notNull(),
  clientId: p
    .uuid("client_id")
    .notNull()
    .references(() => customerTable.id, { onDelete: "set null" }),
  deliveryTimeDays: p.varchar("delivery_time_days", { length: 50 }),
  sampleLeadtimeDays: p.varchar("sample_leadtime_days", { length: 50 }),
  paymentTerms: p.text("payment_terms"),
  qualityRemark: p.text("quality_remark"),
  safetyCompliance: p.text("safety_compliance"),
  status: p.varchar("status", { length: 20 }).default("draft").notNull(),

  // 🔥 合并自 quotationItemsTable - 每次报价只针对单个商品
  skuId: p
    .uuid("sku_id")
    .notNull()
    .references(() => skuTable.id, { onDelete: "set null" }),
  productionDeptId: p
    .uuid("production_dept_id")
    .notNull()
    .references(() => departmentTable.id, { onDelete: "set null" }),
  unitPriceUsd: p
    .decimal("unit_price_usd", { precision: 10, scale: 2 })
    .notNull(),
  quantity: p.integer("quantity").notNull(),
  totalUsd: p.decimal("total_usd", { precision: 12, scale: 2 }).notNull(),
  remark: p.text("remark"),

  snapShortClientId: p
    .uuid("snap_client_id")
    .references(() => customerTable.id, { onDelete: "set null" }),
  // 报价是交易数据，使用 trackingCols，sourceSiteId 记录来源站点（可为空）
  ...trackingCols,
});

export const dailyInquiryCounterTable = p.pgTable("daily_inquiry_counter", {
  ...Audit,
  date: p.varchar("date", { length: 10 }).notNull().unique(),
  count: p.integer("count").default(0).notNull(),
  lastResetAt: p.timestamp("last_reset_at").defaultNow(),
});

// Newsletter 订阅表
export const newsletterSubscriptionTable = p.pgTable(
  "newsletter_subscriptions",
  {
    ...Audit,
    email: p.varchar("email", { length: 255 }).notNull().unique(),
    isActive: p.boolean("is_active").default(true).notNull(),
    subscribedAt: p.timestamp("subscribed_at").defaultNow().notNull(),
    siteId: p
      .uuid("site_id")
      .references(() => siteTable.id, { onDelete: "cascade" }),
    unsubscribedAt: p.timestamp("unsubscribed_at"),
  }
);
