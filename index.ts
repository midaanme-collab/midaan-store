export type Language = 'ar' | 'en';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  inStock: boolean;
  stockCount: number;
}

export interface Product {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  category: 'drops' | 'collabs' | 'core' | 'lifestyle';
  descriptionEn: string;
  descriptionAr: string;
  basePriceJOD: number;
  printSpec: string;
  images: string[];
  variants: ProductVariant[];
  isCollab?: boolean;
  collabArtist?: string;
  orderToPrintTimeHours: number;
}
