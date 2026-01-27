export interface SiteCategoryDetailRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  parentId?: any;
  sortOrder: number;
  siteId: string;
  description?: string;
  masterCategoryId?: string;
  url?: string;
}





// 获取分类下的商品列表
export type SiteCategoryProductRes = {
  id: string;
  displayName: string;
  displayDesc: string;
  mainMedia: string;
  minPrice: string;
  spuCode: string;
  isFeatured: boolean | null;
}