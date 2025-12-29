import { defineRelations } from "drizzle-orm";
import * as schema from "./table.schema";

export const relations = defineRelations(schema, (r) => ({
  // ==========================================
  // 1. 系统核心架构 (Tenants, Depts, Users)
  // ==========================================

  // [租户]：顶层容器
  tenantTable: {
    departments: r.many.departmentTable(), // 一个租户有多个部门
    users: r.many.userTable(),             // 一个租户有多个用户
    sites: r.many.siteTable(),             // 一个租户拥有多个站点
  },

  // [部门]：树形结构
  departmentTable: {
    tenant: r.one.tenantTable({
      from: r.departmentTable.tenantId,
      to: r.tenantTable.id,
    }),
    parent: r.one.departmentTable({
      from: r.departmentTable.parentId,
      to: r.departmentTable.id,
      alias: "dept_hierarchy",
    }),
    childrens: r.many.departmentTable({
      from: r.departmentTable.id,
      to: r.departmentTable.parentId,
      alias: "dept_hierarchy",
    }),
    users: r.many.userTable(),             // 部门下的员工
    site: r.one.siteTable({
      from: r.departmentTable.id,
      to: r.siteTable.boundDeptId
    }),             // 绑定到该部门的站点 (如工厂站)
    // 生产关联
    producedQuotations: r.many.quotationTable(),
  },

  // [用户]：统一身份
  userTable: {
    tenant: r.one.tenantTable({
      from: r.userTable.tenantId,
      to: r.tenantTable.id,
    }),
    department: r.one.departmentTable({
      from: r.userTable.deptId,
      to: r.departmentTable.id,
      alias: "dept_hierarchy",
    }),
    // 权限关联
    // 多对多
    roles: r.many.roleTable({
      from: r.userTable.id.through(r.userRoleTable.userId),
      to: r.roleTable.id.through(r.userRoleTable.roleId),
    }),
    // 业务关联 (创建的数据)
    createdProducts: r.many.productTable(),
  },

  // ==========================================
  // 2. 权限与角色 (RBAC)
  // ==========================================

  roleTable: {
    // 多对多关联：角色 <-> 权限
    permissions: r.many.permissionTable({
      from: r.roleTable.id.through(r.rolePermissionTable.roleId),
      to: r.permissionTable.id.through(r.rolePermissionTable.permissionId),
    }),
  },

  // ==========================================
  // 3. 站点体系 (Sites & Config)
  // ==========================================

  siteTable: {
    tenant: r.one.tenantTable({
      from: r.siteTable.tenantId,
      to: r.tenantTable.id,
    }),
    boundDepartment: r.one.departmentTable({
      from: r.siteTable.boundDeptId,
      to: r.departmentTable.id,
    }),
    // 站点内容
    siteConfig: r.many.siteConfigTable(),
    ads: r.many.adTable(),
    heroCards: r.many.heroCardTable(),
    siteCategories: r.many.siteCategoryTable(),
    siteProducts: r.many.siteProductTable(),
    inquiries: r.many.inquiryTable(),
  },

  siteConfigTable: {
    site: r.one.siteTable({
      from: r.siteConfigTable.siteId,
      to: r.siteTable.id,
    }),
  },

  adTable: {
    site: r.one.siteTable({
      from: r.adTable.siteId,
      to: r.siteTable.id,
    }),
    media: r.one.mediaTable({
      from: r.adTable.mediaId,
      to: r.mediaTable.id,
    }),
    tenant: r.one.tenantTable({
      from: r.adTable.tenantId,
      to: r.tenantTable.id,
    }),
  },

  heroCardTable: {
    site: r.one.siteTable({
      from: r.heroCardTable.siteId,
      to: r.siteTable.id,
    }),
    media: r.one.mediaTable({
      from: r.heroCardTable.mediaId,
      to: r.mediaTable.id,
    }),
  },

  // ==========================================
  // 4. 商品资源中心 (Products, SKU, Media)
  // ==========================================

  // [主分类]
  masterCategoryTable: {
    parent: r.one.masterCategoryTable({
      from: r.masterCategoryTable.parentId,
      to: r.masterCategoryTable.id,
      alias: "parent_category",
    }),
    children: r.many.masterCategoryTable({
      from: r.masterCategoryTable.id,
      to: r.masterCategoryTable.parentId,
      alias: "child_categories",
    }),
    // 关联到商品 (多对多)
    productLinks: r.many.productTable(),
    // 关联到属性模板
    templates: r.many.templateTable(),

  },

  // [站点分类]
  siteCategoryTable: {
    site: r.one.siteTable({
      from: r.siteCategoryTable.siteId,
      to: r.siteTable.id,
    }),

    parent: r.one.siteCategoryTable({
      from: r.siteCategoryTable.parentId,
      to: r.siteCategoryTable.id,
      alias: "parent_site",
    }),
    children: r.many.siteCategoryTable({
      from: r.siteCategoryTable.id,
      to: r.siteCategoryTable.parentId,
      alias: "child_site",
    }),
    productLinks: r.many.productSiteCategoryTable(),
  },

  // [商品主表]
  productTable: {
    // 归属
    tenant: r.one.tenantTable({
      from: r.productTable.tenantId,
      to: r.tenantTable.id,
    }),
    department: r.one.departmentTable({
      from: r.productTable.deptId,
      to: r.departmentTable.id,
    }),
    creator: r.one.userTable({
      from: r.productTable.createdBy,
      to: r.userTable.id,
    }),
    // 关联
    skus: r.many.skuTable(),
    media: r.many.productMediaTable(),
    // template: r.one.productTemplateTable({
    //   from: r.productsTable.templateId,
    //   to: r.productTemplateTable.id,
    // }), // 属性模板
    // 分类关联
    masterCategories: r.many.productMasterCategoryTable(),
    siteCategories: r.many.productSiteCategoryTable(),
    // 站点覆写
    siteOverrides: r.many.siteProductTable(),
  },

  // [SKU]
  skuTable: {
    product: r.one.productTable({
      from: r.skuTable.productId,
      to: r.productTable.id,
    }),
    media: r.many.skuMediaTable(),
    // SKU 关联到业务单据
    inquiries: r.many.inquiryTable(),
    quotation: r.many.quotationTable(),
  },

  // [多对多中间表 - 显式定义以便进行嵌套查询]
  productMasterCategoryTable: {
    product: r.one.productTable({
      from: r.productMasterCategoryTable.productId,
      to: r.productTable.id,
    }),
    category: r.one.masterCategoryTable({
      from: r.productMasterCategoryTable.masterCategoryId,
      to: r.masterCategoryTable.id,
    }),
  },

  productSiteCategoryTable: {
    product: r.one.productTable({
      from: r.productSiteCategoryTable.productId,
      to: r.productTable.id,
    }),
    category: r.one.siteCategoryTable({
      from: r.productSiteCategoryTable.siteCategoryId,
      to: r.siteCategoryTable.id,
    }),
  },

  siteProductTable: {
    site: r.one.siteTable({
      from: r.siteProductTable.siteId,
      to: r.siteTable.id,
    }),
    product: r.one.productTable({
      from: r.siteProductTable.productId,
      to: r.productTable.id,
    }),



  },

  // ==========================================
  // 5. 属性系统 (Attributes)
  // ==========================================

  templateTable: {
    masterCategory: r.one.masterCategoryTable({
      from: r.templateTable.masterCategoryId,
      to: r.masterCategoryTable.id,
    }),
    templateKeys: r.many.templateKeyTable(),
  },

  templateKeyTable: {
    template: r.one.templateTable({
      from: r.templateKeyTable.templateId,
      to: r.templateTable.id,
    }),
    values: r.many.templateValueTable(),
  },

  templateValueTable: {
    templateKey: r.one.templateKeyTable({
      from: r.templateValueTable.templateKeyId,
      to: r.templateKeyTable.id,
    }),
  },

  productTemplateTable: {
    product: r.one.productTable({
      from: r.productTemplateTable.productId,
      to: r.productTable.id,
    }),

    templateKeys: r.many.templateKeyTable(),
  },


  // ==========================================
  // 6. 媒体资源 (Media)
  // ==========================================

  mediaTable: {
    metadata: r.one.mediaMetadataTable(),
    // 反向关联
    productLinks: r.many.productMediaTable(),
    skuLinks: r.many.skuMediaTable(),
    ads: r.one.adTable({
      from: r.mediaTable.id,
      to: r.adTable.mediaId,
    }),
    heroCards: r.one.heroCardTable({
      from: r.mediaTable.id,
      to: r.heroCardTable.mediaId,
    }),
  },

  mediaMetadataTable: {
    media: r.one.mediaTable({
      from: r.mediaMetadataTable.fileId,
      to: r.mediaTable.id,
    }),
    product: r.one.productTable({
      from: r.productTemplateTable.productId,
      to: r.productTable.id,
    }),
    template: r.one.templateTable({
      from: r.productTemplateTable.templateId,
      to: r.templateTable.id,
    }),
  },



  productMediaTable: {
    product: r.one.productTable({
      from: r.productMediaTable.productId,
      to: r.productTable.id,
    }),
    media: r.one.mediaTable({
      from: r.productMediaTable.mediaId,
      to: r.mediaTable.id,
    }),
  },

  skuMediaTable: {
    sku: r.one.skuTable({
      from: r.skuMediaTable.skuId,
      to: r.skuTable.id,
    }),
    media: r.one.mediaTable({
      from: r.skuMediaTable.mediaId,
      to: r.mediaTable.id,
    }),
  },

  // ==========================================
  // 7. 客户与交易 (CRM & Orders)
  // ==========================================

  CustomerTable: {
    tenant: r.one.tenantTable({
      from: r.customerTable.tenantId,
      to: r.tenantTable.id,
    }),
    quotations: r.many.quotationTable(),
  },

  inquiryTable: {
    site: r.one.siteTable({
      from: r.inquiryTable.siteId,
      to: r.siteTable.id,
    }),
    sku: r.one.skuTable({
      from: r.inquiryTable.skuId,
      to: r.skuTable.id,
    }),
  },



  quotationTable: {
    client: r.one.customerTable({
      from: r.quotationTable.clientId,
      to: r.customerTable.id,
    }),
    tenant: r.one.tenantTable({
      from: r.quotationTable.tenantId,
      to: r.tenantTable.id,
    }),
    sku: r.one.skuTable({
      from: r.quotationTable.skuId,
      to: r.skuTable.id,
    }),
  },



  // ==========================================
  // 8. 认证 (Auth Helpers)
  // ==========================================

  accountTable: {
    user: r.one.userTable({
      from: r.accountTable.userId,
      to: r.userTable.id,
    }),
  },

  sessionTable: {
    user: r.one.userTable({
      from: r.sessionTable.userId,
      to: r.userTable.id,
    }),
  },
}));