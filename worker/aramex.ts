/**
 * Aramex Rate Calculator & Location Service Client
 * Cloudflare Worker Backend Implementation
 */

import {
  SHIPPER_ORIGIN,
  calculateConsolidatedPackage,
  CUSTOMS_DISCLAIMERS,
  SUPPORTED_COUNTRIES,
  calculateMockAramexRate,
} from '../src/constants/shipping';
import { ShippingQuoteRequest, ShippingQuoteResponse, ShippingServiceOption } from '../src/types';

export { calculateMockAramexRate };

export interface AramexEnv {
  ARAMEX_USERNAME?: string;
  ARAMEX_PASSWORD?: string;
  ARAMEX_ACCOUNT_NUMBER?: string;
  ARAMEX_ACCOUNT_PIN?: string;
  ARAMEX_ACCOUNT_ENTITY?: string;
  ARAMEX_ACCOUNT_COUNTRY_CODE?: string;
  ARAMEX_ENV?: 'sandbox' | 'production';
}

const PRODUCTION_ENDPOINT =
  'https://ws.aramex.net/ShippingAPI.V2/RateCalculator/Service_1_0.svc/json/CalculateRate';
const SANDBOX_ENDPOINT =
  'https://ws.dev.aramex.net/ShippingAPI.V2/RateCalculator/Service_1_0.svc/json/CalculateRate';

/**
 * Check if live Aramex credentials are configured in Worker secrets
 */
export function hasLiveAramexCredentials(env: AramexEnv): boolean {
  return Boolean(
    env.ARAMEX_USERNAME &&
    env.ARAMEX_PASSWORD &&
    env.ARAMEX_ACCOUNT_NUMBER &&
    env.ARAMEX_ACCOUNT_PIN
  );
}

/**
 * Sanitize and validate shipping quote request
 */
export function validateShippingQuoteRequest(req: any): {
  valid: boolean;
  error?: string;
  sanitized?: ShippingQuoteRequest;
} {
  if (!req || typeof req !== 'object') {
    return { valid: false, error: 'Invalid request payload' };
  }

  const { destination, items, currency } = req;

  if (!destination || typeof destination !== 'object') {
    return { valid: false, error: 'Missing destination object' };
  }

  const countryCode = (destination.countryCode || '').trim().toUpperCase();
  if (!countryCode || countryCode.length !== 2) {
    return { valid: false, error: 'Invalid ISO 2-letter country code' };
  }

  const city = (destination.city || '').trim();
  if (!city || city.length < 2 || city.length > 80) {
    return { valid: false, error: 'City name must be between 2 and 80 characters' };
  }

  const supportedCountry = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode);
  if (!supportedCountry) {
    return { valid: false, error: `Country ${countryCode} is currently not serviceable` };
  }

  const postalCode = (destination.postalCode || '').trim();
  if (supportedCountry.requiresPostalCode && (!postalCode || postalCode.length < 3)) {
    return {
      valid: false,
      error: `Postal/ZIP code is required for destination ${supportedCountry.nameEn}`,
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'Cart must contain at least one valid item' };
  }

  const sanitizedItems = [];
  for (const item of items) {
    if (!item.productId || typeof item.productId !== 'string') {
      return { valid: false, error: 'Invalid product item format' };
    }
    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 10) {
      return { valid: false, error: 'Item quantity must be between 1 and 10' };
    }
    sanitizedItems.push({
      productId: item.productId,
      productTitle: String(item.productTitle || ''),
      size: String(item.size || 'L'),
      quantity: qty,
    });
  }

  const sanitizedCurrency = currency === 'USD' ? 'USD' : 'JOD';

  return {
    valid: true,
    sanitized: {
      destination: {
        countryCode,
        countryNameAr: supportedCountry.nameAr,
        countryNameEn: supportedCountry.nameEn,
        governorateId: destination.governorateId ? String(destination.governorateId) : undefined,
        city,
        postalCode: postalCode || undefined,
        addressLine1: destination.addressLine1 ? String(destination.addressLine1).slice(0, 150) : undefined,
        phone: destination.phone ? String(destination.phone).slice(0, 25) : undefined,
      },
      items: sanitizedItems,
      currency: sanitizedCurrency,
    },
  };
}

/**
 * Call Live Aramex Rate Calculator API
 */
export async function calculateLiveAramexRate(
  request: ShippingQuoteRequest,
  env: AramexEnv
): Promise<ShippingQuoteResponse> {
  const isDomestic = request.destination.countryCode === 'JO';
  const packageInfo = calculateConsolidatedPackage(request.items, true);
  const endpoint = env.ARAMEX_ENV === 'production' ? PRODUCTION_ENDPOINT : SANDBOX_ENDPOINT;

  const quoteRef = `MID-ARX-${Date.now().toString(36).toUpperCase()}`;

  const aramexPayload = {
    ClientInfo: {
      UserName: env.ARAMEX_USERNAME,
      Password: env.ARAMEX_PASSWORD,
      Version: 'v1.0',
      AccountNumber: env.ARAMEX_ACCOUNT_NUMBER,
      AccountPin: env.ARAMEX_ACCOUNT_PIN,
      AccountEntity: env.ARAMEX_ACCOUNT_ENTITY || SHIPPER_ORIGIN.entity,
      AccountCountryCode: env.ARAMEX_ACCOUNT_COUNTRY_CODE || SHIPPER_ORIGIN.countryCode,
    },
    Transaction: {
      Reference1: quoteRef,
    },
    OriginAddress: {
      CountryCode: SHIPPER_ORIGIN.countryCode,
      City: SHIPPER_ORIGIN.city,
      PostCode: SHIPPER_ORIGIN.postalCode,
    },
    DestinationAddress: {
      CountryCode: request.destination.countryCode,
      City: request.destination.city,
      PostCode: request.destination.postalCode || '',
    },
    ShipmentDetails: {
      PaymentType: 'P',
      ProductGroup: isDomestic ? 'DOM' : 'EXP',
      ProductType: isDomestic ? 'OND' : 'PPX',
      ActualWeight: {
        Value: packageInfo.actualWeightKg,
        Unit: 'KG',
      },
      ChargeableWeight: {
        Value: packageInfo.chargeableWeightKg,
        Unit: 'KG',
      },
      Dimensions: {
        Length: packageInfo.dimensionsCm.length,
        Width: packageInfo.dimensionsCm.width,
        Height: packageInfo.dimensionsCm.height,
        Unit: 'CM',
      },
      NumberOfPieces: packageInfo.totalPieces,
    },
    PreferredCurrencyCode: request.currency,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(aramexPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        success: false,
        mode: 'live',
        quoteReference: quoteRef,
        timestamp: new Date().toISOString(),
        options: [],
        error: `Aramex gateway responded with status ${res.status}`,
        customsDisclaimerAr: CUSTOMS_DISCLAIMERS.ar,
        customsDisclaimerEn: CUSTOMS_DISCLAIMERS.en,
      };
    }

    const data: any = await res.json();

    if (data.HasErrors) {
      const messages = (data.Notifications || []).map((n: any) => n.Message).join(', ');
      return {
        success: false,
        mode: 'live',
        quoteReference: quoteRef,
        timestamp: new Date().toISOString(),
        options: [],
        error: messages || 'Aramex Rate Calculation failed for this destination',
        customsDisclaimerAr: CUSTOMS_DISCLAIMERS.ar,
        customsDisclaimerEn: CUSTOMS_DISCLAIMERS.en,
      };
    }

    const rateVal = data.TotalRate?.Value || 0;
    const rateCur = data.TotalRate?.CurrencyCode || request.currency;

    const serviceOption: ShippingServiceOption = {
      serviceCode: isDomestic ? 'OND' : 'PPX',
      serviceNameAr: isDomestic ? 'أرامكس إكسبريس المحلي (تسليم اليوم التالي)' : 'أرامكس إكسبريس الدولي ذو الأولوية',
      serviceNameEn: isDomestic ? 'Aramex Domestic Priority (Next-Day Delivery)' : 'Aramex Priority Parcel Express (PPX)',
      productGroup: isDomestic ? 'DOM' : 'EXP',
      shippingFee: Math.round(rateVal * 100) / 100,
      currency: rateCur as 'JOD' | 'USD',
      chargeableWeightKg: packageInfo.chargeableWeightKg,
      isConfirmed: true,
      customsIncluded: false,
      estimatedDays: isDomestic ? '1-2 Days' : '3-5 Business Days',
    };

    return {
      success: true,
      mode: 'live',
      quoteReference: quoteRef,
      timestamp: new Date().toISOString(),
      options: [serviceOption],
      selectedOption: serviceOption,
      customsDisclaimerAr: CUSTOMS_DISCLAIMERS.ar,
      customsDisclaimerEn: CUSTOMS_DISCLAIMERS.en,
      requiresPhysicalMeasurements: !packageInfo.isVerifiedMeasurements,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return {
      success: false,
      mode: 'live',
      quoteReference: quoteRef,
      timestamp: new Date().toISOString(),
      options: [],
      error: isTimeout ? 'Aramex API connection timed out (10s)' : 'Network error connecting to Aramex API',
      customsDisclaimerAr: CUSTOMS_DISCLAIMERS.ar,
      customsDisclaimerEn: CUSTOMS_DISCLAIMERS.en,
    };
  }
}

/**
 * Unified request handler for Aramex rate calculation
 */
export async function handleAramexRateCalculation(
  body: any,
  env: AramexEnv
): Promise<ShippingQuoteResponse> {
  const validation = validateShippingQuoteRequest(body);
  if (!validation.valid || !validation.sanitized) {
    return {
      success: false,
      mode: 'mock',
      quoteReference: '',
      timestamp: new Date().toISOString(),
      options: [],
      error: validation.error || 'Invalid request',
      customsDisclaimerAr: CUSTOMS_DISCLAIMERS.ar,
      customsDisclaimerEn: CUSTOMS_DISCLAIMERS.en,
    };
  }

  if (hasLiveAramexCredentials(env)) {
    return await calculateLiveAramexRate(validation.sanitized, env);
  }

  return calculateMockAramexRate(validation.sanitized);
}


