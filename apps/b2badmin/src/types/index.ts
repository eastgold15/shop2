
export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "richtext";




export interface MediaAsset {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
  tags: string[];
}

export interface SkuVariant {
  id: string;
  skuCode: string;
  specs: Record<string, string>; // e.g. { color: 'Red', size: '42' }
  price: number;
  stock: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  contactPerson: string;
}



export interface User {
  id: string;
  name: string;
  role: "admin" | "factory_admin" | "sales";
  avatar: string;
}
