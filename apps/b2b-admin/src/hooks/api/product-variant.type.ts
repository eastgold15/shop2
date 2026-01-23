export interface ProductVariantMediaRes {
  productId: string;
  colorAttributeKey: string;
  variantMedia: VariantMedia[];
}
interface VariantMedia {
  attributeValueId: string;
  attributeValue: string;
  images: Image[];
}
interface Image {
  id: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
  mediaType: string;
}
