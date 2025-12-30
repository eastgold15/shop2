import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

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

// 部门类型：总部、工厂、办事处
export const deptCategoryEnum = p.pgEnum("dept_category", [
  "headquarters",
  "factory",
  "office",
]);

// 站点类型：集团站(展示所有)、工厂站(展示特定部门)
export const siteTypeEnum = p.pgEnum("site_type", ["group", "factory"]);

// 角色数据权限范围
// 1=全部数据, 2=本部门及下级, 3=本部门, 4=仅本人
export const dataScopeEnum = p.pgEnum("data_scope", [
  "all",
  "dept_and_child",
  "dept_only",
  "self",
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
/**
 * @onlyGen contract
 */
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
  category: deptCategoryEnum("category").default("office").notNull(),

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
  tenantId: p.uuid("tenant_id").references(() => tenantTable.id), // 允许租户自定义角色

  // 🔥 核心：数据权限范围
  dataScope: dataScopeEnum("data_scope").default("self").notNull(),

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
  password: p.text("password"), // 如果需要密码登录

  // 🔥 核心归属：决定用户在组织树的哪个位置
  tenantId: p.uuid("tenant_id").references(() => tenantTable.id),
  deptId: p.uuid("dept_id").references(() => departmentTable.id),

  // 原 Salesperson 字段合并
  phone: p.text("phone"),
  whatsapp: p.varchar("whatsapp", { length: 50 }),
  position: p.varchar("position", { length: 100 }), // 职位，如"销售经理"

  isActive: p.boolean("is_active").default(true),
  isSuperAdmin: p.boolean("is_super_admin").default(false),
});

// [用户-角色关联表]
export const userRoleTable = p.pgTable(
  "sys_user_role",
  {
    userId: p
      .uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    roleId: p
      .uuid("role_id")
      .notNull()
      .references(() => roleTable.id, { onDelete: "cascade" }),
  },
  (t) => [p.primaryKey({ columns: [t.userId, t.roleId] })]
);

// --- 4. Tenant Helper (租户字段助手 - 核心修改) ---
// 这个对象将被 spread 到所有业务表中
export const tenantCols = {
  // 1. 硬隔离：属于哪个租户
  tenantId: p
    .uuid("tenant_id")
    .notNull()
    .references(() => tenantTable.id),

  // 2. 软归属：数据属于哪个部门 (用于数据权限过滤)
  deptId: p.uuid("dept_id").references(() => departmentTable.id),

  // 3. 创建人：数据是谁创建的
  createdBy: p.uuid("created_by").references(() => userTable.id),

  // 原有的辅助字段
  isPublic: p.boolean("is_public").default(false).notNull(),
  siteId: p.uuid("site_id").references(() => siteTable.id), // 可选：特定属于某个站点
};

// --- 5. Business Tables (业务表 - 已应用 tenantCols) ---

// [站点表]：核心中的核心
export const siteTable = p.pgTable("site", {
  ...Audit,
  name: p.varchar("name", { length: 100 }).notNull(),
  domain: p.varchar("domain", { length: 255 }).unique().notNull(),
  isActive: p.boolean("is_active").default(true),

  // 1. 站点属于哪个租户
  tenantId: p
    .uuid("tenant_id")
    .notNull()
    .references(() => tenantTable.id),

  // 2. 站点绑定哪个部门？
  // - 绑定总部：集团站，展示 tenant 下所有商品
  // - 绑定工厂：工厂站，只展示该 dept 下的商品
  boundDeptId: p.uuid("bound_dept_id").references(() => departmentTable.id),

  siteType: siteTypeEnum("site_type").notNull(),
});

/**
 * @onlyGen contract
 */
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
  userId: p
    .uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
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

  ...tenantCols, // 🔥 引用新助手
});

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

export const adTable = p.pgTable("advertisement", {
  ...Audit,
  title: p.varchar("title", { length: 255 }).notNull(),
  description: p.varchar("description", { length: 255 }).notNull(),
  type: adTypeEnum("type").notNull(),
  mediaId: p
    .uuid("media_id")
    .notNull()
    .references(() => mediaTable.id),
  link: p.varchar("link", { length: 500 }).notNull(),
  position: adPositionEnum("ads_position").default("home-top"),
  sortOrder: p.integer("sort_order").default(0),
  isActive: p.boolean("is_active").default(true),
  startDate: p.timestamp("start_date").notNull(),
  endDate: p.timestamp("end_date").notNull(),

  // 广告通常由运营创建，最好也加上 tenantCols 以便管理不同租户的广告
  ...tenantCols,
});

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
  siteId: p
    .uuid("site_id")
    .notNull()
    .references(() => siteTable.id, { onDelete: "cascade" }),

  tenantId: p.uuid("tenant_id").references(() => tenantTable.id),
});

export const productTable = p.pgTable("product", {
  ...Audit,
  spuCode: p.varchar("spu_code", { length: 64 }).notNull(), // 注意：如果不唯一，去掉 unique，或者组合 unique(tenantId, spuCode)
  name: p.varchar("name", { length: 255 }).notNull(),
  description: p.text("description"),
  status: p.integer("status").notNull().default(1),
  units: p.varchar("units", { length: 20 }),

  ...tenantCols, // 🔥 核心：包含 tenantId, deptId, createdBy
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

export const siteCategoryTable = p.pgTable("site_category", {
  ...Audit,
  name: p.varchar("name", { length: 100 }).notNull(),
  description: p.text("description"),
  parentId: p.uuid("parent_id"),
  sortOrder: p.integer("sort_order").default(0),
  isActive: p.boolean("is_active").default(true),
  siteId: p
    .uuid("site_id")
    .references(() => siteTable.id, { onDelete: "cascade" })
    .notNull(),
  masterCategoryId: p
    .uuid("master_category_id")
    .references(() => masterCategoryTable.id, { onDelete: "set null" }),
});
/**
 * @onlyGen contract
 */
export const productSiteCategoryTable = p.pgTable(
  "product_site_category",
  {
    productId: p
      .uuid("product_id")
      .notNull()
      .references(() => productTable.id),
    siteCategoryId: p
      .uuid("category_id")
      .notNull()
      .references(() => siteCategoryTable.id),
  },
  (t) => [p.primaryKey({ columns: [t.productId, t.siteCategoryId] })]
);
/**
 * @onlyGen contract
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

export const templateTable = p.pgTable("template", {
  id: idUuid,
  name: p.varchar("name", { length: 100 }).notNull(),
  masterCategoryId: p
    .uuid("master_category_id")
    .notNull()
    .references(() => masterCategoryTable.id),
  siteCategoryId: p
    .uuid("site_category_id")
    .references(() => siteCategoryTable.id),
});

export const templateKeyTable = p.pgTable("template_key", {
  id: idUuid,
  templateId: p
    .uuid("template_id")
    .notNull()
    .references(() => templateTable.id),
  key: p.varchar("key", { length: 100 }).notNull(),
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
  value: p.varchar("value", { length: 100 }).notNull(),
  sortOrder: p.integer("sort_order").default(0),
});
/**
 * @onlyGen contract
 */
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

export const skuTable = p.pgTable("sku", {
  ...Audit,
  skuCode: p.varchar("sku_code", { length: 100 }).notNull(), // 同样建议去重逻辑需带上 tenantId
  price: p
    .decimal("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  marketPrice: p.decimal("market_price", { precision: 10, scale: 2 }),
  costPrice: p.decimal("cost_price", { precision: 10, scale: 2 }),
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

  ...tenantCols,
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
      .references(() => mediaTable.id, { onDelete: "restrict" }),
    isMain: p.boolean("is_main").default(false),
    sortOrder: p.integer("sort_order").default(0),
    ...tenantCols,
  },
  (t) => [p.primaryKey({ columns: [t.skuId, t.mediaId] })]
);

export const siteProductTable = p.pgTable("site_product", {
  ...Audit,
  sitePrice: p.decimal("site_price", { precision: 10, scale: 2 }),
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
  siteCategoryId: p
    .uuid("site_category_id")
    .references(() => siteCategoryTable.id, { onDelete: "set null" }),
});

export const customerTable = p.pgTable("customer", {
  ...Audit,
  companyName: p.varchar("company_name", { length: 200 }).notNull(),
  name: p.varchar("contact_name", { length: 100 }),
  email: p.varchar("email", { length: 255 }),
  whatsapp: p.varchar("whatsapp", { length: 50 }),
  phone: p.varchar("phone", { length: 20 }),
  address: p.text("address"),
  ...tenantCols,
});

export const inquiryTable = p.pgTable("inquiry", {
  ...Audit,
  inquiryNumber: p.varchar("inquiry_number", { length: 50 }).notNull(),
  customerName: p.varchar("customer_name", { length: 100 }),
  customerCompany: p.varchar("company_name", { length: 200 }).notNull(),
  customerEmail: p.varchar("email", { length: 255 }).notNull(),
  customerPhone: p.varchar("phone", { length: 50 }),
  customerWhatsapp: p.varchar("whatsapp", { length: 50 }),
  status: inquiryStatusEnum("status").default("pending").notNull(),

  // 🔥 合并自 inquiryItemsTable - 每次询价只针对单个商品
  skuId: p
    .uuid("sku_id")
    .notNull()
    .references(() => skuTable.id),
  productName: p.varchar("product_name", { length: 255 }).notNull(),
  productDescription: p.text("product_description"),
  quantity: p.integer("quantity").notNull(),
  price: p.decimal("price", { precision: 10, scale: 2 }),
  paymentMethod: p.varchar("payment_method", { length: 255 }).notNull(),
  customerRequirements: p.text("customer_requirements"),

  ...tenantCols,
});

export const quotationTable = p.pgTable("quotation", {
  ...Audit,
  refNo: p.varchar("ref_no", { length: 50 }).notNull(),
  date: p.date("date").notNull(),
  clientId: p
    .uuid("client_id")
    .notNull()
    .references(() => customerTable.id, { onDelete: "restrict" }),
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
    .references(() => skuTable.id, { onDelete: "restrict" }),
  productionDeptId: p
    .uuid("production_dept_id")
    .notNull()
    .references(() => departmentTable.id),
  unitPriceUsd: p
    .decimal("unit_price_usd", { precision: 10, scale: 2 })
    .notNull(),
  quantity: p.integer("quantity").notNull(),
  totalUsd: p.decimal("total_usd", { precision: 12, scale: 2 }).notNull(),
  remark: p.text("remark"),

  ...tenantCols,
});

export const siteConfigTable = p.pgTable("site_config", {
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
});

export const dailyInquiryCounterTable = p.pgTable("daily_inquiry_counter", {
  ...Audit,
  date: p.varchar("date", { length: 10 }).notNull().unique(),
  count: p.integer("count").default(0).notNull(),
  lastResetAt: p.timestamp("last_reset_at").defaultNow(),
});
