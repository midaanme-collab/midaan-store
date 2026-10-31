const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const alexandriaFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'Alexandria-Regular.ttf')).toString('base64');
const messiriFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'ElMessiri-Bold.ttf')).toString('base64');

let editorialArtworkBase64 = '';
const artworkPath = path.join(__dirname, '..', 'public', 'magazine', 'editorial-symbolic-earth-sky.jpg');
if (fs.existsSync(artworkPath)) {
  editorialArtworkBase64 = fs.readFileSync(artworkPath).toString('base64');
}

function getSpecimenHtml(lang) {
  const isAr = lang === 'ar';

  return `<!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <title>${isAr ? 'نموذج مجلة ميدان المصغر — العدد صفر' : 'Midaan Review Specimen — Issue Zero'}</title>
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
        padding: 16mm 18mm 14mm 18mm;
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
        padding-bottom: 2.5mm;
        margin-bottom: 4mm;
        font-size: 8pt;
        font-weight: 700;
        color: #444;
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
        padding-top: 2.5mm;
        font-size: 8pt;
        color: #555;
        font-weight: 600;
      }
      .page-footer .page-num {
        font-weight: 800;
        color: #111;
        font-size: 9pt;
      }

      /* PAGE 1: COVER */
      .cover-page {
        padding: 14mm 14mm 12mm 14mm;
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
        font-size: 5rem;
        font-weight: 700;
        color: #111;
        line-height: 1;
        margin-top: 2mm;
      }
      .cover-brand span {
        color: #D80032;
      }
      .cover-subhead {
        font-size: 8.5pt;
        font-weight: 700;
        color: #444;
        margin-top: 3mm;
        letter-spacing: ${isAr ? '0' : '1px'};
      }
      .cover-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4mm;
        margin: auto 0;
        max-width: 170mm;
      }
      .cover-badge {
        display: inline-block;
        background-color: #D80032;
        color: #fff;
        font-size: 8pt;
        font-weight: 800;
        padding: 4px 16px;
        border-radius: 9999px;
      }
      .cover-issue-title {
        font-family: 'El Messiri', serif;
        font-size: 4.2rem;
        font-weight: 700;
        color: #111;
        line-height: 1;
        margin: 2mm 0;
      }
      .cover-issue-num {
        font-size: 1.25rem;
        font-weight: 800;
        color: #D80032;
        margin-bottom: 2mm;
      }
      .cover-lead-summary {
        font-size: 8.8pt;
        line-height: 1.8;
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
        font-size: 7pt;
        color: #666;
        font-weight: 600;
        border-top: 1px solid #E5E0D0;
        padding-top: 3mm;
      }

      /* PAGE 2: ARTICLE OPENER */
      .opener-category {
        display: inline-block;
        background-color: #D80032;
        color: #fff;
        font-size: 7.5pt;
        font-weight: 800;
        padding: 3px 12px;
        border-radius: 9999px;
        margin-bottom: 3.5mm;
      }
      .opener-title {
        font-family: 'El Messiri', serif;
        font-size: 20pt;
        font-weight: 700;
        color: #111;
        line-height: 1.3;
        margin-bottom: 3.5mm;
      }
      .opener-meta {
        font-size: 7.5pt;
        color: #666;
        font-weight: 600;
        margin-bottom: 4.5mm;
        display: flex;
        gap: 3mm;
        align-items: center;
      }
      .opener-meta-dot {
        color: #D80032;
      }
      .opener-lead-box {
        background: #F2EFE9;
        border-${isAr ? 'right' : 'left'}: 3.5px solid #D80032;
        padding: 4mm 5mm;
        font-size: 9.5pt;
        line-height: 1.7;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 5mm;
        border-radius: 2px;
      }
      .opener-artwork-box {
        width: 100%;
        margin-bottom: 5mm;
        border: 1px solid #D5D0C0;
        border-radius: 2px;
        overflow: hidden;
        background: #000;
      }
      .opener-artwork-box img {
        width: 100%;
        height: auto;
        display: block;
        max-height: 75mm;
        object-fit: cover;
      }
      .opener-artwork-caption {
        font-size: 6.8pt;
        color: #666;
        padding: 1.5mm 3mm;
        background: #F8F5EE;
        border-top: 1px solid #E5E0D0;
        font-style: italic;
        display: flex;
        justify-content: space-between;
      }
      .opener-columns {
        display: flex;
        gap: 6mm;
        flex: 1;
        font-size: 8.5pt;
        line-height: 1.75;
        color: #222;
        text-align: justify;
      }
      .opener-col {
        flex: 1;
      }

      /* PAGE 3: READING PAGE */
      .reading-section-title {
        font-family: 'El Messiri', serif;
        font-size: 13pt;
        font-weight: 700;
        color: #D80032;
        margin: 3mm 0 2mm 0;
        border-bottom: 1px solid #E5E0D0;
        padding-bottom: 1.5mm;
      }
      .reading-columns {
        display: flex;
        gap: 6mm;
        font-size: 8.5pt;
        line-height: 1.78;
        color: #222;
        text-align: justify;
      }
      .reading-col {
        flex: 1;
      }
      .reading-pullquote {
        margin: 4.5mm 0;
        padding: 4mm 6mm;
        background: #F2EFE9;
        border-${isAr ? 'right' : 'left'}: 4px solid #D80032;
        font-family: 'El Messiri', serif;
        font-size: 11pt;
        font-weight: 700;
        color: #111;
        line-height: 1.55;
        font-style: italic;
      }
      .analytical-card {
        background: #F9F7F2;
        border: 1px solid #DDD8C8;
        padding: 3mm 4mm;
        margin: 3mm 0;
        border-radius: 2px;
        font-size: 8pt;
        line-height: 1.65;
      }
      .analytical-card-header {
        font-weight: 800;
        color: #111;
        margin-bottom: 1.5mm;
        display: flex;
        align-items: center;
        gap: 1.5mm;
      }
      .analytical-card-header span {
        color: #D80032;
      }
    </style>
  </head>
  <body>
    
    <!-- PAGE 1: COVER -->
    <div class="page" style="padding: 0;">
      <div class="cover-page">
        <div class="cover-masthead">
          <div class="cover-brand">${isAr ? 'مَـيـدَان' : 'MIDAAN'}<span>.</span></div>
          <div class="cover-subhead">${isAr ? 'مجلة فكرية وثقافية مستقلة • صُنعت في عمّان - فلسطين' : 'Independent Intellectual & Cultural Review • Amman • Palestine'}</div>
        </div>

        <div class="cover-center">
          <div class="cover-badge">${isAr ? 'الإصدار التأسيسي // خريف 2026' : 'FOUNDING ISSUE // AUTUMN 2026'}</div>
          <div class="cover-issue-title">${isAr ? 'انتحاب' : 'ENTIHAB'}</div>
          <div class="cover-issue-num">${isAr ? 'العدد صفر' : 'ISSUE ZERO'}</div>
          <div class="cover-lead-summary">
            ${isAr 
              ? 'توثيق سردية الشارع، صراع الأرض والسماء، وسجل وصايا الخالدين. منصة للرواية المستقلة، حبر حر وذاكرة تأبى النسيان.'
              : 'Documenting the street narrative, the conflict of earth and sky, and the testaments of the immortal. An independent forum for memory and cultural resistance.'}
          </div>
        </div>

        <div class="cover-foot">
          <span>${isAr ? 'العدد 00' : 'ISSUE 00'}</span>
          <span style="font-family: monospace; letter-spacing: 1px;">MIDAAN SPECIMEN // HKJ-PAL-2026-ZERO</span>
          <span>${isAr ? 'حبر حر • ذاكرة تأبى النسيان' : 'Free Press • Unbroken Memory'}</span>
        </div>
      </div>
    </div>

    <!-- PAGE 2: ARTICLE OPENER -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر (انتحاب)' : 'MIDAAN • ISSUE ZERO (ENTIHAB)'}</span>
        <span style="color: #D80032;">${isAr ? 'افتتاحية العدد' : 'EDITORIAL'}</span>
      </div>

      <div class="opener-category">${isAr ? 'افتتاحية العدد' : 'EDITORIAL ESSAY'}</div>
      
      <h1 class="opener-title">
        ${isAr 
          ? 'صراع الأرض والسماء: لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟'
          : 'Conflict of Earth and Sky: Why the Palestine Cause Cannot Be Understood Apart from Faith'}
      </h1>

      <div class="opener-meta">
        <span>${isAr ? 'مجلة ميدان' : 'Midaan Review'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? 'العدد التأسيسي (خريف 2026)' : 'Founding Issue (Autumn 2026)'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? '٨ دقائق قراءة' : '8 min read'}</span>
      </div>

      <div class="opener-lead-box">
        ${isAr 
          ? 'على طاولات المفاوضات الباردة، يتحدث الساسة بلغة الأرقام ومساحات الأراضي، لكن على الأرض يتحدث الواقع بلغة لا تعترف بجغرافيا السياسة، بل بـ «جغرافيا العقيدة».'
          : 'At cold negotiating tables, politicians speak the language of numbers and borders; on the ground, reality speaks an entirely different language: the geography of faith.'}
      </div>

      <!-- Symbolic Editorial Artwork -->
      <div class="opener-artwork-box">
        <img src="data:image/jpeg;base64,${editorialArtworkBase64}" alt="Symbolic artwork of Earth and Sky" />
        <div class="opener-artwork-caption">
          <span>${isAr ? 'عمل فني رمزي: صراع الأرض والسماء — جذور متجذرة في صخر الأرض تحت سماء التاريخ المفتوحة' : 'Symbolic Editorial Woodcut: Conflict of Earth and Sky — deep roots anchored in stone beneath open heavens'}</span>
          <span>MIDAAN ARCHIVE // ART-01</span>
        </div>
      </div>

      <div class="opener-columns">
        <div class="opener-col">
          <p>
            ${isAr 
              ? 'إن الخطأ الأكبر الذي يقع فيه المراقب الخارجي هو محاولة اختزال الصراع الفلسطيني الإسرائيلي في كونه مجرد نزاع حدودي أو خلاف سياسي على دولة وموارد. الحقيقة أعمق وأكثر تجذراً؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة، وتختلط فيه روايات الأنبياء بقرارات الأمم المتحدة.'
              : 'The greatest error an outside observer can make is reducing the Palestinian-Israeli conflict to a mere border dispute or a political disagreement over statehood and resources. The truth is deeper and far more entrenched: an existential struggle where scriptural texts intertwine with infantry rifles.'}
          </p>
        </div>
        <div class="opener-col">
          <p>
            ${isAr 
              ? 'التوراة كخريطة طريق.. العقيدة في خدمة الاستعمار: لفهم جوهر الصراع، يجب أن ننظر إلى كيف وظفت الحركة الصهيونية «العقيدة» كأداة استعمارية إحلالية. رغم أن الآباء المؤسسين للصهيونية كانوا علمانيين بامتياز، إلا أنهم أدركوا مبكراً أن مشروعهم لا يمكن أن ينجح دون تعبئة روحية وسردية توظف المقدس لخدمة التوسع.'
              : 'The Torah as a Roadmap: Faith in the Service of Colonialism. To understand the heart of the conflict, one must examine how the Zionist movement employed religious faith as a tool of settler colonialism. Although founding figures were avowedly secular, they recognized early on that their project could never take hold without spiritual mobilization.'}
          </p>
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — العدد صفر' : 'Midaan Magazine — Issue Zero'}</span>
        <span class="page-num">01</span>
      </div>
    </div>

    <!-- PAGE 3: READING PAGE -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
        <span style="color: #888;">${isAr ? 'قراءة فكرية' : 'Intellectual Critique'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? '«آية في كتاب».. الجذور في العقل الجمعي' : '"A Verse in the Book": Roots in the Collective Conscience'}
      </div>

      <div class="reading-columns">
        <div class="reading-col">
          <p>
            ${isAr 
              ? 'في المقابل، لا يمكن فهم الصمود الفلسطيني الأسطوري دون فهم المحرك العقائدي الذي يغذي هذا الصمود. بالنسبة للفلسطيني وللعربي والمسلم من خلفه، فلسطين ليست مجرد مساحة ترابية يمكن التعويض عنها في مكان آخر. إنها ليست مجرد وطن بالمعنى القومي الحديث، بل هي آية من القرآن ترتبط بصلب الإيمان وعقيدة الإسراء والمعراج.'
              : 'Conversely, one cannot understand the steadfastness of the Palestinian people without understanding the religious conviction that sustains it. For Palestinians—and for the Arabs and Muslims who stand behind them—Palestine is not a tract of earth that could be compensated elsewhere; it is a verse in sacred text.'}
          </p>
          
          <div class="analytical-card">
            <div class="analytical-card-header">
              <span>■</span> ${isAr ? 'ركيزتا الارتباط الروحي والتاريخي:' : 'Twin Pillars of Spiritual & Historical Bond:'}
            </div>
            <p>
              ${isAr 
                ? '• عقيدة الإسراء والمعراج: الأقصى بوابة الأرض إلى السماء وأولى القبلتين.<br>• عقيدة الرباط: اعتبار البقاء في هذه الأرض حراسة مستمرة لثغور الحق، محولاً الصمود إلى عبادة مقدسة.'
                : '• Al-Isra wal-Miraj: Earth’s gateway to heaven and the first Qibla of Islam.<br>• Duty of Ribat: Continuous vigilance over the frontiers of truth, transforming endurance into sacred worship.'}
            </p>
          </div>
        </div>

        <div class="reading-col">
          <p>
            ${isAr 
              ? 'سقوط وهم «البراغماتية» ومعركة الروايات: الجواب يكمن في استحالة تفكيك العقيدة بالسياسة. يمكن للسياسي أن يقبل بالتنازل عن نسبة من مساحة الأرض مقابل امتيازات، لكن كيف يمكنه التنازل عن مقدسات منسوجة في صلب هوية الإنسان وذاكرته الجمعية؟'
              : 'The Collapse of Political "Pragmatism": The dilemma lies in the impossibility of dismantling faith through politics. A politician might concede land for privileges, but how does one surrender sanctities woven into the marrow of human identity?'}
          </p>

          <p>
            ${isAr 
              ? 'إن صراع الفلسطينيين مع الاحتلال هو حرب روايات وهويات قبل أن يكون حرب بنادق. وبينما تحاول الصهيونية ليّ عنق التاريخ لصناعة شرعية زائفة، تقف الرواية الفلسطينية متجذرة كشجر الزيتون، تستمد بقاءها من يقين لا يتزعزع بأن الحق لا يسقط بالتقادم.'
              : 'The Palestinian struggle is a war of narratives and identity before it is a war of rifles. While Zionism strains history to manufacture artificial legitimacy, the Palestinian narrative stands rooted like an ancient olive tree, drawing endurance from unshakable conviction.'}
          </p>
        </div>
      </div>

      <!-- Pull Quote Breakout -->
      <div class="reading-pullquote">
        ${isAr 
          ? '«لا يمكن فهم الصراع الفلسطيني كنزاع حدودي عابر؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة، وتختلط فيه روايات الأنبياء بقرارات الأمم المتحدة.»'
          : '«The Palestinian struggle cannot be reduced to a passing border dispute; it is an existential conflict in which sacred scripture intertwines with infantry rifles, and the accounts of prophets mix with United Nations resolutions.»'}
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — وثيقة العدد صفر' : 'Midaan Review — Issue Zero Document'}</span>
        <span class="page-num">02</span>
      </div>
    </div>

  </body>
  </html>`;
}

async function generateSpecimens() {
  console.log('Generating Magazine Prototype Specimens...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(__dirname, '..', 'public', 'magazine');
  const arPdfPath = path.join(outDir, 'issue-zero-specimen-ar.pdf');
  const enPdfPath = path.join(outDir, 'issue-zero-specimen-en.pdf');

  // 1. Arabic Specimen PDF & Page Screenshots
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(getSpecimenHtml('ar'), { waitUntil: 'networkidle0' });
    await page.pdf({
      path: arPdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const pages = await page.$$('.page');
    for (let i = 0; i < pages.length; i++) {
      await pages[i].screenshot({
        path: path.join(outDir, `specimen-ar-page${i + 1}.png`)
      });
      console.log(`Captured: specimen-ar-page${i + 1}.png`);
    }
    await page.close();
    console.log(`Generated: ${arPdfPath}`);
  }

  // 2. English Specimen PDF & Page Screenshots
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(getSpecimenHtml('en'), { waitUntil: 'networkidle0' });
    await page.pdf({
      path: enPdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const pages = await page.$$('.page');
    for (let i = 0; i < pages.length; i++) {
      await pages[i].screenshot({
        path: path.join(outDir, `specimen-en-page${i + 1}.png`)
      });
      console.log(`Captured: specimen-en-page${i + 1}.png`);
    }
    await page.close();
    console.log(`Generated: ${enPdfPath}`);
  }

  await browser.close();

  console.log('Magazine Prototype Specimen generation and page captures complete!');
}

generateSpecimens().catch(err => {
  console.error('Failed to generate specimen:', err);
  process.exit(1);
});
