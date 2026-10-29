export const CLIQ_ALIAS = 'MIDAANME';

export const BASE_PRICES = {
  tshirt: 35,
  hoodie: 36,
  tote: 12,
} as const;

export const COLOR_HEX = {
  black: '#101010',
  offwhite: '#E5E0D0',
  charcoal: '#242424',
} as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;
export type GarmentSize = typeof SIZES[number];

export const GOVERNORATES = [
  { id: 'amman', nameAr: 'العاصمة عمّان', nameEn: 'Amman', fee: 2.5 },
  { id: 'zarqa', nameAr: 'الزرقاء', nameEn: 'Zarqa', fee: 3.5 },
  { id: 'irbid', nameAr: 'إربد', nameEn: 'Irbid', fee: 3.5 },
  { id: 'balqa', nameAr: 'البلقاء / السلط', nameEn: 'Balqa / As-Salt', fee: 3.5 },
  { id: 'madaba', nameAr: 'مأدبا', nameEn: 'Madaba', fee: 3.5 },
  { id: 'jerash', nameAr: 'جرش', nameEn: 'Jerash', fee: 3.5 },
  { id: 'ajloun', nameAr: 'عجلون', nameEn: 'Ajloun', fee: 3.5 },
  { id: 'mafraq', nameAr: 'المفرق', nameEn: 'Mafraq', fee: 3.5 },
  { id: 'karak', nameAr: 'الكرك', nameEn: 'Karak', fee: 3.5 },
  { id: 'tafilah', nameAr: 'الطفيلة', nameEn: 'Tafilah', fee: 3.5 },
  { id: 'maan', nameAr: 'معان', nameEn: "Ma'an", fee: 3.5 },
  { id: 'aqaba', nameAr: 'العقبة', nameEn: 'Aqaba', fee: 3.5 },
];

export const STUDIO_MOCKUPS: Record<string, Record<string, { front: string; back: string }>> = {
  tshirt: {
    black: { front: '/images/studio/tshirt-black-front.png', back: '/images/studio/tshirt-black-back.png' },
    offwhite: { front: '/images/studio/tshirt-white-front.png', back: '/images/studio/tshirt-white-back.png' },
    charcoal: { front: '/images/studio/tshirt-charcoal-front.png', back: '/images/studio/tshirt-charcoal-back.png' },
  },
  hoodie: {
    black: { front: '/images/studio/hoodie-black-front.png', back: '/images/studio/hoodie-black-back.png' },
    offwhite: { front: '/images/studio/hoodie-white-front.png', back: '/images/studio/hoodie-white-back.png' },
    charcoal: { front: '/images/studio/hoodie-charcoal-front.png', back: '/images/studio/hoodie-charcoal-back.png' },
  },
  tote: {
    black: { front: '/images/studio/tote-black.png', back: '/images/studio/tote-black.png' },
    offwhite: { front: '/images/studio/tote-white.png', back: '/images/studio/tote-white.png' },
    charcoal: { front: '/images/studio/tote-charcoal.png', back: '/images/studio/tote-charcoal.png' },
  },
};

export const TSHIRT_SIZE_CHART = [
  { size: 'XS', a: 61, b: 46 },
  { size: 'S', a: 70, b: 48 },
  { size: 'M', a: 73, b: 50 },
  { size: 'L', a: 75, b: 52 },
  { size: 'XL', a: 77, b: 56 },
  { size: '2XL', a: 79, b: 64 },
  { size: '3XL', a: 81, b: 67 },
];

export const HOODIE_SIZE_CHART = [
  { size: 'XS', a: 64, b: 52 },
  { size: 'S', a: 66, b: 54 },
  { size: 'M', a: 71, b: 57 },
  { size: 'L', a: 74, b: 59 },
  { size: 'XL', a: 77, b: 61 },
  { size: '2XL', a: 81, b: 63 },
  { size: '3XL', a: 84, b: 66 },
];

export const HUB_WORKSHOPS = [
  {
    id: 'dtf_printing',
    titleAr: 'التقنيات الصناعية لطباعة الـ DTF والـ UV',
    titleEn: 'Industrial DTF & UV Print Mastery',
    dateAr: 'السبت، 3 أكتوبر 2026',
    dateEn: 'Saturday, Oct 3, 2026',
    durationAr: '3 ساعات تطبيقية',
    durationEn: '3 Practical Hours',
    instructorAr: 'فريق مشغل ميدان',
    instructorEn: 'Midan Studio Team',
    descAr: 'تدريب عملي مباشر على تجهيز الملفات، تشغيل مكائن الـ DTF الصناعية، وكبس التيشيرتات والأقمشة باحترافية.',
    descEn: 'Hands-on practical training on file pre-flight, industrial DTF machine operation, and heat pressing.',
    priceAr: 'مشمول بمنح الشباب / رمزي للمؤسسات',
    priceEn: 'Subsidized for youth / Nominal for NGOs',
  },
  {
    id: 'graphic_advocacy',
    titleAr: 'تصميم الملصقات والأزياء للتعبير والمناصرة',
    titleEn: 'Graphic Design for Civic Advocacy & Merch',
    dateAr: 'الأربعاء، 14 أكتوبر 2026',
    dateEn: 'Wednesday, Oct 14, 2026',
    durationAr: '4 جلسات تدريبية',
    durationEn: '4 Intensive Sessions',
    instructorAr: 'مصممون وناشطون ضيوف',
    instructorEn: 'Guest Designers & Activists',
    descAr: 'كيف تحوّل القضايا الحقوقية والمجتمعية إلى رسومات تعبيرية وهويات بصرية قوية قابلة للطباعة والانتشار.',
    descEn: 'Transforming civic causes into impactful visual identities and wearable advocacy concepts.',
    priceAr: 'مجاني للناشطين والشباب المستهدفين',
    priceEn: 'Free for activists and targeted youth',
  },
  {
    id: 'film_storytelling',
    titleAr: 'السرد السينمائي الرمزي والإنتاج المستقل',
    titleEn: 'Symbolic Cinema & Guerrilla Filmmaking',
    dateAr: 'السبت، 24 أكتوبر 2026',
    dateEn: 'Saturday, Oct 24, 2026',
    durationAr: 'يومان مكثفان',
    durationEn: '2-Day Intensive',
    instructorAr: 'مخرجو مبادرة صوت',
    instructorEn: 'The Voice Initiative Directors',
    descAr: 'تقنيات تطوير السيناريو القصير وبناء المشاهد البصرية الدرامية التي تعالج القضايا الإنسانية بميزانيات مرنة.',
    descEn: 'Screenwriting techniques and visual drama for independent human rights narratives.',
    priceAr: 'مشمول ببرنامج صوت ميدان',
    priceEn: 'Part of The Voice Initiative',
  }
];

export const basePrices = BASE_PRICES;
