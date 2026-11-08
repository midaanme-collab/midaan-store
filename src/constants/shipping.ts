/**
 * Centralized Shipping Configuration & Rules
 * Midaan Collective — Aramex Rate Calculator & Shipping Services
 */

import { ShippingQuoteRequest, ShippingQuoteResponse, ShippingServiceOption } from '@/types';

export interface ProductShippingProfile {
  productId: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  // Actual physical measurements — null when unverified to prevent fabricated quotes
  actualPackedWeightKg: number | null;
  packageLengthCm: number | null;
  packageWidthCm: number | null;
  packageHeightCm: number | null;
  packagingType: 'poly_mailer' | 'carton_box';
  isVerified: boolean;
  // Standard test benchmark (used in test/mock mode only)
  testReferenceWeightKg: number;
  testReferenceDimensionsCm: { length: number; width: number; height: number };
}

/**
 * Status of Physical Packaging Measurements:
 * Marked as unverified until warehouse provides physical scale weights and package dimensions.
 */
export const PRODUCT_SHIPPING_PROFILES: Record<string, ProductShippingProfile> = {
  'drop-helmet-white': {
    productId: 'drop-helmet-white',
    slug: 'keffiyeh-helmet-tee',
    titleEn: 'Keffiyeh Helmet Tee — White',
    titleAr: 'تيشيرت خوذة الكوفية — أبيض',
    actualPackedWeightKg: null, // REQUIRED INPUT: To be confirmed by Midaan warehouse
    packageLengthCm: null,      // REQUIRED INPUT
    packageWidthCm: null,       // REQUIRED INPUT
    packageHeightCm: null,      // REQUIRED INPUT
    packagingType: 'poly_mailer',
    isVerified: false,
    testReferenceWeightKg: 0.26,
    testReferenceDimensionsCm: { length: 30, width: 22, height: 2 },
  },
  'drop-poster-white': {
    productId: 'drop-poster-white',
    slug: 'palestine-poster-tee',
    titleEn: 'Palestine Poster Tee — White',
    titleAr: 'تيشيرت بوستر فلسطين — أبيض',
    actualPackedWeightKg: null, // REQUIRED INPUT: To be confirmed by Midaan warehouse
    packageLengthCm: null,      // REQUIRED INPUT
    packageWidthCm: null,       // REQUIRED INPUT
    packageHeightCm: null,      // REQUIRED INPUT
    packagingType: 'poly_mailer',
    isVerified: false,
    testReferenceWeightKg: 0.26,
    testReferenceDimensionsCm: { length: 30, width: 22, height: 2 },
  },
};

/**
 * Official Shipper Origin (Amman, Jordan)
 */
export const SHIPPER_ORIGIN = {
  countryCode: 'JO',
  city: 'Amman',
  entity: 'AMM',
  addressLine1: 'Midaan Operations, Amman, Jordan',
  postalCode: '11118',
} as const;

/**
 * Official Exchange Rate Configuration
 * Source: Central Bank of Jordan (CBJ) Official USD/JOD Fixed Peg
 * Peg: 1 USD = 0.709 JOD | 1 JOD ≈ 1.4104 USD
 */
export const EXCHANGE_RATE_CONFIG = {
  jodToUsd: 1.4104,
  usdToJod: 0.709,
  source: 'Central Bank of Jordan (CBJ) Official Fixed Peg',
  lastVerifiedDate: '2026-11-01',
} as const;

/**
 * Convert between JOD and USD with documented rate
 */
export function convertCurrency(
  amount: number,
  from: 'JOD' | 'USD',
  to: 'JOD' | 'USD'
): { convertedAmount: number; rate: number; timestamp: string; source: string } {
  if (from === to) {
    return {
      convertedAmount: amount,
      rate: 1.0,
      timestamp: EXCHANGE_RATE_CONFIG.lastVerifiedDate,
      source: EXCHANGE_RATE_CONFIG.source,
    };
  }

  const rate = from === 'JOD' ? EXCHANGE_RATE_CONFIG.jodToUsd : EXCHANGE_RATE_CONFIG.usdToJod;
  const rawConverted = amount * rate;
  // Round to two decimal places
  const convertedAmount = Math.round(rawConverted * 100) / 100;

  return {
    convertedAmount,
    rate,
    timestamp: EXCHANGE_RATE_CONFIG.lastVerifiedDate,
    source: EXCHANGE_RATE_CONFIG.source,
  };
}

/**
 * Aramex Dimensional Weight Formula:
 * Volumetric Weight (KG) = (Length (cm) * Width (cm) * Height (cm)) / 5000
 * Chargeable Weight (KG) = Math.max(Actual Weight, Volumetric Weight)
 */
export function calculateChargeableWeight(
  actualWeightKg: number,
  dimensionsCm: { length: number; width: number; height: number }
): {
  actualWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
} {
  const volumetric = (dimensionsCm.length * dimensionsCm.width * dimensionsCm.height) / 5000;
  // Aramex rounds up to nearest 0.5 kg for express rating
  const chargeable = Math.max(actualWeightKg, volumetric);
  return {
    actualWeightKg: Math.round(actualWeightKg * 100) / 100,
    volumetricWeightKg: Math.round(volumetric * 100) / 100,
    chargeableWeightKg: Math.round(chargeable * 100) / 100,
  };
}

/**
 * Package consolidation calculation for cart items
 */
export function calculateConsolidatedPackage(
  items: Array<{ productId: string; quantity: number }>,
  useTestFallbackIfUnverified: boolean = true
): {
  totalPieces: number;
  actualWeightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  chargeableWeightKg: number;
  isVerifiedMeasurements: boolean;
} {
  let totalPieces = 0;
  let totalWeight = 0;
  let allVerified = true;

  for (const item of items) {
    const qty = item.quantity || 1;
    totalPieces += qty;
    const profile = PRODUCT_SHIPPING_PROFILES[item.productId];
    if (!profile || profile.actualPackedWeightKg === null) {
      allVerified = false;
      if (useTestFallbackIfUnverified && profile) {
        totalWeight += profile.testReferenceWeightKg * qty;
      }
    } else {
      totalWeight += profile.actualPackedWeightKg * qty;
    }
  }

  // Package dimensions scale with piece count
  // 1-2 shirts: poly mailer (30 x 22 x 2-4 cm)
  // 3-6 shirts: small/medium box (32 x 24 x 10 cm)
  const length = 32;
  const width = 24;
  const height = Math.min(30, Math.max(2, totalPieces * 2.5));
  const dimensionsCm = { length, width, height };

  const { chargeableWeightKg } = calculateChargeableWeight(totalWeight, dimensionsCm);

  return {
    totalPieces,
    actualWeightKg: Math.round(totalWeight * 100) / 100,
    dimensionsCm,
    chargeableWeightKg: Math.max(0.5, chargeableWeightKg),
    isVerifiedMeasurements: allVerified,
  };
}

/**
 * Customs & Duty Disclaimers (Bilingual)
 */
export const CUSTOMS_DISCLAIMERS = {
  ar: 'تنبيه: الرسوم الجمركية والضرائب المحلية في بلد الوصول غير مشمولة في تكلفة الشحن، وتُدفع من قبل العميل عند الاستلام وفق قوانين الجمارك المحلية.',
  en: 'Notice: Customs duties, import taxes, and destination clearance fees are excluded from this shipping quotation and may be payable separately by the customer upon arrival according to local customs regulations.',
};

/**
 * Supported International Countries List
 */
export interface SupportedCountry {
  code: string;
  nameAr: string;
  nameEn: string;
  requiresPostalCode: boolean;
  currency: 'JOD' | 'USD';
}

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  // Domestic
  { code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan', requiresPostalCode: false, currency: 'JOD' },
  // GCC & Middle East
  { code: 'AE', nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', requiresPostalCode: false, currency: 'USD' },
  { code: 'SA', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', requiresPostalCode: true, currency: 'USD' },
  { code: 'QA', nameAr: 'قطر', nameEn: 'Qatar', requiresPostalCode: false, currency: 'USD' },
  { code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait', requiresPostalCode: false, currency: 'USD' },
  { code: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain', requiresPostalCode: false, currency: 'USD' },
  { code: 'OM', nameAr: 'عُمان', nameEn: 'Oman', requiresPostalCode: true, currency: 'USD' },
  { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt', requiresPostalCode: true, currency: 'USD' },
  { code: 'LB', nameAr: 'لبنان', nameEn: 'Lebanon', requiresPostalCode: false, currency: 'USD' },
  { code: 'IQ', nameAr: 'العراق', nameEn: 'Iraq', requiresPostalCode: false, currency: 'USD' },
  // Europe
  { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', requiresPostalCode: true, currency: 'USD' },
  { code: 'DE', nameAr: 'ألمانيا', nameEn: 'Germany', requiresPostalCode: true, currency: 'USD' },
  { code: 'FR', nameAr: 'فرنسا', nameEn: 'France', requiresPostalCode: true, currency: 'USD' },
  { code: 'IT', nameAr: 'إيطاليا', nameEn: 'Italy', requiresPostalCode: true, currency: 'USD' },
  { code: 'ES', nameAr: 'إسبانيا', nameEn: 'Spain', requiresPostalCode: true, currency: 'USD' },
  { code: 'NL', nameAr: 'هولندا', nameEn: 'Netherlands', requiresPostalCode: true, currency: 'USD' },
  { code: 'SE', nameAr: 'السويد', nameEn: 'Sweden', requiresPostalCode: true, currency: 'USD' },
  { code: 'CH', nameAr: 'سويسرا', nameEn: 'Switzerland', requiresPostalCode: true, currency: 'USD' },
  { code: 'TR', nameAr: 'تركيا', nameEn: 'Turkey', requiresPostalCode: true, currency: 'USD' },
  // Americas
  { code: 'US', nameAr: 'الولايات المتحدة الأمريكية', nameEn: 'United States', requiresPostalCode: true, currency: 'USD' },
  { code: 'CA', nameAr: 'كندا', nameEn: 'Canada', requiresPostalCode: true, currency: 'USD' },
  // Asia-Pacific
  { code: 'AU', nameAr: 'أستراليا', nameEn: 'Australia', requiresPostalCode: true, currency: 'USD' },
  { code: 'MY', nameAr: 'ماليزيا', nameEn: 'Malaysia', requiresPostalCode: true, currency: 'USD' },
  { code: 'SG', nameAr: 'سنغافورة', nameEn: 'Singapore', requiresPostalCode: true, currency: 'USD' },
  { code: 'JP', nameAr: 'اليابان', nameEn: 'Japan', requiresPostalCode: true, currency: 'USD' },
];

/**
 * Jordan Domestic Governorates with Primary Cities
 */
export interface JordanGovernorateArea {
  id: string;
  nameAr: string;
  nameEn: string;
  cities: Array<{ nameAr: string; nameEn: string }>;
  defaultPostalCode: string;
}

export const JORDAN_GOVERNORATE_AREAS: JordanGovernorateArea[] = [
  {
    id: 'amman',
    nameAr: 'العاصمة عمّان',
    nameEn: 'Amman',
    cities: [
      { nameAr: 'عمّان (وسط البلد / جبل عمّان / اللويبده)', nameEn: 'Amman Downtown / Jabal Amman / Weibdeh' },
      { nameAr: 'عبدون / الصويفية / دير غبار', nameEn: 'Abdoun / Sweifieh / Deir Ghbar' },
      { nameAr: 'الشميساني / جبل الحسين', nameEn: 'Shmeisani / Jabal Al-Hussein' },
      { nameAr: 'خلدا / تلاع العلي / أم أذينة', nameEn: 'Khalda / Tlaa Al-Ali / Um Uthaina' },
      { nameAr: 'الجبيهة / شفا بدران / أبو نصير', nameEn: 'Jubaiha / Shafa Badran / Abu Nseir' },
      { nameAr: 'مرج الحمام / البيادر / وادي السير', nameEn: 'Marj Al-Hamam / Bayader / Wadi Al-Seir' },
      { nameAr: 'سحاب / الموقر / القويسمة', nameEn: 'Sahab / Muwaqqar / Qweismeh' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '11118',
  },
  {
    id: 'zarqa',
    nameAr: 'الزرقاء',
    nameEn: 'Zarqa',
    cities: [
      { nameAr: 'الزرقاء المدينة', nameEn: 'Zarqa City' },
      { nameAr: 'الرصيفة', nameEn: 'Russeifa' },
      { nameAr: 'الهاشمية', nameEn: 'Hashemiya' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '13110',
  },
  {
    id: 'irbid',
    nameAr: 'إربد',
    nameEn: 'Irbid',
    cities: [
      { nameAr: 'إربد المدينة', nameEn: 'Irbid City' },
      { nameAr: 'الرمثا', nameEn: 'Ramtha' },
      { nameAr: 'بني عبيد / الحصن', nameEn: 'Bani Obeid / Huson' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '21110',
  },
  {
    id: 'balqa',
    nameAr: 'البلقاء / السلط',
    nameEn: 'Balqa / As-Salt',
    cities: [
      { nameAr: 'السلط', nameEn: 'As-Salt' },
      { nameAr: 'الفحيص / ماحص', nameEn: 'Fuheis / Mahis' },
      { nameAr: 'عين الباشا', nameEn: 'Ain Al-Basha' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '19110',
  },
  {
    id: 'madaba',
    nameAr: 'مأدبا',
    nameEn: 'Madaba',
    cities: [
      { nameAr: 'مأدبا المدينة', nameEn: 'Madaba City' },
      { nameAr: 'ذيبان', nameEn: 'Dhiban' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '17110',
  },
  {
    id: 'jerash',
    nameAr: 'جرش',
    nameEn: 'Jerash',
    cities: [
      { nameAr: 'جرش المدينة', nameEn: 'Jerash City' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '26110',
  },
  {
    id: 'ajloun',
    nameAr: 'عجلون',
    nameEn: 'Ajloun',
    cities: [
      { nameAr: 'عجلون / كفرنجة', nameEn: 'Ajloun / Kufranjah' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '26810',
  },
  {
    id: 'mafraq',
    nameAr: 'المفرق',
    nameEn: 'Mafraq',
    cities: [
      { nameAr: 'المفرق المدينة', nameEn: 'Mafraq City' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '25110',
  },
  {
    id: 'karak',
    nameAr: 'الكرك',
    nameEn: 'Karak',
    cities: [
      { nameAr: 'الكرك المدينة / المزار', nameEn: 'Karak City / Mazar' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '61110',
  },
  {
    id: 'tafilah',
    nameAr: 'الطفيلة',
    nameEn: 'Tafilah',
    cities: [
      { nameAr: 'الطفيلة المدينة', nameEn: 'Tafilah City' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '66110',
  },
  {
    id: 'maan',
    nameAr: 'معان',
    nameEn: "Ma'an",
    cities: [
      { nameAr: 'معان المدينة', nameEn: "Ma'an City" },
      { nameAr: 'وادي موسى / البترا', nameEn: 'Wadi Musa / Petra' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '71110',
  },
  {
    id: 'aqaba',
    nameAr: 'العقبة',
    nameEn: 'Aqaba',
    cities: [
      { nameAr: 'العقبة المدينة', nameEn: 'Aqaba City' },
      { nameAr: 'منطقة أخرى', nameEn: 'Other area' },
    ],
    defaultPostalCode: '77110',
  },
];

/**
 * Deterministic Mock / Simulation Rate Calculator
 * Used when commercial Aramex credentials or physical measurements are awaiting live verification.
 * Adheres strictly to the user instruction:
 * "Use mocked Aramex responses for automated tests. Do not claim a live integration works until valid credentials and real API responses have been tested."
 */
export function calculateMockAramexRate(
  request: ShippingQuoteRequest
): ShippingQuoteResponse {
  const isDomestic = request.destination.countryCode === 'JO';
  const packageInfo = calculateConsolidatedPackage(request.items, true);
  const quoteRef = `MID-SIM-${Date.now().toString(36).toUpperCase()}`;

  const isUsd = request.currency === 'USD';

  let baseFeeJOD = 0;
  let serviceCode = 'OND';
  let serviceNameAr = '';
  let serviceNameEn = '';
  let estimatedDays = '';

  if (isDomestic) {
    const isAmman =
      request.destination.governorateId === 'amman' ||
      /amman|عمان|عمّان/i.test(request.destination.city);
    baseFeeJOD = isAmman ? 2.5 : 3.5;
    serviceCode = 'OND';
    serviceNameAr = 'أرامكس المحلي السريع (الأردن)';
    serviceNameEn = 'Aramex Domestic Express (Jordan)';
    estimatedDays = isAmman ? '1 يوم عمل' : '1 - 2 أيام عمل';
  } else {
    // International Tiered Pricing based on region & chargeable weight
    const code = request.destination.countryCode;
    const weightFactor = Math.max(0.5, Math.ceil(packageInfo.chargeableWeightKg / 0.5) * 0.5);

    if (['AE', 'SA', 'QA', 'KW', 'BH', 'OM'].includes(code)) {
      // GCC
      baseFeeJOD = 12.0 + (weightFactor - 0.5) * 4.0;
      serviceCode = 'PPX';
      serviceNameAr = 'أرامكس إكسبريس الدولي (الخليج العربي)';
      serviceNameEn = 'Aramex Priority Express (GCC)';
      estimatedDays = '2 - 4 أيام عمل';
    } else if (['EG', 'LB', 'IQ'].includes(code)) {
      // Arab World Regional
      baseFeeJOD = 14.0 + (weightFactor - 0.5) * 5.0;
      serviceCode = 'PPX';
      serviceNameAr = 'أرامكس إكسبريس الدولي (الشرق الأوسط)';
      serviceNameEn = 'Aramex Priority Express (Regional)';
      estimatedDays = '3 - 5 أيام عمل';
    } else if (['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'CH', 'TR'].includes(code)) {
      // Europe
      baseFeeJOD = 18.0 + (weightFactor - 0.5) * 6.0;
      serviceCode = 'PPX';
      serviceNameAr = 'أرامكس إكسبريس الدولي (أوروبا)';
      serviceNameEn = 'Aramex Priority Express (Europe)';
      estimatedDays = '4 - 6 أيام عمل';
    } else if (['US', 'CA'].includes(code)) {
      // North America
      baseFeeJOD = 20.0 + (weightFactor - 0.5) * 7.0;
      serviceCode = 'PPX';
      serviceNameAr = 'أرامكس إكسبريس الدولي (أمريكا الشمالية)';
      serviceNameEn = 'Aramex Priority Express (North America)';
      estimatedDays = '5 - 7 أيام عمل';
    } else {
      // Rest of World
      baseFeeJOD = 25.0 + (weightFactor - 0.5) * 8.0;
      serviceCode = 'PPX';
      serviceNameAr = 'أرامكس إكسبريس الدولي (عالمي)';
      serviceNameEn = 'Aramex Priority Express (Global)';
      estimatedDays = '5 - 8 أيام عمل';
    }
  }

  const finalFee = isUsd
    ? Math.round(baseFeeJOD * EXCHANGE_RATE_CONFIG.jodToUsd * 100) / 100
    : Math.round(baseFeeJOD * 100) / 100;

  const option: ShippingServiceOption = {
    serviceCode,
    serviceNameAr,
    serviceNameEn,
    productGroup: isDomestic ? 'DOM' : 'EXP',
    shippingFee: finalFee,
    currency: request.currency,
    estimatedDays,
    chargeableWeightKg: packageInfo.chargeableWeightKg,
    isConfirmed: false, // Mock/simulation is not confirmed by carrier until commercial setup
    customsIncluded: false,
    additionalCharges: 0,
  };

  return {
    success: true,
    mode: 'mock',
    quoteReference: quoteRef,
    timestamp: new Date().toISOString(),
    options: [option],
    selectedOption: option,
    warnings: [
      'حساب الشحن في وضع المحاكاة لاختبار الربط — بانتظار تفعيل حساب أرامكس التجاري المعتمد والمقاسات الفيزيائية النهائية للطرود.',
      'Shipping is running in simulated test mode — awaiting verified commercial Aramex credentials and confirmed garment packaging measurements.',
    ],
    customsDisclaimerAr: CUSTOMS_DISCLAIMERS.ar,
    customsDisclaimerEn: CUSTOMS_DISCLAIMERS.en,
    requiresPhysicalMeasurements: !packageInfo.isVerifiedMeasurements,
  };
}
