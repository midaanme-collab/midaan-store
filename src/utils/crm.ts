import { CrmOrderPayload } from '@/types';

export const CRM_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyRWThRWC-w1-NXoSUDcSZV7Zbklt26bP9oRZXySmWiBnsnrcYza19VRrDxtsT6KEzU/exec';

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
    const sanitizedPayload: CrmOrderPayload = {
      ...payload,
      customerName: sanitizeCrmField(payload.customerName, 80),
      phone: sanitizeCrmField(payload.phone, 25),
      address: sanitizeCrmField(payload.address, 200),
      notes: sanitizeCrmField(payload.notes, 250),
      cityOrArea: sanitizeCrmField(payload.cityOrArea, 100),
    };

    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      fetch(CRM_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(sanitizedPayload),
      }).catch((err) => {
        // Non-blocking, do not interrupt checkout flow
        console.warn('CRM logging error:', err);
      });
    }
  } catch (err) {
    // Non-blocking
    console.warn('CRM dispatch error:', err);
  }
}
