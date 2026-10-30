const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const { FOUNDING_MANIFESTO, ARTICLES } = require('../src/constants/articles.ts');

const alexandriaFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'Alexandria-Regular.ttf')).toString('base64');
const messiriFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'ElMessiri-Bold.ttf')).toString('base64');

async function buildPdf(lang, outputPath) {
  const isAr = lang === 'ar';
  const totalPages = isAr ? 11 : 12;

  const tocPages = {
    manifesto: 2,
    art1: 4,
    art2: 6,
    art3: 8,
    art4: 10
  };

  const art1 = ARTICLES[0];
  const art2 = ARTICLES[1];
  const art3 = ARTICLES[2];
  const art4 = ARTICLES[3];

  const html = `
  <!DOCTYPE html>
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
        padding: 18mm 20mm 16mm 20mm;
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
        padding-bottom: 3mm;
        margin-bottom: 5mm;
        font-size: 8pt;
        font-weight: 700;
        color: #444;
        font-family: 'Alexandria', sans-serif;
        letter-spacing: ${isAr ? '0' : '0.5px'};
      }
      .page-footer {
        position: absolute;
        bottom: 8mm;
        left: 20mm;
        right: 20mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1.5px solid #D5D0C0;
        padding-top: 2.5mm;
        font-size: 8.5pt;
        color: #555;
        font-family: ${isAr ? "'Alexandria', sans-serif" : "'Courier New', monospace"};
        font-weight: 600;
      }
      .page-footer .page-num {
        font-weight: 800;
        color: #111;
        font-size: 9.5pt;
      }

      /* COVER STYLES */
      .cover {
        padding: 16mm 16mm 14mm 16mm;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        border: 2px solid #111;
        margin: 5mm;
        width: 200mm;
        height: 287mm;
        position: relative;
        background: #FAF8F5;
      }
      .cover::before {
        content: '';
        position: absolute;
        inset: 3.5mm;
        border: 1px solid #D5D0C0;
        pointer-events: none;
      }
      .cover-masthead {
        margin-top: 4mm;
      }
      .cover-brand {
        font-family: 'El Messiri', serif;
        font-size: 5.2rem;
        font-weight: 700;
        color: #111;
        line-height: 0.95;
        letter-spacing: ${isAr ? '0' : '4px'};
        margin: 0;
      }
      .cover-brand span {
        color: #D80032;
      }
      .cover-subhead {
        font-size: 9.5pt;
        font-weight: 700;
        color: #333;
        text-transform: uppercase;
        letter-spacing: ${isAr ? '0' : '3px'};
        margin-top: 4mm;
      }
      .cover-badge {
        display: inline-block;
        background-color: #D80032;
        color: #fff;
        font-size: 9pt;
        font-weight: 800;
        padding: 5px 18px;
        border-radius: 9999px;
        letter-spacing: ${isAr ? '0' : '1.5px'};
        text-transform: uppercase;
      }
      .cover-issue-title {
        font-family: 'El Messiri', serif;
        font-size: 4.4rem;
        font-weight: 700;
        color: #111;
        line-height: 1;
        margin: 5mm 0 2mm 0;
      }
      .cover-issue-sub {
        font-family: 'El Messiri', serif;
        font-size: 1.4rem;
        color: #D80032;
        font-weight: 600;
      }
      .cover-strapline {
        font-size: 10.5pt;
        line-height: 1.85;
        color: #222;
        max-width: 150mm;
        margin: 4mm auto 0 auto;
        font-weight: 600;
      }
      .cover-footer {
        width: 100%;
        border-top: 1.5px solid #D5D0C0;
        padding-top: 3.5mm;
        font-size: 8.5pt;
        color: #444;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }

      /* MANIFESTO STYLES */
      .manifesto-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1mm 2mm 5mm 2mm;
      }
      .manifesto-lead {
        font-family: 'El Messiri', serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #D80032;
        line-height: 1.6;
        margin-bottom: 5mm;
        border-bottom: 1.5px solid #D5D0C0;
        padding-bottom: 4mm;
      }
      .manifesto-body {
        font-size: ${isAr ? '11.8pt' : '10.8pt'};
        line-height: ${isAr ? '2.1' : '1.9'};
        color: #1A1A1A;
        text-align: justify;
      }
      .manifesto-body p {
        margin-bottom: 5mm;
      }
      .manifesto-box {
        border-right: ${isAr ? '4px solid #D80032' : 'none'};
        border-left: ${isAr ? 'none' : '4px solid #D80032'};
        padding: 4.5mm 6mm;
        background: #F4EFE6;
        border-radius: 4px;
        font-size: ${isAr ? '11.2pt' : '10.2pt'};
        font-weight: 600;
        line-height: 1.95;
        margin-top: 3mm;
      }

      /* TOC STYLES */
      .toc-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2mm 2mm 5mm 2mm;
      }
      .toc-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 4mm 0;
        border-bottom: 1px dashed #D5D0C0;
      }
      .toc-row:last-child {
        border-bottom: none;
      }
      .toc-left {
        max-width: 145mm;
      }
      .toc-category {
        font-size: 8pt;
        font-weight: 800;
        color: #D80032;
        text-transform: uppercase;
        letter-spacing: ${isAr ? '0' : '1px'};
        margin-bottom: 1mm;
      }
      .toc-title {
        font-family: 'El Messiri', serif;
        font-size: 1.28rem;
        font-weight: 700;
        color: #111;
        line-height: 1.3;
      }
      .toc-desc {
        font-size: 8.8pt;
        color: #444;
        margin-top: 1mm;
        line-height: 1.5;
      }
      .toc-page-num {
        font-family: 'El Messiri', serif;
        font-size: 1.55rem;
        font-weight: 700;
        color: #D80032;
        padding-left: ${isAr ? '0' : '4mm'};
        padding-right: ${isAr ? '4mm' : '0'};
      }
      .toc-note-box {
        padding: 4mm 6mm;
        background: #F4EFE6;
        border-radius: 6px;
        font-size: 8.8pt;
        color: #333;
        line-height: 1.7;
        border-left: ${isAr ? 'none' : '3px solid #111'};
        border-right: ${isAr ? '3px solid #111' : 'none'};
      }

      /* ARTICLE STYLES */
      .article-hero {
        margin-bottom: 4.5mm;
      }
      .article-tag {
        display: inline-block;
        background: #D80032;
        color: white;
        font-size: 7.5pt;
        font-weight: 800;
        padding: 2.5px 10px;
        border-radius: 9999px;
        text-transform: uppercase;
        margin-bottom: 2mm;
      }
      .article-heading {
        font-family: 'El Messiri', serif;
        font-size: 2.15rem;
        font-weight: 700;
        color: #111;
        line-height: 1.2;
        margin: 1mm 0 2mm 0;
      }
      .article-subheading {
        font-family: 'El Messiri', serif;
        font-size: 1.15rem;
        color: #444;
        font-weight: 600;
        margin-bottom: 3.5mm;
      }
      .article-lead-box {
        background: #F4EFE6;
        border-right: ${isAr ? '3.5px solid #D80032' : 'none'};
        border-left: ${isAr ? 'none' : '3.5px solid #D80032'};
        padding: 3.5mm 5mm;
        font-size: ${isAr ? '11pt' : '10pt'};
        font-weight: 600;
        line-height: 1.85;
        color: #1A1A1A;
        border-radius: 3px;
        margin-bottom: 3.5mm;
      }
      .article-columns {
        column-count: 2;
        column-gap: 8.5mm;
        text-align: justify;
        font-size: ${isAr ? '11.2pt' : '10pt'};
        line-height: ${isAr ? '1.9' : '1.65'};
        color: #1F1F1F;
        flex: 1;
      }
      .article-columns p {
        margin: 0 0 4.5mm 0;
      }
      .section-title {
        font-family: 'El Messiri', serif;
        font-size: 1.15rem;
        font-weight: 700;
        color: #111;
        margin: 3.5mm 0 2mm 0;
        break-after: avoid;
        display: flex;
        align-items: center;
        gap: 2mm;
        border-bottom: 1.5px solid #D80032;
        padding-bottom: 1mm;
      }
      .pull-quote {
        font-family: 'El Messiri', serif;
        font-size: 1.2rem;
        color: #D80032;
        font-weight: 700;
        line-height: 1.6;
        border-top: 1.5px solid #D5D0C0;
        border-bottom: 1.5px solid #D5D0C0;
        padding: 3.5mm 0;
        margin: 4.5mm 0;
        text-align: center;
        break-inside: avoid;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 2mm 0 3mm 0;
        font-size: ${isAr ? '9.5pt' : '8.5pt'};
        line-height: 1.5;
        break-inside: avoid;
      }
      .data-table th {
        background-color: #111;
        color: #FAF8F5;
        font-weight: 700;
        padding: 2mm 3mm;
        text-align: ${isAr ? 'right' : 'left'};
        border: 1px solid #111;
      }
      .data-table td {
        border: 1px solid #D5D0C0;
        padding: 2mm 3mm;
        vertical-align: top;
      }
      .data-table tr:nth-child(even) {
        background-color: #F4EFE6;
      }
      .martyr-card {
        border: 1px solid #D5D0C0;
        background: #FDFCF9;
        border-radius: 4px;
        padding: 3mm 3.5mm;
        margin-bottom: 3.5mm;
        break-inside: avoid;
        border-right: ${isAr ? '3px solid #D80032' : '1px solid #D5D0C0'};
        border-left: ${isAr ? '1px solid #D5D0C0' : '3px solid #D80032'};
      }
      .martyr-card-header {
        font-family: 'El Messiri', serif;
        font-weight: 700;
        color: #111;
        font-size: 10.8pt;
        margin-bottom: 1.5mm;
        display: flex;
        justify-content: space-between;
      }
      .martyr-card-header span:last-child {
        font-family: 'Courier New', monospace;
        color: #D80032;
        font-weight: 800;
      }
      .martyr-card-text {
        font-size: ${isAr ? '10pt' : '9.2pt'};
        line-height: 1.8;
        color: #222;
      }
    </style>
  </head>
  <body>

    <!-- ==================== 1. COVER PAGE ==================== -->
    <div class="page" style="padding: 0; background: #FAF8F5;">
      <div class="cover">
        <div class="cover-masthead">
          <h1 class="cover-brand">مَـيـدَان<span>.</span></h1>
          <div class="cover-subhead">
            ${isAr ? 'مجلة فكرية وثقافية مستقلة • صُنعت في عمّان • فلسطين' : 'Independent Intellectual & Cultural Review • Amman • Palestine'}
          </div>
        </div>

        <div style="margin: 6mm 0;">
          <div class="cover-badge">${isAr ? 'الإصدار التأسيسي // خريف 2026' : 'FOUNDING ISSUE // AUTUMN 2026'}</div>
          <div class="cover-issue-title">${isAr ? 'انتحاب' : 'ENTIHAB'}</div>
          <div class="cover-issue-sub">${isAr ? 'العدد صفر' : 'ISSUE ZERO'}</div>
          <p class="cover-strapline">
            ${isAr 
              ? 'توثيق سردية الشارع، صراع الأرض والسماء، وسجل وصايا الخالدين. منصة للرواية المستقلة والتعبير المدني الحر.'
              : 'Documenting the street narrative, the conflict of earth and sky, and the testaments of the immortal. An independent forum for memory and cultural resistance.'}
          </p>
        </div>

        <div class="cover-footer">
          <span>${isAr ? 'حبر حر • ذاكرة تأبى النسيان' : 'Free Press • Unbroken Memory'}</span>
          <span style="font-family: 'Courier New', monospace; font-weight: bold;">MIDAAN ARCHIVE // HKJ-PAL-2026-ZERO</span>
          <span>${isAr ? 'العدد 00' : 'ISSUE 00'}</span>
        </div>
      </div>
    </div>

    <!-- ==================== 2. FOUNDING MANIFESTO ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — العدد صفر' : 'Midaan Magazine — Issue Zero'}</span>
        <span>${isAr ? 'البيان التأسيسي' : 'Founding Manifesto'}</span>
      </div>

      <div class="manifesto-container">
        <div>
          <div class="article-tag">${isAr ? 'افتتاحية الإصدار' : 'PROLOGUE'}</div>
          <h2 style="font-family: 'El Messiri', serif; font-size: 2.3rem; color: #111; margin: 2mm 0 4mm 0; line-height: 1.2;">
            ${isAr ? FOUNDING_MANIFESTO.titleAr : FOUNDING_MANIFESTO.titleEn}
          </h2>
          <div class="manifesto-lead">
            ${isAr ? FOUNDING_MANIFESTO.paragraphsAr[0] : FOUNDING_MANIFESTO.paragraphsEn[0]}
          </div>

          <div class="manifesto-body">
            <p>${isAr ? FOUNDING_MANIFESTO.paragraphsAr[1] : FOUNDING_MANIFESTO.paragraphsEn[1]}</p>
            <p>${isAr ? FOUNDING_MANIFESTO.paragraphsAr[2] : FOUNDING_MANIFESTO.paragraphsEn[2]}</p>
            <p>${isAr ? FOUNDING_MANIFESTO.paragraphsAr[3] : FOUNDING_MANIFESTO.paragraphsEn[3]}</p>
          </div>
        </div>

        <div class="manifesto-box">
          ${isAr ? FOUNDING_MANIFESTO.paragraphsAr[4] : FOUNDING_MANIFESTO.paragraphsEn[4]}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — البيان التأسيسي' : 'Midaan Magazine — Founding Manifesto'}</span>
        <span class="page-num">2 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 3. TABLE OF CONTENTS ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — العدد صفر' : 'Midaan Magazine — Issue Zero'}</span>
        <span>${isAr ? 'فهرس العدد ومحتويات الإصدار' : 'Contents & Editorial Directory'}</span>
      </div>

      <div class="toc-container">
        <div>
          <div class="article-tag">${isAr ? 'دليل القراءة' : 'DIRECTORY'}</div>
          <h2 style="font-family: 'El Messiri', serif; font-size: 2.3rem; color: #D80032; margin: 2mm 0 5mm 0;">
            ${isAr ? 'فهرس العدد' : 'Table of Contents'}
          </h2>

          <div>
            <div class="toc-row">
              <div class="toc-left">
                <div class="toc-category">${isAr ? 'البيان التأسيسي' : 'Prologue'}</div>
                <div class="toc-title">${isAr ? 'البيان التأسيسي: انتحاب' : 'Founding Manifesto: Entihab (Lamentation)'}</div>
                <div class="toc-desc">${isAr ? 'مقدمة العدد صفر، عهد الرواية، وإعلان إطلاق ميدان كخندق ثقافي يحرس الذاكرة.' : 'Issue Zero introduction, the covenant of narrative, and launching Midaan.'}</div>
              </div>
              <div class="toc-page-num">${tocPages.manifesto}</div>
            </div>

            <div class="toc-row">
              <div class="toc-left">
                <div class="toc-category">${isAr ? 'افتتاحية العدد' : 'Editorial'}</div>
                <div class="toc-title">${isAr ? art1.titleAr : art1.titleEn}</div>
                <div class="toc-desc">${isAr ? 'لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟ تفكيك أوهام الحلول السياسية البراغماتية أمام صراع الوجود.' : 'Why the Palestine struggle cannot be understood apart from faith: dismantling diplomatic illusions.'}</div>
              </div>
              <div class="toc-page-num">${tocPages.art1}</div>
            </div>

            <div class="toc-row">
              <div class="toc-left">
                <div class="toc-category">${isAr ? 'مقال فكري' : 'Philosophical Essay'}</div>
                <div class="toc-title">${isAr ? art2.titleAr : art2.titleEn}</div>
                <div class="toc-desc">${isAr ? 'تشريح نقدي لأنظمة التدجين: الأبوي، التعليمي، المجتمعي، واللاهوتي، والوقوف في وجه آلة النظام.' : 'A critical anatomy of domesticating systems—patriarchal, educational, societal—and defying the machine.'}</div>
              </div>
              <div class="toc-page-num">${tocPages.art2}</div>
            </div>

            <div class="toc-row">
              <div class="toc-left">
                <div class="toc-category">${isAr ? 'دراسة فلسفية' : 'Philosophical Study'}</div>
                <div class="toc-title">${isAr ? art3.titleAr : art3.titleEn}</div>
                <div class="toc-desc">${isAr ? 'من مشقة الوداع إلى سكينة الشهادة: كيف يتحول عبء الوصية الوجودي إلى يقين خالص يتسامى فوق الفناء؟' : 'From the agony of parting to the serenity of martyrdom: how the burden of testaments becomes certainty.'}</div>
              </div>
              <div class="toc-page-num">${tocPages.art3}</div>
            </div>

            <div class="toc-row">
              <div class="toc-left">
                <div class="toc-category">${isAr ? 'أرشيف وتوثيق' : 'Historical Registry'}</div>
                <div class="toc-title">${isAr ? art4.titleAr : art4.titleEn}</div>
                <div class="toc-desc">${isAr ? 'سجل وصايا الشهداء الفلسطينيين: نصوص ووصايا باسل الأعرج، بهاء عليان، دلال المغربي، غسان كنفاني، ورفاقهم.' : "Ledger of Palestinian Martyrs' Wills: testaments of Basil al-Araj, Baha Alyan, Dalal al-Mughrabi, and comrades."}</div>
              </div>
              <div class="toc-page-num">${tocPages.art4}</div>
            </div>
          </div>
        </div>

        <div class="toc-note-box">
          <strong>${isAr ? 'ملاحظة توثيقية حول حدود الإصدار الأرشيفي:' : 'Archival Documentation Note:'}</strong>
          ${isAr 
            ? 'يضم هذا الإصدار الأرشيفي الكامل للعدد صفر النصوص التأسيسية الأربعة المعتمدة في سجلات مجلة ميدان. تم توثيق النصوص كاملة دون اختزال. ملف "انتحاب - العدد الأول" المحفوظ في الأرشيف يمثل الإصدار التالي المنفصل ويخضع لجدول نشر مستقل.' 
            : 'This complete archival edition of Issue Zero compiles the four foundational texts verified from Midaan Magazine archives, fully unabridged. The "Entihab - Issue One" file in the source repository represents the forthcoming separate issue.'}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — الفهرس' : 'Midaan Magazine — Contents'}</span>
        <span class="page-num">3 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 4. ARTICLE 1 (Page 4) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — افتتاحية العدد' : 'Midaan Magazine — Editorial'}</span>
        <span>${isAr ? 'صراع الأرض والسماء (1)' : 'Conflict of Earth and Sky (Part 1)'}</span>
      </div>

      <div class="article-hero">
        <div class="article-tag">${isAr ? 'افتتاحية العدد' : 'EDITORIAL'}</div>
        <h2 class="article-heading">${isAr ? art1.titleAr : art1.titleEn}</h2>
        <div class="article-lead-box">
          ${isAr ? art1.excerptAr : art1.excerptEn}
        </div>
      </div>

      <div class="article-columns">
        <p>${isAr ? art1.contentAr[0] : art1.contentEn[0]}</p>
        <p>${isAr ? art1.contentAr[1] : art1.contentEn[1]}</p>
        
        <div class="pull-quote">
          ${isAr ? art1.pullQuoteAr : art1.pullQuoteEn}
        </div>

        <div class="section-title">
          <span>${isAr ? 'التوراة كخريطة طريق.. العقيدة في خدمة الاستعمار' : 'The Torah as a Roadmap: Faith in the Service of Colonialism'}</span>
        </div>
        <p>${isAr ? art1.contentAr[2] : art1.contentEn[2]}</p>
        <p>${isAr ? art1.contentAr[3] : art1.contentEn[3]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
        <span class="page-num">4 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 5. ARTICLE 1 Continued (Page 5) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — افتتاحية العدد' : 'Midaan Magazine — Editorial'}</span>
        <span>${isAr ? 'صراع الأرض والسماء (2)' : 'Conflict of Earth and Sky (Part 2)'}</span>
      </div>

      <div class="article-columns">
        <div class="section-title">
          <span>${isAr ? '«آية في كتاب».. الجذور في العقل الجمعي' : '"A Verse in the Book": Roots in Collective Consciousness'}</span>
        </div>
        <p>${isAr ? art1.contentAr[4] : art1.contentEn[4]}</p>
        <p>${isAr ? art1.contentAr[5].replace(/\\n/g, '<br/>') : art1.contentEn[5].replace(/\\n/g, '<br/>')}</p>

        <div class="section-title">
          <span>${isAr ? 'مقارنة تحليلية: أبعاد الصراع بين الرؤية والواقع' : 'Analytical Comparison: Dimensions of the Conflict'}</span>
        </div>
        <table class="data-table">
          <tr>
            <th>${isAr ? 'البُعد التحليلي' : 'Dimension'}</th>
            <th>${isAr ? 'المنظور السياسي' : 'Political View'}</th>
            <th>${isAr ? 'الواقع العقائدي' : 'Faith Reality'}</th>
          </tr>
          <tr>
            <td><strong>${isAr ? 'طبيعة الخلاف' : 'Nature of Dispute'}</strong></td>
            <td>${isAr ? 'نزاع على حدود وموارد' : 'Border dispute & resources'}</td>
            <td>${isAr ? 'صراع وجودي يمس العقيدة' : 'Existential struggle of identity & faith'}</td>
          </tr>
          <tr>
            <td><strong>${isAr ? 'أدوات الحل' : 'Means of Resolution'}</strong></td>
            <td>${isAr ? 'مفاوضات وحلول وسطى' : 'Negotiations & compromise'}</td>
            <td>${isAr ? 'حقوق تاريخية غير قابلة للتجزئة' : 'Indivisible historical & sacred rights'}</td>
          </tr>
          <tr>
            <td><strong>${isAr ? 'محرك الصمود' : 'Engine of Sumud'}</strong></td>
            <td>${isAr ? 'حقوق مواطنة دولية' : 'Civil rights under law'}</td>
            <td>${isAr ? 'يقين عقائدي ورباط مقدس' : 'Faith, steadfast vigil (Ribat) & moral duty'}</td>
          </tr>
        </table>

        <div class="section-title">
          <span>${isAr ? 'سقوط وهم «البراغماتية» ومعركة الروايات' : 'The Demise of Pragmatism & the War of Narratives'}</span>
        </div>
        <p>${isAr ? art1.contentAr[7] : art1.contentEn[7]}</p>
        <p>${isAr ? art1.contentAr[8] : art1.contentEn[8]}</p>
        <p style="font-weight: 700; color: #111;">${isAr ? art1.contentAr[9] : art1.contentEn[9]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
        <span class="page-num">5 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 6. ARTICLE 2 (Page 6) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — مقال فكري' : 'Midaan Magazine — Philosophical Essay'}</span>
        <span>${isAr ? 'سأموت قبل الأربعين (1)' : 'I Will Die Before Forty (Part 1)'}</span>
      </div>

      <div class="article-hero">
        <div class="article-tag">${isAr ? 'مقال فكري' : 'ESSAY'}</div>
        <h2 class="article-heading">${isAr ? art2.titleAr : art2.titleEn}</h2>
        <div class="article-lead-box">
          ${isAr ? art2.excerptAr : art2.excerptEn}
        </div>
      </div>

      <div class="article-columns">
        <p>${isAr ? art2.contentAr[0] : art2.contentEn[0]}</p>

        <div class="section-title">
          <span>${isAr ? 'السستم: المصفوفة الكبرى' : 'The System: The Master Matrix'}</span>
        </div>
        <p>${isAr ? art2.contentAr[1] : art2.contentEn[1]}</p>

        <div class="section-title">
          <span>${isAr ? 'النظام الأبوي: صكوك الملكية' : 'The Patriarchal Order: Deeds of Ownership'}</span>
        </div>
        <p>${isAr ? art2.contentAr[2] : art2.contentEn[2]}</p>

        <div class="section-title">
          <span>${isAr ? 'النظام التعليمي: مقصلة العقول' : 'The Educational System: Guillotine of the Mind'}</span>
        </div>
        <p>${isAr ? art2.contentAr[3] : art2.contentEn[3]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</span>
        <span class="page-num">6 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 7. ARTICLE 2 Continued (Page 7) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — مقال فكري' : 'Midaan Magazine — Philosophical Essay'}</span>
        <span>${isAr ? 'سأموت قبل الأربعين (2)' : 'I Will Die Before Forty (Part 2)'}</span>
      </div>

      <div class="article-columns">
        <div class="pull-quote">
          ${isAr ? art2.pullQuoteAr : art2.pullQuoteEn}
        </div>

        <div class="section-title">
          <span>${isAr ? 'النظام المجتمعي: مسرح العبث والنفاق' : 'The Social Order: A Theater of the Absurd'}</span>
        </div>
        <p>${isAr ? art2.contentAr[4] : art2.contentEn[4]}</p>

        <div class="section-title">
          <span>${isAr ? 'النظام الربوبي: الأسئلة المحرمة' : 'The Religious Order: Forbidden Questions'}</span>
        </div>
        <p>${isAr ? art2.contentAr[5] : art2.contentEn[5]}</p>

        <div class="section-title">
          <span>${isAr ? 'تسع سنوات متبقية: الوقوف في وجه السستم' : 'Nine Years Remain: Standing Against the System'}</span>
        </div>
        <p>${isAr ? art2.contentAr[6] : art2.contentEn[6]}</p>

        <div style="background: #F4EFE6; border: 1px solid #D5D0C0; padding: 3.5mm 4.5mm; border-radius: 4px; margin-top: 3mm; break-inside: avoid;">
          <div style="font-family: 'El Messiri', serif; font-size: 10.5pt; font-weight: 700; color: #D80032; margin-bottom: 1.5mm;">
            ${isAr ? 'وثيقة انتحاب: صوت الرفض المستقل' : 'Voice of Defiance: Midaan Philosophical Registry'}
          </div>
          <div style="font-size: 8.5pt; color: #333; line-height: 1.6;">
            ${isAr 
              ? 'يمثل هذا المقال شهادة وجودية نقدية تعكس صدمة الجيل الشاب مع أجهزة الضبط الاجتماعي والمؤسسي في المنطقة العربية.' 
              : 'This essay constitutes an existential testimony dissecting the crisis of youth agency confronting institutional and social pacification in the region.'}
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</span>
        <span class="page-num">7 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 8. ARTICLE 3 (Page 8) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — دراسة فلسفية' : 'Midaan Magazine — Philosophical Study'}</span>
        <span>${isAr ? 'حبر اليقين (1)' : 'Ink of Certainty (Part 1)'}</span>
      </div>

      <div class="article-hero">
        <div class="article-tag">${isAr ? 'دراسة سيكولوجية وسردية' : 'STUDY'}</div>
        <h2 class="article-heading">${isAr ? art3.titleAr : art3.titleEn}</h2>
        <div class="article-lead-box">
          ${isAr ? art3.excerptAr : art3.excerptEn}
        </div>
      </div>

      <div class="article-columns">
        <p>${isAr ? art3.contentAr[0] : art3.contentEn[0]}</p>

        <div class="section-title">
          <span>${isAr ? 'مشقة البداية: مواجهة الحبر والعدم' : 'The Agony of the Opening: Facing Ink and Void'}</span>
        </div>
        <p>${isAr ? art3.contentAr[1] : art3.contentEn[1]}</p>
        <p>${isAr ? art3.contentAr[2] : art3.contentEn[2]}</p>

        <div class="section-title">
          <span>${isAr ? 'التسامي النفسي: كيف وُلدت السكينة؟' : 'Psychological Sublimation: Serenity from Peril'}</span>
        </div>
        <p>${isAr ? art3.contentAr[3] : art3.contentEn[3]}</p>
        <p>${isAr ? art3.contentAr[4] : art3.contentEn[4]}</p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'حبر اليقين' : 'Ink of Certainty'}</span>
        <span class="page-num">8 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 9. ARTICLE 3 Continued (Page 9) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — دراسة فلسفية' : 'Midaan Magazine — Philosophical Study'}</span>
        <span>${isAr ? 'حبر اليقين (2)' : 'Ink of Certainty (Part 2)'}</span>
      </div>

      <div class="article-columns">
        <div class="pull-quote">
          ${isAr ? art3.pullQuoteAr : art3.pullQuoteEn}
        </div>

        <p>${isAr ? art3.contentAr[5] : art3.contentEn[5]}</p>
        <p>${isAr ? art3.contentAr[6] : art3.contentEn[6]}</p>

        <div class="section-title">
          <span>${isAr ? 'الأثر النفسي للوصية: نقل العبء إلى الأحياء' : 'Legacy of the Testament: The Burden of the Living'}</span>
        </div>
        <p>${isAr ? art3.contentAr[7] : art3.contentEn[7]}</p>
        <p style="font-weight: 700; color: #111;">${isAr ? art3.contentAr[8] : art3.contentEn[8]}</p>

        <div style="background: #F4EFE6; border-right: ${isAr ? '3px solid #D80032' : 'none'}; border-left: ${isAr ? 'none' : '3px solid #D80032'}; padding: 3.5mm 4.5mm; margin-top: 3mm; border-radius: 4px; break-inside: avoid;">
          <div style="font-family: 'El Messiri', serif; font-size: 10.5pt; font-weight: 700; color: #D80032; margin-bottom: 1.5mm;">
            ${isAr ? 'خلاصة اليقين' : 'Distilled Certainty'}
          </div>
          <div style="font-size: 8.5pt; color: #333; line-height: 1.6;">
            ${isAr 
              ? 'إن وصايا الشهداء الفلسطينيين تعيد تعريف مفهوم الشجاعة النفسية؛ حيث ينتقل الوعي من حيز الفناء الشخصي إلى حيز الفعل التأسيسي والخلود الجمعي.' 
              : 'The testaments of Palestinian martyrs redefine psychological resolve, moving consciousness from personal mortality into collective immortality.'}
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'حبر اليقين' : 'Ink of Certainty'}</span>
        <span class="page-num">9 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 10. ARTICLE 4 (Page 10) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — أرشيف وتوثيق' : 'Midaan Magazine — Historical Registry'}</span>
        <span>${isAr ? 'سجل وصايا الشهداء (1)' : "Register of Martyrs' Wills (Part 1)"}</span>
      </div>

      <div class="article-hero">
        <div class="article-tag">${isAr ? 'سجل أرشيفي وتاريخي' : 'ARCHIVE'}</div>
        <h2 class="article-heading">${isAr ? art4.titleAr : art4.titleEn}</h2>
        <div class="article-lead-box">
          ${isAr ? art4.excerptAr : art4.excerptEn}
        </div>
      </div>

      <div class="article-columns">
        <p>${isAr ? art4.contentAr[0] : art4.contentEn[0]}</p>

        <div class="section-title">
          <span>${isAr ? 'فهرس الوصايا الموثقة في السجل' : 'Index of Documented Testaments'}</span>
        </div>
        <table class="data-table">
          <tr>
            <th>${isAr ? 'الشهيد' : 'Martyr'}</th>
            <th>${isAr ? 'العام' : 'Year'}</th>
            <th>${isAr ? 'طبيعة الوصية' : 'Classification'}</th>
          </tr>
          <tr><td>باسل الأعرج</td><td>2017</td><td>${isAr ? 'فكرية وثقافية ثورية' : 'Revolutionary cultural thought'}</td></tr>
          <tr><td>بهاء عليان</td><td>2015</td><td>${isAr ? 'الوصايا العشر (اجتماعية)' : 'The Ten Commandments (Civic)'}</td></tr>
          <tr><td>دلال المغربي</td><td>1978</td><td>${isAr ? 'سياسية وعسكرية' : 'Political & military imperative'}</td></tr>
          <tr><td>تامر الكيلاني</td><td>2022</td><td>${isAr ? 'تنظيمية وروحية' : 'Discipline & spiritual resolve'}</td></tr>
          <tr><td>إبراهيم النابلسي</td><td>2022</td><td>${isAr ? 'تسجيل صوتي تحت الحصار' : 'Audio dispatch under siege'}</td></tr>
          <tr><td>عدي التميمي</td><td>2022</td><td>${isAr ? 'ميدانية أثناء المطاردة' : 'Field manuscript under manhunt'}</td></tr>
          <tr><td>يحيى عياش</td><td>1996</td><td>${isAr ? 'منهج وعقيدة اشتباك' : 'Resistance doctrine'}</td></tr>
          <tr><td>وديع الحوح</td><td>2022</td><td>${isAr ? 'رسالة عبر اللاسلكي' : 'Tactical radio transmission'}</td></tr>
          <tr><td>غسان كنفاني</td><td>1972</td><td>${isAr ? 'أدبية وفلسفية' : 'Literary & philosophical'}</td></tr>
        </table>

        <div class="section-title">
          <span>${isAr ? 'القسم الأول: الوصايا الفكرية والسياسية' : 'Part One: Intellectual & Political Testaments'}</span>
        </div>
        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>${isAr ? '1. الشهيد المثقف باسل الأعرج' : '1. Intellectual Martyr Basil al-Araj'}</span>
            <span>2017</span>
          </div>
          <div class="martyr-card-text">
            ${isAr 
              ? art4.contentAr[3].replace(/•/g, '<br/>•').replace(/\\n/g, '<br/>')
              : art4.contentEn[3].replace(/•/g, '<br/>•').replace(/\\n/g, '<br/>')}
          </div>
        </div>
        ${!isAr ? '' : `
        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>2. الوصايا العشر للشهيد بهاء عليان</span>
            <span>2015</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[4].replace(/\\n/g, '<br/>')}
          </div>
        </div>
        `}
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء' : "Register of Palestinian Martyrs' Wills"}</span>
        <span class="page-num">10 / ${totalPages}</span>
      </div>
    </div>

    ${isAr ? `
    <!-- ==================== 11. ARABIC ARTICLE 4 Conclusion (Page 11) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>مجلة ميدان — أرشيف وتوثيق</span>
        <span>سجل وصايا الشهداء (خاتمة السجل)</span>
      </div>

      <div class="article-columns">
        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>3. الشهيدة دلال المغربي</span>
            <span>1978</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[5].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>4. الشهيد تامر الكيلاني</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[6].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="section-title">
          <span>القسم الثاني: وصايا الميدان والاشتباك</span>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>5. الشهيد إبراهيم النابلسي</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[8].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>6. الشهيد عدي التميمي</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[9].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>7. مقولة الشهيد يحيى عياش</span>
            <span>1996</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[10].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>8. رسالة الشهيد وديع الحوح</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[11].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="section-title">
          <span>القسم الثالث: وصايا أدبية وفلسفية</span>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>9. الأديب الشهيد غسان كنفاني</span>
            <span>1972</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentAr[13].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div style="background: #111; color: #FAF8F5; padding: 4.5mm 5mm; border-radius: 6px; margin-top: 4mm; break-inside: avoid;">
          <div style="font-family: 'El Messiri', serif; font-size: 11pt; font-weight: 700; color: #D80032; margin-bottom: 1.5mm;">
            عهد ميدان: الرواية التي لا تُهزم
          </div>
          <div style="font-size: 8.5pt; line-height: 1.7; color: #DDD;">
            إن توثيق هذه الوصايا في مجلة ميدان هو عهد مستمر بأن الرواية الفلسطينية لا تُهزم، وأن الكلمة الشاهدة تبقى حية تتوارثها الأجيال حتى لحظة التحرير والعودة.
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>سجل وصايا الشهداء</span>
        <span class="page-num">11 / ${totalPages}</span>
      </div>
    </div>
    ` : `
    <!-- ==================== 11. ENGLISH ARTICLE 4 Continued (Page 11) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>Midaan Magazine — Historical Registry</span>
        <span>Register of Martyrs' Wills (Part 2)</span>
      </div>

      <div class="article-columns">
        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>2. The Ten Wills of Martyr Baha Alyan</span>
            <span>2015</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[4].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>3. Martyr Dalal al-Mughrabi</span>
            <span>1978</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[5].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>4. Martyr Tamer al-Kilani</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[6].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="section-title">
          <span>Part Two: Battlefield Testaments</span>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>5. Martyr Ibrahim al-Nabulsi</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[8].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>6. Martyr Oday al-Tamimi</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[9].replace(/\\n/g, '<br/>')}
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>Register of Palestinian Martyrs' Wills</span>
        <span class="page-num">11 / ${totalPages}</span>
      </div>
    </div>

    <!-- ==================== 12. ENGLISH ARTICLE 4 Conclusion (Page 12) ==================== -->
    <div class="page">
      <div class="page-header">
        <span>Midaan Magazine — Historical Registry</span>
        <span>Register of Martyrs' Wills (Conclusion)</span>
      </div>

      <div class="article-columns">
        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>7. Maxim of Martyr Yahya Ayyash</span>
            <span>1996</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[10].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>8. Message of Martyr Wadee al-Hawah</span>
            <span>2022</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[11].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div class="section-title">
          <span>Part Three: Literary & Philosophical Wills</span>
        </div>

        <div class="martyr-card">
          <div class="martyr-card-header">
            <span>9. Literary Martyr Ghassan Kanafani</span>
            <span>1972</span>
          </div>
          <div class="martyr-card-text">
            ${art4.contentEn[13].replace(/\\n/g, '<br/>')}
          </div>
        </div>

        <div style="background: #111; color: #FAF8F5; padding: 4.5mm 5mm; border-radius: 6px; margin-top: 5mm; break-inside: avoid;">
          <div style="font-family: 'El Messiri', serif; font-size: 11pt; font-weight: 700; color: #D80032; margin-bottom: 2mm;">
            Midaan Covenant: An Invincible Narrative
          </div>
          <div style="font-size: 8.5pt; line-height: 1.7; color: #DDD;">
            Documenting these testaments in Midaan Magazine is our continuing pledge: that the narrative is never vanquished, and witness words endure across generations until liberation.
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span>Register of Palestinian Martyrs' Wills</span>
        <span class="page-num">12 / ${totalPages}</span>
      </div>
    </div>
    `}

  </body>
  </html>
  `;

  const tempHtmlPath = path.join(__dirname, '..', 'public', 'magazine', `temp-${lang}.html`);
  fs.writeFileSync(tempHtmlPath, html);

  console.log(`Generating ${lang.toUpperCase()} PDF (${outputPath})...`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('file://' + tempHtmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  const pageElements = await page.$$('.page');
  console.log(`Found ${pageElements.length} pages in ${lang.toUpperCase()}`);

  const pageMetrics = await page.evaluate(() => {
    const pages = document.querySelectorAll('.page');
    return Array.from(pages).map((p, idx) => {
      const pageRect = p.getBoundingClientRect();
      const col = p.querySelector('.article-columns');
      if (!col) return { page: idx + 1, fillPercent: 100 };
      const children = Array.from(col.children);
      const textBottoms = children.map(c => c.getBoundingClientRect().bottom - pageRect.top);
      const bottom = Math.max(...textBottoms);
      const maxUsable = pageRect.height - 75; // usable before footer
      return {
        page: idx + 1,
        pageHeight: Math.round(pageRect.height),
        textBottom: Math.round(bottom),
        fillPercent: Math.round((bottom / maxUsable) * 100)
      };
    });
  });
  console.log(`${lang.toUpperCase()} Actual Text Fill Metrics:`, pageMetrics);

  await browser.close();
  fs.unlinkSync(tempHtmlPath);
  console.log(`Finished ${outputPath}`);
}

async function run() {
  const arPdf = path.join(__dirname, '..', 'public', 'magazine', 'issue-zero.pdf');
  const enPdf = path.join(__dirname, '..', 'public', 'magazine', 'issue-zero-en.pdf');

  await buildPdf('ar', arPdf);
  await buildPdf('en', enPdf);

  console.log('All bilingual PDFs generated successfully!');
}

run().catch(err => {
  console.error('Error generating magazines:', err);
  process.exit(1);
});
