import { CrmOrderPayload } from '@/types';

export const CRM_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyRWThRWC-w1-NXoSUDcSZV7Zbklt26bP9oRZXySmWiBnsnrcYza19VRrDxtsT6KEzU/exec';

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
 */
export function sendOrderToCrm(payload: CrmOrderPayload): void {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      fetch(CRM_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
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
