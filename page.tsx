'use client';

import React, { useState, useRef } from 'react';
import { 
  ShoppingBag, 
  Sliders, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck,
  Globe, 
  Upload, 
  Ruler, 
  Trash2, 
  BookOpen, 
  Film, 
  Users, 
  Calendar, 
  MapPin, 
  Printer, 
  Compass 
} from 'lucide-react';

// قاموس الترجمة الكامل لضمان نقاء اللغة في كل زر وعنصر
const t = {
  ar: {
    brandSubtitle: "تجمع ميدان // مؤسسة اجتماعية للتعبير الديمقراطي والاقتصاد الإبداعي",
    tagline: "مبادرة مجتمع مدني مستقلة • صُنِعَت في عمّان",
    heroTitle: "مَـيـدَان: فضاء الإبداع والمناصرة والتعبير",
    heroDesc: "نموذج ريادي يدمج الاقتصاد الإبداعي بالمشاركة المدنية في الأردن. مساحة للشباب والناشطين لإنتاج أزياء معبّرة، نشر فكري مستقل، سرد سينمائي، وورش عمل تقنية.",
    btnCustomize: "استوديو التخصيص والمناصرة",
    btnHub: "المساحة الإبداعية والورش",
    btnVoice: "صوت ميدان (المجلة والسينما)",
    
    // استوديو التخصيص
    studioTitle: "1. استوديو المناصرة القابلة للارتداء (Wearable Advocacy)",
    studioDesc: "أزياء قطنية ثقيلة بتقنيات DTF الصناعية المباشرة. صمم قطعتك أو احمل رسالتك الخاصة.",
    selectGarment: "1. نوع القطعة:",
    selectColor: "2. لون القماش:",
    selectSize: "3. المقاس:",
    selectArtSource: "4. تصميم القطعة:",
    selectPlacement: "5. مكان وضع التصميم:",
    sizeChartBtn: "جدول القياسات بالسنتيمتر",
    oneSizeNotice: "مقاس موحد قياسي (38×42 سم)",
    jordanFitNotice: "قصة مريحة للجنسين (+/- 1.5 سم)",
    artPresets: "تصاميم ميدان",
    artCustomText: "كتابة نص",
    artUpload: "رفع تصميم خاص",
    typeTextPlaceholder: "اكتب عبارتك للطباعة...",
    uploadBoxTitle: "اضغط لرفع رسمتك أو شعارك (PNG / SVG)",
    uploadBoxSub: "يفضل خلفية شفافة للحصول على أعلى دقة طباعة DTF",
    uploadSuccess: "تم تحميل ملف تصميمك بنجاح",
    changeFile: "تغيير",
    fullChest: "أعلى منتصف الصدر",
    smallCorpo: "شعار الصدر الصغير",
    frontView: "الصدر (أمامي)",
    backView: "الظهر (خلفي)",
    totalPrice: "المجموع التقديري للقطعة:",
    orderNow: "طلب واستلام سريع",

    // المحور الثاني: Creative Hub
    hubSectionTitle: "2. المساحة الإبداعية وبناء القدرات (Creative Hub)",
    hubSectionDesc: "مساحة عمل مشتركة ومفتوحة في الرابية بعمّان للنشطاء، المصممين، وصنّاع الأفلام، مع برامج تدريبية وتطبيقية لتمكين الشباب.",
    hubBadge: "المشغل والمساحة",
    bookSpaceBtn: "طلب حجز مساحة أو فعالية",
    joinWorkshopBtn: "تسجيل في الورشة",
    hubFeature1Title: "مشغل التصميم والطباعة الحية",
    hubFeature1Desc: "معدات طباعة DTF وUV صناعية لتمكين المبادرات والشباب من إنتاج موادهم التعبيرية فورياً.",
    hubFeature2Title: "مساحة اللقاءات والحوار المدني",
    hubFeature2Desc: "بيئة آمنة لاحتضان جلسات التفكير، الحلقات النقاشية، والتخطيط لحملات التغيير المجتمعي.",
    hubFeature3Title: "نموذج إعادة الاستثمار المجتمعي",
    hubFeature3Desc: "عوائد الخدمات والإنتاج يُعاد استثمارها بالكامل لدعم تدريب الشباب وتوفير مساحات مجانية للمبادرات.",
    upcomingWorkshopsTitle: "ورش العمل وبرامج بناء القدرات القادمة",

    // المحور الثالث: The Voice
    voiceSectionTitle: "3. صوت ميدان: الإعلام المستقل والفنون (The Voice)",
    voiceSectionDesc: "منصة فكرية وفنية حرة تدعم حرية الرأي والتعبير عبر النشر المطبوع والرقمي والسرديات البصرية والسينما الرمزية.",
    voiceBadge: "النشر والسينما",
    magazineTitle: "مجلة ميدان — العدد صفر (انتحاب)",
    magazineDesc: "إصدار فكري ثقافي مستقل يبحث في قضايا الهوية، التحولات الاجتماعية، ودور الفن في التعبير المدني.",
    readIssueBtn: "تصفح العدد رقمياً (PDF)",
    cinemaTitle: "الإنتاج السينمائي والسرديات البصرية",
    cinemaDesc: "إنتاج أفلام مستقلة ودراما رمزية قصيرة تعكس الواقع الإنساني وتدعم الوعي الحقوقي.",
    watchProjectBtn: "استعراض ملف الإنتاج",

    // الفوتر والنوافذ
    footerText: "تجمع ميدان (Midan Collective) • استوديو ومشغل الرابية، عمّان، الأردن • جميع الحقوق محفوظة 2026",
    close: "إغلاق",
    fullName: "الاسم الكريم:",
    phone: "رقم الهاتف (واتساب):",
    governorate: "المحافظة:",
    address: "العنوان بالتفصيل:",
    cliqAlias: "اسم كليك المستعار:",
    copyCliq: "نسخ اسم كليك",
    copied: "تم النسخ!",
    grandTotal: "المجموع الإجمالي مع التوصيل:",
    confirmOrder: "تأكيد الطلب وإرسال عبر واتساب 📲",
    orderModalTitle: "إتمام الطلب من استوديو ميدان",
    workshopModalTitle: "التسجيل في الورشة التدريبية",
    submitWorkshopWhatsApp: "تأكيد حجز الورشة عبر واتساب 📲",
    fabricSpecsTitle: "مواصفات القماش والغسيل:",
    tshirtSpecs: "قطن ممشط 100% (175 جم/م² أبيض، 150 جم/م² ملون)، ياقة سادة بدون أي علامات تجارية داخلية.",
    hoodieSpecs: "ميلتون 65% قطن و35% بوليستر فليس دافئ (300 جم/م²)، قصة مريحة للجنسين.",
    careInstructions: "الغسيل بماء بارد مقلوباً للداخل. يُمنع ملامسة المكواة لسطح الطباعة مباشرة."
  },
  en: {
    brandSubtitle: "MIDAN COLLECTIVE // SOCIAL ENTERPRISE FOR DEMOCRATIC EXPRESSION",
    tagline: "INDEPENDENT CIVIL SOCIETY ACTION • CRAFTED IN AMMAN",
    heroTitle: "MIDAN: SPACE FOR EXPRESSION, ARTS & ADVOCACY",
    heroDesc: "A pioneering social enterprise merging the creative economy with civic engagement in Jordan. Empowering youth and activists through wearable advocacy, independent publishing, symbolic cinema, and technical workshops.",
    btnCustomize: "Wearable Advocacy Studio",
    btnHub: "The Creative Hub & Workshops",
    btnVoice: "The Voice (Magazine & Cinema)",

    // Studio
    studioTitle: "1. Wearable Advocacy Studio (Live DTF Printing)",
    studioDesc: "Heavyweight streetwear crafted with industrial DTF printing. Express your identity and democratic values.",
    selectGarment: "1. Garment Type:",
    selectColor: "2. Fabric Color:",
    selectSize: "3. Size:",
    selectArtSource: "4. Artwork Source:",
    selectPlacement: "5. Print Placement:",
    sizeChartBtn: "Centimeter Size Chart",
    oneSizeNotice: "Standard One Size (38×42 cm)",
    jordanFitNotice: "Relaxed unisex streetwear fit (+/- 1.5 cm)",
    artPresets: "Midan Artworks",
    artCustomText: "Type Text",
    artUpload: "Upload Design",
    typeTextPlaceholder: "Type your statement...",
    uploadBoxTitle: "Click to upload artwork or logo (PNG / SVG)",
    uploadBoxSub: "Transparent background recommended for sharpest DTF print",
    uploadSuccess: "Artwork uploaded successfully",
    changeFile: "Change",
    fullChest: "Upper Center Chest",
    smallCorpo: "Left Chest (Small Logo)",
    frontView: "Front View",
    backView: "Back View",
    totalPrice: "Estimated Piece Total:",
    orderNow: "Instant Order & Dispatch",

    // Hub
    hubSectionTitle: "2. The Creative Hub & Capacity Building",
    hubSectionDesc: "A dedicated collaborative space in Al-Rabieh, Amman for activists, designers, and filmmakers, hosting hands-on workshops and civic dialogues.",
    hubBadge: "The Workshop & Space",
    bookSpaceBtn: "Inquire Venue / Hub Booking",
    joinWorkshopBtn: "Register for Workshop",
    hubFeature1Title: "Live Industrial Printing Studio",
    hubFeature1Desc: "Equipped with DTF and UV printing technology, enabling youth and initiatives to produce visual advocacy materials on demand.",
    hubFeature2Title: "Civic Dialogue & Collaboration",
    hubFeature2Desc: "A safe, supportive environment for human rights workshops, creative hackathons, and collective campaigning.",
    hubFeature3Title: "Social Reinvestment Model",
    hubFeature3Desc: "Commercial printing revenues are directly reinvested to subsidize free training and workspace for marginalized youth.",
    upcomingWorkshopsTitle: "Upcoming Workshops & Training Programs",

    // Voice
    voiceSectionTitle: "3. The Voice: Independent Media & Cinema",
    voiceSectionDesc: "An open intellectual and artistic platform advancing freedom of speech through print publications, digital essays, and symbolic cinema.",
    voiceBadge: "Publishing & Cinema",
    magazineTitle: "Midan Magazine — Issue Zero (Entehab)",
    magazineDesc: "A cultural and intellectual publication exploring identity, democratic transformations, and grassroots art in the Arab world.",
    readIssueBtn: "Read Digital Edition (PDF)",
    cinemaTitle: "Symbolic Cinema & Visual Storytelling",
    cinemaDesc: "Producing independent short films and allegorical drama addressing civil liberties and human experiences.",
    watchProjectBtn: "View Production Dossier",

    // Footer & Modals
    footerText: "Midan Collective • Al-Rabieh Studio, Amman, Jordan • All Rights Reserved 2026",
    close: "Close",
    fullName: "Full Name:",
    phone: "Phone (WhatsApp):",
    governorate: "Governorate:",
    address: "Detailed Address:",
    cliqAlias: "CliQ Alias:",
    copyCliq: "Copy CliQ Alias",
    copied: "Copied!",
    grandTotal: "Grand Total with Delivery:",
    confirmOrder: "Confirm Order via WhatsApp 📲",
    orderModalTitle: "Complete Your Midan Studio Order",
    workshopModalTitle: "Register for Capacity Building Workshop",
    submitWorkshopWhatsApp: "Confirm Workshop Booking via WhatsApp 📲",
    fabricSpecsTitle: "Fabric Specs & Care Instructions:",
    tshirtSpecs: "100% Combed Cotton (175 GSM White, 150 GSM Colors), tagless collar.",
    hoodieSpecs: "Heavyweight 300 GSM winter fleece (65% cotton, 35% polyester), relaxed unisex fit.",
    careInstructions: "Wash inside-out with cold water. Never iron directly on print."
  }
};

// مسارات الموك أب الفوتوغرافي الحقيقي
const STUDIO_MOCKUPS: Record<string, Record<string, { front: string; back: string }>> = {
  tshirt: {
    black: { front: '/images/studio/tshirt-black-front.png', back: '/images/studio/tshirt-black-back.png' },
    offwhite: { front: '/images/studio/tshirt-white-front.png', back: '/images/studio/tshirt-white-back.png' },
    charcoal: { front: '/images/studio/tshirt-charcoal-front.png', back: '/images/studio/tshirt-charcoal-back.png' }
  },
  hoodie: {
    black: { front: '/images/studio/hoodie-black-front.png', back: '/images/studio/hoodie-black-back.png' },
    offwhite: { front: '/images/studio/hoodie-white-front.png', back: '/images/studio/hoodie-white-back.png' },
    charcoal: { front: '/images/studio/hoodie-charcoal-front.png', back: '/images/studio/hoodie-charcoal-back.png' }
  },
  tote: {
    black: { front: '/images/studio/tote-black.png', back: '/images/studio/tote-black.png' },
    offwhite: { front: '/images/studio/tote-white.png', back: '/images/studio/tote-white.png' },
    charcoal: { front: '/images/studio/tote-charcoal.png', back: '/images/studio/tote-charcoal.png' }
  }
};

// مصفوفة ورش العمل وبناء القدرات (المحور الثاني: Creative Hub)
const HUB_WORKSHOPS = [
  {
    id: 'dtf_printing',
    titleAr: 'التقنيات الصناعية لطباعة الـ DTF والـ UV',
    titleEn: 'Industrial DTF & UV Print Mastery',
    dateAr: 'السبت، 3 أكتوبر 2026',
    dateEn: 'Saturday, Oct 3, 2026',
    durationAr: '3 ساعات تطبيقية',
    durationEn: '3 Practical Hours',
    descAr: 'تدريب عملي مباشر على تجهيز الملفات، تشغيل مكائن الـ DTF الصناعية، وكبس التيشيرتات والأقمشة باحترافية.',
    descEn: 'Hands-on practical training on file pre-flight, industrial DTF machine operation, and heat pressing.',
    priceAr: 'مشمول بمنح الشباب / رمزي للمؤسسات',
    priceEn: 'Subsidized for youth / Nominal for NGOs'
  },
  {
    id: 'graphic_advocacy',
    titleAr: 'تصميم الملصقات والأزياء للتعبير والمناصرة',
    titleEn: 'Graphic Design for Civic Advocacy & Merch',
    dateAr: 'الأربعاء، 14 أكتوبر 2026',
    dateEn: 'Wednesday, Oct 14, 2026',
    durationAr: '4 جلسات تدريبية',
    durationEn: '4 Intensive Sessions',
    descAr: 'كيف تحوّل القضايا الحقوقية والمجتمعية إلى رسومات تعبيرية وهويات بصرية قوية قابلة للطباعة والانتشار.',
    descEn: 'Transforming civic causes into impactful visual identities and wearable advocacy concepts.',
    priceAr: 'مجاني للناشطين والشباب المستهدفين',
    priceEn: 'Free for activists and targeted youth'
  },
  {
    id: 'film_storytelling',
    titleAr: 'السرد السينمائي الرمزي والإنتاج المستقل',
    titleEn: 'Symbolic Cinema & Guerrilla Filmmaking',
    dateAr: 'السبت، 24 أكتوبر 2026',
    dateEn: 'Saturday, Oct 24, 2026',
    durationAr: 'يومان مكثفان',
    durationEn: '2-Day Intensive',
    descAr: 'تقنيات تطوير السيناريو القصير وبناء المشاهد البصرية الدرامية التي تعالج القضايا الإنسانية بميزانيات مرنة.',
    descEn: 'Screenwriting techniques and visual drama for independent human rights narratives.',
    priceAr: 'مشمول ببرنامج صوت ميدان',
    priceEn: 'Part of The Voice Initiative'
  }
];

const GOVERNORATES = [
  { id: 'amman', nameAr: 'العاصمة عمّان', nameEn: 'Amman', fee: 2.5 },
  { id: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa', fee: 3.5 },
  { id: 'irbid', nameAr: 'إربد', nameEn: 'Irbid', fee: 3.5 },
  { id: 'other', nameAr: 'باقي المحافظات', nameEn: 'Other Governorates', fee: 4.0 },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;
type GarmentSize = typeof SIZES[number];

const TSHIRT_SIZE_CHART = [
  { size: 'XS', a: 61, b: 46 },
  { size: 'S', a: 70, b: 48 },
  { size: 'M', a: 73, b: 50 },
  { size: 'L', a: 75, b: 52 },
  { size: 'XL', a: 77, b: 56 },
  { size: '2XL', a: 79, b: 64 },
  { size: '3XL', a: 81, b: 67 },
];

const HOODIE_SIZE_CHART = [
  { size: 'XS', a: 64, b: 52 },
  { size: 'S', a: 66, b: 54 },
  { size: 'M', a: 71, b: 57 },
  { size: 'L', a: 74, b: 59 },
  { size: 'XL', a: 77, b: 61 },
  { size: '2XL', a: 81, b: 63 },
  { size: '3XL', a: 84, b: 66 },
];

export default function MidaanFlagship() {
  const [hasEntered, setHasEntered] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const strings = t[lang];
  const isRtl = lang === 'ar';

  const [garment, setGarment] = useState<'tshirt' | 'hoodie' | 'tote'>('tshirt');
  const [view, setView] = useState<'front' | 'back'>('front');
  const [color, setColor] = useState<'black' | 'offwhite' | 'charcoal'>('black');
  const [size, setSize] = useState<GarmentSize>('L');
  const [placement, setPlacement] = useState<'center' | 'small_corpo'>('center');
  
  const [artMode, setArtMode] = useState<'presets' | 'text' | 'upload'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<'calligraphy' | 'press' | 'far3i'>('calligraphy');
  const [customText, setCustomText] = useState(isRtl ? 'مَـيـدَان' : 'MIDAAN');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'tshirt' | 'hoodie'>('tshirt');
  const [selectedGov, setSelectedGov] = useState(GOVERNORATES[0]);
  const [copiedCliq, setCopiedCliq] = useState(false);

  // نافذة الورش
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('');

  // دوال تجهيز روابط الواتساب لتجنب أخطاء تداخل النصوص
  const getWhatsAppWorkshopUrl = () => {
    const msg = `مرحباً استوديو ميدان، أود التسجيل أو الاستفسار بخصوص: ${selectedWorkshop}`;
    return `https://wa.me/962790000000?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppOrderUrl = () => {
    const sizeStr = garment === 'tote' ? 'One Size' : size;
    const msg = `مرحباً استوديو ميدان، أود تأكيد طلبي: قطعة ${garment} - مقاس ${sizeStr} - مكان التصميم: ${placement}. المجموع: ${finalTotal.toFixed(2)} د.أ`;
    return `https://wa.me/962790000000?text=${encodeURIComponent(msg)}`;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const basePrices = { tshirt: 20, hoodie: 36, tote: 12 };
  const currentPrice = basePrices[garment];
  const finalTotal = currentPrice + selectedGov.fee;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target?.result as string);
        setArtMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const copyCliq = () => {
    navigator.clipboard.writeText('MIDAAN');
    setCopiedCliq(true);
    setTimeout(() => setCopiedCliq(false), 2000);
  };

  const openWorkshopModal = (workshopTitle: string) => {
    setSelectedWorkshop(workshopTitle);
    setIsWorkshopModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 selection:bg-red-600 selection:text-white relative overflow-hidden font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. البوابة الترحيبية الافتتاحية */}
      {!hasEntered && (
        <div className="fixed inset-0 z-50 bg-[#070707] flex flex-col items-center justify-center p-6 text-center">
          <div className="relative group cursor-pointer" onClick={() => setHasEntered(true)}>
            <div className="absolute -inset-8 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-600/40 transition-all duration-500" />
            <img 
              src="/logo.png" 
              alt="MIDAAN" 
              className="relative h-44 md:h-64 w-auto object-contain brightness-0 invert drop-shadow-[0_10px_35px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <p className="font-mono text-xs md:text-sm tracking-widest text-neutral-400 uppercase mt-8 animate-pulse">
            {isRtl ? "اضغط على الشعار للدخول إلى فضاء ميدان" : "CLICK LOGO TO ENTER MIDAN COLLECTIVE"}
          </p>

          <button
            onClick={() => setHasEntered(true)}
            className="mt-6 px-6 py-2 rounded-full border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
          >
            {isRtl ? "الدخول المباشر ←" : "Direct Entry →"}
          </button>
        </div>
      )}

      {/* 2. شريط التنقل المتناسق مع المحاور الثلاثة */}
      <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-md border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="cursor-pointer group flex items-center"
        >
          <img 
            src="/logo.png" 
            alt="MIDAAN" 
            className="h-12 md:h-16 w-auto object-contain brightness-0 invert group-hover:opacity-85 transition-opacity" 
          />
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-neutral-300">
          <a href="#studio" className="hover:text-red-500 transition flex items-center gap-1.5">
            <Sliders size={14} className="text-red-500" />
            <span>{strings.btnCustomize}</span>
          </a>
          <a href="#hub" className="hover:text-red-500 transition flex items-center gap-1.5">
            <Compass size={14} className="text-red-500" />
            <span>{strings.btnHub}</span>
          </a>
          <a href="#voice" className="hover:text-red-500 transition flex items-center gap-1.5">
            <BookOpen size={14} className="text-red-500" />
            <span>{strings.btnVoice}</span>
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900 text-xs font-bold text-neutral-200 hover:text-white hover:border-neutral-600 transition-all shadow-md"
          >
            <Globe size={13} className="text-red-500" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </header>

      {/* 3. زر السلة العائم */}
      <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 flex items-center`}>
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="relative group w-16 h-16 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-[0_0_30px_rgba(216,0,50,0.65)] hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-300"
          title={strings.orderNow}
        >
          <span className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
          <ShoppingBag size={20} />
          <span className="text-[10px] font-mono font-black mt-0.5">
            {currentPrice} {isRtl ? 'د.أ' : 'JOD'}
          </span>
        </button>
      </div>

      {/* 4. قسم الواجهة الرئيسية (Hero & Social Enterprise Mission) */}
      <section className="relative z-10 pt-20 pb-24 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-950 text-xs font-medium text-neutral-300 mb-8">
          <span className="text-red-600 font-bold">●</span>
          <span>{strings.tagline}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
          {strings.heroTitle}
        </h1>

        <p className="max-w-2xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed mb-10">
          {strings.heroDesc}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#studio"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-red-600/25"
          >
            <Sliders size={16} />
            <span>{strings.btnCustomize}</span>
          </a>
          <a
            href="#hub"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95"
          >
            <Compass size={16} className="text-red-500" />
            <span>{strings.btnHub}</span>
          </a>
          <a
            href="#voice"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 px-8 py-3.5 text-xs sm:text-sm font-bold rounded-full flex items-center gap-2 transition-transform active:scale-95"
          >
            <BookOpen size={16} className="text-red-500" />
            <span>{strings.btnVoice}</span>
          </a>
        </div>
      </section>

      {/* 5. المحور الأول: استوديو التخصيص والمناصرة القابلة للارتداء (Wearable Advocacy) */}
      <section id="studio" className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-neutral-900 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold mb-2">
              <Sliders size={13} />
              <span>{isRtl ? "المحور الأول: أزياء التعبير" : "Pillar 1: Wearable Advocacy"}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">{strings.studioTitle}</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">{strings.studioDesc}</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSizeChartOpen(true)}
              className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white border border-neutral-800 bg-neutral-900 px-3.5 py-2 rounded-xl transition"
            >
              <Ruler size={14} className="text-red-500" />
              <span>{strings.sizeChartBtn}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* الموك اب الفوتوغرافي الواقعي */}
          <div className="lg:col-span-7 bg-[#0E0E0E] border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[540px] relative shadow-2xl overflow-hidden">
            {garment !== 'tote' && (
              <div className={`absolute top-5 z-20 flex gap-2 ${isRtl ? 'left-5' : 'right-5'}`}>
                <button 
                  onClick={() => setView('front')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    view === 'front' ? 'bg-red-600 text-white shadow' : 'bg-black/60 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {strings.frontView}
                </button>
                <button 
                  onClick={() => setView('back')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    view === 'back' ? 'bg-red-600 text-white shadow' : 'bg-black/60 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {strings.backView}
                </button>
              </div>
            )}

            <div className={`absolute top-5 z-20 text-[11px] font-mono text-neutral-300 bg-black/80 px-3 py-1.5 rounded-full border border-neutral-800 ${isRtl ? 'right-5' : 'left-5'}`}>
              {placement === 'small_corpo' ? strings.smallCorpo : strings.fullChest}
            </div>

            <div className="w-full max-w-[360px] aspect-[4/5] relative flex items-center justify-center">
              {/* صورة المنتج الحقيقي */}
              <img 
                src={STUDIO_MOCKUPS[garment][color][garment === 'tote' ? 'front' : view]}
                alt={`${garment} mockup`}
                className="w-full h-full object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] select-none pointer-events-none transition-all duration-300"
              />

              {/* طبقة التصميم والطباعة المباشرة */}
              <div 
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
                  garment === 'tote'
                    ? 'translate-y-8 scale-75'
                    : placement === 'small_corpo' 
                      ? (isRtl ? 'scale-[0.35] translate-x-14 -translate-y-24' : 'scale-[0.35] -translate-x-14 -translate-y-24')
                      : 'scale-90 -translate-y-16 sm:-translate-y-20'
                }`}
              >
                {artMode === 'upload' && uploadedImage && (
                  <div className="max-w-[190px] max-h-[220px] flex items-center justify-center drop-shadow-md">
                    <img src={uploadedImage} alt="Design" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                {artMode === 'text' && (
                  <div className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)] tracking-wider">
                    {customText}
                  </div>
                )}
                {artMode === 'presets' && (
                  <div className="text-2xl sm:text-4xl font-black text-white text-center border-y-2 border-white/60 py-2 px-4 drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]">
                    {selectedPreset === 'calligraphy' ? (isRtl ? 'مَـيـدَان' : 'MIDAAN') : selectedPreset === 'press' ? (isRtl ? 'صَحَافَة' : 'PRESS') : (isRtl ? 'الفرعي' : 'ELFAR3I')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* لوحة خيارات التخصيص */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-2">{strings.selectGarment}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tshirt', name: isRtl ? 'تيشيرت كلاسيك' : 'Classic Tee', sub: '175G' },
                  { id: 'hoodie', name: isRtl ? 'هودي شتوي' : 'Heavy Hoodie', sub: '300G' },
                  { id: 'tote', name: isRtl ? 'حقيبة توت باج' : 'Canvas Tote', sub: 'Canvas' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGarment(item.id as any)}
                    className={`py-3 px-2 rounded-xl border text-center transition ${
                      garment === item.id ? 'border-red-600 bg-red-600/15 text-white font-bold' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[10px] opacity-60 font-mono mt-0.5">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-2">{strings.selectColor}</label>
              <div className="flex gap-2">
                {[
                  { id: 'black', hex: '#101010', name: isRtl ? 'أسود' : 'Black' },
                  { id: 'offwhite', hex: '#E5E0D0', name: isRtl ? 'أبيض / بيج' : 'White / Off-White' },
                  { id: 'charcoal', hex: '#242424', name: isRtl ? 'رمادي غامق' : 'Charcoal' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs transition ${
                      color === c.id ? 'border-red-600 bg-neutral-800 text-white font-bold' : 'border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-neutral-400">{strings.selectSize}</label>
                {garment !== 'tote' && (
                  <button 
                    onClick={() => {
                      setActiveChartTab(garment === 'hoodie' ? 'hoodie' : 'tshirt');
                      setIsSizeChartOpen(true);
                    }}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    {strings.sizeChartBtn}
                  </button>
                )}
              </div>

              {garment === 'tote' ? (
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 font-mono flex items-center justify-between">
                  <span>{strings.oneSizeNotice}</span>
                  <span className="text-red-500 font-bold">ONE SIZE</span>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`py-2 rounded-lg border text-xs font-mono font-bold transition ${
                        size === s ? 'border-red-600 bg-red-600 text-white' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-2">{strings.selectPlacement}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPlacement('center')}
                  className={`py-3 px-2 rounded-xl border text-center transition ${
                    placement === 'center' ? 'border-red-600 bg-red-600/10 text-white font-bold' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold block">{strings.fullChest}</span>
                </button>
                <button
                  onClick={() => setPlacement('small_corpo')}
                  className={`py-3 px-2 rounded-xl border text-center transition ${
                    placement === 'small_corpo' ? 'border-red-600 bg-red-600/10 text-white font-bold' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold block">{strings.smallCorpo}</span>
                </button>
              </div>
            </div>

            {/* مصدر التصميم */}
            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-2">{strings.selectArtSource}</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => setArtMode('presets')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition ${
                    artMode === 'presets' ? 'border-white bg-white/10 text-white' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {strings.artPresets}
                </button>
                <button
                  onClick={() => setArtMode('text')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition ${
                    artMode === 'text' ? 'border-white bg-white/10 text-white' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {strings.artCustomText}
                </button>
                <button
                  onClick={() => {
                    setArtMode('upload');
                    if (!uploadedImage) fileInputRef.current?.click();
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    artMode === 'upload' ? 'border-red-600 bg-red-600/15 text-white' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <Upload size={12} />
                  <span>{strings.artUpload}</span>
                </button>
              </div>

              {artMode === 'upload' && (
                <div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  {uploadedImage ? (
                    <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-xs">
                      <span className="text-green-400 font-bold">{strings.uploadSuccess}</span>
                      <div className="flex gap-2">
                        <button onClick={() => fileInputRef.current?.click()} className="underline text-neutral-400 hover:text-white">
                          {strings.changeFile}
                        </button>
                        <button onClick={() => setUploadedImage(null)} className="text-neutral-500 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-neutral-800 p-5 rounded-2xl text-center text-xs text-neutral-400 hover:border-red-600"
                    >
                      <Upload size={20} className="mx-auto mb-1 text-neutral-500" />
                      <div>{strings.uploadBoxTitle}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{strings.uploadBoxSub}</div>
                    </button>
                  )}
                </div>
              )}

              {artMode === 'text' && (
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={strings.typeTextPlaceholder}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                />
              )}
            </div>

            {/* المجموع والطلب الفوري */}
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400">{strings.totalPrice}</div>
                <div className="text-3xl font-black text-white mt-0.5">{currentPrice}.00 <span className="text-xs text-red-500">{isRtl ? 'د.أ' : 'JOD'}</span></div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
              >
                <span>{strings.orderNow}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. المحور الثاني: المساحة الإبداعية وبناء القدرات (Creative Hub) */}
      <section id="hub" className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900 bg-neutral-950/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold mb-2">
              <Compass size={13} />
              <span>{strings.hubBadge}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">{strings.hubSectionTitle}</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">{strings.hubSectionDesc}</p>
          </div>

          <button
            onClick={() => openWorkshopModal(isRtl ? 'طلب حجز مساحة عمل أو تنظيم فعالية في المشغل' : 'Creative Hub Venue Inquiry')}
            className="px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-bold transition flex items-center gap-2"
          >
            <MapPin size={14} />
            <span>{strings.bookSpaceBtn}</span>
          </button>
        </div>

        {/* مميزات ومرافق المساحة الإبداعية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center mb-4">
              <Printer size={20} />
            </div>
            <h4 className="text-base font-bold text-white mb-2">{strings.hubFeature1Title}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">{strings.hubFeature1Desc}</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h4 className="text-base font-bold text-white mb-2">{strings.hubFeature2Title}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">{strings.hubFeature2Desc}</p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-base font-bold text-white mb-2">{strings.hubFeature3Title}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">{strings.hubFeature3Desc}</p>
          </div>
        </div>

        {/* قائمة الورش التدريبية القادمة */}
        <div className="mt-8">
          <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-red-500" />
            <span>{strings.upcomingWorkshopsTitle}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HUB_WORKSHOPS.map((workshop) => (
              <div key={workshop.id} className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition">
                <div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mb-3">
                    <span className="text-red-500 font-bold">{isRtl ? workshop.dateAr : workshop.dateEn}</span>
                    <span>{isRtl ? workshop.durationAr : workshop.durationEn}</span>
                  </div>
                  <h5 className="text-base font-bold text-white mb-2">{isRtl ? workshop.titleAr : workshop.titleEn}</h5>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">{isRtl ? workshop.descAr : workshop.descEn}</p>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">{isRtl ? workshop.priceAr : workshop.priceEn}</span>
                  <button
                    onClick={() => openWorkshopModal(isRtl ? workshop.titleAr : workshop.titleEn)}
                    className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1"
                  >
                    <span>{strings.joinWorkshopBtn}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. المحور الثالث: صوت ميدان (الإعلام، النشر، والسينما) */}
      <section id="voice" className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold mb-2">
            <BookOpen size={13} />
            <span>{strings.voiceBadge}</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white">{strings.voiceSectionTitle}</h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">{strings.voiceSectionDesc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* كرت مجلة ميدان - العدد صفر */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition">
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-md bg-white/10 text-neutral-300 font-mono text-[10px] font-bold uppercase mb-4">
                ISSUE ZERO // العدد صفر
              </div>
              <h4 className="text-2xl font-black text-white mb-3">{strings.magazineTitle}</h4>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                {strings.magazineDesc}
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">Midan Publication 2026</span>
              <a
                href="#voice"
                onClick={(e) => {
                  e.preventDefault();
                  alert(isRtl ? "سيتم إتاحة النسخة الرقمية التفاعلية لتحميل PDF قريباً." : "Interactive PDF edition will be available shortly.");
                }}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <BookOpen size={14} />
                <span>{strings.readIssueBtn}</span>
              </a>
            </div>
          </div>

          {/* كرت السرديات البصرية والسينما الرمزية */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition">
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 rounded-md bg-white/10 text-neutral-300 font-mono text-[10px] font-bold uppercase mb-4">
                CINEMATIC NARRATIVES // سرديات بصرية
              </div>
              <h4 className="text-2xl font-black text-white mb-3">{strings.cinemaTitle}</h4>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                {strings.cinemaDesc}
              </p>
            </div>

            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">Short Film & Video Advocacy</span>
              <a
                href="#voice"
                onClick={(e) => {
                  e.preventDefault();
                  alert(isRtl ? "يمكنك استعراض المشاهد وقائمة اللقطات وملف الإنتاج من خلال التواصل المباشر مع استوديو ميدان." : "Production dossier and screening info available upon direct contact.");
                }}
                className="px-5 py-2.5 rounded-full border border-neutral-700 hover:border-neutral-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Film size={14} />
                <span>{strings.watchProjectBtn}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 8. نافذة جدول المقاسات */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsSizeChartOpen(false)}
              className={`absolute top-4 text-neutral-400 hover:text-white text-lg font-bold ${isRtl ? 'left-4' : 'right-4'}`}
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-neutral-800">
              <Ruler className="text-red-500" size={20} />
              <h4 className="text-lg font-bold text-white">{strings.sizeChartBtn}</h4>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveChartTab('tshirt')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  activeChartTab === 'tshirt' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {isRtl ? "تيشيرت كلاسيك (T-Shirt)" : "T-Shirt Size"}
              </button>
              <button
                onClick={() => setActiveChartTab('hoodie')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  activeChartTab === 'hoodie' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {isRtl ? "هودي شتوي (Hoodie)" : "Hoodie Size"}
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              * {isRtl ? "نسبة التفاوت المسموحة:" : "Allowed tolerance:"} <strong>(+/-) 1.5 cm</strong>.
            </p>

            <div className="overflow-x-auto border border-neutral-800 rounded-xl mb-5">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 font-bold">
                    <th className="py-2.5">{isRtl ? "المقاس" : "Size"}</th>
                    <th className="py-2.5">{isRtl ? "الطول A (سم)" : "Length A (cm)"}</th>
                    <th className="py-2.5">{isRtl ? "عرض الصدر B (سم)" : "Chest Width B (cm)"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200 font-mono">
                  {(activeChartTab === 'tshirt' ? TSHIRT_SIZE_CHART : HOODIE_SIZE_CHART).map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-800/40">
                      <td className="py-2 font-bold text-white">{row.size}</td>
                      <td className="py-2">{row.a} cm</td>
                      <td className="py-2">{row.b} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs space-y-2 text-neutral-300">
              <div className="font-bold text-white">● {strings.fabricSpecsTitle}</div>
              <p className="text-neutral-400 leading-relaxed">
                {activeChartTab === 'tshirt' ? strings.tshirtSpecs : strings.hoodieSpecs}
              </p>
              <p className="text-neutral-400 leading-relaxed">
                • {strings.careInstructions}
              </p>
            </div>

            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="mt-5 w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-xl text-xs font-bold"
            >
              {strings.close}
            </button>
          </div>
        </div>
      )}

      {/* 9. نافذة التسجيل في ورش العمل أو حجز المساحة (Workshop Registration Modal) */}
      {isWorkshopModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsWorkshopModalOpen(false)}
              className={`absolute top-4 text-neutral-400 hover:text-white text-lg font-bold ${isRtl ? 'left-4' : 'right-4'}`}
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                <Compass size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{strings.workshopModalTitle}</h4>
                <p className="text-[11px] text-neutral-400">{selectedWorkshop}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-neutral-400 text-xs leading-relaxed">
                {isRtl 
                  ? "تأكيد مشاركتك في برامج بناء القدرات واستوديو ميدان في الرابية يتم مباشرة عبر واتساب لترتيب المواعيد والمقاعد."
                  : "Registration and space booking confirmation are processed directly via WhatsApp to coordinate timing and seats."}
              </p>

              <a
                href={getWhatsAppWorkshopUrl()}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl text-xs sm:text-sm transition"
              >
                {strings.submitWorkshopWhatsApp}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 10. نافذة الدفع الفردي السريع (Checkout Modal) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className={`absolute top-4 text-neutral-400 hover:text-white text-lg font-bold ${isRtl ? 'left-4' : 'right-4'}`}
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-600 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{strings.orderModalTitle}</h4>
                <p className="text-xs text-neutral-400">{isRtl ? "تجهيز فوري وتوصيل لكافة المحافظات" : "Fast delivery across Jordan"}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">{strings.fullName}</label>
                <input
                  type="text"
                  placeholder={isRtl ? "الاسم الثلاثي" : "Your full name"}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">{strings.phone}</label>
                  <input
                    type="tel"
                    placeholder="07XXXXXXXX"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">{strings.governorate}</label>
                  <select
                    value={selectedGov.id}
                    onChange={(e) => {
                      const found = GOVERNORATES.find((g) => g.id === e.target.value);
                      if (found) setSelectedGov(found);
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-600"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {isRtl ? gov.nameAr : gov.nameEn} ({gov.fee.toFixed(2)} {isRtl ? 'د.أ' : 'JOD'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">{strings.address}</label>
                <input
                  type="text"
                  placeholder={isRtl ? "المنطقة، الشارع، البناية..." : "Area, street, building..."}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">{strings.cliqAlias}</span>
                  <span className="font-mono font-bold text-white bg-black px-3 py-1 rounded border border-neutral-700">MIDAAN</span>
                </div>
                <button
                  type="button"
                  onClick={copyCliq}
                  className="w-full bg-neutral-800 hover"
                  onClick={copyCliq}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {copiedCliq ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  <span>{copiedCliq ? strings.copied : strings.copyCliq}</span>
                </button>
              </div>

              <div className="bg-black/50 p-4 rounded-xl space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>{isRtl ? "قيمة القطعة:" : "Garment Price:"}</span>
                  <span className="text-white font-mono">{currentPrice}.00 {isRtl ? 'د.أ' : 'JOD'}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{isRtl ? `أجور التوصيل (${selectedGov.nameAr}):` : `Shipping (${selectedGov.nameEn}):`}</span>
                  <span className="text-white font-mono">{selectedGov.fee.toFixed(2)} {isRtl ? 'د.أ' : 'JOD'}</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-sm text-white">
                  <span>{strings.grandTotal}</span>
                  <span className="text-red-600 font-mono">{finalTotal.toFixed(2)} {isRtl ? 'د.أ' : 'JOD'}</span>
                </div>
              </div>

              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-black font-bold py-3.5 rounded-full text-xs sm:text-sm transition shadow-lg"
              >
                {strings.confirmOrder}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 11. الفوتر */}
      <footer className="relative z-10 py-10 px-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        <p className="font-bold text-neutral-300 text-sm mb-1">{strings.brandSubtitle}</p>
        <p>{strings.footerText}</p>
      </footer>
    </div>
  );
}