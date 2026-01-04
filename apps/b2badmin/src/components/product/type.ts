/**
 * 媒体文件类型
 */
export interface Media {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  mediaType: string;
  thumbnailUrl: string | null;
  isMain: boolean;
  sortOrder: number;
}

/**
 * SKU 规格信息（动态键值对）
 */
export interface SpecJson {
  [key: string]: string;
}

/**
 * SKU 实体
 */
export interface Sku {
  id: string;
  productId: string;
  skuCode: string;
  price: string;
  marketPrice: string;
  costPrice: string;
  stock: string;
  specJson: SpecJson;
  status: number;
  /** SKU 关联的媒体文件 */
  media: Media[];
}

/**
 * 商品实体
 */
export interface Product {
  id: string;
  name: string;
  spuCode: string;
  description: string;
  status: number;
  units: string;
  createdAt: string;
  updatedAt: string;
  /** 站点自定义价格 */
  sitePrice: string;
  /** 站点自定义名称 */
  siteName: string;
  /** 站点自定义描述 */
  siteDescription: string;
  /** 站点分类 ID */
  siteCategoryId: string;
  /** 模板 ID */
  templateId: string | null;
  /** 图片媒体 ID 列表 */
  mediaIds: string[];
  /** 视频媒体 ID 列表 */
  videoIds: string[];
  /** 图片列表（用于展示） */
  images: Media[];
  /** 视频列表（用于展示） */
  videos: Media[];
  /** 主图 URL */
  mainImage: string | null;
  /** 主图 ID */
  mainImageId: string | null;
  /** SKU 列表 */
  skus: Sku[];
  /** SKU 数量 */
  skuCount: number;
  /** 原始价格（查询时返回的参考价格） */
  price: string;
  /** 是否有自定义价格（集团站点用） */
  hasCustomPrice: boolean;
}