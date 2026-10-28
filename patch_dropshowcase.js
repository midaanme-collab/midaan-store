const fs = require('fs');

let content = fs.readFileSync('src/components/DropShowcase.tsx', 'utf8');

const search = `const FEATURED_PRODUCTS: Product[] = [
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
  {`;
  
const replace = `const FEATURED_PRODUCTS: Product[] = [
  {`;

content = content.replace(search, replace);

const searchGrid = `<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">`;
const replaceGrid = `<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">`;
content = content.replace(searchGrid, replaceGrid);

fs.writeFileSync('src/components/DropShowcase.tsx', content, 'utf8');

