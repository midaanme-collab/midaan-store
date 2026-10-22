import { SIZES } from '@/constants';

export type Language = 'ar' | 'en';

export type GarmentType = 'tshirt' | 'hoodie' | 'tote';
export type GarmentColor = 'black' | 'offwhite' | 'charcoal';
export type GarmentView = 'front' | 'back';
export type GarmentSize = typeof SIZES[number];
export type PrintPlacement = 'center' | 'small_corpo';
export type ArtMode = 'presets' | 'text' | 'upload';
export type PresetArt = 'calligraphy' | 'press' | 'far3i';

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
  previewImage?: string; // Optional snapshot for the cart
  customText?: string;
  selectedPreset?: PresetArt;
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
  printSpec: string;
  images: string[];
  variants: ProductVariant[];
  isCollab?: boolean;
  collabArtist?: string;
  orderToPrintTimeHours: number;
}
