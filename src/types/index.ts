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
export type PolicyTab = 'shipping' | 'returns' | 'privacy' | 'contact';

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
  productId?: string;
  productTitle?: string;
  productTitleAr?: string;
  productTitleEn?: string;
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

export interface ShippingDestination {
  countryCode: string;
  countryNameAr: string;
  countryNameEn: string;
  governorateId?: string;
  city: string;
  customArea?: string;
  postalCode?: string;
  addressLine1?: string;
  customerName?: string;
  phone?: string;
  domesticGovernorateId?: string;
  domesticCity?: string;
  domesticCustomArea?: string;
  domesticAddressLine1?: string;
  internationalCountryCode?: string;
  internationalCity?: string;
  internationalPostalCode?: string;
  internationalAddressLine1?: string;
}

export interface ShippingQuoteRequestItem {
  productId: string;
  productTitle: string;
  size: string;
  quantity: number;
}

export interface ShippingQuoteRequest {
  destination: ShippingDestination;
  items: ShippingQuoteRequestItem[];
  currency: 'JOD' | 'USD';
}

export interface ShippingServiceOption {
  serviceCode: string;
  serviceNameAr: string;
  serviceNameEn: string;
  productGroup: 'DOM' | 'EXP';
  shippingFee: number;
  currency: 'JOD' | 'USD';
  estimatedDays?: string;
  estimatedDeliveryDate?: string;
  chargeableWeightKg: number;
  isConfirmed: boolean;
  additionalCharges?: number;
  customsIncluded: boolean;
}

export interface ShippingQuoteResponse {
  success: boolean;
  mode: 'live' | 'mock';
  quoteReference: string;
  timestamp: string;
  options: ShippingServiceOption[];
  selectedOption?: ShippingServiceOption;
  warnings?: string[];
  error?: string;
  customsDisclaimerAr: string;
  customsDisclaimerEn: string;
  requiresPhysicalMeasurements?: boolean;
}

export interface CrmOrderPayload {
  orderId: string;
  customerName: string;
  phone: string;
  deliveryScope: string;
  countryOrGov: string;
  cityOrArea: string;
  address: string;
  itemsSummary: string;
  productIds: string;
  sizes: string;
  totalQty: number;
  currency: 'JOD' | 'USD';
  subtotal: number;
  deliveryFee: string;
  grandTotal: number;
  paymentMethod: string;
  audienceTag: string;
  notes: string;
}
