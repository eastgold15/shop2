import { randomUUIDv7 } from "bun"; // @ts-ignore - bun types
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./src/table.relation";
import {
  accountTable,
  adTable,
  // ========================================
  // 业务表
  // ========================================
  customerTable,
  // ========================================
  // 其他
  // ========================================
  dailyInquiryCounterTable,
  departmentTable,
  heroCardTable,
  inquiryTable,
  // ========================================
  // 分类和模板
  // ========================================
  masterCategoryTable,
  mediaMetadataTable,
  // ========================================
  // 媒体相关
  // ========================================
  mediaTable,
  permissionTable,
  productMasterCategoryTable,
  productMediaTable,
  productSiteCategoryTable,
  // ========================================
  // 产品相关
  // ========================================
  productTable,
  productTemplateTable,
  quotationTable,
  rolePermissionTable,
  roleTable,
  sessionTable,
  siteCategoryTable,
  siteConfigTable,
  siteProductTable,
  // ========================================
  // 站点相关
  // ========================================
  siteTable,
  skuMediaTable,
  skuTable,
  templateKeyTable,
  templateTable,
  templateValueTable,
  // ========================================
  // 系统架构核心表
  // ========================================
  tenantTable,
  userRoleTable,
  userTable,
  verificationTable,
} from "./src/table.schema";

const db = drizzle("postgres://shop:shop@localhost:5444/shop", { relations });

// ========================================
// 1. 基础配置
// ========================================

// 预定义密码哈希 (12345678)
const hashedPassword =
  "948ca608bf8799e01f412bc8e42e4384:18a873f36c8ccb79a0954f6ae5c66ecc0a1c14f113e6d3f0de65dd3d0deeb3257cdc3fa840021fe627cf6f399cb8beb9c597ed30967a8959badb5e782db934065";

// 获取所有数据库表名并生成对应的权限
// 使用变量名去掉 Table 后缀
const getAllTableNames = () => [
  // 系统架构核心表
  "tenant",
  "department",
  "user",
  "role",
  "permission",
  // "userRole", // 关联表，通常不需要单独权限
  // "rolePermission", // 关联表，通常不需要单独权限
  // 认证相关
  "account",
  "session",
  "verification",
  // 站点相关
  "site",
  "siteCategory",
  "siteProduct",
  "siteConfig",
  // 分类和模板
  "masterCategory",
  "template",
  "templateKey",
  "templateValue",
  // 产品相关
  "product",
  "productMasterCategory",
  "productSiteCategory",
  "productMedia",
  "productTemplate",
  "sku",
  "skuMedia",
  // 媒体相关
  "media",
  "mediaMetadata",
  // 广告和首页
  "ad",
  "heroCard",
  // 业务表
  "customer",
  "inquiry",
  "quotation",
  "dailyInquiryCounter",
];

// 生成标准CRUD权限
const generateCRUDPermissions = (resource: string) => [
  `${resource.toUpperCase()}_VIEW`,
  `${resource.toUpperCase()}_CREATE`,
  `${resource.toUpperCase()}_EDIT`,
  `${resource.toUpperCase()}_DELETE`,
];

// 角色权限映射
const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    // 超级管理员拥有所有权限
    ...getAllTableNames().flatMap((table) => generateCRUDPermissions(table)),
    "SITES_MANAGE",
    "TENANTS_MANAGE",
  ],
  tenant_admin: [
    // 租户管理员权限
    ...generateCRUDPermissions("sys_users"),
    ...generateCRUDPermissions("sys_depts"),
    ...generateCRUDPermissions("sites"),
    ...generateCRUDPermissions("products"),
    ...generateCRUDPermissions("skus"),
    ...generateCRUDPermissions("media"),
    ...generateCRUDPermissions("customers"),
    ...generateCRUDPermissions("inquiries"),
    ...generateCRUDPermissions("quotations"),
    "SITES_VIEW",
    "SITES_CREATE",
    "SITES_EDIT",
  ],
  dept_manager: [
    // 部门经理权限
    ...generateCRUDPermissions("sys_users"),
    ...generateCRUDPermissions("products"),
    ...generateCRUDPermissions("skus"),
    ...generateCRUDPermissions("media"),
    ...generateCRUDPermissions("customers"),
    ...generateCRUDPermissions("inquiries"),
    ...generateCRUDPermissions("quotations"),
    "SITES_VIEW",
    "SITES_EDIT",
  ],
  salesperson: [
    // 业务员权限
    ...generateCRUDPermissions("customers"),
    "PRODUCTS_VIEW",
    "PRODUCTS_CREATE",
    "PRODUCTS_EDIT",
    "SKUS_VIEW",
    "MEDIA_VIEW",
    "MEDIA_CREATE",
    "MEDIA_DELETE",
    "SITES_VIEW",
    "SITE_CATEGORIES_VIEW",
    "SITE_PRODUCTS_VIEW",
    "INQUIRIES_VIEW",
    "INQUIRIES_CREATE",
    "INQUIRIES_EDIT",
    "QUOTATIONS_VIEW",
    "QUOTATIONS_CREATE",
    "QUOTATIONS_EDIT",
  ],
};

// ========================================
// 2. 角色和权限数据
// ========================================

const roles = [
  {
    id: randomUUIDv7(),
    name: "tenant_admin",
    description: "租户管理员",
    type: "system" as const,
    priority: 80,
    dataScope: "all" as const,
  },
  {
    id: randomUUIDv7(),
    name: "dept_manager",
    description: "部门经理",
    type: "system" as const,
    priority: 70,
    dataScope: "dept_and_child" as const,
  },
  {
    id: randomUUIDv7(),
    name: "salesperson",
    description: "业务员",
    type: "system" as const,
    priority: 50,
    dataScope: "self" as const,
  },
  {
    id: randomUUIDv7(),
    name: "super_admin",
    description: "超级管理员",
    type: "system" as const,
    priority: 100,
    dataScope: "all" as const,
  },
];

// 生成权限数据
const generatePermissions = () => {
  const permissions: any[] = [];
  const allTables = getAllTableNames();

  allTables.forEach((table) => {
    const resource = table.toUpperCase();
    permissions.push(
      {
        id: randomUUIDv7(),
        name: `${resource}_VIEW`,
        description: `查看${table}`,
      },
      {
        id: randomUUIDv7(),
        name: `${resource}_CREATE`,
        description: `创建${table}`,
      },
      {
        id: randomUUIDv7(),
        name: `${resource}_EDIT`,
        description: `编辑${table}`,
      },
      {
        id: randomUUIDv7(),
        name: `${resource}_DELETE`,
        description: `删除${table}`,
      }
    );
  });

  permissions.push({
    id: randomUUIDv7(),
    name: "SITES_MANAGE",
    description: "管理站点",
  });

  permissions.push({
    id: randomUUIDv7(),
    name: "TENANTS_MANAGE",
    description: "管理租户",
  });

  return permissions;
};

const permissions = generatePermissions();

// ========================================
// 4. 租户和部门数据（提前定义，因为 masterCategories 需要使用）
// ========================================

const tenant1Id = randomUUIDv7();
const tenant2Id = randomUUIDv7();

// ========================================
// 3. 主分类数据
// ========================================

const masterCategories = [
  {
    id: "019b1bd7-8d03-701c-85c9-4cb7bbc75ab5",
    name: "pumps",
    slug: "pumps",
    description: "pumps",
    parentId: null,
    sortOrder: 1,
    isActive: true,
    icon: "electronics",
    tenantId: tenant1Id, // 🔥 添加租户ID
  },
  {
    id: "095138c7-5eef-476c-ac66-38f86d4697bb",
    name: "bridal",
    slug: "bridal",
    description: "bridal",
    parentId: null,
    sortOrder: 6,
    isActive: true,
    icon: "clothing",
    tenantId: tenant1Id, // 🔥 添加租户ID
  },
  {
    id: "019b1bd7-8d03-701e-8722-e6956b408ff7",
    name: "boots",
    slug: "boots",
    description: "boots",
    parentId: null,
    sortOrder: 3,
    isActive: true,
    icon: "home",
    tenantId: tenant1Id, // 🔥 添加租户ID
  },
  {
    id: "019b1bd7-8d03-701d-bdc5-fdd947ca7202",
    name: "sandals",
    slug: "sandals",
    description: "sandals",
    parentId: null,
    sortOrder: 2,
    isActive: true,
    icon: "clothing",
    tenantId: tenant1Id, // 🔥 添加租户ID
  },
  {
    id: "019b1bd7-8d03-701f-ac04-80e22fe95368",
    name: "platforms",
    slug: "platforms",
    description: "platforms",
    parentId: null,
    sortOrder: 4,
    isActive: true,
    icon: "sports",
    tenantId: tenant1Id, // 🔥 添加租户ID
  },
  {
    id: "019b1bd7-8d03-7020-b2a7-38f19eeb860f",
    name: "flats",
    slug: "flats",
    description: "flats",
    parentId: null,
    sortOrder: 5,
    isActive: true,
    icon: "food",
    tenantId: tenant1Id, // 🔥 添加租户ID
  },
];

const tenants = [
  {
    id: tenant1Id,
    name: "环球贸易集团",
    code: "GLOBAL_TRADE_GROUP",
    status: 1,
    address: "深圳市福田区中心商务大厦",
    website: "https://www.global-trade.com",
    subscriptionPlan: "premium",
  },
  {
    id: tenant2Id,
    name: "美亚进出口公司",
    code: "MEYA_IMPORT",
    status: 1,
    address: "广州市天河区珠江新城",
    website: "https://www.meya-import.com",
    subscriptionPlan: "standard",
  },
];

// 租户1的部门结构
const dept1HeadquartersId = randomUUIDv7();
const dept1Factory1Id = randomUUIDv7();
const dept1Factory2Id = randomUUIDv7();
const dept1Office1Id = randomUUIDv7();

const departments = [
  // 租户1 - 总部
  {
    id: dept1HeadquartersId,
    tenantId: tenant1Id,
    parentId: null,
    name: "总部",
    code: "HQ",
    category: "headquarters" as const,
    address: "深圳市福田区",
    contactPhone: "0755-88888888",
    isActive: true,
  },
  // 租户1 - 工厂1（东莞）
  {
    id: dept1Factory1Id,
    tenantId: tenant1Id,
    parentId: dept1HeadquartersId,
    name: "东莞制造工厂",
    code: "DG_FACTORY",
    category: "factory" as const,
    address: "东莞市东城区科技园",
    contactPhone: "0769-66666666",
    extensions: {
      mainProducts: "鞋类、箱包、服装",
      annualRevenue: "5000万-1亿",
      employeeCount: 200,
    },
    isActive: true,
  },
  // 租户1 - 工厂2（深圳）
  {
    id: dept1Factory2Id,
    tenantId: tenant1Id,
    parentId: dept1HeadquartersId,
    name: "深圳制造工厂",
    code: "SZ_FACTORY",
    category: "factory" as const,
    address: "深圳市宝安区工业园",
    contactPhone: "0755-77777777",
    extensions: {
      mainProducts: "电子产品、智能设备",
      annualRevenue: "8000万-1.5亿",
      employeeCount: 350,
    },
    isActive: true,
  },
  // 租户1 - 办事处
  {
    id: dept1Office1Id,
    tenantId: tenant1Id,
    parentId: dept1HeadquartersId,
    name: "上海办事处",
    code: "SH_OFFICE",
    category: "office" as const,
    address: "上海市浦东新区",
    contactPhone: "021-55555555",
    isActive: true,
  },
];

// ========================================
// 5. 用户数据
// ========================================

const user1Id = randomUUIDv7(); // 超级管理员
const user2Id = randomUUIDv7(); // 租户管理员
const user3Id = randomUUIDv7(); // 工厂经理
const user4Id = randomUUIDv7(); // 业务员
const user5Id = randomUUIDv7(); // 业务员2
const user6Id = randomUUIDv7(); // 业务员3

const users = [
  {
    id: user1Id,
    name: "超级管理员",
    email: "super@admin.com",
    emailVerified: true,
    isSuperAdmin: true,
    image:
      "https://ui-avatars.com/api/?name=超级管理员&background=random&color=fff",
    tenantId: tenant1Id,
    deptId: dept1HeadquartersId,
    phone: "13800000001",
    position: "系统管理员",
    isActive: true,
  },
  {
    id: user2Id,
    name: "张三",
    email: "admin@global.com",
    emailVerified: true,
    image: "https://ui-avatars.com/api/?name=张三&background=random&color=fff",
    tenantId: tenant1Id,
    deptId: dept1HeadquartersId,
    phone: "13800000002",
    position: "运营总监",
    isActive: true,
  },
  {
    id: user3Id,
    name: "李四",
    email: "factory@manager.com",
    emailVerified: true,
    image: "https://ui-avatars.com/api/?name=李四&background=random&color=fff",
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    phone: "13800000003",
    position: "工厂经理",
    isActive: true,
  },
  {
    id: user4Id,
    name: "王五",
    email: "sales@rep.com",
    emailVerified: true,
    image: "https://ui-avatars.com/api/?name=王五&background=random&color=fff",
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    phone: "13800000004",
    whatsapp: "+8613800000004",
    position: "高级业务员",
    isActive: true,
  },
  {
    id: user5Id,
    name: "赵六",
    email: "john@example.com",
    emailVerified: true,
    image: "https://ui-avatars.com/api/?name=John&background=random&color=fff",
    tenantId: tenant1Id,
    deptId: dept1Factory2Id,
    phone: "13800000005",
    whatsapp: "+8613800000005",
    position: "业务员",
    isActive: true,
  },
  {
    id: user6Id,
    name: "陈七",
    email: "jane@example.com",
    emailVerified: true,
    image: "https://ui-avatars.com/api/?name=Jane&background=random&color=fff",
    tenantId: tenant1Id,
    deptId: dept1Office1Id,
    phone: "13800000006",
    whatsapp: "+8613800000006",
    position: "业务员",
    isActive: true,
  },
];

// ========================================
// 6. 站点数据
// ========================================

const site1Id = randomUUIDv7(); // 集团站
const site2Id = randomUUIDv7(); // 东莞工厂站
const site3Id = randomUUIDv7(); // 深圳工厂站

const sites = [
  {
    id: site1Id,
    name: "环球贸易集团站",
    domain: "global-trade.example.com",
    isActive: true,
    tenantId: tenant1Id,
    boundDeptId: dept1HeadquartersId, // 绑定总部 = 集团站
    siteType: "group" as const,
  },
  {
    id: site2Id,
    name: "东莞工厂站",
    domain: "dg-factory.example.com",
    isActive: true,
    tenantId: tenant1Id,
    boundDeptId: dept1Factory1Id, // 绑定工厂 = 工厂站
    siteType: "factory" as const,
  },
  {
    id: site3Id,
    name: "深圳工厂站",
    domain: "sz-factory.example.com",
    isActive: true,
    tenantId: tenant1Id,
    boundDeptId: dept1Factory2Id,
    siteType: "factory" as const,
  },
];

// ========================================
// 7. 模板和属性数据
// ========================================

const templates = [
  {
    id: randomUUIDv7(),
    name: "鞋类通用属性模板",
    masterCategoryId: masterCategories[0].id,
    siteCategoryId: null,
  },
  {
    id: randomUUIDv7(),
    name: "服装属性模板",
    masterCategoryId: masterCategories[1].id,
    siteCategoryId: null,
  },
];

const templateKeys = [
  // 鞋类属性
  {
    id: randomUUIDv7(),
    templateId: templates[0].id,
    key: "color",
    inputType: "select" as const,
    isRequired: true,
    isSkuSpec: true,
    sortOrder: 1,
  },
  {
    id: randomUUIDv7(),
    templateId: templates[0].id,
    key: "size",
    inputType: "select" as const,
    isRequired: true,
    isSkuSpec: true,
    sortOrder: 2,
  },
  {
    id: randomUUIDv7(),
    templateId: templates[0].id,
    key: "material",
    inputType: "select" as const,
    isRequired: false,
    isSkuSpec: false,
    sortOrder: 3,
  },
  // 服装属性
  {
    id: randomUUIDv7(),
    templateId: templates[1].id,
    key: "size",
    inputType: "select" as const,
    isRequired: true,
    isSkuSpec: true,
    sortOrder: 1,
  },
  {
    id: randomUUIDv7(),
    templateId: templates[1].id,
    key: "fabric",
    inputType: "select" as const,
    isRequired: false,
    isSkuSpec: false,
    sortOrder: 2,
  },
];

const templateValues = [
  // 颜色值
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[0].id,
    value: "黑色",
    sortOrder: 1,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[0].id,
    value: "白色",
    sortOrder: 2,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[0].id,
    value: "红色",
    sortOrder: 3,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[0].id,
    value: "蓝色",
    sortOrder: 4,
  },
  // 尺码值（鞋类）
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[1].id,
    value: "35",
    sortOrder: 1,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[1].id,
    value: "36",
    sortOrder: 2,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[1].id,
    value: "37",
    sortOrder: 3,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[1].id,
    value: "38",
    sortOrder: 4,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[1].id,
    value: "39",
    sortOrder: 5,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[1].id,
    value: "40",
    sortOrder: 6,
  },
  // 材质值
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[2].id,
    value: "真皮",
    sortOrder: 1,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[2].id,
    value: "PU",
    sortOrder: 2,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[2].id,
    value: "织物",
    sortOrder: 3,
  },
  // 尺码值（服装）
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[3].id,
    value: "S",
    sortOrder: 1,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[3].id,
    value: "M",
    sortOrder: 2,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[3].id,
    value: "L",
    sortOrder: 3,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[3].id,
    value: "XL",
    sortOrder: 4,
  },
  // 面料值
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[4].id,
    value: "纯棉",
    sortOrder: 1,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[4].id,
    value: "涤纶",
    sortOrder: 2,
  },
  {
    id: randomUUIDv7(),
    templateKeyId: templateKeys[4].id,
    value: "混纺",
    sortOrder: 3,
  },
];

// ========================================
// 8. 产品和SKU数据
// ========================================

const product1Id = randomUUIDv7();
const product2Id = randomUUIDv7();

const products = [
  {
    id: product1Id,
    spuCode: "SPU-PUMP-001",
    name: "经典高跟鞋 Pumps Classic",
    description: "经典款高跟鞋，舒适耐穿，适合各种场合",
    status: 1,
    units: "PAIR",
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    createdBy: user3Id,
    isPublic: true,
  },
  {
    id: product2Id,
    spuCode: "SPU-SANDAL-001",
    name: "夏季凉鞋 Sandals Summer",
    description: "舒适透气的夏季凉鞋",
    status: 1,
    units: "PAIR",
    tenantId: tenant1Id,
    deptId: dept1Factory2Id,
    createdBy: user5Id,
    isPublic: true,
  },
];

const sku1Id = randomUUIDv7();
const sku2Id = randomUUIDv7();
const sku3Id = randomUUIDv7();

const skus = [
  {
    id: sku1Id,
    skuCode: "SKU-PUMP-001-BLK-37",
    price: "89.99",
    marketPrice: "129.99",
    costPrice: "45.00",
    stock: "100",
    specJson: { color: "黑色", size: "37" },
    status: 1,
    productId: product1Id,
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    createdBy: user3Id,
  },
  {
    id: sku2Id,
    skuCode: "SKU-PUMP-001-BLK-38",
    price: "89.99",
    marketPrice: "129.99",
    costPrice: "45.00",
    stock: "150",
    specJson: { color: "黑色", size: "38" },
    status: 1,
    productId: product1Id,
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    createdBy: user3Id,
  },
  {
    id: sku3Id,
    skuCode: "SKU-SANDAL-001-RED-37",
    price: "69.99",
    marketPrice: "99.99",
    costPrice: "35.00",
    stock: "80",
    specJson: { color: "红色", size: "37" },
    status: 1,
    productId: product2Id,
    tenantId: tenant1Id,
    deptId: dept1Factory2Id,
    createdBy: user5Id,
  },
];

// ========================================
// 9. 站点分类和配置
// ========================================

const siteCategory1Id = randomUUIDv7();
const siteCategory2Id = randomUUIDv7();

const siteCategories = [
  {
    id: siteCategory1Id,
    name: "热销鞋类",
    description: "最畅销的鞋类产品",
    parentId: null,
    sortOrder: 1,
    isActive: true,
    siteId: site1Id,
    masterCategoryId: masterCategories[0].id,
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    createdBy: user2Id,
    isPublic: true,
  },
  {
    id: siteCategory2Id,
    name: "新品上市",
    description: "最新发布的产品",
    parentId: null,
    sortOrder: 2,
    isActive: true,
    siteId: site2Id,
    masterCategoryId: masterCategories[3].id,
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    createdBy: user2Id,
    isPublic: true,
  },
];

const siteConfigs = [
  {
    id: randomUUIDv7(),
    key: "site_name",
    value: "环球贸易集团",
    description: "站点名称",
    category: "general",
    siteId: site1Id,
  },
  {
    id: randomUUIDv7(),
    key: "site_description",
    value: "专业的鞋类产品出口商",
    description: "站点描述",
    category: "general",
    siteId: site1Id,
  },
];

// ========================================
// 10. 主页卡片数据
// ========================================

// 先创建一个默认的 media 记录
const defaultMediaId = randomUUIDv7();
const heroCardsMedia = [
  {
    id: defaultMediaId,
    storageKey: "hero-card-default",
    category: "hero_card",
    url: "https://via.placeholder.com/1200x400",
    originalName: "default-hero-bg.jpg",
    mimeType: "image/jpeg",
    status: true,
    thumbnailUrl: "https://via.placeholder.com/300x100",
    mediaType: "image" as const,
    tenantId: tenant1Id,
    deptId: dept1HeadquartersId,
    createdBy: user2Id,
    isPublic: true,
  },
];

const heroCards = [
  {
    id: "e6d2b19c-81ec-4b4a-9f70-a0242ae92920",
    title: 'DISCOVER "HEY BABY" COLLECTION',
    description: "Crafted in the decadent leopard design calf hair",
    buttonText: "LETS SHOPPIN",
    buttonUrl: "/shop",
    backgroundClass: "bg-blue-50",
    sortOrder: 3,
    isActive: true,
    mediaId: defaultMediaId,
    siteId: site1Id,
    tenantId: tenant1Id,
  },
  {
    id: "eeb815b1-ded9-4b66-9bfa-fac1502ee013",
    title: "EXPLORE SANDALES",
    description:
      "Handcrafted in exquisite detail,explore our selection of sandals",
    buttonText: "EXPLORE MORE",
    buttonUrl: "/sandals",
    backgroundClass: "bg-blue-50",
    sortOrder: 1,
    isActive: true,
    mediaId: defaultMediaId,
    siteId: site1Id,
    tenantId: tenant1Id,
  },
  {
    id: "23ddb3b0-f732-4d5b-af8a-12f724415dea",
    title: 'MEET "HEY BABY" COLLECTION',
    description: "A sleek mule designed for elegant occasions",
    buttonText: "DISCOVER MORE",
    buttonUrl: "/collection",
    backgroundClass: "bg-blue-50",
    sortOrder: 2,
    isActive: true,
    mediaId: defaultMediaId,
    siteId: site1Id,
    tenantId: tenant1Id,
  },
];

// ========================================
// 11. 客户和询盘数据
// ========================================

const customer1Id = randomUUIDv7();
const customer2Id = randomUUIDv7();

const customers = [
  {
    id: customer1Id,
    companyName: "美国ABC公司",
    name: "John Smith",
    email: "info@abc-usa.com",
    whatsapp: "+12125551234",
    phone: "2125551234",
    address: "123 Broadway, New York, NY 10001, USA",
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    createdBy: user4Id,
    isPublic: false,
  },
  {
    id: customer2Id,
    companyName: "德国XYZ贸易",
    name: "Hans Mueller",
    email: "contact@xyz-germany.de",
    whatsapp: "+493012345678",
    phone: "3012345678",
    address: "Friedrichstrasse 123, 10117 Berlin, Germany",
    tenantId: tenant1Id,
    deptId: dept1Factory2Id,
    createdBy: user5Id,
    isPublic: false,
  },
];

const inquiry1Id = randomUUIDv7();

const inquiries = [
  {
    id: inquiry1Id,
    inquiryNum: "INQ-2024-001",
    customerName: "John Smith",
    customerCompany: "美国ABC公司",
    customerEmail: "info@abc-usa.com",
    customerPhone: "2125551234",
    customerWhatsapp: "+12125551234",
    status: "pending" as const,
    skuId: sku1Id,
    productName: "经典高跟鞋 Pumps Classic",
    productDescription: "经典款高跟鞋，舒适耐穿",
    quantity: 500,
    price: "89.99",
    paymentMethod: "T/T",
    customerRequirements: "需要定制包装，印客户logo",
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    siteId: site1Id,
    createdBy: user4Id,
    isPublic: false,
  },
];

const quotation1Id = randomUUIDv7();

const quotations = [
  {
    id: quotation1Id,
    refNo: "QT-2024-001",
    date: new Date().toISOString().split("T")[0],
    clientId: customer1Id,
    deliveryTimeDays: "30",
    sampleLeadtimeDays: "7",
    paymentTerms: "30% deposit, 70% before shipment",
    qualityRemark: "符合欧盟标准",
    safetyCompliance: "CE认证",
    status: "draft",
    skuId: sku1Id,
    productionDeptId: dept1Factory1Id,
    unitPriceUsd: "89.99",
    quantity: 500,
    totalUsd: "44995.00",
    remark: "包含定制包装费用",
    tenantId: tenant1Id,
    deptId: dept1Factory1Id,
    siteId: site1Id,
    createdBy: user3Id,
    isPublic: false,
  },
];

// ========================================
// 12. 产品关联数据
// ========================================

const productMasterCategories = [
  { productId: product1Id, masterCategoryId: masterCategories[0].id },
  { productId: product2Id, masterCategoryId: masterCategories[3].id },
];

const productSiteCategories = [
  { productId: product1Id, siteCategoryId: siteCategory1Id },
  { productId: product2Id, siteCategoryId: siteCategory2Id },
];

const productTemplates = [
  { productId: product1Id, templateId: templates[0].id },
  { productId: product2Id, templateId: templates[0].id },
];

const siteProducts = [
  {
    siteId: site1Id,
    productId: product1Id,
    sitePrice: "89.99",
    siteName: "经典高跟鞋 - 热销款",
    siteDescription: "集团站热销产品",
    isFeatured: true,
    sortOrder: 1,
    isVisible: true,
    siteCategoryId: siteCategory1Id,
  },
  {
    siteId: site2Id,
    productId: product2Id,
    sitePrice: "69.99",
    siteName: "夏季凉鞋 - 工厂直供",
    siteDescription: "东莞工厂生产",
    isFeatured: true,
    sortOrder: 1,
    isVisible: true,
    siteCategoryId: siteCategory2Id,
  },
];

// ========================================
// 13. 其他数据
// ========================================

const dailyInquiryCounter = [
  {
    id: randomUUIDv7(),
    date: new Date().toISOString().split("T")[0],
    count: 1,
    lastResetAt: new Date(),
  },
];

// ========================================
// 清理数据库
// ========================================

async function clearDatabase() {
  console.log("🧹 清理现有数据...");

  const tables = [
    // 先删除有外键依赖的表
    siteProductTable,
    productSiteCategoryTable,
    productMasterCategoryTable,
    productTemplateTable,
    skuMediaTable,
    productMediaTable,
    inquiryTable,
    quotationTable,
    customerTable,
    skuTable,
    productTable,
    templateValueTable,
    templateKeyTable,
    templateTable,
    siteCategoryTable,
    siteConfigTable,
    heroCardTable,
    adTable,
    mediaMetadataTable,
    mediaTable,
    siteTable,
    masterCategoryTable,
    userRoleTable,
    userTable,
    rolePermissionTable,
    roleTable,
    permissionTable,
    departmentTable,
    tenantTable,
    accountTable,
    sessionTable,
    verificationTable,
    dailyInquiryCounterTable,
  ];

  for (const table of tables) {
    try {
      if (!table) {
        continue;
      }
      await db.delete(table);
    } catch (error: any) {
      console.log(
        `注意：表 ${table?._?.name || "未知"} 可能不存在: ${error?.message || error}`
      );
    }
  }
}

// ========================================
// 数据库初始化
// ========================================

async function seedCompleteDatabase() {
  try {
    console.log("🌱 开始完整数据库初始化...");

    // 1. 插入租户数据
    console.log("🏢 插入租户数据...");
    await db.insert(tenantTable).values(tenants);

    // 2. 插入部门数据
    console.log("🏭 插入部门数据...");
    await db.insert(departmentTable).values(departments);

    // 3. 插入角色数据
    console.log("📋 插入角色数据...");
    await db.insert(roleTable).values(roles);

    // 4. 插入权限数据
    console.log("🔑 插入权限数据...");
    await db.insert(permissionTable).values(permissions);

    // 5. 插入角色权限关联
    console.log("🔗 插入角色权限关联...");
    const rolePermissionRelations = [];
    const uniqueRelations = new Set();

    for (const [roleName, permissionNames] of Object.entries(
      ROLE_PERMISSIONS
    )) {
      const role = roles.find((r) => r.name === roleName);
      if (!role) continue;

      for (const permissionName of permissionNames) {
        const permission = permissions.find((p) => p.name === permissionName);
        if (!permission) continue;

        const relationKey = `${role.id}-${permission.id}`;
        if (!uniqueRelations.has(relationKey)) {
          uniqueRelations.add(relationKey);
          rolePermissionRelations.push({
            roleId: role.id,
            permissionId: permission.id,
          });
        }
      }
    }

    const batchSize = 100;
    for (let i = 0; i < rolePermissionRelations.length; i += batchSize) {
      const batch = rolePermissionRelations.slice(i, i + batchSize);
      await db.insert(rolePermissionTable).values(batch);
    }

    // 6. 插入主分类数据
    console.log("📦 插入主分类数据...");
    await db.insert(masterCategoryTable).values(masterCategories);

    // 7. 插入用户数据
    console.log("👥 插入用户数据...");
    await db.insert(userTable).values(users);

    // 8. 创建Better Auth账户记录
    console.log("🔐 创建Better Auth账户记录...");
    const accounts = users.map((user) => ({
      id: randomUUIDv7(),
      userId: user.id,
      type: "email" as const,
      providerId: "credential",
      accountId: user.email,
      password: hashedPassword,
    }));
    await db.insert(accountTable).values(accounts);

    // 9. 插入用户角色关联
    console.log("👑 插入用户角色关联...");
    const userRoles = [
      // 超级管理员
      { userId: user1Id, roleId: roles[3].id },
      // 租户管理员
      { userId: user2Id, roleId: roles[0].id },
      // 工厂经理
      { userId: user3Id, roleId: roles[1].id },
      // 业务员们
      { userId: user4Id, roleId: roles[2].id },
      { userId: user5Id, roleId: roles[2].id },
      { userId: user6Id, roleId: roles[2].id },
    ];
    await db.insert(userRoleTable).values(userRoles);

    // 10. 插入站点数据
    console.log("🌐 插入站点数据...");
    await db.insert(siteTable).values(sites);

    // 11. 插入站点分类数据
    console.log("📂 插入站点分类数据...");
    await db.insert(siteCategoryTable).values(siteCategories);

    // 12. 插入站点配置数据
    console.log("⚙️ 插入站点配置数据...");
    await db.insert(siteConfigTable).values(siteConfigs);

    // 13. 插入模板数据
    console.log("📋 插入模板数据...");
    await db.insert(templateTable).values(templates);

    // 14. 插入模板键数据
    console.log("🔑 插入模板键数据...");
    await db.insert(templateKeyTable).values(templateKeys);

    // 15. 插入模板值数据
    console.log("💎 插入模板值数据...");
    await db.insert(templateValueTable).values(templateValues);

    // 16. 插入产品数据
    console.log("🛍️ 插入产品数据...");
    await db.insert(productTable).values(products);

    // 17. 插入SKU数据
    console.log("📦 插入SKU数据...");
    await db.insert(skuTable).values(skus);

    // 18. 插入产品关联数据
    console.log("🔗 插入产品关联数据...");
    await db.insert(productMasterCategoryTable).values(productMasterCategories);
    await db.insert(productSiteCategoryTable).values(productSiteCategories);
    await db.insert(productTemplateTable).values(productTemplates);
    await db.insert(siteProductTable).values(siteProducts);

    // 19. 插入媒体数据
    console.log("📸 插入媒体数据...");
    await db.insert(mediaTable).values(heroCardsMedia);

    // 20. 插入主页卡片数据
    console.log("🎨 插入主页卡片数据...");
    await db.insert(heroCardTable).values(heroCards);

    // 21. 插入客户数据
    console.log("🏢 插入客户数据...");
    await db.insert(customerTable).values(customers);

    // 22. 插入询盘数据
    console.log("📨 插入询盘数据...");
    await db.insert(inquiryTable).values(inquiries);

    // 23. 插入报价数据
    console.log("💰 插入报价数据...");
    await db.insert(quotationTable).values(quotations);

    // 24. 插入每日询盘计数器数据
    console.log("📊 插入每日询盘计数器数据...");
    await db.insert(dailyInquiryCounterTable).values(dailyInquiryCounter);

    console.log("✅ 数据库初始化完成！");
    console.log("\n📝 创建的账号信息：");
    console.log("1. 超级管理员: super@admin.com");
    console.log("2. 租户管理员: admin@global.com");
    console.log("3. 部门经理: factory@manager.com");
    console.log("4. 业务员1: sales@rep.com");
    console.log("5. 业务员2: john@example.com");
    console.log("6. 业务员3: jane@example.com");
    console.log("\n💡 所有账号的密码都是: 12345678");
    console.log("\n📊 初始化的数据包括：");
    console.log("- 2个租户");
    console.log("- 4个部门（1个总部 + 2个工厂 + 1个办事处）");
    console.log("- 4个角色及其权限");
    console.log("- 6个主分类（鞋类）");
    console.log("- 2个属性模板");
    console.log("- 5个属性键");
    console.log("- 18个属性值");
    console.log("- 6个用户");
    console.log("- 3个站点（1个集团站 + 2个工厂站）");
    console.log("- 2个站点分类");
    console.log("- 2个产品");
    console.log("- 3个SKU");
    console.log("- 3个主页卡片");
    console.log("- 2个客户");
    console.log("- 1个询盘");
    console.log("- 1个报价");
    console.log("\n🏗️ 架构说明：");
    console.log("- 租户 → 部门（树形结构）→ 用户");
    console.log("- 站点绑定部门：集团站绑定总部，工厂站绑定工厂");
    console.log(
      "- 所有业务表包含 tenantCols（tenantId, deptId, createdBy, isPublic, siteId）"
    );
  } catch (error) {
    console.error("❌ 数据库初始化失败:", error);
    process.exit(1);
  }
}

// 运行初始化
async function main() {
  await clearDatabase(); // 先清理现有数据
  await seedCompleteDatabase();
}

main();
