/**
 * Comprehensive Automated Tests for Live Aramex Shipping Integration
 * Midaan Collective — Domestic Jordan & International Calculator
 */

import {
  calculateChargeableWeight,
  calculateConsolidatedPackage,
  convertCurrency,
  calculateMockAramexRate,
  SUPPORTED_COUNTRIES,
  JORDAN_GOVERNORATE_AREAS,
  EXCHANGE_RATE_CONFIG,
  CUSTOMS_DISCLAIMERS,
  PRODUCT_SHIPPING_PROFILES,
} from '@/constants/shipping';
import { ShippingQuoteRequest } from '@/types';
import { handleAramexRateCalculation } from '../worker/aramex';

describe('1. Currency Conversion & Central Bank of Jordan (CBJ) Peg', () => {
  test('verifies documented official fixed exchange peg', () => {
    expect(EXCHANGE_RATE_CONFIG.jodToUsd).toBe(1.4104);
    expect(EXCHANGE_RATE_CONFIG.usdToJod).toBe(0.709);
    expect(EXCHANGE_RATE_CONFIG.source).toContain('Central Bank of Jordan');
  });

  test('converts JOD to USD accurately with 2 decimal rounding', () => {
    // 35 JOD base shirt price
    const { convertedAmount: priceInUsd } = convertCurrency(35, 'JOD', 'USD');
    // 35 * 1.4104 = 49.364 -> 49.36
    expect(priceInUsd).toBe(49.36);

    // 2.50 JOD Amman shipping
    const { convertedAmount: shippingInUsd } = convertCurrency(2.5, 'JOD', 'USD');
    // 2.5 * 1.4104 = 3.526 -> 3.53
    expect(shippingInUsd).toBe(3.53);
  });

  test('converts USD to JOD accurately with 2 decimal rounding', () => {
    const { convertedAmount: priceInJod } = convertCurrency(50, 'USD', 'JOD');
    // 50 * 0.709 = 35.45
    expect(priceInJod).toBe(35.45);
  });

  test('identity conversion returns exact same amount', () => {
    const resJod = convertCurrency(35, 'JOD', 'JOD');
    expect(resJod.convertedAmount).toBe(35);
    expect(resJod.rate).toBe(1.0);

    const resUsd = convertCurrency(50, 'USD', 'USD');
    expect(resUsd.convertedAmount).toBe(50);
    expect(resUsd.rate).toBe(1.0);
  });
});

describe('2. Physical Packaging, Volumetric Weight & Consolidation', () => {
  test('flags missing physical measurements until warehouse verifies them', () => {
    const helmetProfile = PRODUCT_SHIPPING_PROFILES['drop-helmet-white'];
    const posterProfile = PRODUCT_SHIPPING_PROFILES['drop-poster-white'];

    expect(helmetProfile.actualPackedWeightKg).toBeNull();
    expect(helmetProfile.isVerified).toBe(false);
    expect(posterProfile.actualPackedWeightKg).toBeNull();
    expect(posterProfile.isVerified).toBe(false);

    // Must have test reference benchmarks for testing without fabrication
    expect(helmetProfile.testReferenceWeightKg).toBeGreaterThan(0);
    expect(posterProfile.testReferenceWeightKg).toBeGreaterThan(0);
  });

  test('computes Aramex dimensional volumetric weight: (L * W * H in cm) / 5000', () => {
    // Dimensions: 30 x 20 x 10 cm = 6,000 / 5000 = 1.2 kg
    const { volumetricWeightKg, chargeableWeightKg } = calculateChargeableWeight(0.5, {
      length: 30,
      width: 20,
      height: 10,
    });

    expect(volumetricWeightKg).toBe(1.2);
    // Chargeable weight is max(actual 0.5, volumetric 1.2) = 1.2
    expect(chargeableWeightKg).toBe(1.2);
  });

  test('chooses actual weight when heavier than volumetric weight', () => {
    // Actual weight 2.5 kg, small box 20 x 15 x 5 cm = 1,500 / 5000 = 0.3 kg
    const { volumetricWeightKg, chargeableWeightKg } = calculateChargeableWeight(2.5, {
      length: 20,
      width: 15,
      height: 5,
    });

    expect(volumetricWeightKg).toBe(0.3);
    expect(chargeableWeightKg).toBe(2.5);
  });

  test('consolidates multiple items into single package and scales dimensions', () => {
    const singleItem = calculateConsolidatedPackage([
      { productId: 'drop-helmet-white', quantity: 1 },
    ]);
    expect(singleItem.totalPieces).toBe(1);
    expect(singleItem.chargeableWeightKg).toBeGreaterThanOrEqual(0.5);

    const multipleItems = calculateConsolidatedPackage([
      { productId: 'drop-helmet-white', quantity: 2 },
      { productId: 'drop-poster-white', quantity: 2 },
    ]);
    expect(multipleItems.totalPieces).toBe(4);
    expect(multipleItems.actualWeightKg).toBeCloseTo(singleItem.actualWeightKg * 4, 1);
    expect(multipleItems.dimensionsCm.height).toBeGreaterThan(singleItem.dimensionsCm.height);
  });
});

describe('3. Domestic Jordan Aramex Rate Calculation', () => {
  test('calculates correct rate for Amman delivery (2.50 JOD)', () => {
    const request: ShippingQuoteRequest = {
      destination: {
        countryCode: 'JO',
        countryNameAr: 'الأردن',
        countryNameEn: 'Jordan',
        governorateId: 'amman',
        city: 'عمّان',
      },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Keffiyeh Helmet Tee', size: 'L', quantity: 1 }],
      currency: 'JOD',
    };

    const quote = calculateMockAramexRate(request);
    expect(quote.success).toBe(true);
    expect(quote.options).toHaveLength(1);

    const option = quote.selectedOption!;
    expect(option.serviceCode).toBe('OND');
    expect(option.productGroup).toBe('DOM');
    expect(option.shippingFee).toBe(2.5);
    expect(option.currency).toBe('JOD');
    expect(option.additionalCharges).toBe(0);
  });

  test('calculates correct rate for other Jordan governorates (3.50 JOD)', () => {
    const otherGovernorates = ['zarqa', 'irbid', 'aqaba', 'karak'];

    for (const govId of otherGovernorates) {
      const request: ShippingQuoteRequest = {
        destination: {
          countryCode: 'JO',
          countryNameAr: 'الأردن',
          countryNameEn: 'Jordan',
          governorateId: govId,
          city: govId,
        },
        items: [{ productId: 'drop-helmet-white', productTitle: 'Keffiyeh Helmet Tee', size: 'M', quantity: 1 }],
        currency: 'JOD',
      };

      const quote = calculateMockAramexRate(request);
      expect(quote.selectedOption!.shippingFee).toBe(3.5);
      expect(quote.selectedOption!.serviceCode).toBe('OND');
    }
  });

  test('converts domestic rate to USD when currency is USD', () => {
    const request: ShippingQuoteRequest = {
      destination: {
        countryCode: 'JO',
        countryNameAr: 'الأردن',
        countryNameEn: 'Jordan',
        governorateId: 'amman',
        city: 'عمّان',
      },
      items: [{ productId: 'drop-poster-white', productTitle: 'Palestine Poster Tee', size: 'XL', quantity: 1 }],
      currency: 'USD',
    };

    const quote = calculateMockAramexRate(request);
    // 2.5 JOD * 1.4104 = 3.53 USD
    expect(quote.selectedOption!.shippingFee).toBe(3.53);
    expect(quote.selectedOption!.currency).toBe('USD');
  });
});

describe('4. International Express Aramex Rate Calculation', () => {
  test('calculates GCC international rate (e.g. UAE, Saudi Arabia, Qatar)', () => {
    const request: ShippingQuoteRequest = {
      destination: {
        countryCode: 'AE',
        countryNameAr: 'الإمارات العربية المتحدة',
        countryNameEn: 'United Arab Emirates',
        city: 'Dubai',
      },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Keffiyeh Helmet Tee', size: 'L', quantity: 1 }],
      currency: 'USD',
    };

    const quote = calculateMockAramexRate(request);
    expect(quote.success).toBe(true);
    const option = quote.selectedOption!;
    expect(option.productGroup).toBe('EXP');
    expect(option.serviceCode).toBe('PPX');
    expect(option.shippingFee).toBeGreaterThan(15);
    expect(option.currency).toBe('USD');
  });

  test('calculates North America international rate (US, Canada)', () => {
    const request: ShippingQuoteRequest = {
      destination: {
        countryCode: 'US',
        countryNameAr: 'الولايات المتحدة الأمريكية',
        countryNameEn: 'United States',
        city: 'New York',
        postalCode: '10001',
      },
      items: [{ productId: 'drop-poster-white', productTitle: 'Palestine Poster Tee', size: 'S', quantity: 1 }],
      currency: 'USD',
    };

    const quote = calculateMockAramexRate(request);
    expect(quote.success).toBe(true);
    const option = quote.selectedOption!;
    expect(option.productGroup).toBe('EXP');
    // US base fee in JOD is 20 -> converted to USD
    expect(option.shippingFee).toBeCloseTo(20 * 1.4104, 1);
  });

  test('calculates Europe international rate (UK, Germany)', () => {
    const request: ShippingQuoteRequest = {
      destination: {
        countryCode: 'GB',
        countryNameAr: 'المملكة المتحدة',
        countryNameEn: 'United Kingdom',
        city: 'London',
        postalCode: 'EC1A 1BB',
      },
      items: [{ productId: 'drop-poster-white', productTitle: 'Palestine Poster Tee', size: 'M', quantity: 1 }],
      currency: 'USD',
    };

    const quote = calculateMockAramexRate(request);
    expect(quote.success).toBe(true);
    const option = quote.selectedOption!;
    expect(option.productGroup).toBe('EXP');
    expect(option.shippingFee).toBeCloseTo(18 * 1.4104, 1);
  });

  test('weight tier increases shipping fee when quantity increases', () => {
    const singleShirtReq: ShippingQuoteRequest = {
      destination: {
        countryCode: 'DE',
        countryNameAr: 'ألمانيا',
        countryNameEn: 'Germany',
        city: 'Berlin',
        postalCode: '10115',
      },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Keffiyeh Helmet Tee', size: 'L', quantity: 1 }],
      currency: 'USD',
    };

    const sixShirtsReq: ShippingQuoteRequest = {
      ...singleShirtReq,
      items: [{ productId: 'drop-helmet-white', productTitle: 'Keffiyeh Helmet Tee', size: 'L', quantity: 6 }],
    };

    const singleQuote = calculateMockAramexRate(singleShirtReq);
    const multiQuote = calculateMockAramexRate(sixShirtsReq);

    expect(multiQuote.selectedOption!.shippingFee).toBeGreaterThan(singleQuote.selectedOption!.shippingFee);
    expect(multiQuote.selectedOption!.chargeableWeightKg).toBeGreaterThan(singleQuote.selectedOption!.chargeableWeightKg);
  });
});

describe('5. Customs & Regulatory Disclaimers', () => {
  test('includes explicit customs disclaimers in both Arabic and English', () => {
    expect(CUSTOMS_DISCLAIMERS.ar).toContain('الرسوم الجمركية');
    expect(CUSTOMS_DISCLAIMERS.ar).toContain('غير مشمولة');
    expect(CUSTOMS_DISCLAIMERS.en).toContain('Customs duties, import taxes');
    expect(CUSTOMS_DISCLAIMERS.en).toContain('excluded');

    const quote = calculateMockAramexRate({
      destination: { countryCode: 'FR', countryNameAr: 'فرنسا', countryNameEn: 'France', city: 'Paris', postalCode: '75001' },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Tee', size: 'L', quantity: 1 }],
      currency: 'USD',
    });

    expect(quote.customsDisclaimerAr).toBe(CUSTOMS_DISCLAIMERS.ar);
    expect(quote.customsDisclaimerEn).toBe(CUSTOMS_DISCLAIMERS.en);
  });
});

describe('6. Server-Side Request Validation & Security (Worker API)', () => {
  test('rejects request with missing or empty items', async () => {
    const invalidRequest = {
      destination: { countryCode: 'JO', countryNameAr: 'الأردن', countryNameEn: 'Jordan', city: 'Amman' },
      items: [],
      currency: 'JOD' as const,
    };

    const result = await handleAramexRateCalculation(invalidRequest, {});
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('rejects request with missing country code', async () => {
    const invalidRequest = {
      destination: { countryCode: '', countryNameAr: '', countryNameEn: '', city: 'Amman' },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Tee', size: 'L', quantity: 1 }],
      currency: 'JOD' as const,
    };

    const result = await handleAramexRateCalculation(invalidRequest, {});
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('validates required postal code for countries that require postal code', async () => {
    const missingPostalRequest = {
      destination: { countryCode: 'US', countryNameAr: 'أمريكا', countryNameEn: 'USA', city: 'New York', postalCode: '' },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Tee', size: 'L', quantity: 1 }],
      currency: 'USD' as const,
    };

    const result = await handleAramexRateCalculation(missingPostalRequest, {});
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/postal.*code/i);
  });

  test('rejects unsupported countries gracefully', async () => {
    const unsupportedCountryRequest = {
      destination: { countryCode: 'ZZ', countryNameAr: 'Unknown', countryNameEn: 'Unknown', city: 'Nowhere' },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Tee', size: 'L', quantity: 1 }],
      currency: 'USD' as const,
    };

    const result = await handleAramexRateCalculation(unsupportedCountryRequest, {});
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not serviceable/i);
  });

  test('when credentials are not set, falls back safely to mock calculation with simulation status and warnings', async () => {
    const validRequest = {
      destination: { countryCode: 'JO', countryNameAr: 'الأردن', countryNameEn: 'Jordan', governorateId: 'amman', city: 'عمّان' },
      items: [{ productId: 'drop-helmet-white', productTitle: 'Tee', size: 'L', quantity: 1 }],
      currency: 'JOD' as const,
    };

    // Empty env: no credentials
    const result = await handleAramexRateCalculation(validRequest, {});
    expect(result.success).toBe(true);
    expect(result.mode).toBe('mock');
    expect(result.warnings).toBeDefined();
    expect(result.warnings!.length).toBeGreaterThan(0);
    // Credentials must never appear in response
    expect(JSON.stringify(result)).not.toContain('ARAMEX_PASSWORD');
    expect(JSON.stringify(result)).not.toContain('ARAMEX_ACCOUNT_PIN');
  });
});

describe('7. Data Reference Lists', () => {
  test('all supported countries have bilingual names and valid ISO codes', () => {
    expect(SUPPORTED_COUNTRIES.length).toBeGreaterThanOrEqual(15);
    for (const country of SUPPORTED_COUNTRIES) {
      expect(country.code).toMatch(/^[A-Z]{2}$/);
      expect(country.nameAr.length).toBeGreaterThan(0);
      expect(country.nameEn.length).toBeGreaterThan(0);
    }
  });

  test('all Jordan governorates have valid cities and default postal codes', () => {
    expect(JORDAN_GOVERNORATE_AREAS.length).toBe(12);
    for (const gov of JORDAN_GOVERNORATE_AREAS) {
      expect(gov.id).toBeDefined();
      expect(gov.nameAr).toBeDefined();
      expect(gov.nameEn).toBeDefined();
      expect(gov.cities.length).toBeGreaterThan(0);
      expect(gov.defaultPostalCode).toMatch(/^\d{5}$/);
    }
  });
});
