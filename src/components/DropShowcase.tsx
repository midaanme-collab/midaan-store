"use client";

import React from "react";
import { Language, Product } from "@/types";
import { Flame, ArrowUpRight, ShoppingBag, Edit3, PackageCheck } from "lucide-react";
import { useStore } from "@/store";
import { useState } from "react";
import { GarmentSize } from "@/types";

interface DropShowcaseProps {
  lang?: Language;
  onSelectProduct?: (product: Product) => void;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "drop-elfar3i-01",
    slug: "elfar3i-nas-min-khashab",
    titleEn: "MIDAAN × ELFAR3I // ناس من خشب",
    titleAr: "ميدان × الفرعي // ناس من خشب",
    category: "collabs",
    descriptionEn: "Official limited capsule celebrating Arabic acoustic hip-hop underground. Heavyweight 300GSM carded cotton.",
    descriptionAr: "التعاون الرسمي الحصري مع طارق أبو كويك (الفرعي). قطن ثقيل معالج 300 غرام بطباعة حرارية مزدوجة.",
    basePriceJOD: 24.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/merch/elfar3i-black-front.jpg"],
    variants: [
      { id: "v1", sku: "FR3-S", size: "S", inStock: true, stockCount: 14 },
      { id: "v2", sku: "FR3-M", size: "M", inStock: true, stockCount: 22 },
      { id: "v3", sku: "FR3-L", size: "L", inStock: true, stockCount: 8 },
      { id: "v4", sku: "FR3-XL", size: "XL", inStock: true, stockCount: 5 },
    ],
    isCollab: true,
    collabArtist: "Elfar3i / طارق الفرعي",
    orderToPrintTimeHours: 24,
  },
  {
    id: "drop-core-02",
    slug: "midaan-statement-hoodie",
    titleEn: "MIDAAN HEAVY STATEMENT HOODIE",
    titleAr: "هودي ميدان الأساسي الثقيل 460GSM",
    category: "drops",
    descriptionEn: "Boxy brutalist silhouette crafted in Jordan. High-density embroidery with DTF underprint.",
    descriptionAr: "قصة بوكسي ستريت عريضة مصنعة في الأردن. تطريز عالي الكثافة مع تفاصيل دقيقة خلفية.",
    basePriceJOD: 36.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/merch/hoodie-black-front.jpg"],
    variants: [
      { id: "v5", sku: "MDN-H-M", size: "M", inStock: true, stockCount: 15 },
      { id: "v6", sku: "MDN-H-L", size: "L", inStock: true, stockCount: 20 },
    ],
    orderToPrintTimeHours: 18,
  },
  {
    id: "drop-helmet-05",
    slug: "helmet-white-tee",
    titleEn: "HELMET WHITE TEE",
    titleAr: "تيشيرت الخوذة الأبيض",
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
    titleEn: "POSTER WHITE TEE",
    titleAr: "تيشيرت البوستر الأبيض",
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
  },
];

export default function DropShowcase({ lang = "ar" }: DropShowcaseProps) {
  const isRtl = lang === "ar";
  const { addToCart, setIsCartOpen, setGarment, setArtMode, setSelectedPreset } = useStore();

  const handleCustomize = (prod: Product) => {
    if (prod.id.includes('elfar3i')) {
      setGarment('tshirt');
      setArtMode('presets');
      setSelectedPreset('far3i');
    } else if (prod.id.includes('hoodie')) {
      setGarment('hoodie');
      setArtMode('presets');
      setSelectedPreset('calligraphy');
    } else if (prod.id.includes('tote')) {
      setGarment('tote');
      setArtMode('presets');
      setSelectedPreset('press');
    } else {
      setGarment('tshirt');
      setArtMode('presets');
      setSelectedPreset('press');
    }
    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const handleAddToCart = (prod: Product) => {
    let size = 'L';
    if (prod.isPrePrinted) {
      size = selectedSizes[prod.id];
      if (!size) {
        alert(isRtl ? 'الرجاء اختيار المقاس' : 'Please select a size');
        return;
      }
    }

    addToCart({
      id: crypto.randomUUID(),
      garment: prod.id.includes('hoodie') ? 'hoodie' : prod.id.includes('tote') ? 'tote' : 'tshirt',
      color: prod.isPrePrinted ? 'offwhite' : 'black',
      size: (prod.id.includes('tote') ? 'O/S' : size) as GarmentSize,
      placement: prod.backPrintOnly ? 'back' : 'center',
      artMode: 'presets',
      price: prod.basePriceJOD,
      selectedPreset: 'calligraphy',
      isPrePrinted: prod.isPrePrinted,
      productTitle: isRtl ? prod.titleAr : prod.titleEn,
    });
    setIsCartOpen(true);
  };

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="w-full bg-[#050505] py-20 px-4 md:px-8 font-sans border-t border-[#1F1F1F]">
      {/* Section Title */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#262626] pb-8 mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D80032] uppercase font-bold tracking-normal mb-2">
            <Flame size={16} />
            <span>{isRtl ? "المحل // إصدارات جاهزة" : "READY-TO-WEAR DROPS"}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-normal">
            {isRtl ? "مجموعات الشارع الرسمية" : "OFFICIAL MERCHANDISE"}
          </h2>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURED_PRODUCTS.map((prod, idx) => (
          <div
            key={prod.id}
            className="group bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-[#262626] hover:border-white transition-all rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl hover:-translate-y-2"
          >
            <div className="relative aspect-[4/5] bg-[#050505] flex items-center justify-center border-b border-[#262626] overflow-hidden">
              <div className="absolute top-4 start-4 z-10 bg-[#D80032] text-white text-[9px] font-mono font-bold px-3 py-1.5 uppercase tracking-normal rounded-lg shadow-lg">
                DROP 0{idx + 1}
              </div>

              {prod.isCollab && (
                <div className="absolute top-4 end-4 z-10 bg-white text-black text-[9px] font-mono font-bold px-3 py-1.5 uppercase tracking-normal rounded-lg shadow-lg">
                  {prod.collabArtist}
                </div>
              )}

              <img src={prod.images[0]} alt={prod.titleEn} className="w-4/5 h-auto object-contain transition-transform duration-700 group-hover:scale-110" />

              {prod.isPrePrinted && (
                 <div className="absolute top-14 start-4 z-10 flex flex-col gap-1">
                  <div className="bg-green-600/90 text-white text-[9px] font-mono font-bold px-2 py-1 uppercase tracking-normal rounded shadow-lg backdrop-blur flex items-center gap-1">
                    <PackageCheck size={10} />
                    {isRtl ? "جاهز للشحن الفوري (تسليم 24 ساعة في عمّان)" : "In Stock — Dispatches within 24h"}
                  </div>
                  {prod.backPrintOnly && (
                    <div className="bg-[#111]/90 text-neutral-300 text-[9px] font-mono font-bold px-2 py-1 uppercase tracking-normal rounded shadow-lg backdrop-blur border border-[#333] inline-flex items-center">
                      {isRtl ? "طباعة الظهر (Back Print)" : "Back Print"}
                    </div>
                  )}
                 </div>
              )}

              <div className="absolute bottom-4 inset-x-4 flex gap-2">
                <button
                  onClick={() => handleAddToCart(prod)}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black py-3 rounded-lg font-mono text-[10px] font-black uppercase tracking-normal transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag size={14} /> Bag
                </button>
                {!prod.isPrePrinted && (
                  <button
                    onClick={() => handleCustomize(prod)}
                    className="w-12 h-12 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-white rounded-lg flex items-center justify-center transition-colors shadow-lg"
                    title="Customize in Studio"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-black text-lg text-white leading-tight font-sans">
                  {isRtl ? prod.titleAr : prod.titleEn}
                </h3>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-3 mb-6 font-serif">
                {isRtl ? prod.descriptionAr : prod.descriptionEn}
              </p>
              
              {prod.isPrePrinted && (
                <div className="mb-4">
                  <div className="text-[10px] font-mono text-neutral-500 mb-2 uppercase tracking-normal">{isRtl ? 'اختر المقاس:' : 'Select Size:'}</div>
                  <div className="flex flex-wrap gap-2">
                    {prod.variants.map((v) => (
                      <button
                        key={v.id}
                        disabled={v.stockCount === 0}
                        onClick={() => setSelectedSizes({ ...selectedSizes, [prod.id]: v.size })}
                        className={`text-xs font-mono font-bold px-3 py-1.5 rounded border transition-colors ${
                          v.stockCount === 0
                            ? 'bg-[#111] border-[#222] text-neutral-600 cursor-not-allowed opacity-50'
                            : selectedSizes[prod.id] === v.size
                              ? 'bg-white border-white text-black'
                              : 'bg-[#1A1A1A] border-[#333] text-neutral-400 hover:border-neutral-400 hover:text-white'
                        }`}
                      >
                        {v.size} {v.stockCount > 0 && v.stockCount <= 5 && <span className="text-[#D80032] ml-1">({v.stockCount})</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-4 mt-auto">
                <div className="flex gap-1">
                  {!prod.isPrePrinted && prod.variants.slice(0, 3).map(v => (
                    <span key={v.id} className="text-[9px] font-mono font-bold bg-[#111] border border-[#333] text-neutral-400 px-1.5 py-0.5 rounded">
                      {v.size}
                    </span>
                  ))}
                  {!prod.isPrePrinted && prod.variants.length > 3 && <span className="text-[9px] text-neutral-500">+{prod.variants.length - 3}</span>}
                </div>
                <span className="font-mono text-lg font-black text-white">
                  {prod.basePriceJOD.toFixed(2)} <span className="text-[10px] text-[#D80032]">{isRtl ? "د.أ" : "JOD"}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
