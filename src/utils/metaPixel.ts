/**
 * Meta Pixel Tracking Utility (ID: 476490290557651)
 * Provides safe, robust wrappers around fbq() that fail silently
 * if the script is blocked by ad blockers or unavailable.
 */

export const META_PIXEL_ID = '476490290557651';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Safe wrapper for fbq calls that won't throw errors.
 */
export function fbqTrack(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
    }
  } catch (err) {
    // Fail silently without interrupting UI or checkout flow
  }
}

export function fbqCustomTrack(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (params) {
        window.fbq('trackCustom', eventName, params);
      } else {
        window.fbq('trackCustom', eventName);
      }
    }
  } catch (err) {
    // Fail silently
  }
}

/**
 * Standard ViewContent event:
 * Fired when a user views a product detail page/modal.
 */
export function trackViewContent(product: {
  id: string;
  title: string;
  price: number;
  currency: 'JOD' | 'USD';
}): void {
  fbqTrack('ViewContent', {
    content_ids: [product.id],
    content_name: product.title,
    content_type: 'product',
    value: product.price,
    currency: product.currency,
  });
}

/**
 * Standard AddToCart event:
 * Fired when a user clicks Add to Cart.
 */
export function trackAddToCart(item: {
  id: string;
  title: string;
  price: number;
  currency: 'JOD' | 'USD';
  quantity?: number;
}): void {
  fbqTrack('AddToCart', {
    content_ids: [item.id],
    content_name: item.title,
    content_type: 'product',
    value: item.price * (item.quantity || 1),
    currency: item.currency,
  });
}

/**
 * Standard InitiateCheckout event:
 * Fired when a user opens the Cart/Checkout drawer.
 */
export function trackInitiateCheckout(details: {
  num_items: number;
  value: number;
  currency: 'JOD' | 'USD';
  content_ids?: string[];
}): void {
  fbqTrack('InitiateCheckout', {
    num_items: details.num_items,
    value: details.value,
    currency: details.currency,
    content_ids: details.content_ids || [],
    content_type: 'product',
  });
}

/**
 * Standard Lead event:
 * Fired when a user clicks the WhatsApp order submission button.
 */
export function trackLead(details: {
  order_id: string;
  value: number;
  currency: 'JOD' | 'USD';
}): void {
  fbqTrack('Lead', {
    order_id: details.order_id,
    value: details.value,
    currency: details.currency,
    content_category: 'Order_Inquiry',
  });
}
