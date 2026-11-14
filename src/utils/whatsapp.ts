import { CartItem } from '@/types';
import { formatArabicJod, getLocalizedProductTitle } from '@/constants/products';

export interface WhatsAppOrderDetails {
  cart: CartItem[];
  currency: 'JOD' | 'USD';
  lang: 'ar' | 'en';
  isDomestic: boolean;
  destinationSummary: string;
  paymentMethod?: 'cliq' | 'cod';
  cartSubtotal: number;
  customerName?: string;
  phone?: string;
}

/**
 * Builds the canonical WhatsApp order URL and message.
 * Strictly guarantees:
 * - Localized item titles and labels (Size / Qty in English, مقاس / كمية in Arabic)
 * - Zero simulated shipping fees or fake transit days
 * - Zero duplicate total when shipping fee is pending confirmation
 * - Explicit payment method: CliQ/COD for domestic, "confirmed via WhatsApp" for international
 * - Raw customer-entered text preserved in its original language
 */
export function buildWhatsAppOrderMessage(details: WhatsAppOrderDetails): string {
  const { cart, currency, lang, isDomestic, destinationSummary, paymentMethod, cartSubtotal, customerName, phone } = details;
  const isAr = lang === 'ar';
  const isUsd = currency === 'USD';

  const formatPrice = (amount: number): string => {
    if (isUsd) return `${amount.toFixed(2)} USD`;
    if (isAr) return formatArabicJod(amount);
    return amount % 1 === 0 ? `${amount.toFixed(0)} JOD` : `${amount.toFixed(2)} JOD`;
  };

  const orderLines = cart.map((item, index) => {
    const title = getLocalizedProductTitle(item, lang);
    const sizeStr = item.garment === 'tote' ? 'One Size' : item.size;
    const unitPrice = isUsd ? (item.priceUSD || 50) : item.price;
    const formattedTotal = formatPrice(unitPrice * (item.quantity || 1));
    const qty = item.quantity || 1;

    if (isAr) {
      return `${index + 1}. ${title} - مقاس: ${sizeStr} - كمية: ${qty} (${formattedTotal})`;
    } else {
      return `${index + 1}. ${title} - Size: ${sizeStr} - Qty: ${qty} (${formattedTotal})`;
    }
  }).join('\n');

  if (isAr) {
    const paymentLine = isDomestic
      ? (paymentMethod === 'cliq' ? 'كليك (CliQ)' : 'عند الاستلام (نقداً)')
      : 'تُؤكد طريقة الدفع المتاحة عبر واتساب قبل إتمام الطلب';

    const subtotalLine = `- قيمة المنتجات (لا تشمل التوصيل): ${formatPrice(cartSubtotal)}`;
    const shippingLine = `- رسوم التوصيل: تُؤكد عبر واتساب قبل الدفع`;
    const dutiesLine = !isDomestic
      ? `\n- الرسوم الجمركية والضرائب في بلد الوصول: غير مشمولة (تُحدد وتُدفع عند الوصول)`
      : '';
    const noteLine = `*ملاحظة: يؤكد فريق ميدان تكلفة التوصيل وتوفر المقاس قبل الدفع.*`;

    const customerLines: string[] = [];
    if (customerName && customerName.trim()) {
      customerLines.push(`الاسم الكامل: ${customerName.trim()}`);
    }
    if (phone && phone.trim()) {
      customerLines.push(`رقم الهاتف (واتساب): ${phone.trim()}`);
    }
    const customerBlock = customerLines.length > 0 ? `\n${customerLines.join('\n')}\n` : '';

    return `مرحباً فريق ميدان،\n\nأود إرسال الطلب التالي للمراجعة والتأكيد:\n\n${orderLines}\n${customerBlock}\nوجهة التوصيل: ${destinationSummary}\nطريقة الدفع${isDomestic ? ' المفضلة' : ''}: ${paymentLine}\n\nتفاصيل الحساب:\n${subtotalLine}\n${shippingLine}${dutiesLine}\n\n${noteLine}`;
  } else {
    const paymentLine = isDomestic
      ? (paymentMethod === 'cliq' ? 'CliQ' : 'Cash on Delivery')
      : 'Available payment methods are confirmed via WhatsApp before completing the order';

    const subtotalLine = `- Items subtotal (delivery not included): ${formatPrice(cartSubtotal)}`;
    const shippingLine = `- Delivery fee: Confirmed via WhatsApp before payment`;
    const dutiesLine = !isDomestic
      ? `\n- Customs & destination taxes: Excluded (payable upon arrival)`
      : '';
    const noteLine = `*Note: The Midaan team confirms delivery fees and size availability before payment.*`;

    const customerLines: string[] = [];
    if (customerName && customerName.trim()) {
      customerLines.push(`Full Name: ${customerName.trim()}`);
    }
    if (phone && phone.trim()) {
      customerLines.push(`Phone Number (WhatsApp): ${phone.trim()}`);
    }
    const customerBlock = customerLines.length > 0 ? `\n${customerLines.join('\n')}\n` : '';

    return `Hello Midaan team,\n\nI would like to submit the following order request for confirmation:\n\n${orderLines}\n${customerBlock}\nDelivery Destination: ${destinationSummary}\n${isDomestic ? 'Preferred Payment' : 'Payment'}: ${paymentLine}\n\nCost Breakdown:\n${subtotalLine}\n${shippingLine}${dutiesLine}\n\n${noteLine}`;
  }
}

export function generateWhatsAppOrderUrl(details: WhatsAppOrderDetails): string {
  const msg = buildWhatsAppOrderMessage(details);
  return `https://wa.me/962770125316?text=${encodeURIComponent(msg)}`;
}
