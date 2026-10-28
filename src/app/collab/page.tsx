'use client';

import React, { useState } from 'react';
import { Play, Volume2, VolumeX, ShoppingBag, X } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Interactive3DTilt from '@/components/Interactive3DTilt';
import { useStore } from '@/store';
import { Product } from '@/types';

// Hardcoded for now since they are needed on this specific collab page
const COLLAB_PRODUCTS: Product[] = [
  {
    id: "drop-helmet-05",
    slug: "helmet-white-tee",
    titleEn: "KEFFIYEH HELMET HEAVY TEE",
    titleAr: "تيشيرت الخوذة والكوفية الأبيض",
    category: "drops",
    descriptionEn: "100% Bamboo Cotton • High-Definition DTG Print • Crafted in Bali • Palestine Support • Full Back Print.",
    descriptionAr: "قطن خيزران فاخر ومستدام • طباعة الظهر • دعم فلسطين.",
    basePriceJOD: 20.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/helmet-back-white.jpg"],
    variants: [
      { id: "v10", sku: "HLM-S", size: "S", inStock: true, stockCount: 4 },
      { id: "v11", sku: "HLM-M", size: "M", inStock: true, stockCount: 5 },
      { id: "v12", sku: "HLM-L", size: "L", inStock: true, stockCount: 6 },
      { id: "v13", sku: "HLM-XL", size: "XL", inStock: true, stockCount: 2 },
      { id: "v14", sku: "HLM-2XL", size: "2XL", inStock: true, stockCount: 4 },
    ],
    orderToPrintTimeHours: 24,
    isPrePrinted: true,
    backPrintOnly: true,
  },
  {
    id: "drop-poster-06",
    slug: "poster-white-tee",
    titleEn: "PALESTINE GRAPHIC POSTER TEE",
    titleAr: "تيشيرت البوستر الجرافيكي الأبيض",
    category: "drops",
    descriptionEn: "100% Bamboo Cotton • High-Definition DTG Print • Crafted in Bali • Palestine Support • Full Back Print.",
    descriptionAr: "قطن خيزران فاخر ومستدام • طباعة الظهر • دعم فلسطين.",
    basePriceJOD: 20.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/palestine-back-white.jpg"],
    variants: [
      { id: "v15", sku: "PST-S", size: "S", inStock: true, stockCount: 3 },
      { id: "v16", sku: "PST-M", size: "M", inStock: true, stockCount: 1 },
      { id: "v17", sku: "PST-L", size: "L", inStock: true, stockCount: 1 },
      { id: "v18", sku: "PST-XL", size: "XL", inStock: true, stockCount: 8 },
      { id: "v19", sku: "PST-2XL", size: "2XL", inStock: true, stockCount: 1 },
    ],
    orderToPrintTimeHours: 24,
    isPrePrinted: true,
    backPrintOnly: true,
  }
];

export default function CollabPage() {
  const { lang, addToCart, setIsCartOpen } = useStore();
  const isRtl = lang === 'ar';
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const handleAddToCart = (prod: Product) => {
    const size = selectedSizes[prod.id];
    if (!size) {
      alert(isRtl ? 'يجب اختيار المقاس قبل إضافة القطعة إلى الحقيبة' : 'You must select a size before adding the item to your bag');
      return;
    }

    addToCart({
      id: crypto.randomUUID(),
      garment: 'tshirt',
      color: 'offwhite',
      size: size as GarmentSize,
      placement: 'back',
      artMode: 'presets',
      price: prod.basePriceJOD,
      selectedPreset: 'archive_1', // default placeholder
      isPrePrinted: true,
      productTitle: isRtl ? prod.titleAr : prod.titleEn,
    });
    setIsCartOpen(true);
  };

  return (
    <PageLayout>
      <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#D80032] selection:text-white pb-20">
        
        {/* 1. Dual Co-Branded Header */}
        <header className="pt-32 pb-16 px-4 md:px-8 border-b border-[#262626]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            
            <div className="flex items-center justify-center gap-6 md:gap-12 mb-12">
              <img src="/logo.png" alt="Midaan" className="h-16 md:h-24 object-contain brightness-0 invert" />
              <div className="text-4xl md:text-6xl font-light text-neutral-500">×</div>
              <img src="/sotusura.png" alt="Sotusura" className="h-16 md:h-24 object-contain rounded-lg" />
            </div>

            <div className="inline-block bg-[#D80032] text-white px-4 py-1.5 font-mono text-[10px] md:text-xs font-bold tracking-normal uppercase mb-8 rounded shadow-lg">
              MIDAAN COLLECTIVE × SOTUSURA CLOTHING // ARCHIVE 01
            </div>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 leading-relaxed font-serif" dir={isRtl ? 'rtl' : 'ltr'}>
              {isRtl 
                ? 'اندماج بين منصة ميدان للمناصرة عبر الأزياء، وثقافة الشارع المستقلة لصوت صورة. مجموعة "أرشيف 01" تعيد صياغة الذاكرة البصرية وتوثق السردية البديلة على قطع قطنية ثقيلة.'
                : 'A synergy between Midaan\'s Wearable Advocacy and Sotusura\'s independent underground street culture. The "Archive 01" capsule reframes visual memory, documenting the alternative narrative on heavyweight cotton.'}
            </p>
          </div>
        </header>

        {/* 2. Cinematic Video Showcase Section */}
        <section className="py-20 px-4 md:px-8 border-b border-[#262626] bg-[#111]">
          <div className="max-w-5xl mx-auto">
            <div 
              className="relative aspect-video bg-[#050505] border border-[#262626] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl"
              onClick={() => setIsVideoModalOpen(true)}
            >
              {/* Poster frame overlay placeholder - normally an img */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599557608244-9388df6718d0?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white transition-all duration-500 z-10">
                  <Play size={32} className="text-white group-hover:text-black ml-2" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="text-white font-mono font-bold tracking-normal text-sm mb-1 uppercase">Trailer: Archive 01</h3>
                  <p className="text-neutral-400 font-mono text-[10px] uppercase">Dir. Midaan Voice Initiative</p>
                </div>
                <div className="text-neutral-500 font-mono text-[10px] uppercase border border-[#333] px-2 py-1 rounded backdrop-blur">
                  01:45
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive 3D T-Shirt Showcase */}
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-normal mb-4">
              {isRtl ? 'القطع الحصرية (جاهزة للتسليم)' : 'EXCLUSIVE DROPS (IN-STOCK)'}
            </h2>
            <p className="text-neutral-400 font-mono text-xs uppercase tracking-normal">
              {isRtl ? 'كميات محدودة جداً' : 'Extremely Limited Quantities'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            {COLLAB_PRODUCTS.map((prod) => (
              <div key={prod.id} className="flex flex-col">
                <Interactive3DTilt className="aspect-[4/5] bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-[#262626] rounded-2xl flex items-center justify-center overflow-hidden mb-8 shadow-2xl">
                  {/* Backdrop glow */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-3xl"></div>
                  
                  <img 
                    src={prod.images[0]} 
                    alt={prod.titleEn} 
                    className="w-3/4 h-auto object-contain z-10 drop-shadow-2xl" 
                  />
                </Interactive3DTilt>

                <div className="flex flex-col flex-1" dir={isRtl ? 'rtl' : 'ltr'}>
                  <h3 className="text-2xl font-black uppercase tracking-normal mb-2">
                    {isRtl ? prod.titleAr : prod.titleEn}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                    {isRtl ? prod.descriptionAr : prod.descriptionEn}
                  </p>

                  <div className="mt-auto">
                    <div className="mb-6">
                      <div className="text-[10px] font-mono text-neutral-500 mb-3 uppercase tracking-normal">
                        {isRtl ? 'اختر المقاس:' : 'Select Size:'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {prod.variants.map((v) => (
                          <button
                            key={v.id}
                            disabled={v.stockCount === 0}
                            onClick={() => setSelectedSizes({ ...selectedSizes, [prod.id]: v.size })}
                            className={`text-sm font-mono font-bold w-12 h-12 rounded-lg border transition-all ${
                              v.stockCount === 0
                                ? 'bg-[#111] border-[#222] text-neutral-600 cursor-not-allowed opacity-50 relative overflow-hidden before:absolute before:inset-0 before:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==")]'
                                : selectedSizes[prod.id] === v.size
                                  ? 'bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                  : 'bg-[#1A1A1A] border-[#333] text-neutral-400 hover:border-neutral-400 hover:text-white'
                            }`}
                          >
                            <span className="block">{v.size}</span>
                            {false && (
                              <span className="block text-[8px] text-[#D80032] -mt-1 leading-none">
                                {v.stockCount} {isRtl ? 'فقط' : 'left'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="font-mono text-2xl font-black text-white w-24">
                        {prod.basePriceJOD.toFixed(2)} <span className="text-xs text-[#D80032]">{isRtl ? 'د.أ' : 'JOD'}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="flex-1 bg-white hover:bg-neutral-200 text-black py-4 rounded-xl font-mono text-sm font-black uppercase tracking-normal transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10"
                      >
                        <ShoppingBag size={18} /> {isRtl ? 'أضف للحقيبة' : 'ADD TO BAG'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button 
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors z-[110] bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-[#262626] shadow-2xl">
            {/* Embedded video placeholder - using a generic nature video or similar if direct MP4 isn't available */}
            <video 
              src="/collab-video.mp4" 
              autoPlay 
              loop 
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-6 right-6 z-[110]">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
