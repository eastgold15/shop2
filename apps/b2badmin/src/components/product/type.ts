
export interface Product {
  id: string;
  name: string;
  spuCode: string;
  description: string;
  status: number;
  units: string;
  createdAt: string;
  updatedAt: string;
  sitePrice: string;
  siteName: string;
  siteDescription: string;
  siteCategoryId: string;
  templateId: string;
  mediaIds: any[];
  videoIds: any[];
  images: any[];
  videos: any[];
  mainImage?: any;
  mainImageId?: any;
  skus: Sku[];
  skuCount: number;
}
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
}
interface SpecJson {
  color: string;
  size: string;
}