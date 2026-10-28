const fs = require('fs');

let content = fs.readFileSync('src/app/collab/page.tsx', 'utf8');

const search = `const COLLAB_PRODUCTS: Product[] = [
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
  {`;
  
const replace = `const COLLAB_PRODUCTS: Product[] = [
  {`;

content = content.replace(search, replace);

fs.writeFileSync('src/app/collab/page.tsx', content, 'utf8');
