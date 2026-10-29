import { SIZES } from '@/constants';

export type Language = 'ar' | 'en';

export type GarmentType = 'tshirt' | 'hoodie' | 'tote';
export type GarmentColor = 'black' | 'offwhite' | 'charcoal';
export type GarmentView = 'front' | 'back';
export type GarmentSize = typeof SIZES[number];
export type PrintPlacement = 'center' | 'small_corpo' | 'back';
export type ArtMode = 'presets' | 'text' | 'upload';
export type PresetArt = 'calligraphy' | 'press' | 'far3i' | 'archive_1' | 'archive_2' | 'archive_3';

export type TextColor = 'white' | '#D80032' | '#E5E0D0' | 'black';
export type TextFont = 'sans' | 'serif' | 'mono';
export type PaymentMethod = 'cliq' | 'cod';

export interface CartItem {
  id: string;
  garment: GarmentType;
  color: GarmentColor;
  size: GarmentSize;
  placement: PrintPlacement;
  artMode: ArtMode;
  price: number;
  priceUSD?: number;
  previewImage?: string;
  customText?: string;
  selectedPreset?: PresetArt;
  isPrePrinted?: boolean;
  productTitle?: string;
  quantity?: number;
}

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
  category: string;
  descriptionEn: string;
  descriptionAr: string;
  basePriceJOD: number;
  basePriceUSD?: number;
  printSpec: string;
  images: string[];
  variants: ProductVariant[];
  isCollab?: boolean;
  collabArtist?: string;
  orderToPrintTimeHours: number;
  isPrePrinted?: boolean;
  backPrintOnly?: boolean;
}
