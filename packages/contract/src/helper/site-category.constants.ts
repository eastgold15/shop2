/**
 * 站点配置分类选项
 * 固定的15个工厂/公司名称选项
 */

// ===== 分类枚举 (数据库存储值) =====
export const SITE_CATEGORY_ENUM = {
  FUSHI: "服饰平台",
  FUSHI_FS1: "fushi_fs1",
  FUSHI_FS2: "fushi_fs2",
  FUSHI_FS3: "fushi_fs3",
  FUSHI_FS4: "fushi_fs4",
  GIFT: "礼品平台",
  GIFT_LP1: "gift_lp1",
  GIFT_LP2: "gift_lp2",
  TOY_LP3: "toy_lp3",
  TOY_LP4: "toy_lp4",
  DQ: "鞋子平台",
  DQ_DQ1: "shoes_dq1",
  DQ_DQ2: "shoes_dq2",
  DQ_DQ3: "shoes_dq3",
  DQ_DQ4: "shoes_dq4",
} as const;

// ===== 显示标签映射 =====
export const SITE_CATEGORY_LABELS: Record<SiteCategory, string> = {
  [SITE_CATEGORY_ENUM.FUSHI]: "HUAXIN APPARELCITY MFG GROUP",
  [SITE_CATEGORY_ENUM.FUSHI_FS1]: "裛都服饰（FS1）",
  [SITE_CATEGORY_ENUM.FUSHI_FS2]: "孟加拉华兴（FS2）",
  [SITE_CATEGORY_ENUM.FUSHI_FS3]: "衣之都（FS3）",
  [SITE_CATEGORY_ENUM.FUSHI_FS4]: "仔衣库（FS4）",
  [SITE_CATEGORY_ENUM.GIFT]: "香港环球卡通礼品",
  [SITE_CATEGORY_ENUM.GIFT_LP1]: "佳人礼品（LP1）",
  [SITE_CATEGORY_ENUM.GIFT_LP2]: "佳人礼品(LP2)",
  [SITE_CATEGORY_ENUM.TOY_LP3]: "鼎冠玩具 (LP3)",
  [SITE_CATEGORY_ENUM.TOY_LP4]: "鼎冠玩具(LP4)",
  [SITE_CATEGORY_ENUM.DQ]: "出口商 东祺鞋业",
  [SITE_CATEGORY_ENUM.DQ_DQ1]: "东莞东祺 (DQ1)",
  [SITE_CATEGORY_ENUM.DQ_DQ2]: "东莞东祺 (DQ2)",
  [SITE_CATEGORY_ENUM.DQ_DQ3]: "江西东祺 (DQ3)",
  [SITE_CATEGORY_ENUM.DQ_DQ4]: "品牌 征搏 (DQ4)",
} as const;

// ===== 数组格式 (用于 Select 组件) =====
export const SITE_CATEGORY_OPTIONS = [
  {
    value: SITE_CATEGORY_ENUM.FUSHI,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.FUSHI],
  },
  {
    value: SITE_CATEGORY_ENUM.FUSHI_FS1,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.FUSHI_FS1],
  },
  {
    value: SITE_CATEGORY_ENUM.FUSHI_FS2,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.FUSHI_FS2],
  },
  {
    value: SITE_CATEGORY_ENUM.FUSHI_FS3,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.FUSHI_FS3],
  },
  {
    value: SITE_CATEGORY_ENUM.FUSHI_FS4,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.FUSHI_FS4],
  },
  {
    value: SITE_CATEGORY_ENUM.GIFT,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.GIFT],
  },
  {
    value: SITE_CATEGORY_ENUM.GIFT_LP1,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.GIFT_LP1],
  },
  {
    value: SITE_CATEGORY_ENUM.GIFT_LP2,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.GIFT_LP2],
  },
  {
    value: SITE_CATEGORY_ENUM.TOY_LP3,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.TOY_LP3],
  },
  {
    value: SITE_CATEGORY_ENUM.TOY_LP4,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.TOY_LP4],
  },
  {
    value: SITE_CATEGORY_ENUM.DQ,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.DQ],
  },
  {
    value: SITE_CATEGORY_ENUM.DQ_DQ1,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.DQ_DQ1],
  },
  {
    value: SITE_CATEGORY_ENUM.DQ_DQ2,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.DQ_DQ2],
  },
  {
    value: SITE_CATEGORY_ENUM.DQ_DQ3,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.DQ_DQ3],
  },
  {
    value: SITE_CATEGORY_ENUM.DQ_DQ4,
    label: SITE_CATEGORY_LABELS[SITE_CATEGORY_ENUM.DQ_DQ4],
  },
] as const;

// ===== 类型定义 =====
export type SiteCategory =
  typeof SITE_CATEGORY_ENUM[keyof typeof SITE_CATEGORY_ENUM];
export type SiteCategoryOption = typeof SITE_CATEGORY_OPTIONS[number];
