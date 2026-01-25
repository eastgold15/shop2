export interface SiteConfigRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  key: string;
  value: string;
  description: string;
  category: string;
  url: string;
  translatable: boolean;
  visible: boolean;
  siteId: string;
}
