"use client";

import React from "react";
import { Language, Product } from "@/types";
import { Flame, ArrowUpRight, ShoppingBag, Edit3 } from "lucide-react";
import { useStore } from "@/store";

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
    id: "drop-core-03",
    slug: "entehab-issue-zero-tee",
    titleEn: "ENTEHAB: ISSUE ZERO HEAVY TEE",
    titleAr: "تيشيرت العدد صفر: انتحاب",
    category: "drops",
    descriptionEn: "Commemorative drop for the launch of Midaan Magazine. Heavyweight cotton canvas chassis.",
    descriptionAr: "إصدار تذكاري بمناسبة إطلاق مجلة ميدان. قطن ثقيل خام.",
    basePriceJOD: 22.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/images/studio/tshirt-white-front.png"],
    variants: [
      { id: "v7", sku: "ENT-S", size: "S", inStock: true, stockCount: 50 },
      { id: "v8", sku: "ENT-M", size: "M", inStock: true, stockCount: 50 },
    ],
    orderToPrintTimeHours: 24,
  },
  {
    id: "drop-core-04",
    slug: "amman-underground-tote",
    titleEn: "AMMAN UNDERGROUND TOTE",
    titleAr: "حقيبة عمّان أندرغراوند",
    category: "drops",
    descriptionEn: "16oz Raw duck canvas tote bag. Printed edge-to-edge with the underground manifesto.",
    descriptionAr: "حقيبة قماش خام 16 أونصة. مطبوعة من الحافة للحافة ببيان المشهد المستقل.",
    basePriceJOD: 15.0,
    printSpec: "DTF_INDUSTRIAL_602A",
    images: ["/images/studio/tote-white.png"],
    variants: [
      { id: "v9", sku: "TOTE-OS", size: "O/S", inStock: true, stockCount: 100 },
    ],
    orderToPrintTimeHours: 12,
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

  const handleAddToCart = (prod: Product) => {
    addToCart({
      id: Math.random().toString(36).substring(2, 9),
      garment: prod.id.includes('hoodie') ? 'hoodie' : prod.id.includes('tote') ? 'tote' : 'tshirt',
      color: 'black',
      size: 'L',
      placement: 'center',
      artMode: 'presets',
      price: prod.basePriceJOD,
      selectedPreset: 'calligraphy'
    });
    setIsCartOpen(true);
  };

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="w-full bg-[#050505] py-20 px-4 md:px-8 font-sans border-t border-[#1F1F1F]">
      {/* Section Title */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between border-b border-[#262626] pb-8 mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#D80032] uppercase font-bold tracking-widest mb-2">
            <Flame size={16} />
            <span>{isRtl ? "المحل // إصدارات جاهزة" : "READY-TO-WEAR DROPS"}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter">
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
              <div className="absolute top-4 start-4 z-10 bg-[#D80032] text-white text-[9px] font-mono font-bold px-3 py-1.5 uppercase tracking-widest rounded-lg shadow-lg">
                DROP 0{idx + 1}
              </div>

              {prod.isCollab && (
                <div className="absolute top-4 end-4 z-10 bg-white text-black text-[9px] font-mono font-bold px-3 py-1.5 uppercase tracking-widest rounded-lg shadow-lg">
                  {prod.collabArtist}
                </div>
              )}

              <img src={prod.images[0]} alt={prod.titleEn} className="w-4/5 h-auto object-contain transition-transform duration-700 group-hover:scale-110" />

              <div className="absolute bottom-4 inset-x-4 flex gap-2">
                <button
                  onClick={() => handleAddToCart(prod)}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black py-3 rounded-lg font-mono text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag size={14} /> Bag
                </button>
                <button
                  onClick={() => handleCustomize(prod)}
                  className="w-12 h-12 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-white rounded-lg flex items-center justify-center transition-colors shadow-lg"
                  title="Customize in Studio"
                >
                  <Edit3 size={16} />
                </button>
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
              
              <div className="flex items-center justify-between border-t border-[#1A1A1A] pt-4 mt-auto">
                <div className="flex gap-1">
                  {prod.variants.slice(0, 3).map(v => (
                    <span key={v.id} className="text-[9px] font-mono font-bold bg-[#111] border border-[#333] text-neutral-400 px-1.5 py-0.5 rounded">
                      {v.size}
                    </span>
                  ))}
                  {prod.variants.length > 3 && <span className="text-[9px] text-neutral-500">+{prod.variants.length - 3}</span>}
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
