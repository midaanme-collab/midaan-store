'use client';

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { GOVERNORATES } from '@/constants';
import { formatProductPrice } from '@/constants/products';

export default function Modals() {
  const { 
    lang, currency,
    selectedGov, setSelectedGov,
    cart, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, paymentMethod, setPaymentMethod
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';

  const hasConfiguredFee = selectedGov.fee !== null && selectedGov.fee !== undefined;
  const shippingAmount = hasConfiguredFee ? (currency === 'USD' ? (selectedGov.fee * 1.41) : selectedGov.fee) : 0;
  const cartSubtotal = cart.reduce((sum, item) => sum + ((currency === 'USD' ? (item.priceUSD || 50) : item.price) * (item.quantity || 1)), 0);
  const finalTotal = cartSubtotal > 0 ? cartSubtotal + shippingAmount : 0;

  const getFormattedItemPrice = (itemPrice: number, qty: number) => {
    if (currency === 'USD') {
      return `${(50 * qty).toFixed(2)} USD`;
    }
    if (isRtl) {
      if (qty === 1) return '٣٥ د.أ';
      return `${(35 * qty).toFixed(2)} د.أ`;
    }
    return `${(35 * qty).toFixed(2)} JOD`;
  };

  const getWhatsAppOrderUrl = () => {
    const isUsd = currency === 'USD';
    const currencySuffix = isUsd ? 'USD' : (isRtl ? 'د.أ' : 'JOD');

    const orderDetails = cart.map((item, index) => {
      const sizeStr = item.garment === 'tote' ? 'One Size' : item.size;
      const unitP = isUsd ? (item.priceUSD || 50) : item.price;
      if (item.isPrePrinted) {
        return `${index + 1}. ${item.productTitle || item.garment} - مقاس: ${sizeStr} - كمية: ${item.quantity || 1} (${unitP.toFixed(2)} ${currencySuffix})`;
      }
      return `${index + 1}. ${item.garment} (${item.color}) - Size: ${sizeStr} - Qty: ${item.quantity || 1} (${unitP.toFixed(2)} ${currencySuffix})`;
    }).join('\n');

    const shippingInfo = hasConfiguredFee
      ? `${(isUsd ? (selectedGov.fee * 1.41) : selectedGov.fee).toFixed(2)} ${currencySuffix}`
      : (isRtl ? 'تُحدد وتؤكد يدوياً مع الفريق' : 'Unconfigured — confirmed manually with team');

    const totalLabel = hasConfiguredFee
      ? (isRtl ? 'المجموع الإجمالي:' : 'Total:')
      : (isRtl ? 'المجموع (باستثناء الشحن):' : 'Total (Excluding shipping):');

    const msg = isRtl
      ? `مرحباً فريق ميدان،\n\nأود إرسال الطلب التالي للمراجعة والتأكيد:\n\n${orderDetails}\n\nالمحافظة: ${selectedGov.nameAr} (رسوم التوصيل: ${shippingInfo})\nطريقة الدفع المفضلة: ${paymentMethod === 'cliq' ? 'كليك (CliQ)' : 'عند الاستلام (نقداً)'}\n${totalLabel} ${finalTotal.toFixed(2)} ${currencySuffix}\n\n*ملاحظة: يؤكد فريق ميدان توفر المقاس وتكلفة التوصيل قبل الدفع.*`
      : `Hello Midaan team,\n\nI would like to submit the following order request for confirmation:\n\n${orderDetails}\n\nGovernorate: ${selectedGov.nameEn} (Shipping: ${shippingInfo})\nPreferred Payment: ${paymentMethod === 'cliq' ? 'CliQ' : 'Cash on Delivery'}\n${totalLabel} ${finalTotal.toFixed(2)} ${currencySuffix}\n\n*Note: The Midaan team confirms size availability and delivery fees before payment.*`;

    return `https://wa.me/962770125316?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Drawer */}
          <div 
            className={`relative w-full max-w-md bg-[#050505] h-full shadow-2xl flex flex-col border-l border-[#262626] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isRtl ? 'border-l-0 border-r left-0 right-auto' : 'right-0'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="p-6 flex items-center justify-between border-b border-[#1A1A1A]">
              <h2 className="text-xl font-black text-white font-sans flex items-center gap-2">
                <span>{strings.nav.cart}</span>
                <span className="text-[#D80032] text-sm" dir="ltr">({cart.length})</span>
              </h2>
              <button 
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-neutral-400 py-16 font-sans text-sm">
                  {isRtl ? 'الحقيبة فارغة حالياً' : 'Your bag is currently empty'}
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#111] border border-[#262626] p-4 rounded-2xl flex gap-4 items-start shadow-md">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white text-sm font-sans">
                            {item.productTitle || item.garment}
                          </h4>
                          <span className="text-xs font-black text-white font-sans" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                            {getFormattedItemPrice(item.price, item.quantity || 1)}
                          </span>
                        </div>
                        
                        <div className="text-xs text-neutral-400 space-y-0.5 font-sans mb-3">
                          <p>
                            {strings.size}: <span className="font-bold text-neutral-200" dir="ltr">{item.size}</span>
                          </p>
                          <p>
                            {isRtl ? 'السعر الفردي:' : 'Unit price:'} <span className="font-semibold text-neutral-300" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>{formatProductPrice(currency, isRtl ? 'ar' : 'en')}</span>
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-[#262626] rounded-lg bg-[#050505] overflow-hidden" dir="ltr">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-white min-w-[28px] text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                              className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button 
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title={isRtl ? 'حذف من الحقيبة' : 'Remove item'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#1A1A1A] p-6 bg-gradient-to-t from-black to-[#050505]">
                <div className="space-y-4 mb-6">
                  {/* Governorate */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 font-sans">{strings.governorate}</label>
                    <select 
                      value={selectedGov.id}
                      onChange={(e) => {
                        const gov = GOVERNORATES.find(g => g.id === e.target.value);
                        if(gov) setSelectedGov(gov);
                      }}
                      className="w-full bg-[#111] border border-[#262626] rounded-xl p-3 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors"
                    >
                      {GOVERNORATES.map(g => (
                        <option key={g.id} value={g.id}>
                          {isRtl ? g.nameAr : g.nameEn} {g.fee !== null ? `(+${g.fee} ${isRtl ? 'د.أ' : 'JOD'})` : (isRtl ? '(تأكيد يدوي مع الفريق)' : '(Manual confirmation)')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Payment Method */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 font-sans">
                      {isRtl ? 'طريقة الدفع المفضلة (عند التأكيد):' : 'Preferred Payment Method (Upon Confirmation):'}
                    </label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('cliq')}
                        className={`flex-1 py-2.5 px-2 border rounded-xl text-xs font-bold transition-colors font-sans text-center ${paymentMethod === 'cliq' ? 'border-[#D80032] bg-[#D80032]/10 text-white' : 'border-[#262626] bg-[#111] text-neutral-400'}`}
                      >
                        {isRtl ? 'كليك (CliQ)' : 'CliQ Transfer'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`flex-1 py-2.5 px-2 border rounded-xl text-xs font-bold transition-colors font-sans text-center ${paymentMethod === 'cod' ? 'border-white bg-[#1A1A1A] text-white' : 'border-[#262626] bg-[#111] text-neutral-400'}`}
                      >
                        {isRtl ? 'عند الاستلام (COD)' : 'Cash on Delivery'}
                      </button>
                    </div>
                  </div>

                  {/* Informational Payment Notice (No unapproved details displayed) */}
                  <div className="bg-[#111] border border-[#262626] rounded-xl p-3 text-[11px] text-neutral-400 font-sans leading-relaxed">
                    <div className="text-neutral-300 font-medium mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D80032] inline-block" />
                      <span>{isRtl ? 'آلية الدفع والتأكيد:' : 'Payment & Confirmation Flow:'}</span>
                    </div>
                    <p>
                      {paymentMethod === 'cliq'
                        ? (isRtl 
                            ? 'لا يُطلب الدفع الآن. يؤكد فريق ميدان توفر المقاس وتكلفة التوصيل قبل الدفع، ثم يزودكم بالاسم المستعار الرسمي لكليك عبر واتساب لإتمام التحويل بأمان.'
                            : 'No payment is requested now. The Midaan team confirms size availability and delivery fees before payment, then provides official CliQ transfer details via WhatsApp.')
                        : (isRtl
                            ? 'يتم الدفع نقداً عند استلام الشحنة. يؤكد فريق ميدان توفر المقاس وتكلفة التوصيل وموعد التسليم قبل إرسال الطلب.'
                            : 'Payment is collected in cash upon delivery. The Midaan team confirms size availability, delivery fees, and delivery schedule before dispatch.')}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1A1A1A] space-y-2 font-sans text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>{strings.subtotal}</span>
                      <span className="font-bold text-neutral-200" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                        {cartSubtotal.toFixed(2)} {currency === 'USD' ? 'USD' : (isRtl ? 'د.أ' : 'JOD')}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>{strings.shipping}</span>
                      <span className="font-bold text-neutral-200" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                        {hasConfiguredFee
                          ? `${(currency === 'USD' ? (selectedGov.fee! * 1.41) : selectedGov.fee!).toFixed(2)} ${currency === 'USD' ? 'USD' : (isRtl ? 'د.أ' : 'JOD')}`
                          : (isRtl ? 'تأكيد يدوي مع الفريق' : 'Manual team confirmation')}
                      </span>
                    </div>
                    <div className="flex justify-between items-end pt-2 border-t border-[#1A1A1A]">
                      <span className="text-sm font-bold text-white font-sans">
                        {hasConfiguredFee ? strings.total : (isRtl ? 'المجموع (بدون الشحن):' : 'Total (Excl. shipping):')}
                      </span>
                      <span className="text-2xl font-black text-white font-sans" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                        {finalTotal.toFixed(2)} <span className="text-xs text-[#D80032]">{currency === 'USD' ? 'USD' : (isRtl ? 'د.أ' : 'JOD')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <a 
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white text-black hover:bg-neutral-200 py-4 font-sans text-sm font-bold transition-colors rounded-xl flex items-center justify-center gap-2 shadow-xl active:scale-95"
                >
                  <span>{strings.sendOrderWhatsApp}</span>
                </a>
                <p className="text-[11px] text-neutral-400 font-sans mt-3 text-center leading-relaxed">
                  {strings.orderRequestNotice}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
