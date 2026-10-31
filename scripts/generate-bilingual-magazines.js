const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load approved constants
const { FOUNDING_MANIFESTO, ARTICLES } = require('../src/constants/articles.ts');

// Load fonts
const alexandriaFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'Alexandria-Regular.ttf')).toString('base64');
const messiriFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'ElMessiri-Bold.ttf')).toString('base64');

// Load woodcut artwork (associated strictly with art-1: Conflict of Earth and Sky)
let editorialArtworkBase64 = '';
const artworkPath = path.join(__dirname, '..', 'public', 'magazine', 'editorial-symbolic-earth-sky.jpg');
if (fs.existsSync(artworkPath)) {
  editorialArtworkBase64 = fs.readFileSync(artworkPath).toString('base64');
}

/**
 * Generate full HTML for either Arabic ('ar') or English ('en')
 * @param {'ar' | 'en'} lang
 * @param {Record<string, number>} tocPages - Calculated page numbers for TOC
 * @param {number} totalPages - Total calculated page count
 */
function getMagazineHtml(lang, tocPages, totalPages) {
  const isAr = lang === 'ar';
  const art1 = ARTICLES[0];
  const art2 = ARTICLES[1];
  const art3 = ARTICLES[2];
  const art4 = ARTICLES[3];

  function cleanCardBody(rawText) {
    if (!rawText) return '';
    let txt = rawText.trim();
    // Strip redundant leading title line that repeats the card header
    txt = txt.replace(/^\d+\.\s*[^\n]+\n+/, '');
    if (!isAr) {
      txt = txt.replace(/\\'/g, "'");
    }
    return txt.replace(/\n/g, '<br/>');
  }

  return `<!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <title>${isAr ? 'مجلة ميدان — العدد صفر (انتحاب)' : 'Midaan Magazine — Issue Zero (Entihab)'}</title>
    <style>
      @font-face {
        font-family: 'Alexandria';
        src: url(data:font/truetype;charset=utf-8;base64,${alexandriaFont}) format('truetype');
        font-weight: 100 900;
        font-display: swap;
      }
      @font-face {
        font-family: 'El Messiri';
        src: url(data:font/truetype;charset=utf-8;base64,${messiriFont}) format('truetype');
        font-weight: 600 700;
        font-display: swap;
      }
      @page {
        size: A4;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      body {
        font-family: 'Alexandria', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #FAF8F5;
        color: #121212;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        width: 210mm;
        height: 297mm;
        max-height: 297mm;
        padding: 15mm 18mm 14mm 18mm;
        page-break-after: always;
        position: relative;
        overflow: hidden;
        background: #FAF8F5;
        display: flex;
        flex-direction: column;
      }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1.5px solid #D5D0C0;
        padding-bottom: 2.2mm;
        margin-bottom: 3.8mm;
        font-size: 7.8pt;
        font-weight: 700;
        color: #444;
        letter-spacing: ${isAr ? '0' : '0.4px'};
      }
      .page-footer {
        position: absolute;
        bottom: 7mm;
        left: 18mm;
        right: 18mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1.5px solid #D5D0C0;
        padding-top: 2.2mm;
        font-size: 7.8pt;
        color: #555;
        font-weight: 600;
      }
      .page-footer .page-num {
        font-weight: 800;
        color: #111;
        font-size: 8.8pt;
      }

      /* ==================== COVER STYLING ==================== */
      .cover-page {
        padding: 12mm 14mm 10mm 14mm;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        border: 2px solid #111;
        margin: 4.5mm;
        width: 201mm;
        height: 288mm;
        position: relative;
        background: #FAF8F5;
      }
      .cover-page::before {
        content: '';
        position: absolute;
        inset: 3mm;
        border: 1px solid #D5D0C0;
        pointer-events: none;
      }
      .cover-brand {
        font-family: 'El Messiri', serif;
        font-size: 4.6rem;
        font-weight: 700;
        color: #111;
        line-height: 1;
        margin-top: 1mm;
      }
      .cover-brand span {
        color: #D80032;
      }
      .cover-subhead {
        font-size: 8pt;
        font-weight: 700;
        color: #444;
        margin-top: 2.5mm;
        letter-spacing: ${isAr ? '0' : '0.5px'};
      }
      .cover-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3mm;
        margin: auto 0;
        max-width: 170mm;
        width: 100%;
      }
      .cover-badge {
        display: inline-block;
        background-color: #D80032;
        color: #fff;
        font-size: 8pt;
        font-weight: 800;
        padding: 4px 16px;
        border-radius: 9999px;
        letter-spacing: ${isAr ? '0' : '1px'};
      }
      .cover-issue-title {
        font-family: 'El Messiri', serif;
        font-size: 4rem;
        font-weight: 700;
        color: #111;
        line-height: 1;
        margin: 1.5mm 0 1mm 0;
      }
      .cover-roots-crop {
        width: 138mm;
        height: 38mm;
        margin: 1.5mm auto 2.5mm auto;
        border: 1.5px solid #111;
        overflow: hidden;
        background: #000;
        position: relative;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      }
      .cover-roots-crop img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 95%;
        display: block;
        filter: contrast(120%) brightness(95%);
      }
      .cover-issue-num {
        font-size: 1.15rem;
        font-weight: 800;
        color: #D80032;
        margin-bottom: 1mm;
      }
      .cover-lead-summary {
        font-size: 8.8pt;
        line-height: 1.75;
        color: #333;
        max-width: 135mm;
        margin: 0 auto;
        font-weight: 500;
      }
      .cover-foot {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 7.2pt;
        color: #666;
        font-weight: 600;
        border-top: 1px solid #E5E0D0;
        padding-top: 3mm;
      }

      /* ==================== TOC STYLING ==================== */
      .toc-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .toc-heading-area {
        margin-bottom: 3.5mm;
      }
      .toc-main-title {
        font-family: 'El Messiri', serif;
        font-size: 20pt;
        font-weight: 700;
        color: #111;
        margin: 1.5mm 0 2mm 0;
      }
      .toc-main-desc {
        font-size: 8.5pt;
        color: #555;
        line-height: 1.6;
        border-bottom: 1.5px solid #D5D0C0;
        padding-bottom: 3mm;
      }
      .toc-list {
        display: flex;
        flex-direction: column;
        gap: 3.2mm;
        margin: 2mm 0 4mm 0;
      }
      .toc-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-bottom: 2.5mm;
        border-bottom: 1px dashed #D5D0C0;
      }
      .toc-item-info {
        max-width: 146mm;
      }
      .toc-item-cat {
        font-size: 7.2pt;
        font-weight: 800;
        color: #D80032;
        letter-spacing: ${isAr ? '0' : '0.5px'};
        text-transform: uppercase;
        margin-bottom: 0.8mm;
      }
      .toc-item-title {
        font-family: 'El Messiri', serif;
        font-size: 11.8pt;
        font-weight: 700;
        color: #111;
        line-height: 1.35;
      }
      .toc-item-desc {
        font-size: 7.8pt;
        color: #555;
        margin-top: 1mm;
        line-height: 1.5;
      }
      .toc-item-page {
        font-family: 'El Messiri', serif;
        font-size: 15pt;
        font-weight: 700;
        color: #D80032;
        padding-${isAr ? 'right' : 'left'}: 4mm;
        white-space: nowrap;
      }
      .toc-colophon-box {
        background: #F2EFE9;
        border-${isAr ? 'right' : 'left'}: 3.5px solid #111;
        padding: 3.5mm 4.5mm;
        border-radius: 2px;
        font-size: 7.8pt;
        line-height: 1.65;
        color: #333;
        margin-top: auto;
      }
      .toc-colophon-title {
        font-family: 'El Messiri', serif;
        font-size: 9.5pt;
        font-weight: 700;
        color: #111;
        margin-bottom: 1mm;
      }

      /* ==================== ARTICLE OPENER ==================== */
      .opener-category {
        display: inline-block;
        background-color: #D80032;
        color: #fff;
        font-size: 7.5pt;
        font-weight: 800;
        padding: 2.5px 11px;
        border-radius: 9999px;
        margin-bottom: 2.5mm;
      }
      .opener-title {
        font-family: 'El Messiri', serif;
        font-size: 18.5pt;
        font-weight: 700;
        color: #111;
        line-height: 1.3;
        margin-bottom: 2.5mm;
      }
      .opener-meta {
        font-size: 7.5pt;
        color: #666;
        font-weight: 600;
        margin-bottom: 3.5mm;
        display: flex;
        gap: 2.5mm;
        align-items: center;
      }
      .opener-meta-dot {
        color: #D80032;
      }
      .opener-lead-box {
        background: #F2EFE9;
        border-${isAr ? 'right' : 'left'}: 3.5px solid #D80032;
        padding: 3.5mm 4.5mm;
        font-size: ${isAr ? '10pt' : '9.5pt'};
        line-height: ${isAr ? '1.8' : '1.7'};
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 4mm;
        border-radius: 2px;
      }
      .opener-artwork-box {
        width: 100%;
        margin-bottom: 4mm;
        border: 1px solid #D5D0C0;
        border-radius: 2px;
        overflow: hidden;
        background: #000;
      }
      .opener-artwork-box img {
        width: 100%;
        height: auto;
        display: block;
        max-height: 64mm;
        object-fit: cover;
      }
      .opener-artwork-caption {
        font-size: 6.8pt;
        color: #666;
        padding: 1.2mm 3mm;
        background: #F8F5EE;
        border-top: 1px solid #E5E0D0;
        font-style: italic;
        display: flex;
        justify-content: space-between;
      }
      .opener-body-single {
        font-size: ${isAr ? '12pt' : '11pt'};
        line-height: ${isAr ? '1.95' : '1.85'};
        color: #222;
        text-align: ${isAr ? 'right' : 'left'};
      }

      /* ==================== READING PAGES ==================== */
      .reading-section-title {
        font-family: 'El Messiri', serif;
        font-size: ${isAr ? '15.5pt' : '14.5pt'};
        font-weight: 700;
        color: #D80032;
        margin: 1.5mm 0 ${isAr ? '4mm' : '3.5mm'} 0;
        border-bottom: 1.5px solid #E5E0D0;
        padding-bottom: 1.8mm;
        line-height: 1.4;
      }
      .reading-single-column {
        width: 100%;
        font-size: ${isAr ? '12.8pt' : '11.6pt'};
        line-height: ${isAr ? '2.1' : '1.9'};
        color: #1a1a1a;
        text-align: ${isAr ? 'right' : 'left'};
        word-break: normal;
        overflow-wrap: break-word;
      }
      .reading-single-column p {
        margin: 0 0 ${isAr ? '5.5mm' : '4.5mm'} 0;
      }
      .reading-pullquote {
        margin: ${isAr ? '6mm 0' : '5mm 0'};
        padding: ${isAr ? '5mm 7mm' : '4.5mm 6.5mm'};
        background: #F2EFE9;
        border-${isAr ? 'right' : 'left'}: 4.5px solid #D80032;
        font-family: ${isAr ? "'El Messiri', serif" : "'Alexandria', sans-serif"};
        font-size: ${isAr ? '13.5pt' : '12pt'};
        font-weight: 700;
        color: #111;
        line-height: ${isAr ? '1.75' : '1.65'};
        font-style: ${isAr ? 'normal' : 'italic'};
        text-align: ${isAr ? 'right' : 'left'};
        border-radius: 2px;
      }

      /* ==================== SPECIALIZED ARTICLE ELEMENTS ==================== */
      .matrix-table {
        width: 100%;
        border-collapse: collapse;
        margin: 2mm 0 4mm 0;
        font-size: ${isAr ? '9pt' : '8.5pt'};
        line-height: 1.55;
      }
      .matrix-table th {
        background-color: #111;
        color: #FAF8F5;
        font-weight: 700;
        padding: 2.2mm 3mm;
        text-align: ${isAr ? 'right' : 'left'};
        border: 1px solid #111;
      }
      .matrix-table td {
        border: 1px solid #D5D0C0;
        padding: 2.2mm 3mm;
        vertical-align: top;
      }
      .matrix-table tr:nth-child(even) {
        background-color: #F4EFE6;
      }

      .registry-table {
        width: 100%;
        border-collapse: collapse;
        margin: 2mm 0 3.5mm 0;
        font-size: ${isAr ? '8.8pt' : '8.2pt'};
        line-height: 1.5;
      }
      .registry-table th {
        background-color: #111;
        color: #FAF8F5;
        font-weight: 700;
        padding: 2mm 3mm;
        text-align: ${isAr ? 'right' : 'left'};
        border: 1px solid #111;
      }
      .registry-table td {
        border: 1px solid #D5D0C0;
        padding: 1.8mm 3mm;
        vertical-align: top;
      }
      .registry-table tr:nth-child(even) {
        background-color: #F4EFE6;
      }

      .martyr-card {
        border: 1px solid #D5D0C0;
        background: #FDFCF9;
        border-radius: 3px;
        padding: 3mm 4mm;
        margin-bottom: 3.5mm;
        border-${isAr ? 'right' : 'left'}: 3.5px solid #D80032;
      }
      .martyr-card-header {
        font-family: 'El Messiri', serif;
        font-weight: 700;
        color: #111;
        font-size: 10.5pt;
        margin-bottom: 1.2mm;
        display: flex;
        justify-content: space-between;
      }
      .martyr-card-year {
        color: #D80032;
        font-weight: 800;
        font-family: 'Alexandria', sans-serif;
        font-size: 9pt;
      }
      .martyr-card-body {
        font-size: ${isAr ? '10.5pt' : '9.6pt'};
        line-height: ${isAr ? '1.85' : '1.75'};
        color: #222;
      }
      .martyr-card-body p {
        margin: 0 0 2mm 0;
      }
      .martyr-card-body p:last-child {
        margin-bottom: 0;
      }

      .manifesto-covenant-box {
        border-${isAr ? 'right' : 'left'}: 4px solid #D80032;
        padding: 4.5mm 6mm;
        background: #F2EFE9;
        border-radius: 3px;
        font-size: ${isAr ? '11.5pt' : '10.5pt'};
        font-weight: 600;
        line-height: 1.95;
        margin-top: auto;
      }
      .pledge-box {
        background: #111;
        color: #FAF8F5;
        padding: 4mm 5mm;
        border-radius: 3px;
        margin-top: 3.5mm;
      }
      .pledge-box-title {
        font-family: 'El Messiri', serif;
        font-size: 11pt;
        font-weight: 700;
        color: #D80032;
        margin-bottom: 1.5mm;
      }
      .pledge-box-body {
        font-size: 8.5pt;
        line-height: 1.7;
        color: #DDD;
      }
    </style>
  </head>
  <body>

    <!-- ==========================================
         PAGE 1: COVER
         ========================================== -->
    <div class="page" style="padding: 0;">
      <div class="cover-page">
        <div class="cover-masthead">
          <div class="cover-brand">${isAr ? 'مَـيـدَان' : 'MIDAAN'}<span>.</span></div>
          <div class="cover-subhead">${isAr ? 'مجلة فكرية وثقافية مستقلة • صُنعت في عمّان - فلسطين' : 'Midaan Magazine • Independent Cultural & Intellectual Platform • Amman & Palestine'}</div>
        </div>

        <div class="cover-center">
          <div class="cover-badge">${isAr ? 'الإصدار التأسيسي // خريف 2026' : 'FOUNDING ISSUE // AUTUMN 2026'}</div>
          <div class="cover-issue-title">${isAr ? 'انتحاب' : 'ENTIHAB'}</div>
          
          <!-- Narrow crop of roots and rock woodcut directly beneath title -->
          <div class="cover-roots-crop">
            <img src="data:image/jpeg;base64,${editorialArtworkBase64}" alt="${isAr ? 'جذور وصخر صراع الأرض والسماء' : 'Roots and rock of Conflict of Earth and Sky'}" />
          </div>

          <div class="cover-issue-num">${isAr ? 'العدد صفر' : 'ISSUE ZERO'}</div>
          <div class="cover-lead-summary">
            ${isAr 
              ? 'توثيق سردية الشارع، صراع الأرض والسماء، وسجل وصايا الخالدين. منصة للرواية المستقلة، حبر حر وذاكرة تأبى النسيان.'
              : 'Documenting the street narrative, the conflict of earth and sky, and the testaments of the immortal. An independent forum for memory and cultural resistance.'}
          </div>
        </div>

        <div class="cover-foot">
          <span>${isAr ? 'العدد 00' : 'ISSUE 00'}</span>
          <span style="font-family: monospace; letter-spacing: 1px;">MIDAAN ISSUE ZERO // HKJ-PAL-2026-ZERO</span>
          <span>${isAr ? 'حبر حر • ذاكرة تأبى النسيان' : 'Free Press • Unbroken Memory'}</span>
        </div>
      </div>
    </div>


    <!-- ==========================================
         PAGE 2: TABLE OF CONTENTS & COLOPHON
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر (انتحاب)' : 'MIDAAN MAGAZINE • ISSUE ZERO (ENTIHAB)'}</span>
        <span style="color: #D80032;">${isAr ? 'فهرس المحتويات والبيانات' : 'CONTENTS & DIRECTORY'}</span>
      </div>

      <div class="toc-wrapper">
        <div class="toc-heading-area">
          <div class="opener-category">${isAr ? 'دليل القراءة والأرشيف' : 'Directory & Index'}</div>
          <h1 class="toc-main-title">${isAr ? 'فهرس العدد التأسيسي' : 'Table of Contents'}</h1>
          <div class="toc-main-desc">
            ${isAr 
              ? 'سجل المواد التأسيسية المعتمدة للعدد صفر. توثيق مستقل للفكر المقاوم، فلسفة الصمود، وأرشيف الوصايا الخالدة.'
              : 'Complete index of foundational texts for Issue Zero. An independent record of cultural resistance, the philosophy of steadfastness, and immortal testaments.'}
          </div>
        </div>

        <div class="toc-list">
          <div class="toc-item">
            <div class="toc-item-info">
              <div class="toc-item-cat">${isAr ? 'البيان التأسيسي' : 'Founding Manifesto'}</div>
              <div class="toc-item-title">${isAr ? 'البيان التأسيسي: انتحاب' : 'Founding Manifesto: Entihab'}</div>
              <div class="toc-item-desc">${isAr ? 'مقدمة العدد صفر وعهد الرواية المستقلة: الفن كمتراس دفاع عن الهوية والذاكرة.' : 'Prologue to Issue Zero and the covenant of narrative: art as a trench guarding memory.'}</div>
            </div>
            <div class="toc-item-page">${tocPages.manifesto < 10 ? '0' + tocPages.manifesto : tocPages.manifesto}</div>
          </div>

          <div class="toc-item">
            <div class="toc-item-info">
              <div class="toc-item-cat">${isAr ? 'افتتاحية العدد' : 'Editorial'}</div>
              <div class="toc-item-title">${isAr ? art1.titleAr : art1.titleEn}</div>
              <div class="toc-item-desc">${isAr ? 'لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟ تفكيك أوهام السياسة البراغماتية أمام صراع الوجود.' : 'Why the Palestine struggle cannot be understood apart from faith: dismantling diplomatic illusions.'}</div>
            </div>
            <div class="toc-item-page">${tocPages.art1 < 10 ? '0' + tocPages.art1 : tocPages.art1}</div>
          </div>

          <div class="toc-item">
            <div class="toc-item-info">
              <div class="toc-item-cat">${isAr ? 'مقال فكري' : 'Philosophical Essay'}</div>
              <div class="toc-item-title">${isAr ? art2.titleAr : art2.titleEn}</div>
              <div class="toc-item-desc">${isAr ? 'تشريح نقدي لأنظمة التدجين: الأبوي، التعليمي، المجتمعي، واللاهوتي، والوقوف في وجه آلة النظام.' : 'A critical anatomy of domesticating systems—patriarchal, educational, societal—and defying the machine.'}</div>
            </div>
            <div class="toc-item-page">${tocPages.art2 < 10 ? '0' + tocPages.art2 : tocPages.art2}</div>
          </div>

          <div class="toc-item">
            <div class="toc-item-info">
              <div class="toc-item-cat">${isAr ? 'دراسة فلسفية' : 'Philosophical Study'}</div>
              <div class="toc-item-title">${isAr ? art3.titleAr : art3.titleEn}</div>
              <div class="toc-item-desc">${isAr ? 'من مشقة الوداع إلى سكينة الشهادة: كيف يتحول عبء الوصية الوجودي إلى يقين خالص يتسامى فوق الفناء؟' : 'From the agony of parting to the serenity of martyrdom: how the burden of testaments becomes certainty.'}</div>
            </div>
            <div class="toc-item-page">${tocPages.art3 < 10 ? '0' + tocPages.art3 : tocPages.art3}</div>
          </div>

          <div class="toc-item">
            <div class="toc-item-info">
              <div class="toc-item-cat">${isAr ? 'أرشيف وتوثيق' : 'Historical Registry'}</div>
              <div class="toc-item-title">${isAr ? art4.titleAr : art4.titleEn}</div>
              <div class="toc-item-desc">${isAr ? 'سجل وصايا الشهداء الفلسطينيين: نصوص ووصايا باسل الأعرج، بهاء عليان، دلال المغربي، غسان كنفاني، ورفاقهم.' : "Ledger of Palestinian Martyrs' Wills: documented testaments of Basil al-Araj, Baha Alyan, Dalal al-Mughrabi, and comrades."}</div>
            </div>
            <div class="toc-item-page">${tocPages.art4 < 10 ? '0' + tocPages.art4 : tocPages.art4}</div>
          </div>
        </div>

        <div class="toc-colophon-box">
          <div class="toc-colophon-title">${isAr ? 'هيئة التحرير والمنصة التوثيقية' : 'Editorial Board & Archival Platform'}</div>
          <div>
            ${isAr 
              ? 'مَـيـدَان منصة فكرية وثقافية عربية مستقلة تصدر من عمّان وفلسطين. تُعنى بحراسة الرواية، وتوثيق نبض الشارع، وبناء جسور الوعي التحرري بين أجيال الأمة. جميع النصوص والوثائق مستندة إلى سجلات أرشيفية موثقة.' 
              : 'Midaan is an independent Arab cultural and intellectual platform published from Amman and Palestine. Dedicated to safeguarding the narrative, documenting memory, and forging consciousness across generations. All texts and documents are drawn from authenticated archival records.'}
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — فهرس المحتويات' : 'Midaan Magazine — Table of Contents'}</span>
        <span class="page-num">${isAr ? '٠٢' : '02'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 3: FOUNDING MANIFESTO
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر' : 'MIDAAN MAGAZINE • ISSUE ZERO'}</span>
        <span style="color: #D80032;">${isAr ? 'البيان التأسيسي' : 'FOUNDING MANIFESTO'}</span>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column;">
        <div class="opener-category">${isAr ? 'البيان التأسيسي' : 'Founding Manifesto'}</div>
        <h1 class="opener-title" style="margin-bottom: 3mm;">
          ${isAr ? FOUNDING_MANIFESTO.titleAr : FOUNDING_MANIFESTO.titleEn}
        </h1>

        <div class="opener-lead-box" style="margin-bottom: 4.5mm;">
          ${isAr ? FOUNDING_MANIFESTO.paragraphsAr[0] : FOUNDING_MANIFESTO.paragraphsEn[0]}
        </div>

        <div class="reading-single-column" style="font-size: ${isAr ? '12.8pt' : '11.6pt'}; line-height: ${isAr ? '2.1' : '1.9'};">
          <p>${isAr ? FOUNDING_MANIFESTO.paragraphsAr[1] : FOUNDING_MANIFESTO.paragraphsEn[1]}</p>
          <p>${isAr ? FOUNDING_MANIFESTO.paragraphsAr[2] : FOUNDING_MANIFESTO.paragraphsEn[2]}</p>
          <p>${isAr ? FOUNDING_MANIFESTO.paragraphsAr[3] : FOUNDING_MANIFESTO.paragraphsEn[3]}</p>
        </div>

        <div class="manifesto-covenant-box">
          ${isAr ? FOUNDING_MANIFESTO.paragraphsAr[4] : FOUNDING_MANIFESTO.paragraphsEn[4]}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — البيان التأسيسي' : 'Midaan Magazine — Founding Manifesto'}</span>
        <span class="page-num">${isAr ? '٠٣' : '03'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 4: ARTICLE 1 OPENER
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر (انتحاب)' : 'MIDAAN MAGAZINE • ISSUE ZERO (ENTIHAB)'}</span>
        <span style="color: #D80032;">${isAr ? 'افتتاحية العدد' : 'EDITORIAL'}</span>
      </div>

      <div class="opener-category">${isAr ? 'افتتاحية العدد' : 'Editorial'}</div>
      
      <h1 class="opener-title">
        ${isAr ? art1.titleAr : art1.titleEn}
      </h1>

      <div class="opener-meta">
        <span>${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? 'العدد التأسيسي (خريف 2026)' : 'Founding Issue (Autumn 2026)'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? art1.readTimeAr + ' قراءة' : art1.readTimeEn}</span>
      </div>

      <div class="opener-lead-box">
        ${isAr ? art1.contentAr[0] : art1.contentEn[0]}
      </div>

      <!-- Woodcut Artwork strictly for art-1 -->
      <div class="opener-artwork-box">
        <img src="data:image/jpeg;base64,${editorialArtworkBase64}" alt="Symbolic artwork of Earth and Sky" />
        <div class="opener-artwork-caption">
          <span>${isAr ? 'عمل فني رمزي: صراع الأرض والسماء — جذور متجذرة في صخر الأرض تحت سماء التاريخ المفتوحة' : 'Symbolic Woodcut: Conflict of Earth and Sky — deep roots anchored in stone beneath open heavens'}</span>
          <span>MIDAAN ARCHIVE // ART-01</span>
        </div>
      </div>

      <!-- Enlarged body text beneath artwork in single reading column -->
      <div class="opener-body-single">
        <p style="margin: 0;">
          ${isAr ? art1.contentAr[1] : art1.contentEn[1]}
        </p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — صراع الأرض والسماء' : 'Midaan Magazine — Conflict of Earth and Sky'}</span>
        <span class="page-num">${isAr ? '٠٤' : '04'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 5: ARTICLE 1 READING PAGE 1
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? 'التوراة كخريطة طريق.. العقيدة في خدمة الاستعمار' : 'The Torah as a Roadmap: Faith in the Service of Colonialism'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art1.contentAr[2] : art1.contentEn[2]}</p>
        <p>${isAr ? art1.contentAr[3] : art1.contentEn[3]}</p>
      </div>

      <div class="reading-section-title" style="margin-top: 2mm;">
        ${isAr ? '«آية في كتاب».. الجذور في العقل الجمعي الإسلامي' : '"A Verse in the Book": Roots in the Islamic Collective Conscience'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art1.contentAr[4] : art1.contentEn[4]}</p>
        <p>${isAr ? art1.contentAr[5].replace(/\n/g, '<br/>') : art1.contentEn[5].replace(/\n/g, '<br/>')}</p>
      </div>

      <!-- Verbatim Pull Quote -->
      <div class="reading-pullquote">
        ${isAr ? art1.pullQuoteAr : art1.pullQuoteEn}
      </div>

      <div class="page-footer">
        <span>${isAr ? 'صراع الأرض والسماء (متابعة القراءة)' : 'Conflict of Earth and Sky (Continued)'}</span>
        <span class="page-num">${isAr ? '٠٥' : '05'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 6: ARTICLE 1 READING PAGE 2 (CONCLUSION)
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'صراع الأرض والسماء (خاتمة الافتتاحية)' : 'Conflict of Earth and Sky (Conclusion)'}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? 'مقارنة تحليلية: أبعاد الصراع بين الرؤية والواقع' : 'Analytical Comparison: Dimensions Between Politics and Faith'}
      </div>

      <table class="matrix-table">
        <tr>
          <th>${isAr ? 'البُعد التحليلي' : 'Dimension'}</th>
          <th>${isAr ? 'المنظور السياسي التقليدي' : 'Conventional Politics'}</th>
          <th>${isAr ? 'الواقع العقائدي والوجودي' : 'Faith & Existential Reality'}</th>
        </tr>
        <tr>
          <td><strong>${isAr ? 'طبيعة الخلاف' : 'Nature of Dispute'}</strong></td>
          <td>${isAr ? 'نزاع حدودي وموارد ودولة' : 'Border dispute, resources & statehood'}</td>
          <td>${isAr ? 'صراع وجودي يمس العقيدة والهوية والكتب المقدسة' : 'Existential struggle touching faith, sacred scripture & identity'}</td>
        </tr>
        <tr>
          <td><strong>${isAr ? 'أدوات الحل' : 'Means of Resolution'}</strong></td>
          <td>${isAr ? 'طاولات المفاوضات والتسويات الوسطى' : 'Negotiating tables & pragmatic compromises'}</td>
          <td>${isAr ? 'حقوق تاريخية وروحية غير قابلة للتجزئة أو المقايضة' : 'Indivisible historical & spiritual rights resistant to bartering'}</td>
        </tr>
        <tr>
          <td><strong>${isAr ? 'محرك الصمود' : 'Engine of Sumud'}</strong></td>
          <td>${isAr ? 'مطالبات حقوقية في القانون الدولي' : 'Legal appeals under international conventions'}</td>
          <td>${isAr ? 'اليقين العقائدي والرباط المقدس وحماية المقدسات' : 'Spiritual certainty, Ribat vigil, and moral duty to defend heritage'}</td>
        </tr>
      </table>

      <div class="reading-section-title" style="margin-top: 2.5mm;">
        ${isAr ? 'سقوط وهم «البراغماتية» ومعركة الروايات' : 'The Collapse of Political Pragmatism & the War of Narratives'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art1.contentAr[7] : art1.contentEn[7]}</p>
        <p>${isAr ? art1.contentAr[8] : art1.contentEn[8]}</p>
        <p style="font-weight: 700; color: #111;">${isAr ? art1.contentAr[9] : art1.contentEn[9]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'صراع الأرض والسماء — نهاية المقال' : 'Conflict of Earth and Sky — End of Editorial'}</span>
        <span class="page-num">${isAr ? '٠٦' : '06'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 7: ARTICLE 2 OPENER
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر' : 'MIDAAN MAGAZINE • ISSUE ZERO'}</span>
        <span style="color: #D80032;">${isAr ? 'مقال فكري' : 'PHILOSOPHICAL ESSAY'}</span>
      </div>

      <div class="opener-category">${isAr ? 'مقال فكري' : 'Philosophical Essay'}</div>
      
      <h1 class="opener-title">
        ${isAr ? art2.titleAr : art2.titleEn}
      </h1>

      <div class="opener-meta">
        <span>${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? 'العدد التأسيسي (خريف 2026)' : 'Founding Issue (Autumn 2026)'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? art2.readTimeAr + ' قراءة' : art2.readTimeEn}</span>
      </div>

      <div class="opener-lead-box">
        ${isAr ? art2.contentAr[0] : art2.contentEn[0]}
      </div>

      <div class="reading-section-title">
        ${isAr ? 'السستم: المصفوفة الكبرى' : 'The System: The Master Matrix'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art2.contentAr[1] : art2.contentEn[1]}</p>
      </div>

      <div class="reading-section-title" style="margin-top: 1mm;">
        ${isAr ? 'النظام الأبوي: صكوك الملكية' : 'The Patriarchal Order: Deeds of Ownership'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art2.contentAr[2] : art2.contentEn[2]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</span>
        <span class="page-num">${isAr ? '٠٧' : '07'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 8: ARTICLE 2 READING PAGE 1
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? 'النظام التعليمي: مقصلة العقول' : 'The Educational System: The Guillotine of the Mind'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art2.contentAr[3] : art2.contentEn[3]}</p>
      </div>

      <!-- Verbatim Pull Quote -->
      <div class="reading-pullquote">
        ${isAr ? art2.pullQuoteAr : art2.pullQuoteEn}
      </div>

      <div class="reading-section-title" style="margin-top: 1mm;">
        ${isAr ? 'النظام المجتمعي: مسرح العبث والنفاق' : 'The Social Order: A Theater of the Absurd'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art2.contentAr[4] : art2.contentEn[4]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سأموت قبل الأربعين (متابعة القراءة)' : 'I Will Die Before Forty (Continued)'}</span>
        <span class="page-num">${isAr ? '٠٨' : '08'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 9: ARTICLE 2 READING PAGE 2 (CONCLUSION)
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'سأموت قبل الأربعين (خاتمة المقال)' : 'I Will Die Before Forty (Conclusion)'}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? 'النظام الربوبي: الأسئلة المحرمة' : 'The Religious Order: Forbidden Questions'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art2.contentAr[5] : art2.contentEn[5]}</p>
      </div>

      <div class="reading-section-title" style="margin-top: 2mm;">
        ${isAr ? 'تسع سنوات متبقية: الوقوف في وجه السستم' : 'Nine Years Remain: Standing Against the System'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art2.contentAr[6] : art2.contentEn[6]}</p>
      </div>

      <div style="background: #F2EFE9; border-${isAr ? 'right' : 'left'}: 3.5px solid #111; padding: 3.5mm 4.5mm; border-radius: 2px; margin-top: auto;">
        <div style="font-family: 'El Messiri', serif; font-size: 10pt; font-weight: 700; color: #D80032; margin-bottom: 1mm;">
          ${isAr ? 'وثيقة انتحاب: صوت الرفض المستقل' : 'Voice of Defiance: Midaan Existential Registry'}
        </div>
        <div style="font-size: 8pt; line-height: 1.6; color: #333;">
          ${isAr 
            ? 'يمثل هذا المقال شهادة وجودية نقدية تعكس صدمة الجيل الشاب مع أجهزة الضبط الاجتماعي والمؤسسي في المنطقة، ورفض الخضوع لقوالب الترويض الجاهزة.' 
            : 'This essay constitutes an existential testimony dissecting the crisis of youth agency confronting institutional and social pacification across the region, rejecting conformity to pre-packaged molds.'}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سأموت قبل الأربعين — نهاية المقال' : 'I Will Die Before Forty — End of Essay'}</span>
        <span class="page-num">${isAr ? '٠٩' : '09'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 10: ARTICLE 3 OPENER
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر' : 'MIDAAN MAGAZINE • ISSUE ZERO'}</span>
        <span style="color: #D80032;">${isAr ? 'دراسة فلسفية' : 'PHILOSOPHICAL STUDY'}</span>
      </div>

      <div class="opener-category">${isAr ? 'دراسة فلسفية' : 'Philosophical Study'}</div>
      
      <h1 class="opener-title">
        ${isAr ? art3.titleAr : art3.titleEn}
      </h1>

      <div class="opener-meta">
        <span>${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? 'العدد التأسيسي (خريف 2026)' : 'Founding Issue (Autumn 2026)'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? art3.readTimeAr + ' قراءة' : art3.readTimeEn}</span>
      </div>

      <div class="opener-lead-box">
        ${isAr ? art3.contentAr[0] : art3.contentEn[0]}
      </div>

      <div class="reading-section-title">
        ${isAr ? 'مشقة البداية: مواجهة الحبر والعدم' : 'The Agony of the Opening: Facing Ink and the Void'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art3.contentAr[1] : art3.contentEn[1]}</p>
        <p>${isAr ? art3.contentAr[2] : art3.contentEn[2]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'حبر اليقين: من مشقة الوداع إلى سكينة الشهادة' : 'Ink of Certainty: From Parting to Serenity'}</span>
        <span class="page-num">${isAr ? '١٠' : '10'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 11: ARTICLE 3 READING PAGE 1
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'حبر اليقين' : 'Ink of Certainty'}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? 'التسامي النفسي: كيف وُلدت السكينة من رحم الخطر؟' : 'Psychological Sublimation: How Serenity is Born from Peril'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art3.contentAr[3] : art3.contentEn[3]}</p>
        <p>${isAr ? art3.contentAr[4] : art3.contentEn[4]}</p>
        <p>${isAr ? art3.contentAr[5] : art3.contentEn[5]}</p>
      </div>

      <!-- Verbatim Pull Quote -->
      <div class="reading-pullquote">
        ${isAr ? art3.pullQuoteAr : art3.pullQuoteEn}
      </div>

      <div class="page-footer">
        <span>${isAr ? 'حبر اليقين (متابعة القراءة)' : 'Ink of Certainty (Continued)'}</span>
        <span class="page-num">${isAr ? '١١' : '11'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 12: ARTICLE 3 READING PAGE 2 (CONCLUSION)
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'حبر اليقين (خاتمة الدراسة)' : 'Ink of Certainty (Conclusion)'}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? '3. قلب معادلة الخوف والمواجهة المباشرة' : '3. Inverting Fear Through Direct Engagement'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art3.contentAr[6] : art3.contentEn[6]}</p>
      </div>

      <div class="reading-section-title" style="margin-top: 2mm;">
        ${isAr ? 'الأثر النفسي للوصية: نقل العبء إلى الأحياء' : 'The Legacy of the Testament: Passing the Question to the Living'}
      </div>

      <div class="reading-single-column">
        <p>${isAr ? art3.contentAr[7] : art3.contentEn[7]}</p>
        <p style="font-weight: 700; color: #111;">${isAr ? art3.contentAr[8] : art3.contentEn[8]}</p>
      </div>

      <div style="background: #F2EFE9; border-${isAr ? 'right' : 'left'}: 3.5px solid #D80032; padding: 3.5mm 4.5mm; border-radius: 2px; margin-top: auto;">
        <div style="font-family: 'El Messiri', serif; font-size: 10pt; font-weight: 700; color: #D80032; margin-bottom: 1mm;">
          ${isAr ? 'خلاصة اليقين: الشجاعة النفسية والخلود الجمعي' : 'Distilled Certainty: Resolve & Collective Immortality'}
        </div>
        <div style="font-size: 8pt; line-height: 1.6; color: #333;">
          ${isAr 
            ? 'إن وصايا الشهداء الفلسطينيين تعيد صياغة مفهوم الشجاعة والوجود الإنساني؛ حيث ينتقل الوعي من حيز الفناء الشخصي الضيق إلى حيز الفعل التأسيسي والخلود الجمعي للأمة.' 
            : 'The testaments of Palestinian martyrs redefine psychological resolve and human existence, moving consciousness from personal mortality into collective immortality.'}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'حبر اليقين — نهاية الدراسة' : 'Ink of Certainty — End of Study'}</span>
        <span class="page-num">${isAr ? '١٢' : '12'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 13: ARTICLE 4 OPENER
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر' : 'MIDAAN MAGAZINE • ISSUE ZERO'}</span>
        <span style="color: #D80032;">${isAr ? 'أرشيف وتوثيق' : 'HISTORICAL REGISTRY'}</span>
      </div>

      <div class="opener-category">${isAr ? 'أرشيف وتوثيق' : 'Historical Registry'}</div>
      
      <h1 class="opener-title">
        ${isAr ? art4.titleAr : art4.titleEn}
      </h1>

      <div class="opener-meta">
        <span>${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? 'العدد التأسيسي (خريف 2026)' : 'Founding Issue (Autumn 2026)'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? art4.readTimeAr + ' قراءة' : art4.readTimeEn}</span>
      </div>

      <div class="opener-lead-box">
        ${isAr ? art4.contentAr[0] : art4.contentEn[0]}
      </div>

      <div class="reading-section-title">
        ${isAr ? 'فهرس الوصايا الموثقة في السجل الأرشيفي' : 'Index of Documented Testaments in Archival Registry'}
      </div>

      <table class="registry-table">
        <tr>
          <th>${isAr ? 'الشهيد' : 'Martyr'}</th>
          <th>${isAr ? 'العام' : 'Year'}</th>
          <th>${isAr ? 'طبيعة الوصية ودلالتها' : 'Classification & Significance'}</th>
        </tr>
        <tr><td>${isAr ? 'باسل الأعرج' : 'Basil al-Araj'}</td><td>2017</td><td>${isAr ? 'فكرية وثقافية ثورية (حيرة الوصية وأجوبة الاشتباك)' : 'Revolutionary thought and cultural theory'}</td></tr>
        <tr><td>${isAr ? 'بهاء عليان' : 'Baha Alyan'}</td><td>2015</td><td>${isAr ? 'الوصايا العشر (أخلاقيات اجتماعية ومجتمعية)' : 'The Ten Commandments (Social and civic ethical principles)'}</td></tr>
        <tr><td>${isAr ? 'دلال المغربي' : 'Dalal al-Mughrabi'}</td><td>1978</td><td>${isAr ? 'سياسية وعسكرية استراتيجية (استقلال البندقية)' : 'Strategic political and military imperative'}</td></tr>
        <tr><td>${isAr ? 'تامر الكيلاني' : 'Tamer al-Kilani'}</td><td>2022</td><td>${isAr ? 'تنظيمية وروحية (نقاء المقصد ورفض الاستعراض)' : 'Organizational discipline and spiritual resolve'}</td></tr>
        <tr><td>${isAr ? 'إبراهيم النابلسي' : 'Ibrahim al-Nabulsi'}</td><td>2022</td><td>${isAr ? 'ميدانية (تسجيل صوتي مباشر تحت الحصار)' : 'Battlefield audio dispatch under siege'}</td></tr>
        <tr><td>${isAr ? 'عدي التميمي' : 'Oday al-Tamimi'}</td><td>2022</td><td>${isAr ? 'ميدانية مكتوبة (أثناء المطاردة والاشتباك)' : 'Handwritten field message during active manhunt'}</td></tr>
        <tr><td>${isAr ? 'يحيى عياش' : 'Yahya Ayyash'}</td><td>1996</td><td>${isAr ? 'مقولات ومنهج اشتباك (الفكرة التي لا تُقتلع)' : 'Resistance doctrine and strategic methodology'}</td></tr>
        <tr><td>${isAr ? 'وديع الحوح' : 'Wadee al-Hawah'}</td><td>2022</td><td>${isAr ? 'ميدانية (عبر اللاسلكي العسكري تحت النار)' : 'Tactical transmission over military radio'}</td></tr>
        <tr><td>${isAr ? 'غسان كنفاني' : 'Ghassan Kanafani'}</td><td>1972</td><td>${isAr ? 'أدبية وفلسفية مستخلصة (عن الموت، الصمت، وغزة)' : 'Distilled literary and philosophical reflections'}</td></tr>
      </table>

      <div class="reading-section-title" style="margin-top: 1.5mm;">
        ${isAr ? 'القسم الأول: الوصايا الفكرية والسياسية (وثائق الوعي الجمعي)' : 'Part One: Intellectual and Political Testaments'}
      </div>

      <div class="martyr-card" style="margin-bottom: 0;">
        <div class="martyr-card-header">
          <span>${isAr ? '1. وصية الشهيد المثقف باسل الأعرج' : '1. Testament of the Intellectual Martyr Basil al-Araj'}</span>
          <span class="martyr-card-year">2017</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[3] : art4.contentEn[3])}</p>
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء الفلسطينيين' : "Register of Palestinian Martyrs' Wills"}</span>
        <span class="page-num">${isAr ? '١٣' : '13'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 14: ARTICLE 4 READING PAGE 1
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'سجل وصايا الشهداء الفلسطينيين' : "Register of Palestinian Martyrs' Wills"}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '2. الوصايا العشر للشهيد بهاء عليان' : '2. The Ten Wills of Martyr Baha Alyan'}</span>
          <span class="martyr-card-year">2015</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[4] : art4.contentEn[4])}</p>
        </div>
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '3. وصية الشهيدة دلال المغربي' : '3. Testament of Martyr Dalal al-Mughrabi'}</span>
          <span class="martyr-card-year">1978</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[5] : art4.contentEn[5])}</p>
        </div>
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '4. وصية الشهيد تامر الكيلاني' : '4. Testament of Martyr Tamer al-Kilani'}</span>
          <span class="martyr-card-year">2022</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[6] : art4.contentEn[6])}</p>
        </div>
      </div>

      <!-- Verbatim Pull Quote -->
      <div class="reading-pullquote">
        ${isAr ? art4.pullQuoteAr : art4.pullQuoteEn}
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء (القسم الأول)' : "Register of Martyrs' Wills (Part One)"}</span>
        <span class="page-num">${isAr ? '١٤' : '14'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 15: ARTICLE 4 READING PAGE 2
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'سجل وصايا الشهداء الفلسطينيين' : "Register of Palestinian Martyrs' Wills"}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? 'القسم الثاني: وصايا الميدان والاشتباك (رسائل اللحظات الأخيرة)' : 'Part Two: Battlefield Testaments (Messages of the Final Hours)'}
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '5. رسالة الشهيد إبراهيم النابلسي' : '5. Message of Martyr Ibrahim al-Nabulsi'}</span>
          <span class="martyr-card-year">2022</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[8] : art4.contentEn[8])}</p>
        </div>
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '6. رسالة الشهيد عدي التميمي' : '6. Message of Martyr Oday al-Tamimi'}</span>
          <span class="martyr-card-year">2022</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[9] : art4.contentEn[9])}</p>
        </div>
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '7. مقولة الشهيد يحيى عياش' : '7. Maxim of Martyr Yahya Ayyash'}</span>
          <span class="martyr-card-year">1996</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[10] : art4.contentEn[10])}</p>
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء (القسم الثاني)' : "Register of Martyrs' Wills (Part Two)"}</span>
        <span class="page-num">${isAr ? '١٥' : '15'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>


    <!-- ==========================================
         PAGE 16: ARTICLE 4 READING PAGE 3 & ISSUE CONCLUSION
         ========================================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'سجل وصايا الشهداء (خاتمة السجل)' : "Register of Martyrs' Wills (Conclusion)"}</span>
        <span style="color: #666;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '8. رسالة الشهيد وديع الحوح' : '8. Message of Martyr Wadee al-Hawah'}</span>
          <span class="martyr-card-year">2022</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[11] : art4.contentEn[11])}</p>
        </div>
      </div>

      <div class="reading-section-title" style="margin-top: 2.5mm;">
        ${isAr ? 'القسم الثالث: وصايا أدبية وفلسفية من وحي القضية' : 'Part Three: Literary and Philosophical Testaments Inspired by the Cause'}
      </div>

      <div class="martyr-card">
        <div class="martyr-card-header">
          <span>${isAr ? '9. وصية الأديب الشهيد غسان كنفاني (رؤية مستخلصة)' : '9. Philosophical Vision of Ghassan Kanafani (Distilled Legacy)'}</span>
          <span class="martyr-card-year">1972</span>
        </div>
        <div class="martyr-card-body">
          <p>${cleanCardBody(isAr ? art4.contentAr[13] : art4.contentEn[13])}</p>
        </div>
      </div>

      <div class="pledge-box">
        <div class="pledge-box-title">
          ${isAr ? 'عهد ميدان: الرواية التي لا تُهزم' : 'Midaan Covenant: An Invincible Narrative'}
        </div>
        <div class="pledge-box-body">
          ${isAr 
            ? 'إن توثيق هذه الوصايا في مجلة ميدان ليس استدعاءً لنوستالجيا حزينة، بل هو عهد مستمر بأن الرواية الفلسطينية لا تُهزم، وأن الكلمة الشاهدة تبقى حية تتوارثها الأجيال حتى لحظة التحرير والعودة. نقف على أرض الحقيقة، ونكتب بحبر الشهود.'
            : 'Documenting these testaments in Midaan Magazine is not an act of sorrowful nostalgia; it is an enduring covenant that the Palestinian narrative is never defeated, and that witness words remain alive, inherited across generations until liberation and return.'}
        </div>
      </div>

      <div style="margin-top: auto; border-top: 1.5px solid #D5D0C0; padding-top: 3mm; display: flex; justify-content: space-between; align-items: center; font-size: 7.2pt; color: #666; font-weight: 600;">
        <span>${isAr ? 'تم بحمد الله توثيق العدد التأسيسي كاملاً' : 'Founding Issue Unabridged Archival Edition'}</span>
        <span style="font-family: monospace; letter-spacing: 0.5px;">MIDAAN ARCHIVE // HKJ-PAL-2026-ZERO-FINAL</span>
        <span>${isAr ? 'خريف 2026 — عمّان • فلسطين' : 'Autumn 2026 — Amman • Palestine'}</span>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء — نهاية الإصدار' : "Register of Palestinian Martyrs' Wills — End of Issue"}</span>
        <span class="page-num">${isAr ? '١٦' : '16'} / ${isAr ? '١٦' : '16'}</span>
      </div>
    </div>

  </body>
  </html>`;
}

/**
 * Two-pass PDF generator and quality inspection
 */
async function generateMagazines() {
  console.log('=== STARTING BILINGUAL MAGAZINE GENERATION ===');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(__dirname, '..', 'public', 'magazine');
  const languages = ['ar', 'en'];
  const results = {};

  for (const lang of languages) {
    const isAr = lang === 'ar';
    console.log(`\n--------------------------------------------`);
    console.log(`Processing ${lang.toUpperCase()} Edition...`);
    console.log(`--------------------------------------------`);

    // Standard starting page numbers for 16-page issue:
    // Page 1: Cover
    // Page 2: Table of Contents & Colophon
    // Page 3: Founding Manifesto
    // Page 4: Art 1 (Opener)
    // Page 7: Art 2 (Opener)
    // Page 10: Art 3 (Opener)
    // Page 13: Art 4 (Opener)
    // Total: 16 pages
    const tocPages = {
      manifesto: 3,
      art1: 4,
      art2: 7,
      art3: 10,
      art4: 13
    };
    const totalPages = 16;
    const html = getMagazineHtml(lang, tocPages, totalPages);

    const tempHtmlPath = path.join(outDir, `temp-${lang}.html`);
    fs.writeFileSync(tempHtmlPath, html);

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.goto('file://' + tempHtmlPath, { waitUntil: 'load', timeout: 60000 });

    // Inspect each page for layout overflow & clipping
    const metrics = await page.evaluate(() => {
      const pageEls = document.querySelectorAll('.page');
      return Array.from(pageEls).map((el, idx) => {
        const clientHeight = el.clientHeight;
        const scrollHeight = el.scrollHeight;
        const isOverflowing = scrollHeight > clientHeight + 3; // allowance of 3px for subpixel font rendering
        return {
          pageNumber: idx + 1,
          clientHeight,
          scrollHeight,
          isOverflowing
        };
      });
    });

    console.log(`Inspected ${metrics.length} pages for ${lang.toUpperCase()}:`);
    let hasOverflow = false;
    for (const m of metrics) {
      if (m.isOverflowing) {
        console.error(`  [!] WARNING: Page ${m.pageNumber} overflows! scrollHeight=${m.scrollHeight} > clientHeight=${m.clientHeight}`);
        hasOverflow = true;
      } else {
        console.log(`  [OK] Page ${m.pageNumber}: ${m.scrollHeight}px / ${m.clientHeight}px (Clean fit, zero clipping)`);
      }
    }

    if (hasOverflow) {
      fs.unlinkSync(tempHtmlPath);
      throw new Error(`Fatal: One or more pages in ${lang.toUpperCase()} edition overflow page boundaries!`);
    }

    // Output PDF path
    const pdfFileName = isAr ? 'issue-zero.pdf' : 'issue-zero-en.pdf';
    const pdfPath = path.join(outDir, pdfFileName);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    console.log(`Successfully written PDF: ${pdfPath}`);

    // Capture every single page as PNG for visual proof & inspection
    const pageHandles = await page.$$('.page');
    console.log(`Capturing ${pageHandles.length} high-res page screenshots...`);
    for (let i = 0; i < pageHandles.length; i++) {
      const pageNumStr = String(i + 1).padStart(2, '0');
      const screenshotPath = path.join(outDir, `issue-zero-${lang}-page${pageNumStr}.png`);
      await pageHandles[i].screenshot({ path: screenshotPath });
    }
    console.log(`All individual page screenshots saved for ${lang.toUpperCase()}.`);

    results[lang] = {
      pdfPath,
      pageCount: pageHandles.length,
      tocPages
    };

    await page.close();
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }

  // Create representative article spread for each language (Pages 04 and 05 side-by-side)
  console.log('\nCreating representative article spreads (Pages 4 & 5)...');
  for (const lang of languages) {
    const isAr = lang === 'ar';
    const p4Path = path.join(outDir, `issue-zero-${lang}-page04.png`);
    const p5Path = path.join(outDir, `issue-zero-${lang}-page05.png`);
    const spreadPath = path.join(outDir, `issue-zero-${lang}-spread-art1.png`);

    const p4Base64 = fs.readFileSync(p4Path).toString('base64');
    const p5Base64 = fs.readFileSync(p5Path).toString('base64');

    // For Arabic RTL: Page 4 (opener) is on Right, Page 5 (reading) is on Left.
    // For English LTR: Page 4 (opener) is on Left, Page 5 (reading) is on Right.
    const leftImg = isAr ? p5Base64 : p4Base64;
    const rightImg = isAr ? p4Base64 : p5Base64;
    const leftLabel = isAr ? 'Page 05 (Reading)' : 'Page 04 (Opener)';
    const rightLabel = isAr ? 'Page 04 (Opener)' : 'Page 05 (Reading)';

    const spreadHtml = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #1A1A1A;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: sans-serif;
        }
        .spread-title {
          color: #FAF8F5;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }
        .spread-container {
          display: flex;
          gap: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          background: #000;
          padding: 12px;
          border-radius: 6px;
        }
        .spread-page {
          width: 794px;
          height: 1123px;
          background: #FAF8F5;
        }
        .spread-page img {
          width: 100%;
          height: 100%;
          display: block;
        }
        .spread-caption {
          margin-top: 8px;
          color: #888;
          font-size: 12px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="spread-title">
        ${isAr ? 'مجلة ميدان — العدد صفر: افتتاحية صراع الأرض والسماء (صفحتا العرض المتقابلتان ٠٤ و ٠٥)' : 'Midaan Magazine — Issue Zero: Conflict of Earth and Sky Spread (Facing Pages 04 & 05)'}
      </div>
      <div class="spread-container">
        <div>
          <div class="spread-page"><img src="data:image/png;base64,${leftImg}" /></div>
          <div class="spread-caption">${leftLabel}</div>
        </div>
        <div>
          <div class="spread-page"><img src="data:image/png;base64,${rightImg}" /></div>
          <div class="spread-caption">${rightLabel}</div>
        </div>
      </div>
    </body>
    </html>`;

    const spreadPage = await browser.newPage();
    await spreadPage.setViewport({ width: 1680, height: 1260, deviceScaleFactor: 1 });
    await spreadPage.setContent(spreadHtml, { waitUntil: 'load' });
    await spreadPage.screenshot({ path: spreadPath, fullPage: true });
    await spreadPage.close();
    console.log(`Generated Spread: ${spreadPath}`);
  }

  await browser.close();

  // Regenerate official cover thumbnails from the final PDFs
  console.log('\nRegenerating official cover thumbnails from final PDFs...');
  try {
    const renderCoverScript = path.join(__dirname, 'capture-cover-thumb.js');
    execSync(`node "${renderCoverScript}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Error running capture-cover-thumb.js:', err);
  }

  console.log('\n=== MAGAZINE GENERATION COMPLETE ===');
  console.log(JSON.stringify(results, null, 2));
}

generateMagazines().catch(err => {
  console.error('Fatal error during magazine generation:', err);
  process.exit(1);
});
