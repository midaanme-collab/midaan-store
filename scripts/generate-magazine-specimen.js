const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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
    <title>${isAr ? 'نموذج مجلة ميدان المصغر — العدد صفر' : 'Midaan Magazine Specimen — Issue Zero'}</title>
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
        font-size: 19pt;
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
        max-height: 72mm;
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
        text-align: ${isAr ? 'justify' : 'left'};
      }
      .opener-col {
        flex: 1;
      }

      /* PAGE 3: SINGLE-COLUMN READING PAGE */
      .reading-section-title {
        font-family: 'El Messiri', serif;
        font-size: ${isAr ? '17pt' : '16pt'};
        font-weight: 700;
        color: #D80032;
        margin: 2mm 0 ${isAr ? '6mm' : '5mm'} 0;
        border-bottom: 1.5px solid #E5E0D0;
        padding-bottom: 2.5mm;
        line-height: 1.4;
      }
      .reading-single-column {
        width: 100%;
        font-size: ${isAr ? '13.6pt' : '12.2pt'};
        line-height: ${isAr ? '2.15' : '1.92'};
        color: #1a1a1a;
        text-align: ${isAr ? 'right' : 'left'};
        word-break: normal;
        overflow-wrap: break-word;
      }
      .reading-single-column p {
        margin: 0 0 ${isAr ? '6.5mm' : '5.5mm'} 0;
      }
      .reading-pullquote {
        margin: ${isAr ? '7.5mm 0' : '6mm 0'};
        padding: ${isAr ? '6.5mm 8.5mm' : '5.5mm 7.5mm'};
        background: #F2EFE9;
        border-${isAr ? 'right' : 'left'}: 4.5px solid #D80032;
        font-family: ${isAr ? "'El Messiri', serif" : "'Alexandria', sans-serif"};
        font-size: ${isAr ? '14.2pt' : '12.8pt'};
        font-weight: 700;
        color: #111;
        line-height: ${isAr ? '1.75' : '1.65'};
        font-style: ${isAr ? 'normal' : 'italic'};
        text-align: ${isAr ? 'right' : 'left'};
        border-radius: 2px;
      }
    </style>
  </head>
  <body>
    
    <!-- PAGE 1: COVER -->
    <div class="page" style="padding: 0;">
      <div class="cover-page">
        <div class="cover-masthead">
          <div class="cover-brand">${isAr ? 'مَـيـدَان' : 'MIDAAN'}<span>.</span></div>
          <div class="cover-subhead">${isAr ? 'مجلة فكرية وثقافية مستقلة • صُنعت في عمّان - فلسطين' : 'Midaan Magazine • Independent Cultural & Intellectual Platform • Amman & Palestine'}</div>
        </div>

        <div class="cover-center">
          <div class="cover-badge">${isAr ? 'الإصدار التأسيسي // خريف 2026' : 'FOUNDING ISSUE // AUTUMN 2026'}</div>
          <div class="cover-issue-title">${isAr ? 'انتحاب' : 'ENTIHAB'}</div>
          
          <!-- Narrow crop of roots and rock directly beneath title -->
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
          <span style="font-family: monospace; letter-spacing: 1px;">MIDAAN SPECIMEN // HKJ-PAL-2026-ZERO</span>
          <span>${isAr ? 'حبر حر • ذاكرة تأبى النسيان' : 'Free Press • Unbroken Memory'}</span>
        </div>
      </div>
    </div>

    <!-- PAGE 2: ARTICLE OPENER -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مَـيـدَان • العدد صفر (انتحاب)' : 'MIDAAN MAGAZINE • ISSUE ZERO (ENTIHAB)'}</span>
        <span style="color: #D80032;">${isAr ? 'افتتاحية العدد' : 'EDITORIAL'}</span>
      </div>

      <div class="opener-category">${isAr ? 'افتتاحية العدد' : 'Editorial'}</div>
      
      <h1 class="opener-title">
        ${isAr 
          ? 'صراع الأرض والسماء: لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟'
          : 'Conflict of Earth and Sky: Why the Palestine Cause Cannot Be Understood Apart from Faith'}
      </h1>

      <div class="opener-meta">
        <span>${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? 'العدد التأسيسي (خريف 2026)' : 'Founding Issue (Autumn 2026)'}</span>
        <span class="opener-meta-dot">•</span>
        <span>${isAr ? '٨ دقائق قراءة' : '8 min read'}</span>
      </div>

      <div class="opener-lead-box">
        ${isAr 
          ? 'على طاولات المفاوضات الباردة، يتحدث الساسة بلغة الأرقام، مساحات الأراضي، الكثافة السكانية، والحدود الآمنة. يعتقدون أن ورقة وقلم وخرائط ملونة تكفي لتقسيم الأرض وإنهاء عقود من الصراع. لكن على الأرض، حيث تُسفك الدماء وتُهدم البيوت وتُتلى الصلوات تحت دوي المدافع، يتحدث الواقع لغة أخرى تماماً؛ لغة لا تعترف بجغرافيا السياسة، بل بـ «جغرافيا العقيدة».'
          : 'At cold negotiating tables, politicians speak the language of numbers, land area, population density, and secure borders. They imagine that a pen, paper, and colored maps are enough to divide the land and settle decades of conflict. Yet on the ground—where blood is spilled, homes are demolished, and prayers are whispered beneath the roar of artillery—reality speaks an entirely different language: one that answers not to political geography, but to the geography of faith.'}
      </div>

      <!-- Symbolic Editorial Artwork -->
      <div class="opener-artwork-box">
        <img src="data:image/jpeg;base64,${editorialArtworkBase64}" alt="Symbolic artwork of Earth and Sky" />
        <div class="opener-artwork-caption">
          <span>${isAr ? 'عمل فني رمزي: صراع الأرض والسماء — جذور متجذرة في صخر الأرض تحت سماء التاريخ المفتوحة' : 'Symbolic Woodcut: Conflict of Earth and Sky — deep roots anchored in stone beneath open heavens'}</span>
          <span>MIDAAN ARCHIVE // ART-01</span>
        </div>
      </div>

      <div class="opener-columns">
        <div class="opener-col">
          <p>
            ${isAr 
              ? 'إن الخطأ الأكبر الذي يقع فيه المراقب الخارجي هو محاولة اختزال الصراع الفلسطيني الإسرائيلي في كونه مجرد نزاع حدودي أو خلاف سياسي على دولة وموارد. الحقيقة أعمق وأكثر تجذراً؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة، وتختلط فيه روايات الأنبياء بقرارات الأمم المتحدة.'
              : 'The greatest error an outside observer can make is reducing the Palestinian-Israeli conflict to a mere border dispute or a political disagreement over statehood and resources. The truth is deeper and far more entrenched: an existential struggle where scriptural texts intertwine with infantry rifles, and the accounts of prophets mix with United Nations resolutions.'}
          </p>
        </div>
        <div class="opener-col">
          <p>
            ${isAr 
              ? 'التوراة كخريطة طريق.. العقيدة في خدمة الاستعمار: لفهم جوهر الصراع، يجب أن ننظر إلى كيف وظفت الحركة الصهيونية «العقيدة» كأداة استعمارية إحلالية. رغم أن الآباء المؤسسين للصهيونية كانوا علمانيين بامتياز، إلا أنهم أدركوا مبكراً أن مشروعهم لا يمكن أن ينجح دون تعبئة روحية.'
              : 'The Torah as a Roadmap: Faith in the Service of Colonialism. To understand the heart of the conflict, one must examine how the Zionist movement employed religious faith as a tool of settler colonialism. Although Zionism\'s founding figures were avowedly secular, they recognized early on that their project could never take hold without spiritual mobilization.'}
          </p>
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — العدد صفر' : 'Midaan Magazine — Issue Zero'}</span>
        <span class="page-num">01</span>
      </div>
    </div>

    <!-- PAGE 3: SINGLE-COLUMN READING PAGE -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
        <span style="color: #888;">${isAr ? 'مجلة ميدان' : 'Midaan Magazine'}</span>
      </div>

      <div class="reading-section-title">
        ${isAr ? '«آية في كتاب».. الجذور في العقل الجمعي الإسلامي' : '"A Verse in the Book": Roots in the Islamic Collective Conscience'}
      </div>

      <div class="reading-single-column">
        <!-- Paragraph 4 from approved source -->
        <p>
          ${isAr 
            ? 'في المقابل، لا يمكن فهم الصمود الفلسطيني الأسطوري دون فهم المحرك العقائدي الذي يغذي هذا الصمود. بالنسبة للفلسطيني وللعربي والمسلم من خلفه، فلسطين ليست مجرد مساحة ترابية يمكن التعويض عنها في مكان آخر. إنها ليست مجرد وطن بالمعنى القومي الحديث، بل هي آية من القرآن.'
            : 'Conversely, one cannot understand the steadfastness of the Palestinian people without understanding the religious conviction that sustains it. For Palestinians—and for the Arabs and Muslims who stand behind them—Palestine is not a tract of earth that could be compensated elsewhere. It is not merely a homeland in the modern nationalist sense; it is a verse in the Quran.'}
        </p>

        <!-- Paragraph 5 from approved source -->
        <p>
          ${isAr 
            ? 'ارتباط المسلمين بفلسطين هو ارتباط نصي وروحي غير قابل للتفاوض، ويتلخص في ركيزتين: أولاً، عقيدة الإسراء والمعراج، فالمسجد الأقصى ليس مجرد بناء حجري، بل هو بوابة الأرض إلى السماء وثاني المسجدين وأولى القبلتين. ثانياً، عقيدة الرباط، ففي الموروث الثقافي والديني يُنظر إلى التواجد في هذه الأرض على أنه حالة «رباط» دائم وحراسة مستمرة لثغور الحق، مما يحول البقاء إلى عبادة مقدسة.'
            : 'The Muslim bond with Palestine is textual, spiritual, and non-negotiable, resting on two pillars: first, the belief in the Night Journey and Ascension (al-Isra wal-Miraj), where al-Aqsa Mosque is earth\'s gateway to heaven and the first Qibla of Islam; second, the duty of Ribat (steadfast vigil), where remaining on this land is understood as continuous guardianship over the frontiers of truth, transforming everyday endurance into an act of worship.'}
        </p>

        <!-- Verbatim Approved Pull Quote -->
        <div class="reading-pullquote">
          ${isAr 
            ? '«لا يمكن فهم الصراع الفلسطيني كنزاع حدودي عابر؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة.»'
            : '“The Palestinian struggle cannot be reduced to a passing border dispute; it is an existential conflict in which sacred scripture intertwines with infantry rifles.”'}
        </div>

        <!-- Paragraph 7 from approved source: continuing naturally below pull quote -->
        <p>
          ${isAr 
            ? 'سقوط وهم «البراغماتية» ومعركة الروايات: الجواب يكمن في استحالة تفكيك العقيدة بالسياسة. يمكن للسياسي أن يقبل بالتنازل عن نسبة من مساحة الأرض مقابل امتيازات معينة، لكن كيف يمكنه التنازل عن مقدسات منسوجة في صلب هوية الإنسان؟'
            : 'The Collapse of Political \'Pragmatism\': The dilemma lies in the impossibility of dismantling faith through politics. A politician might concede a percentage of land in exchange for concessions, but how does one surrender sanctities woven into the marrow of human identity?'}
        </p>

        <!-- Paragraph 9 from approved source: continuing naturally -->
        <p>
          ${isAr 
            ? 'إن صراع الفلسطينيين مع الاحتلال هو حرب روايات وهويات قبل أن يكون حرب بنادق. وبينما تحاول الصهيونية ليّ عنق التاريخ لصناعة شرعية زائفة، تقف الرواية الفلسطينية متجذرة كشجر الزيتون، تستمد بقاءها من عقيدة راسخة بأن الحق لا يسقط بالتقادم، وأن الأرض في النهاية تنطق بلغة أصحابها الأصليين.'
            : 'The Palestinian struggle against the occupation is a war of narratives and identity before it is a war of rifles. While Zionism strains history to manufacture artificial legitimacy, the Palestinian narrative stands rooted like an ancient olive tree, drawing its endurance from an unshakable conviction: that justice is never extinguished by the passage of time, and that the land will ultimately speak the language of its rightful people.'}
        </p>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — وثيقة العدد صفر' : 'Midaan Magazine — Issue Zero Document'}</span>
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
