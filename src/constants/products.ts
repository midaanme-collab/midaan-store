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
 * Single Arabic currency formatter for JOD amounts:
 * Formats numbers using Eastern Arabic numerals (٠-٩) and Arabic decimal separator (٫).
 * Integer amounts format without decimals: 35 -> "٣٥ د.أ"
 * Fractional amounts format with two decimals: 2.5 -> "٢٫٥٠ د.أ", 37.5 -> "٣٧٫٥٠ د.أ"
 */
export function formatArabicJod(amount: number): string {
  const isWhole = (amount % 1 === 0);
  const numStr = isWhole ? amount.toFixed(0) : amount.toFixed(2);
  const easternDigits: Record<string, string> = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩',
    '.': '٫',
  };
  const arabicNum = numStr.split('').map(ch => easternDigits[ch] || ch).join('');
  return `${arabicNum} د.أ`;
}

/**
 * Helper to display product prices consistently:
 * Fixed 35 JOD (Arabic: ٣٥ د.أ) / 50 USD independently of language.
 */
export function formatProductPrice(currency: 'JOD' | 'USD', lang: 'ar' | 'en'): string {
  if (currency === 'USD') {
    return '50 USD';
  }
  if (lang === 'ar') {
    return formatArabicJod(35);
  }
  return '35 JOD';
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
    titleEn: 'Keffiyeh Helmet Tee — White',
    titleAr: 'تيشيرت خوذة الكوفية — أبيض',
    category: 'drops',
    descriptionEn: 'Made in Indonesia • Direct-to-Garment (DTG) Print',
    descriptionAr: 'صنع في إندونيسيا • طباعة مباشرة على القماش (DTG)',
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
    titleEn: 'Palestine Poster Tee — White',
    titleAr: 'تيشيرت بوستر فلسطين — أبيض',
    category: 'drops',
    descriptionEn: 'Made in Indonesia • Direct-to-Garment (DTG) Print',
    descriptionAr: 'صنع في إندونيسيا • طباعة مباشرة على القماش (DTG)',
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
  'keffiyeh helmet tee — white',
  'helmet white tee',
  'keffiyeh helmet heavy tee',
  'تيشيرت خوذة الكوفية — أبيض',
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
  'palestine poster tee — white',
  'poster white tee',
  'palestine graphic poster tee',
  'تيشيرت بوستر فلسطين — أبيض',
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

/**
 * Maps legacy product IDs (e.g. drop-helmet-05, drop-poster-06) to canonical catalog products.
 * Normalizes size (XXL -> 2XL) and clamps initial quantity to stock limits.
 */
export function migrateLegacyCartItem(rawItem: any): any | null {
  if (!rawItem) return null;

  const rawId = String(rawItem.id || rawItem.productId || rawItem.slug || '').trim();
  const rawTitle = String(rawItem.productTitle || rawItem.title || rawItem.productTitleAr || '').trim();
  const rawSize = String(rawItem.size || 'L').trim();

  let isHelmet = 
    rawId === 'drop-helmet-05' ||
    rawId.startsWith('drop-helmet-05') ||
    isHelmetProduct(rawId) ||
    isHelmetProduct(rawTitle);

  let isPoster = 
    rawId === 'drop-poster-06' ||
    rawId.startsWith('drop-poster-06') ||
    isPosterProduct(rawId) ||
    isPosterProduct(rawTitle);

  if (!isHelmet && !isPoster) {
    return null; // Unknown / retired product safely discarded
  }

  const catalogId = isHelmet ? 'drop-helmet-white' : 'drop-poster-white';
  const normSize = normalizeSize(rawSize);
  const maxStock = getMaxStock(catalogId, normSize);

  let qty = parseInt(String(rawItem.quantity || 1), 10);
  if (isNaN(qty) || qty < 1) qty = 1;

  const titleAr = isHelmet 
    ? 'تيشيرت خوذة الكوفية — أبيض' 
    : 'تيشيرت بوستر فلسطين — أبيض';
  const titleEn = isHelmet 
    ? 'Keffiyeh Helmet Tee — White' 
    : 'Palestine Poster Tee — White';

  return {
    ...rawItem,
    id: `${catalogId}-${normSize}`,
    productId: catalogId,
    productTitle: titleAr,
    productTitleAr: titleAr,
    productTitleEn: titleEn,
    size: normSize,
    quantity: Math.min(qty, maxStock),
    price: 35.0,
    priceUSD: 50.0,
    garment: 'tshirt',
    color: 'offwhite',
    isPrePrinted: true,
  };
}

/**
 * Migrates a whole cart array: maps legacy IDs, normalizes XXL/2XL,
 * merges duplicates by canonical item ID, and strictly enforces max stock.
 */
export function migrateCart(rawCart: any[]): any[] {
  if (!Array.isArray(rawCart)) return [];

  const merged = new Map<string, any>();

  for (const raw of rawCart) {
    const migrated = migrateLegacyCartItem(raw);
    if (!migrated) continue;

    const key = migrated.id; // e.g. drop-helmet-white-2XL
    const maxStock = getMaxStock(migrated.productId || migrated.productTitle, migrated.size);

    if (merged.has(key)) {
      const existing = merged.get(key);
      const combinedQty = Math.min((existing.quantity || 1) + (migrated.quantity || 1), maxStock);
      merged.set(key, {
        ...existing,
        ...migrated,
        quantity: combinedQty,
      });
    } else {
      merged.set(key, {
        ...migrated,
        quantity: Math.min(migrated.quantity || 1, maxStock),
      });
    }
  }

  return Array.from(merged.values());
}
