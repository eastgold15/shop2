重构完成总结
我已经成功按照正确的架构重构了 packages/contract/src/table.schema.ts 文件。以下是完成的工作：
1. 拆分 tenantCols 为三个独立对象
✅ standardCols（标准版）
用于：Product、SKU、MasterCategory、Customer、Media 等核心业务表
特点：只包含物理归属（tenantId、deptId、createdBy、isPublic）
目的：确保资产可以在多个站点间复用
✅ siteScopedCols（站点专用版）
用于：HeroCard、Ad 等网站内容表
特点：继承标准版，额外强制绑定 siteId（notNull）
目的：这些表的数据是"网站装修"的一部分，必须属于某个特定站点
✅ trackingCols（追踪专用版）
用于：Inquiry、Quotation 等交易/行为数据表
特点：继承标准版，SiteId 为必选字段
目的：用于记录来源站点，订单可能是线下录入的
2. 更新所有业务表使用正确的辅助对象
表名	使用的辅助对象	说明
mediaTable	standardCols	媒体文件是核心资产，可跨站点复用
adTable	siteScopedCols	广告是网站内容，必须属于特定站点
heroCardTable	siteScopedCols	轮播图是网站内容，必须属于特定站点
productTable	standardCols	商品是核心资产，可跨站点复用
skuTable	standardCols	SKU 是核心资产，可跨站点复用
customerTable	standardCols	客户是核心资产，可跨站点复用
inquiryTable	trackingCols	询盘是交易数据，SiteId 记录来源
quotationTable	trackingCols	报价是交易数据，SiteId 记录来源
skuMediaTable	仅 tenantId	关联表只需要租户隔离
4. 架构优势
重构后的架构实现了：
资产复用：商品、SKU、媒体等核心资产不再绑定到特定站点，可以被多个站点共享
数据隔离：通过 tenantId 和 deptId 实现租户和部门级别的数据隔离

