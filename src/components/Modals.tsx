'use client';

import React, { useEffect } from 'react';
import { X, Trash2, Loader2, AlertCircle, RefreshCw, Truck } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { formatArabicJod } from '@/constants/products';
import { 
  SUPPORTED_COUNTRIES, 
  JORDAN_GOVERNORATE_AREAS, 
  CUSTOMS_DISCLAIMERS,
  EXCHANGE_RATE_CONFIG
} from '@/constants/shipping';

export default function Modals() {
  const { 
    lang, currency,
    cart, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, paymentMethod, setPaymentMethod,
    shippingDestination, setShippingDestination,
    shippingQuote, fetchShippingQuote, isShippingLoading, shippingError
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';

  const isDomestic = shippingDestination.countryCode === 'JO';

  // Automatically fetch quote when drawer opens or when cart/destination is ready without a quote
  useEffect(() => {
    if (isCartOpen && cart.length > 0 && !shippingQuote && !isShippingLoading && !shippingError) {
      fetchShippingQuote();
    }
  }, [isCartOpen, cart.length, shippingQuote, isShippingLoading, shippingError, fetchShippingQuote]);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + ((currency === 'USD' ? (item.priceUSD || 50) : item.price) * (item.quantity || 1)), 
    0
  );

  const selectedShippingOption = shippingQuote?.selectedOption;
  const shippingFee = selectedShippingOption?.shippingFee ?? 0;
  const additionalCharges = selectedShippingOption?.additionalCharges ?? 0;
  const finalCalculatedTotal = cartSubtotal > 0 ? (cartSubtotal + shippingFee + additionalCharges) : 0;
  const isEstimate = !shippingQuote || shippingQuote.mode === 'mock' || !selectedShippingOption?.isConfirmed;

  /**
   * Single unified currency formatter:
   * When Arabic and JOD, uses formatArabicJod (e.g. "٣٥ د.أ", "٢٫٥٠ د.أ", "٣٧٫٥٠ د.أ").
   * When USD, formats with two decimals and "USD".
   * When English and JOD, formats as "35 JOD" or "2.50 JOD".
   */
  const formatPrice = (amount: number): string => {
    if (currency === 'USD') {
      return `${amount.toFixed(2)} USD`;
    }
    if (isRtl) {
      return formatArabicJod(amount);
    }
    return (amount % 1 === 0) ? `${amount.toFixed(0)} JOD` : `${amount.toFixed(2)} JOD`;
  };

  const currentGov = JORDAN_GOVERNORATE_AREAS.find((g) => g.id === shippingDestination.governorateId) || JORDAN_GOVERNORATE_AREAS[0];
  const currentGovCities = currentGov?.cities || [];
  const activeCountry = SUPPORTED_COUNTRIES.find((c) => c.code === shippingDestination.countryCode);

  const getWhatsAppOrderUrl = () => {
    const isUsd = currency === 'USD';

    const orderDetails = cart.map((item, index) => {
      const sizeStr = item.garment === 'tote' ? 'One Size' : item.size;
      const unitP = isUsd ? (item.priceUSD || 50) : item.price;
      const formattedTotal = formatPrice(unitP * (item.quantity || 1));
      if (item.isPrePrinted) {
        return `${index + 1}. ${item.productTitle || item.garment} - مقاس: ${sizeStr} - كمية: ${item.quantity || 1} (${formattedTotal})`;
      }
      return `${index + 1}. ${item.garment} (${item.color}) - Size: ${sizeStr} - Qty: ${item.quantity || 1} (${formattedTotal})`;
    }).join('\n');

    const destSummary = isRtl
      ? (isDomestic
          ? `الأردن - ${currentGov.nameAr} - ${shippingDestination.city}${shippingDestination.addressLine1 ? ` - ${shippingDestination.addressLine1}` : ''}`
          : `${shippingDestination.countryNameAr || shippingDestination.countryCode} - ${shippingDestination.city}${shippingDestination.postalCode ? ` (${shippingDestination.postalCode})` : ''}${shippingDestination.addressLine1 ? ` - ${shippingDestination.addressLine1}` : ''}`)
      : (isDomestic
          ? `Jordan - ${currentGov.nameEn} - ${shippingDestination.city}${shippingDestination.addressLine1 ? ` - ${shippingDestination.addressLine1}` : ''}`
          : `${shippingDestination.countryNameEn || shippingDestination.countryCode} - ${shippingDestination.city}${shippingDestination.postalCode ? ` (${shippingDestination.postalCode})` : ''}${shippingDestination.addressLine1 ? ` - ${shippingDestination.addressLine1}` : ''}`);

    const carrierName = 'أرامكس (Aramex)';
    const serviceName = selectedShippingOption 
      ? (isRtl ? selectedShippingOption.serviceNameAr : selectedShippingOption.serviceNameEn)
      : (isDomestic ? (isRtl ? 'أرامكس المحلي السريع (الأردن)' : 'Aramex Domestic Express') : (isRtl ? 'أرامكس إكسبريس الدولي' : 'Aramex Priority Express'));
    const quoteRef = shippingQuote?.quoteReference || 'Awaiting Confirmation';

    const shippingLineAr = isEstimate
      ? `- تكلفة الشحن (تقديرية): ${formatPrice(shippingFee)}`
      : `- تكلفة الشحن: ${formatPrice(shippingFee)}`;
    const shippingLineEn = isEstimate
      ? `- Shipping Fee (Estimated): ${formatPrice(shippingFee)}`
      : `- Shipping Fee: ${formatPrice(shippingFee)}`;

    const dutiesLineAr = !isDomestic
      ? `- الرسوم الجمركية والضرائب: غير مشمولة (تُحدد وتُدفع عند الوصول)`
      : `- الرسوم الإضافية المؤكدة: ${formatPrice(0)}`;
    const dutiesLineEn = !isDomestic
      ? `- Customs & Import Duties: Excluded (payable upon arrival)`
      : `- Confirmed Additional Charges: ${formatPrice(0)}`;

    const totalLineAr = isEstimate
      ? `- المجموع التقديري: ${formatPrice(finalCalculatedTotal)}`
      : `- المجموع النهائي: ${formatPrice(finalCalculatedTotal)}`;
    const totalLineEn = isEstimate
      ? `- Estimated total: ${formatPrice(finalCalculatedTotal)}`
      : `- Final Total: ${formatPrice(finalCalculatedTotal)}`;

    const confirmationNoteAr = `*ملاحظة: يؤكد فريق ميدان تكلفة التوصيل وتوفر المقاس قبل الدفع.*`;
    const confirmationNoteEn = `*Note: The Midaan team confirms delivery fees and size availability before payment.*`;

    const msg = isRtl
      ? `مرحباً فريق ميدان،\n\nأود إرسال الطلب التالي للمراجعة والتأكيد:\n\n${orderDetails}\n\nوجهة الشحن: ${destSummary}\nشركة الشحن: ${carrierName}\nالخدمة: ${serviceName}\nالمرجع التقديري: ${quoteRef}\nطريقة الدفع المفضلة: ${paymentMethod === 'cliq' ? 'كليك (CliQ)' : 'عند الاستلام (نقداً)'}\n\nتفاصيل الحساب:\n- المجموع الفرعي: ${formatPrice(cartSubtotal)}\n${shippingLineAr}\n${dutiesLineAr}\n${totalLineAr}\n\n${confirmationNoteAr}`
      : `Hello Midaan team,\n\nI would like to submit the following order request for confirmation:\n\n${orderDetails}\n\nShipping Destination: ${destSummary}\nCarrier: ${carrierName}\nService: ${serviceName}\nQuote Reference: ${quoteRef}\nPreferred Payment: ${paymentMethod === 'cliq' ? 'CliQ' : 'Cash on Delivery'}\n\nCost Breakdown:\n- Subtotal: ${formatPrice(cartSubtotal)}\n${shippingLineEn}\n${dutiesLineEn}\n${totalLineEn}\n\n${confirmationNoteEn}`;

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
            {/* Header */}
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

            {/* Cart Items List */}
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
                            {formatPrice((currency === 'USD' ? (item.priceUSD || 50) : item.price) * (item.quantity || 1))}
                          </span>
                        </div>
                        
                        <div className="text-xs text-neutral-400 space-y-0.5 font-sans mb-3">
                          <p>
                            {isRtl ? (
                              <span>المقاس <bdi className="font-bold text-neutral-200" dir="ltr">{item.size}</bdi></span>
                            ) : (
                              <span>Size: <bdi className="font-bold text-neutral-200" dir="ltr">{item.size}</bdi></span>
                            )}
                          </p>
                          <p>
                            {isRtl ? 'سعر القطعة:' : 'Unit price:'}{' '}
                            <span className="font-semibold text-neutral-300" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                              {formatPrice(currency === 'USD' ? (item.priceUSD || 50) : item.price)}
                            </span>
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-[#262626] rounded-lg bg-[#050505] overflow-hidden" dir="ltr">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, -1)}
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
                              onClick={() => updateCartQuantity(item.id, 1)}
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

            {/* Checkout & Shipping Panel */}
            {cart.length > 0 && (
              <div className="border-t border-[#1A1A1A] p-6 bg-gradient-to-t from-black to-[#050505] max-h-[65vh] overflow-y-auto space-y-5">
                
                {/* 1. Destination Scope Selector (Domestic Jordan vs International) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300 font-sans">
                    {strings.calculator.deliveryScope}
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-[#111] p-1 border border-[#262626] rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setShippingDestination({
                          countryCode: 'JO',
                          countryNameAr: 'الأردن',
                          countryNameEn: 'Jordan',
                          governorateId: shippingDestination.governorateId || 'amman',
                          city: shippingDestination.city || 'عمّان',
                          postalCode: '11118',
                        });
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors font-sans text-center ${
                        isDomestic ? 'bg-white text-black shadow' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {strings.calculator.domesticJordan}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultIntl = SUPPORTED_COUNTRIES.find((c) => c.code === 'AE') || SUPPORTED_COUNTRIES[1];
                        setShippingDestination({
                          countryCode: defaultIntl.code,
                          countryNameAr: defaultIntl.nameAr,
                          countryNameEn: defaultIntl.nameEn,
                          governorateId: undefined,
                          city: 'Dubai',
                          postalCode: '',
                        });
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors font-sans text-center ${
                        !isDomestic ? 'bg-white text-black shadow' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {strings.calculator.international}
                    </button>
                  </div>
                </div>

                {/* 2. Destination Fields */}
                {isDomestic ? (
                  <div className="space-y-3 bg-[#0d0d0d] p-3.5 border border-[#1e1e1e] rounded-xl">
                    {/* Jordan Governorate */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans">
                        {strings.calculator.governorate}
                      </label>
                      <select 
                        value={shippingDestination.governorateId || 'amman'}
                        onChange={(e) => {
                          const govId = e.target.value;
                          const gov = JORDAN_GOVERNORATE_AREAS.find((g) => g.id === govId);
                          if (gov) {
                            setShippingDestination({
                              governorateId: gov.id,
                              city: isRtl ? gov.cities[0].nameAr : gov.cities[0].nameEn,
                              postalCode: gov.defaultPostalCode,
                            });
                          }
                        }}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors"
                      >
                        {JORDAN_GOVERNORATE_AREAS.map((g) => (
                          <option key={g.id} value={g.id}>
                            {isRtl ? g.nameAr : g.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Jordan City / Area */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans">
                        {strings.calculator.city}
                      </label>
                      <select
                        value={shippingDestination.city}
                        onChange={(e) => setShippingDestination({ city: e.target.value })}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors"
                      >
                        {currentGovCities.map((c, idx) => (
                          <option key={idx} value={isRtl ? c.nameAr : c.nameEn}>
                            {isRtl ? c.nameAr : c.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans">
                        {strings.calculator.addressLine1} <span className="text-neutral-500">{strings.calculator.optional}</span>
                      </label>
                      <input
                        type="text"
                        value={shippingDestination.addressLine1 || ''}
                        onChange={(e) => setShippingDestination({ addressLine1: e.target.value })}
                        placeholder={isRtl ? 'مثال: شارع الرينبو، بناية 14' : 'e.g. Rainbow Street, Bldg 14'}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors placeholder:text-neutral-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-[#0d0d0d] p-3.5 border border-[#1e1e1e] rounded-xl">
                    {/* International Country */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans">
                        {strings.calculator.destinationCountry}
                      </label>
                      <select 
                        value={shippingDestination.countryCode}
                        onChange={(e) => {
                          const c = SUPPORTED_COUNTRIES.find((cnt) => cnt.code === e.target.value);
                          if (c) {
                            setShippingDestination({
                              countryCode: c.code,
                              countryNameAr: c.nameAr,
                              countryNameEn: c.nameEn,
                              governorateId: undefined,
                              city: '',
                              postalCode: '',
                            });
                          }
                        }}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors"
                      >
                        {SUPPORTED_COUNTRIES.filter((c) => c.code !== 'JO').map((c) => (
                          <option key={c.code} value={c.code}>
                            {isRtl ? c.nameAr : c.nameEn} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* International City */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans flex items-center justify-between">
                        <span>{strings.calculator.city}</span>
                        <span className="text-[#D80032]">{strings.calculator.required}</span>
                      </label>
                      <input
                        type="text"
                        value={shippingDestination.city || ''}
                        onChange={(e) => setShippingDestination({ city: e.target.value })}
                        placeholder={isRtl ? 'المدينة (مثال: دبي، الرياض، لندن)' : 'City (e.g. Dubai, Riyadh, London)'}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors placeholder:text-neutral-600"
                      />
                    </div>

                    {/* Postal / ZIP Code */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans flex items-center justify-between">
                        <span>{strings.calculator.postalCode}</span>
                        <span className={activeCountry?.requiresPostalCode ? 'text-[#D80032]' : 'text-neutral-500'}>
                          {activeCountry?.requiresPostalCode ? strings.calculator.required : strings.calculator.optional}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={shippingDestination.postalCode || ''}
                        onChange={(e) => setShippingDestination({ postalCode: e.target.value })}
                        placeholder={activeCountry?.requiresPostalCode ? (isRtl ? 'الرمز البريدي مطلوب' : 'Postal code required') : (isRtl ? 'إن وجد' : 'Optional')}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors placeholder:text-neutral-600 text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* Street Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans">
                        {strings.calculator.addressLine1} <span className="text-neutral-500">{strings.calculator.optional}</span>
                      </label>
                      <input
                        type="text"
                        value={shippingDestination.addressLine1 || ''}
                        onChange={(e) => setShippingDestination({ addressLine1: e.target.value })}
                        placeholder={isRtl ? 'الشارع / رقم المبنى' : 'Street / Building Number'}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors placeholder:text-neutral-600"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Contact Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 font-sans">
                    {strings.calculator.contactPhone} <span className="text-neutral-500">{strings.calculator.optional}</span>
                  </label>
                  <input
                    type="tel"
                    value={shippingDestination.phone || ''}
                    onChange={(e) => setShippingDestination({ phone: e.target.value })}
                    placeholder={isDomestic ? '07XXXXXXXX' : '+XXXXXXXXXXXX'}
                    className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors placeholder:text-neutral-600 text-left"
                    dir="ltr"
                  />
                </div>

                {/* 4. Live Aramex Rate Calculator Card */}
                <div className="bg-[#111] border border-[#262626] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck size={15} className="text-[#D80032]" />
                      <span className="text-xs font-bold text-white font-sans">{strings.calculator.shippingService}</span>
                    </div>
                    {shippingQuote && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans border ${
                        shippingQuote.mode === 'live' 
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                          : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      }`}>
                        {shippingQuote.mode === 'live' ? strings.calculator.liveBadge : strings.calculator.mockBadge}
                      </span>
                    )}
                  </div>

                  {isShippingLoading ? (
                    <div className="py-3 flex items-center justify-center gap-2 text-xs text-neutral-400 font-sans">
                      <Loader2 size={16} className="animate-spin text-[#D80032]" />
                      <span>{strings.calculator.calculatingShipping}</span>
                    </div>
                  ) : shippingError ? (
                    <div className="py-2 space-y-2">
                      <div className="flex items-start gap-2 text-xs text-red-400 font-sans bg-red-950/30 border border-red-800/40 p-2.5 rounded-lg">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <span className="flex-1">{shippingError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fetchShippingQuote()}
                        className="w-full py-2 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-white text-xs font-sans font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RefreshCw size={13} />
                        <span>{strings.calculator.retry}</span>
                      </button>
                    </div>
                  ) : selectedShippingOption ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <span className="text-neutral-200 font-medium">
                          {isRtl ? selectedShippingOption.serviceNameAr : selectedShippingOption.serviceNameEn}
                        </span>
                        <span className="font-bold text-white" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                          {formatPrice(selectedShippingOption.shippingFee)}
                        </span>
                      </div>
                      {selectedShippingOption.estimatedDays && (
                        <p className="text-[11px] text-neutral-400 font-sans">
                          {isRtl ? 'المدة التقديرية للتسليم:' : 'Estimated transit:'}{' '}
                          <span className="text-neutral-200">{selectedShippingOption.estimatedDays}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-sans pt-1">
                        <span>{isRtl ? 'الوزن المعتمد للاحتساب:' : 'Chargeable weight:'} {selectedShippingOption.chargeableWeightKg} kg</span>
                        <span dir="ltr">Ref: {shippingQuote?.quoteReference}</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* 5. Preferred Payment Method */}
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

                {/* Informational Payment Notice */}
                <div className="bg-[#111] border border-[#262626] rounded-xl p-3 text-[11px] text-neutral-400 font-sans leading-relaxed">
                  <div className="text-neutral-300 font-medium mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D80032] inline-block" />
                    <span>{isRtl ? 'آلية الدفع والتأكيد:' : 'Payment & Confirmation Flow:'}</span>
                  </div>
                  <p>
                    {paymentMethod === 'cliq'
                      ? (isRtl 
                          ? 'لا يُطلب الدفع الآن. يؤكد فريق ميدان تكلفة التوصيل وتوفر المقاس قبل الدفع، ثم يزودكم بالاسم المستعار الرسمي لكليك عبر واتساب لإتمام التحويل بأمان.'
                          : 'No payment is requested now. The Midaan team confirms delivery fees and size availability before payment, then provides official CliQ transfer details via WhatsApp.')
                      : (isRtl
                          ? 'يتم الدفع نقداً عند استلام الشحنة. يؤكد فريق ميدان تكلفة التوصيل وتوفر المقاس وموعد التسليم قبل إرسال الطلب.'
                          : 'Payment is collected in cash upon delivery. The Midaan team confirms delivery fees, size availability, and delivery schedule before dispatch.')}
                  </p>
                </div>

                {/* 6. Itemized Price Breakdown */}
                <div className="pt-3 border-t border-[#1A1A1A] space-y-2 font-sans text-xs">
                  {/* Subtotal */}
                  <div className="flex justify-between text-neutral-400">
                    <span>{strings.subtotal}</span>
                    <span className="font-bold text-neutral-200" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  {/* Shipping Fee */}
                  <div className="flex justify-between text-neutral-400">
                    <span>{isEstimate ? strings.calculator.shippingCostEstimated : strings.calculator.shippingCost}</span>
                    <span className="font-bold text-neutral-200" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                      {selectedShippingOption ? formatPrice(shippingFee) : '—'}
                    </span>
                  </div>

                  {/* Additional Charges / Customs Duties */}
                  <div className="flex justify-between text-neutral-400">
                    <span>{isDomestic ? strings.calculator.additionalCharges : strings.calculator.dutiesAndTaxes}</span>
                    {isDomestic ? (
                      <span className="font-bold text-neutral-200" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                        {formatPrice(additionalCharges)}
                      </span>
                    ) : (
                      <span className="font-medium text-amber-400 text-xs">
                        {strings.calculator.dutiesExcluded}
                      </span>
                    )}
                  </div>

                  {/* Final Total / Estimated Total */}
                  <div className="flex justify-between items-end pt-2 border-t border-[#1A1A1A]">
                    <span className="text-sm font-bold text-white font-sans">
                      {isEstimate ? strings.calculator.estimatedTotal : strings.calculator.finalTotal}
                    </span>
                    <span className="text-2xl font-black text-white font-sans" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                      {formatPrice(finalCalculatedTotal)}
                    </span>
                  </div>
                </div>

                {/* 7. Customs Disclaimer */}
                <div className="bg-[#111] border border-[#262626] rounded-xl p-3 text-[11px] text-neutral-400 font-sans leading-relaxed">
                  <div className="text-neutral-300 font-medium mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D80032] inline-block" />
                    <span>{strings.calculator.excludedCustoms}</span>
                  </div>
                  <p>
                    {isRtl ? CUSTOMS_DISCLAIMERS.ar : CUSTOMS_DISCLAIMERS.en}
                  </p>
                </div>

                {/* 8. Carrier Transparency & Official Peg Notice */}
                <div className="space-y-1 text-[10px] text-neutral-500 font-sans leading-relaxed">
                  <p>{strings.calculator.carrierNotice}</p>
                  <p>{strings.calculator.exchangeRateNotice}</p>
                </div>

                {/* 9. Action Button */}
                {isShippingLoading ? (
                  <button 
                    disabled
                    type="button"
                    className="w-full bg-[#1A1A1A] text-neutral-400 py-4 font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-wait"
                  >
                    <Loader2 size={16} className="animate-spin text-[#D80032]" />
                    <span>{strings.calculator.calculatingShipping}</span>
                  </button>
                ) : shippingError ? (
                  <button 
                    type="button"
                    onClick={() => fetchShippingQuote()}
                    className="w-full bg-[#1A1A1A] hover:bg-[#222] text-red-300 border border-red-800/60 py-4 font-sans text-sm font-bold transition-colors rounded-xl flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    <span>{strings.calculator.retry}</span>
                  </button>
                ) : (
                  <a 
                    href={getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-white text-black hover:bg-neutral-200 py-4 font-sans text-sm font-bold transition-colors rounded-xl flex items-center justify-center gap-2 shadow-xl active:scale-95"
                  >
                    <span>{strings.sendOrderWhatsApp}</span>
                  </a>
                )}

                <p className="text-[11px] text-neutral-400 font-sans text-center leading-relaxed">
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
