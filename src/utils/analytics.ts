/**
 * Unified Analytics Utility for Midaan Store & Magazine
 * Supports Meta Pixel (fbq) and Google Analytics 4 (gtag).
 * Fails gracefully and silently if ad blockers are present or scripts fail to load.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '476490290557651';
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Safe wrapper for Meta Pixel fbq calls.
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
  } catch {
    // Fail silently without interrupting UI or checkout flow
  }
}

/**
 * Safe wrapper for Meta Pixel custom track calls.
 */
export function fbqCustomTrack(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      if (params) {
        window.fbq('trackCustom', eventName, params);
      } else {
        window.fbq('trackCustom', eventName);
      }
    }
  } catch {
    // Fail silently
  }
}

/**
 * Safe wrapper for Google Analytics 4 gtag calls.
 */
export function gtagEvent(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {
    // Fail silently
  }
}

/**
 * Custom PageView tracking on client route transitions.
 */
export function trackPageView(url?: string): void {
  const pagePath = url || (typeof window !== 'undefined' ? window.location.pathname : '');
  fbqTrack('PageView');
  gtagEvent('page_view', { page_path: pagePath });
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

  gtagEvent('view_item', {
    currency: product.currency,
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        currency: product.currency,
      },
    ],
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
  size?: string;
}): void {
  const qty = item.quantity || 1;
  const totalValue = item.price * qty;

  fbqTrack('AddToCart', {
    content_ids: [item.id],
    content_name: item.title,
    content_type: 'product',
    value: totalValue,
    currency: item.currency,
  });

  gtagEvent('add_to_cart', {
    currency: item.currency,
    value: totalValue,
    items: [
      {
        item_id: item.id,
        item_name: item.title,
        price: item.price,
        quantity: qty,
        item_variant: item.size,
      },
    ],
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
  items?: Array<{ id: string; title: string; price: number; quantity: number }>;
}): void {
  fbqTrack('InitiateCheckout', {
    num_items: details.num_items,
    value: details.value,
    currency: details.currency,
    content_ids: details.content_ids || [],
    content_type: 'product',
  });

  gtagEvent('begin_checkout', {
    currency: details.currency,
    value: details.value,
    items: details.items?.map((item) => ({
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * WhatsApp order submission checkout event:
 * Fires Lead and InitiateCheckout simultaneously on final WhatsApp order click.
 */
export function trackWhatsAppCheckout(details: {
  order_id: string;
  value: number;
  currency: 'JOD' | 'USD';
  num_items: number;
  items_summary?: string;
}): void {
  fbqTrack('Lead', {
    order_id: details.order_id,
    value: details.value,
    currency: details.currency,
    content_category: 'Order_Inquiry',
  });

  fbqTrack('InitiateCheckout', {
    num_items: details.num_items,
    value: details.value,
    currency: details.currency,
  });

  gtagEvent('generate_lead', {
    transaction_id: details.order_id,
    value: details.value,
    currency: details.currency,
    items_summary: details.items_summary,
  });
}

/**
 * Alias for trackWhatsAppCheckout for backward compatibility with trackLead.
 */
export function trackLead(details: {
  order_id: string;
  value: number;
  currency: 'JOD' | 'USD';
  num_items?: number;
}): void {
  trackWhatsAppCheckout({
    order_id: details.order_id,
    value: details.value,
    currency: details.currency,
    num_items: details.num_items || 1,
  });
}

/**
 * Event for downloading Issue Zero PDF (AR or EN).
 */
export function trackDownloadPdf(edition: 'ar' | 'en'): void {
  const fileName = edition === 'ar' ? 'Midaan_Magazine_Issue_Zero_AR.pdf' : 'Midaan_Magazine_Issue_Zero_EN.pdf';
  const fileUrl = edition === 'ar' ? '/magazine/issue-zero.pdf' : '/magazine/issue-zero-en.pdf';

  fbqTrack('Lead', {
    content_name: 'Issue_Zero_PDF',
    edition: edition,
    content_category: 'Magazine_Download',
  });

  fbqCustomTrack('Download', {
    content_name: 'Issue_Zero_PDF',
    edition: edition,
  });

  gtagEvent('file_download', {
    file_name: fileName,
    file_extension: 'pdf',
    link_url: fileUrl,
  });
}
