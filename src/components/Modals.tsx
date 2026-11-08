'use client';

import React from 'react';
import { X, Trash2, Truck, AlertCircle } from 'lucide-react';
import { useStore } from '@/store';
import { content } from '@/locales/dictionary';
import { formatArabicJod, getLocalizedProductTitle } from '@/constants/products';
import { 
  SUPPORTED_COUNTRIES, 
  JORDAN_GOVERNORATE_AREAS, 
  CUSTOMS_DISCLAIMERS,
} from '@/constants/shipping';
import { generateWhatsAppOrderUrl } from '@/utils/whatsapp';

export default function Modals() {
  const { 
    lang, currency,
    cart, removeFromCart, updateCartQuantity, isCartOpen, setIsCartOpen, paymentMethod, setPaymentMethod,
    shippingDestination, setShippingDestination,
  } = useStore();
  
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  const isDomestic = shippingDestination.countryCode === 'JO';

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + ((currency === 'USD' ? (item.priceUSD || 50) : item.price) * (item.quantity || 1)), 
    0
  );

  /**
   * Currency formatter matching the design system:
   * When Arabic and JOD, uses formatArabicJod (e.g. "٣٥ د.أ", "٧٠ د.أ").
   * When USD, formats with two decimals and "USD".
   * When English and JOD, formats as "35 JOD" or "70 JOD".
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

  const isCustomAreaOption = (cityName?: string) => {
    if (!cityName) return false;
    const trimmed = cityName.trim();
    return trimmed === 'منطقة أخرى' || trimmed === 'Other area';
  };

  const currentGov = JORDAN_GOVERNORATE_AREAS.find((g) => g.id === shippingDestination.governorateId) || JORDAN_GOVERNORATE_AREAS[0];
  const currentGovCities = currentGov?.cities || [];
  const activeCountry = SUPPORTED_COUNTRIES.find((c) => c.code === shippingDestination.countryCode);

  const isCustomAreaSelected = isDomestic && isCustomAreaOption(shippingDestination.city);
  const isCustomAreaEmpty = isCustomAreaSelected && !(shippingDestination.customArea && shippingDestination.customArea.trim().length > 0);
  const isIntlCityEmpty = !isDomestic && !(shippingDestination.city && shippingDestination.city.trim().length > 0);

  let validationError: string | null = null;
  if (isDomestic && isCustomAreaEmpty) {
    validationError = isRtl ? 'يرجى إدخال اسم المنطقة للمتابعة' : 'Please enter your area name to continue';
  } else if (!isDomestic && isIntlCityEmpty) {
    validationError = isRtl ? 'يرجى إدخال اسم المدينة للمتابعة' : 'Please enter the city name to continue';
  }

  const handleSwitchToDomestic = () => {
    const targetGovId = shippingDestination.domesticGovernorateId || 'amman';
    const gov = JORDAN_GOVERNORATE_AREAS.find((g) => g.id === targetGovId) || JORDAN_GOVERNORATE_AREAS[0];
    const defaultCity = isRtl ? gov.cities[0].nameAr : gov.cities[0].nameEn;
    const restoredCity = shippingDestination.domesticCity || defaultCity;
    
    setShippingDestination({
      internationalCountryCode: shippingDestination.countryCode !== 'JO' ? shippingDestination.countryCode : (shippingDestination.internationalCountryCode || 'AE'),
      internationalCity: shippingDestination.countryCode !== 'JO' ? shippingDestination.city : (shippingDestination.internationalCity || ''),
      internationalPostalCode: shippingDestination.countryCode !== 'JO' ? shippingDestination.postalCode : (shippingDestination.internationalPostalCode || ''),
      internationalAddressLine1: shippingDestination.countryCode !== 'JO' ? shippingDestination.addressLine1 : (shippingDestination.internationalAddressLine1 || ''),
      
      countryCode: 'JO',
      countryNameAr: 'الأردن',
      countryNameEn: 'Jordan',
      governorateId: targetGovId,
      city: restoredCity,
      customArea: shippingDestination.domesticCustomArea || '',
      postalCode: gov.defaultPostalCode,
      addressLine1: shippingDestination.domesticAddressLine1 || '',
    });
  };

  const handleSwitchToInternational = () => {
    const savedCountryCode = (shippingDestination.internationalCountryCode && shippingDestination.internationalCountryCode !== 'JO') 
      ? shippingDestination.internationalCountryCode 
      : 'AE';
    const country = SUPPORTED_COUNTRIES.find((c) => c.code === savedCountryCode) || SUPPORTED_COUNTRIES[1];
    
    setShippingDestination({
      domesticGovernorateId: shippingDestination.governorateId || 'amman',
      domesticCity: shippingDestination.city || 'عمّان (وسط البلد / جبل عمّان / اللويبده)',
      domesticCustomArea: shippingDestination.customArea || '',
      domesticAddressLine1: shippingDestination.addressLine1 || '',
      
      countryCode: country.code,
      countryNameAr: country.nameAr,
      countryNameEn: country.nameEn,
      governorateId: undefined,
      city: shippingDestination.internationalCity || '',
      customArea: '',
      postalCode: shippingDestination.internationalPostalCode || '',
      addressLine1: shippingDestination.internationalAddressLine1 || '',
    });
  };

  const handleGovernorateChange = (govId: string) => {
    const gov = JORDAN_GOVERNORATE_AREAS.find((g) => g.id === govId);
    if (!gov) return;
    const initialCity = isRtl ? gov.cities[0].nameAr : gov.cities[0].nameEn;
    setShippingDestination({
      governorateId: gov.id,
      domesticGovernorateId: gov.id,
      city: initialCity,
      domesticCity: initialCity,
      customArea: '',
      domesticCustomArea: '',
      postalCode: gov.defaultPostalCode,
    });
  };

  const handleCityChange = (newCity: string) => {
    const isOther = isCustomAreaOption(newCity);
    setShippingDestination({
      city: newCity,
      domesticCity: newCity,
      customArea: isOther ? (shippingDestination.customArea || '') : '',
      domesticCustomArea: isOther ? (shippingDestination.domesticCustomArea || '') : '',
    });
  };

  const handleCountryChange = (code: string) => {
    const c = SUPPORTED_COUNTRIES.find((cnt) => cnt.code === code);
    if (c) {
      setShippingDestination({
        countryCode: c.code,
        countryNameAr: c.nameAr,
        countryNameEn: c.nameEn,
        internationalCountryCode: c.code,
        governorateId: undefined,
        city: '',
        internationalCity: '',
        postalCode: '',
        internationalPostalCode: '',
      });
    }
  };

  const getDestinationSummary = (): string => {
    if (isDomestic) {
      const govName = isRtl ? currentGov.nameAr : currentGov.nameEn;
      let areaText = shippingDestination.city;
      if (isCustomAreaOption(shippingDestination.city)) {
        const customName = (shippingDestination.customArea || '').trim();
        areaText = customName ? customName : (isRtl ? 'منطقة أخرى' : 'Other area');
      }
      const addr = shippingDestination.addressLine1 ? ` - ${shippingDestination.addressLine1.trim()}` : '';
      return isRtl 
        ? `الأردن - ${govName} - ${areaText}${addr}`
        : `Jordan - ${govName} - ${areaText}${addr}`;
    }

    const cName = isRtl 
      ? (shippingDestination.countryNameAr || shippingDestination.countryCode)
      : (shippingDestination.countryNameEn || shippingDestination.countryCode);
    const city = (shippingDestination.city || '').trim();
    const postal = shippingDestination.postalCode ? ` (${shippingDestination.postalCode.trim()})` : '';
    const addr = shippingDestination.addressLine1 ? ` - ${shippingDestination.addressLine1.trim()}` : '';
    
    return `${cName} - ${city}${postal}${addr}`;
  };

  const whatsappUrl = generateWhatsAppOrderUrl({
    cart,
    currency,
    lang,
    isDomestic,
    destinationSummary: getDestinationSummary(),
    paymentMethod,
    cartSubtotal,
  });

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
                  {cart.map((item) => {
                    const itemTitle = getLocalizedProductTitle(item, lang);
                    const unitPrice = currency === 'USD' ? (item.priceUSD || 50) : item.price;
                    const itemTotal = unitPrice * (item.quantity || 1);

                    return (
                      <div key={item.id} className="bg-[#111] border border-[#262626] p-4 rounded-2xl flex gap-4 items-start shadow-md">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-white text-sm font-sans">
                              {itemTitle}
                            </h4>
                            <span className="text-xs font-black text-white font-sans" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                              {formatPrice(itemTotal)}
                            </span>
                          </div>
                          
                          <div className="text-xs text-neutral-400 space-y-0.5 font-sans mb-3">
                            <p>
                              {isRtl ? (
                                <span>المقاس: <bdi className="font-bold text-neutral-200" dir="ltr">{item.size}</bdi></span>
                              ) : (
                                <span>Size: <bdi className="font-bold text-neutral-200" dir="ltr">{item.size}</bdi></span>
                              )}
                            </p>
                            <p>
                              {isRtl ? 'سعر القطعة:' : 'Unit price:'}{' '}
                              <span className="font-semibold text-neutral-300" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                                {formatPrice(unitPrice)}
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
                    );
                  })}
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
                      onClick={handleSwitchToDomestic}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-colors font-sans text-center ${
                        isDomestic ? 'bg-white text-black shadow' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {strings.calculator.domesticJordan}
                    </button>
                    <button
                      type="button"
                      onClick={handleSwitchToInternational}
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
                        onChange={(e) => handleGovernorateChange(e.target.value)}
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
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors"
                      >
                        {currentGovCities.map((c, idx) => (
                          <option key={idx} value={isRtl ? c.nameAr : c.nameEn}>
                            {isRtl ? c.nameAr : c.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Area Input (Only when 'منطقة أخرى' / 'Other area' selected) */}
                    {isCustomAreaSelected && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-300 font-sans flex items-center justify-between">
                          <span>{isRtl ? 'اسم المنطقة المخصصة' : 'Custom Area Name'}</span>
                          <span className="text-[#D80032]">{strings.calculator.required}</span>
                        </label>
                        <input
                          type="text"
                          value={shippingDestination.customArea || ''}
                          onChange={(e) => setShippingDestination({ customArea: e.target.value, domesticCustomArea: e.target.value })}
                          placeholder={isRtl ? 'أدخل اسم منطقتك (مثال: طبربور، دير غبار)' : 'Enter area name (e.g. Tabarbour, Deir Ghbar)'}
                          className={`w-full bg-[#111] border rounded-xl p-2.5 text-white text-xs font-sans outline-none transition-colors placeholder:text-neutral-600 ${
                            isCustomAreaEmpty ? 'border-amber-500/60 focus:border-amber-500' : 'border-[#262626] focus:border-[#D80032]'
                          }`}
                        />
                        {isCustomAreaEmpty && (
                          <p className="text-[11px] text-amber-400 font-sans">
                            {isRtl ? 'يرجى إدخال اسم المنطقة للمتابعة' : 'Please enter your area name to continue'}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Street Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans">
                        {strings.calculator.addressLine1} <span className="text-neutral-500">{strings.calculator.optional}</span>
                      </label>
                      <input
                        type="text"
                        value={shippingDestination.addressLine1 || ''}
                        onChange={(e) => setShippingDestination({ addressLine1: e.target.value, domesticAddressLine1: e.target.value })}
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
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full bg-[#111] border border-[#262626] rounded-xl p-2.5 text-white text-xs font-sans outline-none focus:border-[#D80032] transition-colors"
                      >
                        {SUPPORTED_COUNTRIES.filter((c) => c.code !== 'JO').map((c) => (
                          <option key={c.code} value={c.code}>
                            {isRtl ? c.nameAr : c.nameEn} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* International City (No hardcoded default) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 font-sans flex items-center justify-between">
                        <span>{strings.calculator.city}</span>
                        <span className="text-[#D80032]">{strings.calculator.required}</span>
                      </label>
                      <input
                        type="text"
                        value={shippingDestination.city || ''}
                        onChange={(e) => setShippingDestination({ city: e.target.value, internationalCity: e.target.value })}
                        placeholder={isRtl ? 'المدينة (مثال: دبي، الرياض، لندن)' : 'City (e.g. Dubai, Riyadh, London)'}
                        className={`w-full bg-[#111] border rounded-xl p-2.5 text-white text-xs font-sans outline-none transition-colors placeholder:text-neutral-600 ${
                          isIntlCityEmpty ? 'border-amber-500/60 focus:border-amber-500' : 'border-[#262626] focus:border-[#D80032]'
                        }`}
                      />
                      {isIntlCityEmpty && (
                        <p className="text-[11px] text-amber-400 font-sans">
                          {isRtl ? 'يرجى إدخال اسم المدينة للمتابعة' : 'Please enter the city name to continue'}
                        </p>
                      )}
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
                        onChange={(e) => setShippingDestination({ postalCode: e.target.value, internationalPostalCode: e.target.value })}
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
                        onChange={(e) => setShippingDestination({ addressLine1: e.target.value, internationalAddressLine1: e.target.value })}
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

                {/* 4. Delivery Notice */}
                <div className="bg-[#111] border border-[#262626] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck size={15} className="text-[#D80032]" />
                      <span className="text-xs font-bold text-white font-sans">{strings.calculator.shippingService}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-sans border bg-neutral-900 border-neutral-700 text-neutral-300">
                      {strings.calculator.mockBadge}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                    {strings.calculator.shippingNotice}
                  </p>
                </div>

                {/* 5. Payment Method Section */}
                {isDomestic ? (
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

                    {/* Informational Payment Notice for Domestic */}
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
                  </div>
                ) : (
                  <div className="bg-[#111] border border-[#262626] rounded-xl p-3.5 space-y-1.5">
                    <div className="text-neutral-300 font-semibold text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D80032] inline-block" />
                      <span>{isRtl ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {isRtl 
                        ? 'تُؤكد طريقة الدفع المتاحة عبر واتساب قبل إتمام الطلب.'
                        : 'Available payment methods are confirmed via WhatsApp before completing the order.'}
                    </p>
                  </div>
                )}

                {/* 6. Itemized Cost Breakdown */}
                <div className="pt-3 border-t border-[#1A1A1A] space-y-2.5 font-sans text-xs">
                  {/* Subtotal */}
                  <div className="flex justify-between text-neutral-300">
                    <span>{strings.subtotal}</span>
                    <span className="font-bold text-white" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  {/* Delivery Fee Notice */}
                  <div className="flex justify-between text-neutral-400">
                    <span>{strings.calculator.shippingCost}</span>
                    <span className="font-medium text-amber-400">
                      {strings.calculator.shippingCostEstimated}
                    </span>
                  </div>

                  {/* Customs Duties - Exclusively shown for international destinations */}
                  {!isDomestic && (
                    <div className="flex justify-between text-neutral-400">
                      <span>{strings.calculator.dutiesAndTaxes}</span>
                      <span className="font-medium text-amber-400 text-xs">
                        {strings.calculator.dutiesExcluded}
                      </span>
                    </div>
                  )}
                </div>

                {/* 7. Customs Disclaimer - ONLY if International */}
                {!isDomestic && (
                  <div className="bg-[#111] border border-[#262626] rounded-xl p-3 text-[11px] text-neutral-400 font-sans leading-relaxed">
                    <div className="text-neutral-300 font-medium mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D80032] inline-block" />
                      <span>{strings.calculator.excludedCustoms}</span>
                    </div>
                    <p>
                      {isRtl ? CUSTOMS_DISCLAIMERS.ar : CUSTOMS_DISCLAIMERS.en}
                    </p>
                  </div>
                )}

                {/* 8. Fixed Pricing & Transparency Notice */}
                <div className="space-y-1 text-[10px] text-neutral-500 font-sans leading-relaxed">
                  <p>{strings.calculator.carrierNotice}</p>
                  <p>{strings.calculator.exchangeRateNotice}</p>
                </div>

                {/* 9. Action Button & Validation Alert */}
                {validationError ? (
                  <div className="space-y-2">
                    <button 
                      type="button"
                      disabled
                      className="w-full bg-neutral-800 text-neutral-400 py-4 font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                    >
                      <span>{strings.sendOrderWhatsApp}</span>
                    </button>
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  </div>
                ) : (
                  <a 
                    href={whatsappUrl}
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
