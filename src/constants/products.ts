import { Product, GarmentSize } from '@/types';

/**
 * Standardize size codes so XXL and 2XL are treated identically
 */
export function normalizeSize(size: string): GarmentSize {
  const s = size.trim().toUpperCase();
  if (s === 'XXL' || s === '2XL') return '2XL';
  if (s === 'XS') return 'XS';
  if (s === 'S') return 'S';
  if (s === 'M') return 'M';
  if (s === 'L') return 'L';
  if (s === 'XL') return 'XL';
  if (s === '3XL') return '3XL';
  return (s as GarmentSize) || 'L';
}

/**
 * Centralized shared product catalog.
 * Strict inventory matching pre-printed physical stock:
 * - Helmet Tee: S:4, M:5, L:6, XL:2, 2XL:4 (Total: 21)
 * - Poster Tee: S:3, M:1, L:1, XL:8, 2XL:1 (Total: 14)
 */
export const SHARED_PRODUCTS: Product[] = [
  {
    id: 'drop-helmet-white',
    slug: 'keffiyeh-helmet-tee',
    titleEn: 'Keffiyeh Helmet Tee',
    titleAr: 'تيشيرت خوذة الكوفية — الإصدار الأبيض',
    category: 'drops',
    descriptionEn: '100% Bamboo Cotton • Production in Indonesia • DTG Print • Palestine Support',
    descriptionAr: 'قطن خيزران 100% • إنتاج إندونيسيا • طباعة DTG رقمية • دعم فلسطين',
    basePriceJOD: 35.0,
    basePriceUSD: 50.0,
    printSpec: 'DTG_DIRECT_TO_GARMENT',
    images: ['/helmet-back-white.jpg'],
    variants: [
      { id: 'v-hlm-s', sku: 'HLM-W-S', size: 'S', inStock: true, stockCount: 4 },
      { id: 'v-hlm-m', sku: 'HLM-W-M', size: 'M', inStock: true, stockCount: 5 },
      { id: 'v-hlm-l', sku: 'HLM-W-L', size: 'L', inStock: true, stockCount: 6 },
      { id: 'v-hlm-xl', sku: 'HLM-W-XL', size: 'XL', inStock: true, stockCount: 2 },
      { id: 'v-hlm-2xl', sku: 'HLM-W-2XL', size: '2XL', inStock: true, stockCount: 4 },
    ],
    orderToPrintTimeHours: 24,
    isPrePrinted: true,
  },
  {
    id: 'drop-poster-white',
    slug: 'palestine-poster-tee',
    titleEn: 'Palestine Poster Tee',
    titleAr: 'تيشيرت بوستر فلسطين — الإصدار الأبيض',
    category: 'drops',
    descriptionEn: '100% Bamboo Cotton • Production in Indonesia • DTG Print • Palestine Support',
    descriptionAr: 'قطن خيزران 100% • إنتاج إندونيسيا • طباعة DTG رقمية • دعم فلسطين',
    basePriceJOD: 35.0,
    basePriceUSD: 50.0,
    printSpec: 'DTG_DIRECT_TO_GARMENT',
    images: ['/palestine-back-white.jpg'],
    variants: [
      { id: 'v-pst-s', sku: 'PST-W-S', size: 'S', inStock: true, stockCount: 3 },
      { id: 'v-pst-m', sku: 'PST-W-M', size: 'M', inStock: true, stockCount: 1 },
      { id: 'v-pst-l', sku: 'PST-W-L', size: 'L', inStock: true, stockCount: 1 },
      { id: 'v-pst-xl', sku: 'PST-W-XL', size: 'XL', inStock: true, stockCount: 8 },
      { id: 'v-pst-2xl', sku: 'PST-W-2XL', size: '2XL', inStock: true, stockCount: 1 },
    ],
    orderToPrintTimeHours: 24,
    isPrePrinted: true,
  },
];

const HELMET_ALIASES = [
  'drop-helmet-white',
  'drop-helmet-05',
  'keffiyeh-helmet-tee',
  'helmet-white-tee',
  'keffiyeh helmet tee',
  'helmet white tee',
  'keffiyeh helmet heavy tee',
  'تيشيرت خوذة الكوفية — الإصدار الأبيض',
  'تيشيرت الخوذة الأبيض',
  'تيشيرت الخوذة والكوفية الأبيض',
];

const POSTER_ALIASES = [
  'drop-poster-white',
  'drop-poster-06',
  'palestine-poster-tee',
  'poster-white-tee',
  'palestine poster tee',
  'poster white tee',
  'palestine graphic poster tee',
  'تيشيرت بوستر فلسطين — الإصدار الأبيض',
  'تيشيرت البوستر الأبيض',
  'تيشيرت البوستر الجرافيكي الأبيض',
];

export function isHelmetProduct(titleOrId: string = ''): boolean {
  const norm = titleOrId.trim().toLowerCase();
  return HELMET_ALIASES.some(alias => alias.toLowerCase() === norm);
}

export function isPosterProduct(titleOrId: string = ''): boolean {
  const norm = titleOrId.trim().toLowerCase();
  return POSTER_ALIASES.some(alias => alias.toLowerCase() === norm);
}

export function isValidCatalogProduct(titleOrId: string = ''): boolean {
  return isHelmetProduct(titleOrId) || isPosterProduct(titleOrId);
}

export function getMaxStock(titleOrId: string = '', size: string = 'L'): number {
  const normalizedSize = normalizeSize(size);
  if (isHelmetProduct(titleOrId)) {
    if (normalizedSize === 'S') return 4;
    if (normalizedSize === 'M') return 5;
    if (normalizedSize === 'L') return 6;
    if (normalizedSize === 'XL') return 2;
    if (normalizedSize === '2XL') return 4;
    return 4;
  }
  if (isPosterProduct(titleOrId)) {
    if (normalizedSize === 'S') return 3;
    if (normalizedSize === 'M') return 1;
    if (normalizedSize === 'L') return 1;
    if (normalizedSize === 'XL') return 8;
    if (normalizedSize === '2XL') return 1;
    return 1;
  }
  return 10;
}
