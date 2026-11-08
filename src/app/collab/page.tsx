'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Pause, ShoppingBag, Check, MessageSquare, ArrowUpRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Interactive3DTilt from '@/components/Interactive3DTilt';
import { useStore } from '@/store';
import { Product, GarmentSize } from '@/types';
import { SHARED_PRODUCTS, normalizeSize, formatProductPrice } from '@/constants/products';
import { content } from '@/locales/dictionary';

export default function CollabPage() {
  const { lang, currency, addToCart, setIsCartOpen } = useStore();
  const strings = content[lang as keyof typeof content];
  const isRtl = lang === 'ar';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'drop-helmet-white': 'L',
    'drop-poster-white': 'XL',
  });
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, []);

  const handleAddToCart = (prod: Product) => {
    const rawSize = selectedSizes[prod.id];
    if (!rawSize) {
      alert(isRtl ? 'الرجاء اختيار المقاس أولاً' : 'Please select a size first');
      return;
    }

    const normSize = normalizeSize(rawSize);

    addToCart({
      id: `${prod.id}-${normSize}`,
      garment: 'tshirt',
      color: 'offwhite',
      size: normSize as GarmentSize,
      placement: 'back',
      artMode: 'presets',
      price: prod.basePriceJOD, // 35.0 JOD
      priceUSD: prod.basePriceUSD || 50.0, // 50.0 USD
      isPrePrinted: true,
      productTitle: isRtl ? prod.titleAr : prod.titleEn,
    });
    setAddedItem(prod.id);
    setTimeout(() => setAddedItem(null), 1800);
    setIsCartOpen(true);
  };

  const displayPrice = formatProductPrice(currency, lang);

  return (
    <PageLayout>
      <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#D80032] selection:text-white pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* 1. Dual Collaboration Header */}
        <header className="pt-20 pb-16 px-4 md:px-8 border-b border-[#262626]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            
            <div className="flex items-center justify-center gap-6 md:gap-12 mb-8">
              <Image 
                src="/logo.png" 
                alt="Midaan" 
                width={160}
                height={80}
                className="h-14 md:h-20 w-auto object-contain brightness-0 invert drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]" 
              />
              <div className="text-2xl md:text-4xl font-light text-neutral-600">×</div>
              <Image 
                src="/sotusura.png" 
                alt="Sotusura" 
                width={160}
                height={80}
                className="h-14 md:h-20 w-auto object-contain rounded-xl shadow-xl" 
              />
            </div>

            <div className="inline-block bg-[#D80032] text-white px-4 py-1.5 font-sans text-xs font-bold tracking-normal uppercase mb-6 rounded-full shadow-lg shadow-[#D80032]/25">
              {strings.campaign.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-normal mb-6 leading-tight font-sans text-balance">
              {strings.campaign.heading}
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-neutral-300 leading-relaxed font-sans">
              {strings.campaign.desc}
            </p>
          </div>
        </header>

        {/* 2. Embedded 9:16 Vertical Cinema Frame Video Section */}
        <section className="py-20 px-4 md:px-8 border-b border-[#262626] bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            
            {/* 9:16 Vertical Cinema Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] mx-auto rounded-[2.5rem] p-2 bg-gradient-to-b from-[#2a2a2a] via-[#141414] to-[#0a0a0a] border border-neutral-700/60 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(216,0,50,0.15)]">
              <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-black flex items-center justify-center">
                
                <video
                  ref={videoRef}
                  src="/collab-video.mp4"
                  poster="/video-poster.png"
                  preload="metadata"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top Overlay Badge */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-sans text-neutral-200">
                    <span className="w-1.5 h-1.5 bg-[#D80032] rounded-full animate-ping" />
                    <span>{strings.campaign.filmBadge}</span>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-400">
                    9:16
                  </div>
                </div>

                {/* Play/Pause state */}
                {!isPlaying && (
                  <button 
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer w-full h-full border-none"
                    aria-label={strings.campaign.playBtn}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-transform">
                      <Play size={28} className={isRtl ? 'mr-0.5' : 'ml-0.5'} />
                    </div>
                  </button>
                )}

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-6 inset-x-6 z-30 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-full py-3.5 px-6 rounded-2xl font-sans text-xs font-bold flex items-center justify-center gap-2.5 bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all active:scale-95"
                    aria-label={isPlaying ? strings.campaign.pauseBtn : strings.campaign.playBtn}
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={16} />
                        <span>{strings.campaign.pauseBtn}</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} className={isRtl ? 'mr-0.5' : 'ml-0.5'} />
                        <span>{strings.campaign.playBtn}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 2.5 Narrative & Craft Context */}
        <section className="py-16 px-4 md:px-8 border-b border-[#262626] bg-[#070707]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#101010] border border-[#222] rounded-3xl p-8 sm:p-12 shadow-xl">
              <div className="inline-flex items-center gap-2 bg-[#D80032]/10 border border-[#D80032]/30 text-[#D80032] px-3.5 py-1 rounded-full text-xs font-bold uppercase mb-4">
                <span>{isRtl ? 'سردية التعاون والتصنيع' : 'Collaboration Narrative & Craft'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white font-sans leading-tight mb-5">
                {isRtl 
                  ? 'بين هوية الميدان وحرفية صوت وصورة' 
                  : 'Between Street Identity & Artisan Execution'}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                <p>
                  {isRtl 
                    ? 'يجمع هذا المشروع المشترك بين ميدان (المبادرة الفكرية والثقافية النابعة من عمّان وفلسطين) وصوت وصورة (العلامة المتخصصة في إنتاج المنسوجات البديلة). يرتكز التعاون على تحويل الرواية البصرية الملتزمة إلى منتج ملموس عالي الجودة يُرتدى في الحياة اليومية.'
                    : 'This collaborative release unites Midaan (the intellectual and cultural initiative from Amman and Palestine) and Sotusura (the Indonesian label specializing in alternative apparel craft). The project transforms committed visual narrative into high-grade physical garments for everyday life.'}
                </p>
                <p>
                  {isRtl
                    ? 'تم تصنيع القطع في إندونيسيا لمرونتها وملمسها وتوافقها العالي مع تقنية الطباعة الرقمية المباشرة (DTG)، التي تدمج التصميم داخل أنسجة القماش ليبقى ثابتاً ومسامياً مع كثرة الاستخدام والغسيل.'
                    : 'Crafted in Indonesia for durability, soft texture, and exceptional receptivity to Direct-to-Garment (DTG) printing, infusing archival graphics deep into the fabric fibers without stiffness or cracking.'}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#222] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-400 font-sans">
                <div>
                  <span className="block text-white font-bold mb-1">{isRtl ? 'المفهوم الفني' : 'Concept'}</span>
                  <span>{isRtl ? 'سردية الشارع والذاكرة المقاومة' : 'Street narrative & cultural resistance'}</span>
                </div>
                <div>
                  <span className="block text-white font-bold mb-1">{isRtl ? 'المنشأ والتصنيع' : 'Origin & Craft'}</span>
                  <span>{isRtl ? 'صنع في إندونيسيا' : 'Made in Indonesia'}</span>
                </div>
                <div>
                  <span className="block text-white font-bold mb-1">{isRtl ? 'تقنية التنفيذ' : 'Execution'}</span>
                  <span>{isRtl ? 'طباعة مباشرة على النسيج بتقنية DTG' : 'Direct-to-garment printing using DTG technology'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Approved Products Showcase */}
        <section id="collab-drops" className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#262626] pb-8 mb-16 gap-6">
            <div>
              <div className="inline-block bg-[#D80032]/10 border border-[#D80032]/30 text-[#D80032] px-3.5 py-1 rounded-full text-xs font-bold uppercase mb-3">
                <span>{strings.products.label}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-normal font-sans leading-tight">
                {strings.products.heading}
              </h2>
            </div>
            
            <div className="text-sm text-neutral-300 font-medium">
              <span className="text-neutral-400">{strings.products.fixedPriceLabel}:</span>{" "}
              <span className="text-white font-bold text-xl ml-1" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                {displayPrice}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {SHARED_PRODUCTS.map((prod) => {
              const currentSelectedSize = selectedSizes[prod.id] || 'L';
              const activeVariant = prod.variants.find((v) => v.size === currentSelectedSize);
              const isVariantInStock = activeVariant ? activeVariant.stockCount > 0 : true;

              return (
                <Interactive3DTilt
                  key={prod.id}
                  maxRotation={6}
                  scale={1.015}
                  showGlare={true}
                  className="bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#262626] hover:border-neutral-500 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl transition-colors duration-300"
                >
                  <div className="relative aspect-[4/5] bg-gradient-to-b from-[#181818] to-[#0A0A0A] flex items-center justify-center border-b border-[#222] p-8 overflow-hidden group">
                    <div className="absolute top-5 start-5 z-20 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{strings.products.label}</span>
                    </div>

                    <div className="absolute top-5 end-5 z-20 bg-[#D80032] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                      {displayPrice}
                    </div>

                    <Image 
                      src={prod.images[0]} 
                      alt={isRtl ? prod.titleAr : prod.titleEn} 
                      width={600}
                      height={600}
                      className="w-4/5 h-auto max-h-[380px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105 select-none" 
                    />

                    <div className="absolute bottom-4 inset-x-6 z-20 flex justify-between items-center text-xs text-neutral-300 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                      <span>{isRtl ? 'صنع في إندونيسيا' : 'Made in Indonesia'}</span>
                      <span className="text-white font-bold">{strings.products.dtgPrint}</span>
                    </div>
                  </div>

                  <div className="p-7 md:p-8 flex flex-col flex-1">
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-black text-white leading-tight font-sans mb-3">
                        <Link href={`/products/${prod.id}`} className="hover:text-[#D80032] transition-colors inline-flex items-center gap-2 group/link">
                          <span>{isRtl ? prod.titleAr : prod.titleEn}</span>
                          <ArrowUpRight size={18} className="text-neutral-500 group-hover/link:text-[#D80032] transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      </h3>
                      <p className="text-sm text-neutral-300 font-sans leading-relaxed bg-[#161616] border border-[#262626] rounded-xl p-3.5 mb-2">
                        {isRtl ? prod.descriptionAr : prod.descriptionEn}
                      </p>
                      <Link 
                        href={`/products/${prod.id}`}
                        className="text-xs text-[#D80032] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <span>{isRtl ? 'عرض صفحة وتفاصيل القطعة الموثقة' : 'View full piece details & story'}</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center text-xs text-neutral-300 mb-3">
                        <span className="font-bold">
                          {strings.products.selectSize}:
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://wa.me/962770125316?text=${encodeURIComponent(
                              isRtl 
                                ? 'مرحباً فريق ميدان، أود الاستفسار عن قياسات وتفاصيل تيشيرتات التعاون (Midaan × Sotusura).' 
                                : 'Hello Midaan team, I would like to ask about sizing for the Midaan × Sotusura collaboration tees.'
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 underline underline-offset-4 transition-colors"
                          >
                            <MessageSquare size={13} />
                            <span>{isRtl ? 'استفسر عن المقاس عبر واتساب' : 'Ask about sizing on WhatsApp'}</span>
                          </a>

                          <span className={`text-xs font-semibold ${isVariantInStock ? 'text-emerald-400' : 'text-neutral-500'}`}>
                            {isVariantInStock ? strings.products.inStock : strings.products.outOfStock}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2.5" dir="ltr">
                        {prod.variants.map((v) => {
                          const isSelected = selectedSizes[prod.id] === v.size;
                          const isOutOfStock = v.stockCount === 0;

                          return (
                            <button
                              key={v.id}
                              type="button"
                              disabled={isOutOfStock}
                              onClick={() => setSelectedSizes({ ...selectedSizes, [prod.id]: v.size })}
                              className={`relative py-3.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${
                                isOutOfStock
                                  ? 'bg-[#111] border-[#222] text-neutral-600 cursor-not-allowed opacity-40 line-through'
                                  : isSelected
                                    ? 'bg-white border-white text-black shadow-lg shadow-white/20'
                                    : 'bg-[#161616] border-[#2A2A2A] text-neutral-200 hover:border-neutral-400 hover:text-white'
                              }`}
                              aria-label={`Size ${v.size}`}
                            >
                              <span>{v.size}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-5 border-t border-[#1F1F1F] mt-auto">
                      <div>
                        <div className="text-xs text-neutral-400 font-medium">
                          {strings.products.fixedPriceLabel}
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-white" dir={isRtl && currency === 'JOD' ? 'rtl' : 'ltr'}>
                          {displayPrice}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(prod)}
                        className="flex-1 max-w-[210px] bg-white hover:bg-neutral-200 text-black py-4 px-5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-white/20 active:scale-95"
                      >
                        {addedItem === prod.id ? (
                          <>
                            <Check size={16} className="text-emerald-600" />
                            <span>{strings.products.added}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            <span>{strings.products.addToBag}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Interactive3DTilt>
              );
            })}
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
