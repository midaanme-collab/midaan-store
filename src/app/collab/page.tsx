'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ShoppingBag, Check } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Interactive3DTilt from '@/components/Interactive3DTilt';
import { useStore } from '@/store';
import { Product, GarmentSize } from '@/types';
import { SHARED_PRODUCTS, normalizeSize } from '@/constants/products';

export default function CollabPage() {
  const { lang, currency, addToCart, setIsCartOpen } = useStore();
  const isRtl = lang === 'ar';
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'drop-helmet-white': 'L',
    'drop-poster-white': 'XL',
  });
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
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
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  const handleAddToCart = (prod: Product) => {
    const rawSize = selectedSizes[prod.id];
    if (!rawSize) {
      alert(isRtl ? 'يجب اختيار المقاس قبل إضافة القطعة إلى الحقيبة' : 'You must select a size before adding the item to your bag');
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

  return (
    <PageLayout>
      <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#D80032] selection:text-white pb-24">
        
        {/* 1. Dual Collaboration Header */}
        <header className="pt-20 pb-16 px-4 md:px-8 border-b border-[#262626]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            
            <div className="flex items-center justify-center gap-6 md:gap-12 mb-8">
              <img 
                src="/logo.png" 
                alt="Midaan" 
                className="h-14 md:h-20 w-auto object-contain brightness-0 invert drop-shadow-[0_4px_16px_rgba(255,255,255,0.15)]" 
              />
              <div className="text-2xl md:text-4xl font-light text-neutral-600">×</div>
              <img 
                src="/sotusura.png" 
                alt="Sotusura" 
                className="h-14 md:h-20 w-auto object-contain rounded-xl shadow-xl" 
              />
            </div>

            <div className="inline-block bg-[#D80032] text-white px-4 py-1.5 font-mono text-xs font-bold tracking-normal uppercase mb-6 rounded-full shadow-lg shadow-[#D80032]/25">
              MIDAAN COLLECTIVE × SOTUSURA CLOTHING // ARCHIVE 01
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-normal mb-6 leading-tight">
              {isRtl ? 'التعاون الحصري: أرشيف 01' : 'EXCLUSIVE COLLABORATION: ARCHIVE 01'}
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-neutral-300 leading-relaxed font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
              {isRtl 
                ? 'اندماج بين منصة ميدان للمناصرة عبر الأزياء، وثقافة الشارع المستقلة لصوت صورة. مجموعة "أرشيف 01" تعيد صياغة الذاكرة البصرية وتوثق السردية البديلة على قطع قطنية ثقيلة ومستدامة.'
                : 'A synergy between Midaan\'s Wearable Advocacy and Sotusura\'s independent underground street culture. The "Archive 01" capsule reframes visual memory, documenting the alternative narrative on heavyweight cotton.'}
            </p>
          </div>
        </header>

        {/* 2. Embedded 9:16 Vertical Cinema Frame Video Section */}
        <section className="py-20 px-4 md:px-8 border-b border-[#262626] bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="mb-8">
              <div className="text-xs font-mono text-[#D80032] font-bold uppercase mb-2">
                {isRtl ? 'فيديو الحملة الرسمي' : 'Official Campaign Film'}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase font-sans">
                {isRtl ? 'صوت وسردية الذاكرة' : 'Sound & The Narrative of Memory'}
              </h2>
            </div>

            {/* 9:16 Vertical Cinema Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] mx-auto rounded-[2.5rem] p-2 bg-gradient-to-b from-[#2a2a2a] via-[#141414] to-[#0a0a0a] border border-neutral-700/60 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(216,0,50,0.15)]">
              <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-black flex items-center justify-center">
                
                <video
                  ref={videoRef}
                  src="/collab-video.mp4"
                  poster="/video-poster.png"
                  preload="metadata"
                  loop
                  muted={isMuted}
                  playsInline
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top Overlay Badge */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-neutral-300">
                    <span className="w-1.5 h-1.5 bg-[#D80032] rounded-full animate-ping" />
                    <span>MIDAAN × SOTUSURA</span>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-neutral-400">
                    9:16 CINEMA
                  </div>
                </div>

                {/* Play/Pause state */}
                {!isPlaying && (
                  <button 
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer w-full h-full border-none"
                    aria-label="Play Video"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-transform">
                      <Play size={28} className="ml-1" />
                    </div>
                  </button>
                )}

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-6 inset-x-6 z-30 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="bg-black/60 hover:bg-black/80 text-white p-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-colors active:scale-95"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className={`flex-1 py-3.5 px-4 rounded-2xl font-mono text-xs font-black flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 active:scale-95 border ${
                        isMuted 
                          ? 'bg-[#D80032] hover:bg-[#B00028] text-white border-white/30 shadow-[#D80032]/40' 
                          : 'bg-white hover:bg-neutral-200 text-black border-transparent shadow-white/20'
                      }`}
                      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                    >
                      {isMuted ? (
                        <>
                          <VolumeX size={16} />
                          <span className="tracking-normal">{isRtl ? '🔊 تشغيل الصوت' : '🔊 UNMUTE SOUND'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={16} className="text-[#D80032]" />
                          <span className="tracking-normal">{isRtl ? '🔊 كتم الصوت' : '🔊 MUTE SOUND'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 3. Approved Products Showcase */}
        <section id="collab-drops" className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-normal mb-4 font-sans">
              {isRtl ? 'القطع الحصرية الجاهزة للشحن الفوري' : 'EXCLUSIVE DROPS (IN-STOCK)'}
            </h2>
            <p className="text-neutral-400 font-mono text-sm uppercase tracking-normal">
              {isRtl 
                ? (currency === 'USD' ? 'سعر موحد: 50 USD • كميات محدودة' : 'سعر موحد: 35 د.أ • كميات محدودة')
                : (currency === 'USD' ? 'Fixed Price: 50 USD • Limited Stock' : 'Fixed Price: 35 JOD • Limited Stock')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {SHARED_PRODUCTS.map((prod) => {
              const totalStock = prod.variants.reduce((sum, v) => sum + v.stockCount, 0);
              const currentSelectedSize = selectedSizes[prod.id];
              const activeVariant = prod.variants.find((v) => v.size === currentSelectedSize);
              const displayPrice = currency === 'USD' 
                ? `${prod.basePriceUSD || 50} USD` 
                : `${prod.basePriceJOD} ${isRtl ? 'د.أ' : 'JOD'}`;

              return (
                <Interactive3DTilt
                  key={prod.id}
                  maxRotation={6}
                  scale={1.015}
                  showGlare={true}
                  className="bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#262626] hover:border-neutral-500 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl transition-colors duration-300"
                >
                  <div className="relative aspect-[4/5] bg-gradient-to-b from-[#181818] to-[#0A0A0A] flex items-center justify-center border-b border-[#222] p-8 overflow-hidden group">
                    <div className="absolute top-5 start-5 z-20 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{isRtl ? `${totalStock} متوفرة فقط` : `Only ${totalStock} left`}</span>
                    </div>

                    <div className="absolute top-5 end-5 z-20 bg-[#D80032] text-white text-xs font-mono font-black px-3.5 py-1.5 rounded-full shadow-lg">
                      {displayPrice}
                    </div>

                    <img 
                      src={prod.images[0]} 
                      alt={isRtl ? prod.titleAr : prod.titleEn} 
                      className="w-4/5 h-auto max-h-[380px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105 select-none" 
                    />

                    <div className="absolute bottom-4 inset-x-6 z-20 flex justify-between items-center text-[11px] font-mono text-neutral-400 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                      <span>100% Bamboo Cotton</span>
                      <span className="text-white font-bold">DTG Print</span>
                    </div>
                  </div>

                  <div className="p-7 md:p-8 flex flex-col flex-1" dir={isRtl ? 'rtl' : 'ltr'}>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-normal mb-3 font-sans">
                      {isRtl ? prod.titleAr : prod.titleEn}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-300 font-mono leading-relaxed bg-[#161616] border border-[#262626] rounded-xl p-3 mb-6">
                      {isRtl ? prod.descriptionAr : prod.descriptionEn}
                    </p>

                    <div className="mt-auto">
                      <div className="mb-6">
                        <div className="flex justify-between items-center text-xs font-mono text-neutral-400 mb-2.5">
                          <span className="font-bold uppercase tracking-normal">
                            {isRtl ? 'اختر المقاس:' : 'Select Size:'}
                          </span>
                          {activeVariant && (
                            <span className="text-emerald-400 font-mono text-[11px]">
                              {isRtl ? `المتوفر: ${activeVariant.stockCount} قطع` : `Stock: ${activeVariant.stockCount} left`}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          {prod.variants.map((v) => {
                            const isSelected = selectedSizes[prod.id] === v.size;
                            const isOutOfStock = v.stockCount === 0;

                            return (
                              <button
                                key={v.id}
                                type="button"
                                disabled={isOutOfStock}
                                onClick={() => setSelectedSizes({ ...selectedSizes, [prod.id]: v.size })}
                                className={`relative py-3 rounded-xl font-mono text-sm font-black border transition-all flex flex-col items-center justify-center ${
                                  isOutOfStock
                                    ? 'bg-[#111] border-[#222] text-neutral-600 cursor-not-allowed opacity-40 line-through'
                                    : isSelected
                                      ? 'bg-white border-white text-black shadow-lg shadow-white/20'
                                      : 'bg-[#161616] border-[#2a2a2a] text-neutral-300 hover:border-neutral-400 hover:text-white'
                                }`}
                              >
                                <span>{v.size}</span>
                                <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-neutral-700 font-bold' : 'text-neutral-500'}`}>
                                  ({v.stockCount})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#1F1F1F]">
                        <div className="font-mono text-2xl font-black text-white">
                          {displayPrice}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(prod)}
                          className="flex-1 max-w-[200px] bg-white hover:bg-neutral-200 text-black py-4 px-5 rounded-2xl font-mono text-xs md:text-sm font-black uppercase tracking-normal transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-white/20 active:scale-95"
                        >
                          {addedItem === prod.id ? (
                            <>
                              <Check size={16} className="text-emerald-600" />
                              <span>{isRtl ? 'تمت الإضافة' : 'Added'}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={16} />
                              <span>{isRtl ? 'أضف للحقيبة' : 'Add to Bag'}</span>
                            </>
                          )}
                        </button>
                      </div>
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
