import { CrmOrderPayload } from '@/types';

export const DEFAULT_CRM_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyRWThRWC-w1-NXoSUDcSZV7Zbklt26bP9oRZXySmWiBnsnrcYza19VRrDxtsT6KEzU/exec';

export const CRM_WEBHOOK_URL =
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL)
    ? process.env.NEXT_PUBLIC_CRM_WEBHOOK_URL
    : DEFAULT_CRM_WEBHOOK_URL;

export const UTM_STORAGE_KEY = 'midaan_utm_params';

/**
 * Captures UTM marketing parameters and Meta click ID (fbclid) from current URL into sessionStorage.
 */
export function captureUtmParams(customSearch?: string): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    const searchStr = customSearch !== undefined ? customSearch : (window.location ? window.location.search : '');
    const urlParams = new URLSearchParams(searchStr);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
    const captured: Record<string, string> = {};

    utmKeys.forEach((key) => {
      const val = urlParams.get(key);
      if (val) {
        captured[key] = val.trim();
      }
    });

    if (Object.keys(captured).length > 0) {
      const existingStr = window.sessionStorage.getItem(UTM_STORAGE_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : {};
      const merged = { ...existing, ...captured };
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    // Fail silently without interrupting user experience
  }
}

/**
 * Retrieves a compact, sanitized summary of captured UTM parameters for CRM logging.
 */
export function getCapturedUtmSummary(): string {
  if (typeof window === 'undefined' || !window.sessionStorage) return '';
  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!stored) return '';
    const parsed = JSON.parse(stored) as Record<string, string>;
    const parts: string[] = [];
    if (parsed.utm_source) parts.push(`src:${parsed.utm_source}`);
    if (parsed.utm_medium) parts.push(`med:${parsed.utm_medium}`);
    if (parsed.utm_campaign) parts.push(`cmp:${parsed.utm_campaign}`);
    if (parsed.utm_content) parts.push(`cnt:${parsed.utm_content}`);
    if (parsed.fbclid) parts.push(`fbclid:${parsed.fbclid.slice(0, 16)}`);
    return parts.join(' | ');
  } catch {
    return '';
  }
}

/**
 * Strips control characters, spreadsheet formula-injection prefixes (^[=+\-@ \t\r]+),
 * and enforces strict maximum length limits on user-supplied fields.
 */
export function sanitizeCrmField(input: string | null | undefined, maxLength: number): string {
  if (!input || typeof input !== 'string') return '';
  // Strip control characters (ASCII 0x00 - 0x1F, and 0x7F)
  let clean = input.replace(/[\x00-\x1F\x7F]/g, '');
  // Strip leading spreadsheet formula injection characters (=, +, -, @, \t, \r, space)
  clean = clean.replace(/^[=+\-@\t\r ]+/, '');
  clean = clean.trim();
  if (clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  return clean;
}

/**
 * Generates a unique order identifier for tracking and CRM logging.
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${randomSuffix}`;
}

/**
 * Fires a non-blocking POST request to the Google Workspace Orders CRM Web App.
 * Uses keepalive: true and mode: 'no-cors' with Content-Type: text/plain;charset=utf-8
 * to ensure delivery even if the browser immediately navigates or opens WhatsApp.
 * Automatically sanitizes user-supplied fields to prevent formula injection and truncation bugs.
 */
export function sendOrderToCrm(payload: CrmOrderPayload): void {
  try {
    let finalNotes = payload.notes || '';
    const utmSummary = getCapturedUtmSummary();
    if (utmSummary && !finalNotes.includes(utmSummary)) {
      finalNotes = finalNotes ? `${finalNotes} [UTM: ${utmSummary}]` : `[UTM: ${utmSummary}]`;
    }

    const customerName = sanitizeCrmField(payload.customerName, 80);
    const phone = sanitizeCrmField(payload.phone, 25);
    const address = sanitizeCrmField(payload.address, 200);
    const cityOrArea = sanitizeCrmField(payload.cityOrArea, 100);
    const notes = sanitizeCrmField(finalNotes, 250);

    const sheetPayload: Record<string, any> = {
      // Exact Orders_CRM Sheet Columns:
      Order_ID: payload.orderId,
      Timestamp: new Date().toISOString(),
      Customer_Name: customerName,
      Phone_WhatsApp: phone,
      Delivery_Scope: payload.deliveryScope,
      Country_or_Governorate: payload.countryOrGov,
      City_or_Area: cityOrArea,
      Detailed_Address: address,
      Items_Summary: payload.itemsSummary,
      Product_IDs: payload.productIds,
      Sizes: payload.sizes,
      Total_Qty: payload.totalQty,
      Currency: payload.currency,
      Items_Subtotal: payload.subtotal,
      Delivery_Fee: payload.deliveryFee,
      Grand_Total: payload.grandTotal,
      Payment_Preference: payload.paymentMethod,
      Order_Status: 'Pending',
      Ad_Audience_Segment: payload.audienceTag || 'Drop01_Lead',
      Notes: notes,

      // Backward-compatible camelCase keys:
      ...payload,
      customerName,
      phone,
      address,
      notes,
      cityOrArea,
    };

    if (typeof window !== 'undefined') {
      const payloadString = JSON.stringify(sheetPayload);

      // 1. Non-blocking fetch with keepalive: true
      if (typeof fetch === 'function') {
        fetch(CRM_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          keepalive: true,
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: payloadString,
        }).catch((err) => {
          // Non-blocking, do not interrupt checkout flow
          console.warn('CRM logging error:', err);
        });
      } else if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        // Fallback for older browsers
        const blob = new Blob([payloadString], { type: 'text/plain;charset=utf-8' });
        navigator.sendBeacon(CRM_WEBHOOK_URL, blob);
      }
    }
  } catch (err) {
    // Non-blocking
    console.warn('CRM dispatch error:', err);
  }
}

/**
 * Backward-compatible alias for sendOrderToCrm.
 */
export const logOrderToCrm = sendOrderToCrm;
