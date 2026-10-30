const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const alexandriaFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'Alexandria-Regular.ttf')).toString('base64');
const messiriFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'ElMessiri-Bold.ttf')).toString('base64');

async function buildPdf(lang, outputPath) {
  const isAr = lang === 'ar';

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
      body {
        font-family: 'Alexandria', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #fffff8;
        color: #121212;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        width: 210mm;
        height: 297mm;
        padding: 22mm 20mm 20mm 20mm;
        box-sizing: border-box;
        page-break-after: always;
        position: relative;
        background-color: #fffff8;
        overflow: hidden;
      }
      .page-header {
        position: absolute;
        top: 12mm;
        left: 20mm;
        right: 20mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e0dfd5;
        padding-bottom: 4mm;
        font-size: 8pt;
        color: #777;
        font-family: 'Alexandria', sans-serif;
      }
      .page-footer {
        position: absolute;
        bottom: 10mm;
        left: 20mm;
        right: 20mm;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #e0dfd5;
        padding-top: 3mm;
        font-size: 8pt;
        color: #888;
        font-family: 'Courier New', monospace;
      }
      .cover {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        padding: 30mm 20mm 25mm 20mm;
        background: radial-gradient(circle at 50% 30%, #fff 0%, #fffff4 70%, #f5f2e6 100%);
      }
      .cover-title {
        font-family: 'El Messiri', serif;
        font-size: 4.8rem;
        color: #D80032;
        margin: 10px 0 0 0;
        line-height: 1;
      }
      .cover-subtitle {
        font-size: 1.6rem;
        font-weight: 300;
        color: #333;
        margin-top: 5px;
      }
      .cover-badge {
        display: inline-block;
        background-color: #111;
        color: #fff;
        font-size: 9pt;
        font-weight: bold;
        padding: 6px 16px;
        border-radius: 9999px;
        letter-spacing: ${isAr ? '0' : '2px'};
        text-transform: uppercase;
      }
      .article-title {
        font-family: 'El Messiri', serif;
        font-size: 2.1rem;
        color: #D80032;
        margin: 0 0 6px 0;
        line-height: 1.25;
      }
      .article-meta {
        font-size: 9pt;
        color: #666;
        margin-bottom: 18px;
        font-weight: 600;
      }
      .content {
        column-count: 2;
        column-gap: 8mm;
        text-align: justify;
        line-height: 1.75;
        font-size: 9.5pt;
      }
      .content p {
        margin: 0 0 11px 0;
      }
      .section-heading {
        font-family: 'El Messiri', serif;
        font-size: 1.15rem;
        color: #111;
        margin: 14px 0 6px 0;
        break-after: avoid;
        border-bottom: 1.5px solid #D80032;
        padding-bottom: 3px;
        display: inline-block;
      }
      .pull-quote {
        font-family: 'El Messiri', serif;
        font-size: 1.2rem;
        color: #D80032;
        ${isAr ? 'border-right: 4px solid #D80032; padding-right: 12px;' : 'border-left: 4px solid #D80032; padding-left: 12px;'}
        margin: 14px 0;
        line-height: 1.5;
        background: rgba(216, 0, 50, 0.03);
        padding-top: 6px;
        padding-bottom: 6px;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8.5pt;
        margin: 12px 0;
        border: 1px solid #d0cfc4;
      }
      .data-table th {
        background-color: #1a1a1a;
        color: #fff;
        padding: 6px 8px;
        font-weight: bold;
        text-align: ${isAr ? 'right' : 'left'};
      }
      .data-table td {
        padding: 6px 8px;
        border-bottom: 1px solid #e0dfd5;
      }
      .data-table tr:nth-child(even) {
        background-color: #f9f8f0;
      }
      .toc-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        border-bottom: 1px dotted #bbb;
        padding: 10px 0;
        font-size: 11pt;
      }
      .toc-row .title {
        font-family: 'El Messiri', serif;
        font-weight: bold;
        color: #111;
      }
      .toc-row .num {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        color: #D80032;
        font-size: 13pt;
      }
    </style>
  </head>
  <body>

    <!-- 1. COVER PAGE -->
    <div class="page cover">
      <div>
        <div class="cover-badge">${isAr ? 'العدد التأسيسي // صفر' : 'FOUNDING ISSUE // ZERO'}</div>
        <h1 class="cover-title">${isAr ? 'مَـيـدَان' : 'MIDAAN'}</h1>
        <div class="cover-subtitle">${isAr ? 'مجلة فكرية ثقافية مستقلة' : 'Independent Intellectual & Cultural Review'}</div>
      </div>

      <div style="max-w-md; margin: 40px auto; padding: 20px; border: 1px solid #D80032; border-radius: 12px; background: #fff;">
        <div style="font-family: 'El Messiri', serif; font-size: 1.8rem; color: #D80032; margin-bottom: 6px;">
          ${isAr ? 'انتحاب' : 'ENTIHAB'}
        </div>
        <div style="font-size: 9.5pt; color: #555; line-height: 1.6;">
          ${isAr 
            ? 'توثيق سردية الشارع، صراع الأرض والسماء، وسجل وصايا الخالدين.' 
            : 'Documenting the street narrative, the conflict of earth and sky, and the immortal testaments.'}
        </div>
      </div>

      <div style="font-size: 8.5pt; color: #666; border-top: 1px solid #ddd; width: 100%; pt-4;">
        <p>${isAr ? 'عَمّان • فلسطين • حبر حر وأزياء مناصرة' : 'Amman • Palestine • Free Press & Wearable Advocacy'}</p>
        <p style="font-family: 'Courier New', monospace; color: #999;">MIDAAN ARCHIVE // 2026</p>
      </div>
    </div>

    <!-- 2. OPENING MANIFESTO -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — العدد صفر' : 'Midaan Magazine — Issue Zero'}</span>
        <span>${isAr ? 'البيان التأسيسي' : 'Founding Manifesto'}</span>
      </div>

      <div style="margin-top: 15mm; max-width: 170mm;">
        <div class="cover-badge" style="background:#D80032; margin-bottom: 12px;">${isAr ? 'افتتاحية الإصدار' : 'PROLOGUE'}</div>
        <h2 style="font-family: 'El Messiri', serif; font-size: 2.4rem; color: #111; margin: 0 0 16px 0; line-height: 1.3;">
          ${isAr ? 'البيان التأسيسي: انتحاب' : 'The Founding Manifesto: Entihab (Lamentation)'}
        </h2>

        <div style="font-size: 11pt; line-height: 2; color: #222; text-align: justify;">
          ${isAr ? `
            <p style="font-size: 13pt; font-weight: bold; color: #D80032;">في هذا الميدان، نحن لا نكتب الرثاء، بل نوثق النبض الذي لا يموت.</p>
            <p><strong>"انتحاب"</strong> ليس تسليماً بالانكسار، بل هو وقوف مهيب في حضرة الدم، وإجلال مطلق للشهداء والأحرار الذين جعلوا من أجسادهم جسوراً نعبر بها نحو البقاء. الحزن هنا ليس استسلاماً، بل هو غضب يُشحذ، وذاكرة تأبى النسيان.</p>
            <p>لقد ظنوا أن الساحات قد فرغت، لكن "الميدان" لم يُخلَ يوماً ولن يُخلى. ما دامت المقاومة فكرة، والفكرة لا تُغتال، فإن المعركة مستمرة، تتوارثها الأجيال حتى لحظة التحرير.</p>
            <p>نطلق "ميدان" اليوم كـ خندق فني وثقافي، نحرس فيه الرواية، ونغزل من ألم الفقد راية لا تُنكس. نأخذ من الحزن وقوداً، ومن الكلمة سلاحاً، ومن الفن متراساً نقف خلفه لندافع عن هويتنا.</p>
            <p style="border-right: 3px solid #D80032; padding-right: 12px; background: rgba(216,0,50,0.03); margin: 20px 0;">
              هذا هو "العدد صفر".. صرختنا الصامتة، وعهدنا المكتوب بوجع الأرض. تأملوا هذا الانتحاب جيداً، واقرأوا ما بين سطور الفقد.. وتجهزوا، فخلف هذا الصمت الثقيل، عاصفة قادمة ستُكتب في العدد الأول.
            </p>
          ` : `
            <p style="font-size: 13pt; font-weight: bold; color: #D80032;">In this Midaan (arena), we do not write elegies; we document the pulse that refuses to die.</p>
            <p><strong>"Entihab" (Lamentation)</strong> is not a surrender to defeat; it is a solemn stand in the presence of blood, and absolute reverence for the martyrs and free spirits who turned their bodies into bridges upon which we cross toward survival. Grief here is not submission; it is wrath being sharpened, and memory that defies oblivion.</p>
            <p>They thought the arenas were emptied, but "Midaan" has never been vacated, nor shall it ever be. As long as resistance remains an idea, and ideas cannot be assassinated, the battle continues—inherited across generations until the hour of liberation.</p>
            <p>Today we launch "Midaan" as an artistic and cultural trench wherein we guard the narrative and weave from the pain of loss a banner that never falters. We take fuel from sorrow, weapons from the word, and barricades from art behind which we stand to defend our identity.</p>
            <p style="border-left: 3px solid #D80032; padding-left: 12px; background: rgba(216,0,50,0.03); margin: 20px 0;">
              This is "Issue Zero".. our silent cry, and our covenant inscribed with the agony of the land. Reflect deeply upon this lamentation, read between the lines of loss.. and prepare, for behind this heavy silence lies a coming storm that shall be written in Issue One.
            </p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'البيان التأسيسي — انتحاب' : 'Founding Manifesto — Entihab'}</span>
        <span>2</span>
      </div>
    </div>

    <!-- 3. TABLE OF CONTENTS -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — العدد صفر' : 'Midaan Magazine — Issue Zero'}</span>
        <span>${isAr ? 'الفهرس ومحتويات الإصدار' : 'Table of Contents'}</span>
      </div>

      <div style="margin-top: 15mm;">
        <h2 style="font-family: 'El Messiri', serif; font-size: 2.2rem; color: #D80032; margin-bottom: 24px;">
          ${isAr ? 'فهرس العدد' : 'Contents'}
        </h2>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="toc-row">
            <div>
              <span class="title">${isAr ? 'البيان التأسيسي: انتحاب' : 'Founding Manifesto: Entihab'}</span>
              <div style="font-size: 8.5pt; color: #666;">${isAr ? 'مقدمة العدد صفر وعهد الرواية البديلة' : 'Issue Zero prologue and covenant of alternative narrative'}</div>
            </div>
            <span class="num">2</span>
          </div>

          <div class="toc-row">
            <div>
              <span class="title">${isAr ? 'افتتاحية العدد: صراع الأرض والسماء' : 'Editorial: Conflict of Earth and Sky'}</span>
              <div style="font-size: 8.5pt; color: #666;">${isAr ? 'لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟' : 'Why the Palestine cause cannot be understood apart from creed'}</div>
            </div>
            <span class="num">4</span>
          </div>

          <div class="toc-row">
            <div>
              <span class="title">${isAr ? 'مقال فكري: سأموت قبل الأربعين' : 'Philosophical Essay: I Will Die Before Forty'}</span>
              <div style="font-size: 8.5pt; color: #666;">${isAr ? 'تشريح المصفوفة المبرمجة ورفض التدجين المؤسسي' : 'Anatomy of the programmed matrix and refusal of institutional pacification'}</div>
            </div>
            <span class="num">6</span>
          </div>

          <div class="toc-row">
            <div>
              <span class="title">${isAr ? 'دراسة فلسفية: حبر اليقين — من مشقة الوداع إلى سكينة الشهادة' : 'Study: Ink of Certainty — From Parting Hardship to Serenity'}</span>
              <div style="font-size: 8.5pt; color: #666;">${isAr ? 'التحول النفسي والتسامي الوجودي في نصوص الشهداء' : 'Psychological transformation and existential sublimation in martyrs\' texts'}</div>
            </div>
            <span class="num">8</span>
          </div>

          <div class="toc-row">
            <div>
              <span class="title">${isAr ? 'سجل وثائقي: سجل وصايا الشهداء الفلسطينيين' : 'Archival Register: Ledger of Palestinian Martyrs\' Wills'}</span>
              <div style="font-size: 8.5pt; color: #666;">${isAr ? 'توثيق تاريخي لرسائل الميدان والاشتباك والوعي الجمعي' : 'Historical documentation of battlefield dispatches and collective consciousness'}</div>
            </div>
            <span class="num">10</span>
          </div>
        </div>

        <div style="margin-top: 40px; padding: 16px; background: #f2eee3; border-radius: 8px; font-size: 9pt; color: #555; line-height: 1.6;">
          <strong>${isAr ? 'ملاحظة حول حدود الإصدار الأرشيفي:' : 'Archival Scope Note:'}</strong>
          ${isAr 
            ? 'يضم هذا الإصدار الأرشيفي الكامل للعدد صفر النصوص التأسيسية الأربعة الموثقة في السجلات الأصلية لمجلة ميدان. مادة "انتحاب - العدد الأول" المرفقة في الأرشيف تمثل الإصدار القادم المكمل، وتخضع لمسار نشر مستقل.' 
            : 'This complete archival publication of Issue Zero compiles the four foundational texts verified against the original Midaan archives. The "Entihab - Issue One" dossier in the source archives represents the forthcoming companion publication and maintains a distinct issue boundary.'}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'مجلة ميدان — الفهرس' : 'Midaan Magazine — Contents'}</span>
        <span>3</span>
      </div>
    </div>

    <!-- 4. ARTICLE 1 (Page 4 & 5) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — افتتاحية العدد' : 'Midaan Magazine — Editorial'}</span>
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <h2 class="article-title">${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</h2>
        <div style="font-family: 'El Messiri', serif; font-size: 1.15rem; color: #444; margin-bottom: 4px;">
          ${isAr ? 'لماذا لا يمكن فهم قضية فلسطين بعيداً عن العقيدة؟' : 'Why the Palestine Cause Cannot Be Understood Apart from Creed'}
        </div>
        <div class="article-meta">${isAr ? 'بقلم: محررو ميدان • تاريخ التوثيق: أكتوبر 2026' : 'By: Midaan Editorial Collective • Published: October 2026'}</div>

        <div class="content">
          ${isAr ? `
            <p>على طاولات المفاوضات الباردة، يتحدث الساسة بلغة الأرقام، مساحات الأراضي، الكثافة السكانية، والحدود الآمنة. يعتقدون أن ورقة وقلم وخرائط ملونة تكفي لتقسيم الأرض وإنهاء عقود من الصراع. لكن على الأرض، حيث تُسفك الدماء وتُهدم البيوت وتُتلى الصلوات تحت دوي المدافع، يتحدث الواقع لغة أخرى تماماً؛ لغة لا تعترف بجغرافيا السياسة، بل بـ "جغرافيا العقيدة".</p>
            <p>إن الخطأ الأكبر الذي يقع فيه المراقب الخارجي هو محاولة اختزال الصراع الفلسطيني الإسرائيلي في كونه مجرد نزاع حدودي أو خلاف سياسي على دولة وموارد. الحقيقة أعمق وأكثر تجذراً؛ إنه صراع وجودي تتداخل فيه نصوص الكتب المقدسة مع بنادق المشاة، وتختلط فيه روايات الأنبياء بقرارات الأمم المتحدة.</p>
            
            <div class="pull-quote">
              "إنها حرب وجود تتداخل فيها نصوص الكتب المقدسة مع بنادق المشاة، ولا تعترف بجغرافيا السياسة المصطنعة."
            </div>

            <div class="section-heading">التوراة كخريطة طريق.. العقيدة في خدمة الاستعمار</div>
            <p>لفهم جوهر الصراع، يجب أن ننظر إلى كيف وظفت الحركة الصهيونية "العقيدة" كأداة استعمارية إحلالية. رغم أن الآباء المؤسسين للصهيونية كانوا علمانيين بامتياز، إلا أنهم أدركوا مبكراً أن مشروعهم لا يمكن أن ينجح دون تعبئة روحية.</p>
            <p>لم يأتِ المهاجرون من أقاصي الأرض من أجل دولة ديمقراطية فحسب، بل جاؤوا مدفوعين بسردية "أرض الميعاد" ومفهوم "شعب الله المختار". لقد تحولت النصوص التوراتية في أيديهم من طقوس دينية إلى وثائق ملكية عقارية، ومن صلوات روحية إلى أوامر عسكرية بإخلاء الأرض وإحلال مستوطنين مكان أصحابها الأصليين.</p>
          ` : `
            <p>At cold diplomatic tables, politicians converse in the dialect of metrics, surface acreage, demographic density, and secure perimeter borders. They operate under the illusion that pen, paper, and colored cartography suffice to partition the soil and conclude decades of struggle. Yet upon the earth itself—where blood is spilled, ancestral dwellings are leveled, and prayers resonate under the roar of artillery—reality speaks a completely different tongue; one that recognizes neither the cartography of diplomacy, but rather the "geography of creed".</p>
            <p>The gravest error committed by detached observers is the reduction of the Palestinian-Israeli struggle into a standard territorial dispute or political friction over state apparatus and natural resources. The reality is incomparably deeper and profoundly rooted: an existential clash wherein scriptural verses intersect with infantry rifles, and the oral traditions of prophets intermingle with resolutions of the United Nations.</p>

            <div class="pull-quote">
              "It is an existential struggle wherein scriptural verses intersect with infantry rifles, disregarding synthetic diplomacy."
            </div>

            <div class="section-heading">The Torah as a Colonial Roadmap.. Creed in the Service of Settlement</div>
            <p>To comprehend the core of this struggle, one must examine how the Zionist movement operationalized "creed" as an instrument of settler-colonial dispossession. Although Zionism's founding figures were avowed secularists, they recognized early on that their project could never achieve mobilization without spiritual fervor.</p>
            <p>Immigrants did not journey from the far corners of the earth merely to establish a liberal democracy; they arrived impelled by the narrative of the "Promised Land" and the construct of the "Chosen People". Scriptural passages were transformed in their hands from liturgical devotions into real estate deeds, and from spiritual prayers into tactical military mandates commanding the clearance of the land and the substitution of indigenous inhabitants with settlers.</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
        <span>4</span>
      </div>
    </div>

    <!-- ARTICLE 1 Continued (Page 5) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — افتتاحية العدد' : 'Midaan Magazine — Editorial'}</span>
        <span>${isAr ? 'صراع الأرض والسماء (تابع)' : 'Conflict of Earth and Sky (Cont.)'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <div class="content">
          ${isAr ? `
            <div class="section-heading">"آية في كتاب".. الجذور في العقل الجمعي الإسلامي</div>
            <p>في المقابل، لا يمكن فهم الصمود الفلسطيني الأسطوري دون فهم المحرك العقائدي الذي يغذي هذا الصمود. بالنسبة للفلسطيني وللعربي والمسلم من خلفه، فلسطين ليست مجرد مساحة ترابية يمكن التعويض عنها في مكان آخر. إنها ليست مجرد وطن بالمعنى القومي الحديث، بل هي آية من القرآن.</p>
            <p>ارتباط المسلمين بفلسطين هو ارتباط نصي وروحي غير قابل للتفاوض، ويتلخص في ركيزتين: أولاً عقيدة الإسراء والمعراج، فالمسجد الأقصى ليس مجرد بناء حجري، بل هو بوابة الأرض إلى السماء وثاني المسجدين وأولى القبلتين؛ وثانياً عقيدة الرباط، ففي الموروث الثقافي والديني يُنظر إلى التواجد في هذه الأرض على أنه حالة "رباط" دائم وحراسة مستمرة لثغور الحق، مما يحول البقاء إلى عبادة مقدسة.</p>

            <div class="section-heading">مقارنة تحليلية: أبعاد الصراع بين الرؤية والواقع</div>
            <table class="data-table">
              <tr>
                <th>البُعد التحليلي</th>
                <th>المنظور السياسي التقليدي</th>
                <th>الواقع العقائدي الحقيقي</th>
              </tr>
              <tr>
                <td><strong>طبيعة الخلاف</strong></td>
                <td>نزاع على الحدود والموارد والجغرافيا السياسية</td>
                <td>صراع وجودي يمس الهوية والكتب المقدسة والإرث الروحي</td>
              </tr>
              <tr>
                <td><strong>أدوات الحل</strong></td>
                <td>طاولات المفاوضات والاتفاقيات والحلول الوسطى</td>
                <td>التمسك بالحقوق التاريخية والدينية غير القابلة للتجزئة</td>
              </tr>
              <tr>
                <td><strong>محرك الصمود</strong></td>
                <td>المطالبة بحقوق مواطنة في إطار القانون الدولي</td>
                <td>اليقين العقائدي والرباط وحماية المقدسات كواجب ديني وأخلاقي</td>
              </tr>
            </table>

            <div class="section-heading">سقوط وهم "البراغماتية" ومعركة الروایات</div>
            <p>الجواب يكمن في استحالة تفكيك العقيدة بالسياسة. يمكن للسياسي أن يقبل بالتنازل عن نسبة من مساحة الأرض مقابل امتيازات معينة، لكن كيف يمكنه التنازل عن مقدسات منسوجة في صلب هوية الإنسان؟</p>
            <p>إن إسرائيل تزداد انزلاقاً نحو اليمين الديني المتطرف؛ فالصهيونية الدينية اليوم تشكل الحكومات وتتخذ قرارات الحرب بناءً على نبوءات ورؤى إقصائية، مما يجهض أي أمل في التسويات البراغماتية السطحية.</p>
            <p>إن صراع الفلسطينيين مع الاحتلال هو حرب روايات وهويات قبل أن يكون حرب بنادق. وبينما تحاول الصهيونية ليّ عنق التاريخ لصناعة شرعية زائفة، تقف الرواية الفلسطينية متجذرة كشجر الزيتون، تستمد بقاءها من عقيدة راسخة بأن الحق لا يسقط بالتقادم، وأن الأرض في النهاية تنطق بلغة أصحابها الأصليين.</p>
          ` : `
            <div class="section-heading">"A Verse in a Book".. Roots in Collective Consciousness</div>
            <p>Conversely, one cannot fathom legendary Palestinian steadfastness (Sumud) without decoding the creedal engine that sustains it. For the Palestinian—and the Arab and Muslim behind them—Palestine is not an exchangeable tract of soil compensable elsewhere. It is not merely a modern nation-state construct, but an indelible verse in the Quran.</p>
            <p>The bond is non-negotiable and anchored upon two immovable pillars: First, the Creed of the Night Journey and Ascension (Al-Isra' wal-Mi'raj), where Al-Aqsa Mosque is not a stone structure, but the gateway of earth to heaven, the second sanctuary established, and Islam's first Qibla. Second, the Creed of Ribat (Vigilance on the Frontier), wherein dwelling upon this land is revered as permanent spiritual guard over the frontiers of truth, transforming physical presence into sanctified worship.</p>

            <div class="section-heading">Analytical Comparison: Dimensions of the Conflict</div>
            <table class="data-table">
              <tr>
                <th>Analytical Dimension</th>
                <th>Traditional Political View</th>
                <th>True Creedal Reality</th>
              </tr>
              <tr>
                <td><strong>Nature of Conflict</strong></td>
                <td>Dispute over borders, resources, and geography</td>
                <td>Existential clash touching identity, scripture, and heritage</td>
              </tr>
              <tr>
                <td><strong>Mechanisms of Resolution</strong></td>
                <td>Negotiation tables, accords, and compromises</td>
                <td>Adherence to indivisible historic and religious rights</td>
              </tr>
              <tr>
                <td><strong>Engine of Steadfastness</strong></td>
                <td>Civic rights and sovereignty under global law</td>
                <td>Spiritual certainty, frontier vigil (Ribat), and sacred duty</td>
              </tr>
            </table>

            <div class="section-heading">Demise of "Pragmatism" & Battle of Narratives</div>
            <p>The crux lies in the impossibility of dissolving theological conviction through political negotiation. A diplomat might concede territory in exchange for guarantees; but how does a people surrender sanctities interwoven into the marrow of human identity?</p>
            <p>Simultaneously, Israel drifts relentlessly toward religious extremism; religious Zionism commands cabinets and dictates military actions based on exclusionary prophecies, extinguishing all hopes in superficial pragmatic compromises.</p>
            <p>The Palestinian struggle against colonial occupation is first and foremost a battle of memory, identity, and narrative before it is an exchange of gunfire. While settler colonialism twists history to manufacture synthetic legitimacy, the Palestinian narrative stands deep-rooted like ancient olive trees, deriving its endurance from an unwavering conviction: that truth does not lapse through time, and that the earth ultimately speaks the language of its indigenous sons.</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'صراع الأرض والسماء' : 'Conflict of Earth and Sky'}</span>
        <span>5</span>
      </div>
    </div>

    <!-- 5. ARTICLE 2 (Page 6 & 7) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — مقال فكري' : 'Midaan Magazine — Philosophical Essay'}</span>
        <span>${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <h2 class="article-title">${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</h2>
        <div class="article-meta">${isAr ? 'بقلم: صوت ميدان • تاريخ التوثيق: أكتوبر 2026' : 'By: Midaan Voice • Published: October 2026'}</div>

        <div class="content">
          ${isAr ? `
            <p>عمري الآن واحد وثلاثون عاماً. تسع سنوات فقط تفصلني عن الأربعين، وتفصلني عن النهاية الحتمية لروحي إن استمرت في محاولة النجاة داخل هذه المصفوفة المبرمجة. لم أعد أخشى الموت البيولوجي، بل أخشى الموت البطيء؛ موت الشغف، موت التساؤل، وموت الذات داخل آلة عملاقة ابتلعتنا جميعاً منذ صرختنا الأولى. آلة يسمونها.. "النظام"، "السستم".</p>
            
            <div class="section-heading">السستم: المصفوفة الكبرى</div>
            <p>لقد ولدتُ لأجد نفسي عالقاً في شبكة عنكبوتية من الأنظمة المتداخلة. قوالب مُعدة مسبقاً لا خيار لك سوى أن تُحشر فيها لكي تُمنح صك "الرضا". لم أفهم هذا السستم يوماً، ولم يفهمني. أنا فيه مجرد خطأ في الشيفرة (Glitch)، ترس يرفض الدوران مع البقية لأنه يرى الهاوية التي يتجهون إليها.</p>

            <div class="section-heading">النظام الأبوي: صكوك الملكية</div>
            <p>بدأ الترويض في البيت. النظام الأبوي لم يكن يوماً حضناً أو دليلاً، بل كان سلطة هرمية لا تقبل النقاش. لقد عاملونا كمشاريع استثمارية أو كامتداد لنقصهم، لا كأرواح مستقلة. "افعل هذا لأنني الأكبر"، "اختر هذا المسار لأنه يرفع رأس العائلة".</p>
            <p>لم أفهم يوماً كيف يُترجم الحب إلى شروط، وكيف أصبحت الطاعة العمياء هي المقياس الوحيد لبر الأبناء. لقد صادروا هويتي قبل أن أكتشفها، وأخبروني أن هذا هو "الاحترام".</p>

            <div class="pull-quote">
              "لم يعلمونا كيف نتساءل، بل كيف نردد. كان النظام مصمماً بدقة لقص أجنحة الخيال وقتل أي تفكير نقدي."
            </div>

            <div class="section-heading">النظام التعليمي: مقصلة العقول</div>
            <p>ثم سلموني إلى النظام التعليمي.. مصنع النسخ المتطابقة. هناك تم تلقيني أول دروس النفاق: كيف تحفظ ما لا تؤمن به لتجتاز امتحاناً لا يقيس سوى قدرتك على الخضوع. لم يعلمونا كيف نتساءل، بل كيف نردد.</p>
            <p>كان النظام مصمماً بدقة لقص أجنحة الخيال، لقتل أي تفكير نقدي، ولتحويلنا إلى براغيث مطيعة تقفز في نفس المستوى، جاهزة لسوق العمل. من يخرج عن النص، من يسأل "لماذا؟"، يُعاقب ويُصنف كفاشل.</p>
          ` : `
            <p>I am now thirty-one years old. Just nine years separate me from forty, and from the inevitable expiration of my soul if it persists in trying to survive inside this programmed matrix. I no longer fear biological cessation; I fear the slow death—the death of passion, the death of inquiry, and the extinction of the self within a gargantuan apparatus that swallowed us whole from our first cry. A machine they designate.. 'The System'.</p>

            <div class="section-heading">The System: The Great Matrix</div>
            <p>I was born only to find myself entangled in an intricate web of interlocking systems. Pre-fabricated molds into which you have no choice but to be squeezed so you may be granted the stamp of 'Approval'. I never understood this system, and it never understood me. Within it, I am merely an anomaly in the code (a Glitch), a cog that refuses to turn with the rest because it clearly sees the abyss toward which they are heading.</p>

            <div class="section-heading">The Patriarchal System: Deeds of Ownership</div>
            <p>Domestication commenced at home. The patriarchal order was never a sanctuary or a compass; it was a rigid hierarchy intolerant of dialogue. They treated us as financial investments or extensions of their own deficits, never as sovereign souls. 'Do this because I am elder', 'Pursue this path because it elevates the family name'.</p>
            <p>I never comprehended how affection is translated into conditional terms, or how blind compliance became the sole metric of filial piety. They foreclosed my identity before I could discover it, decreeing that this was 'respect'.</p>

            <div class="pull-quote">
              "They never instructed us on how to question, only how to echo. The apparatus was calibrated to sever the wings of imagination."
            </div>

            <div class="section-heading">The Educational System: Guillotine of Intellect</div>
            <p>Then they consigned me to the educational system.. the manufacturing plant of identical replicas. There, I was instructed in the foundational lessons of hypocrisy: how to memorize what you reject in order to pass examinations that measure nothing beyond your capacity for subservience.</p>
            <p>The apparatus was calibrated to sever the wings of imagination, execute critical thinking, and convert us into obedient laborers suited for the corporate marketplace. Whoever deviated from the syllabus, whoever dared ask 'Why?', was penalized and categorized as defective.</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</span>
        <span>6</span>
      </div>
    </div>

    <!-- ARTICLE 2 Continued (Page 7) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — مقال فكري' : 'Midaan Magazine — Philosophical Essay'}</span>
        <span>${isAr ? 'سأموت قبل الأربعين (تابع)' : 'I Will Die Before Forty (Cont.)'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <div class="content">
          ${isAr ? `
            <div class="section-heading">النظام المجتمعي: مسرح العبث والنفاق</div>
            <p>خرجت إلى الشارع لأصطدم بالنظام المجتمعي.. مسرحية عبثية أبطالها بارعون في ارتداء الأقنعة. مجتمع مهووس بالمظاهر، يقدس الاستهلاك ويقيم الإنسان بناءً على ماركة سيارته ورصيده البنكي.</p>
            <p>رسموا لنا "الكتالوج": تخرج، توظف، اقترض لترهن عمرك للبنك، تزوج لترضي المجتمع، وأنجب أطفالاً لتعيد إدخالهم في نفس المفرمة. النفاق هنا ليس خللاً، بل هو "زيت المحرك" الذي يجعل هذا المجتمع يدور. الصادق منبوذ، والمختلف يمثل تهديداً للقطيع المخدر، لذلك يحاربونه بشراسة.</p>

            <div class="section-heading">النظام الربوبي: الأسئلة المحرمة</div>
            <p>وهنا نصل إلى المتاهة الكبرى.. قمة الهرم الذي يبررون به كل ما سبق: النظام الربوبي كما صدّروه لنا. لم أفهم يوماً تلك الصورة المشوهة التي قدموها عن الإله؛ إله غاضب متربص يتعامل معنا بمنطق الثواب والعقاب التجاري البحت، وكأننا في صفقة مستمرة.</p>
            <p>في داخلي حنين لشيء أعظم، لطاقة كونية، لسلام حقيقي ومطلق، لكن نصوصهم وتفسيراتهم حوّلت الدين إلى أداة سيطرة، إلى نظام حراسة يقمع العقل ويحرّم التفكير. إذا سألت: "لماذا خُلقنا لنعاني في هذا العبث المستمر؟" يتهمونك بالزندقة. هم لا يريدونك أن تتصل بالخالق، بل يريدونك أن تخضع للنسخة التي فصّلوها هم عنه؛ نسخة تخدم سلطتهم وتبرر استبدادهم.</p>

            <div class="section-heading">تسع سنوات متبقية: الوقوف في وجه السستم</div>
            <p>أنا في الواحدة والثلاثين، وأقف عارياً من كل هذه الأنظمة. أرفضها وترفضني. الاختلاف ليس ادعاءً أتباهى به، بل هو لعنة أعيشها كل يوم. أن ترى الخيوط التي تحرك الدمى يجعلك عاجزاً عن الاستمتاع بالعرض.</p>
            <p>لن أعيش حتى الأربعين. سأموت قبلها، ليس لأن جسدي سيفنى، بل لأن الاختيار قد حُسم: إما أن أتنازل، أطأطئ رأسي، أرتدي القناع وأقبل بتسوية مع "السستم" ليموت ما تبقى من إنسانيتي وصدقي.. وإما أن أستمر في هذه الحرب الوجودية العبثية، أقاوم تيار الأنظمة كلها حتى أحترق وأتلاشى بشرف. وفي كلتا الحالتين، الرجل الذي يحمل اسمي الآن، والذي ينبض بالحقيقة والرفض، لن يكون موجوداً بعد تسع سنوات.</p>
          ` : `
            <div class="section-heading">The Societal System: Theatre of the Absurd</div>
            <p>I emerged onto the streets to collide with the social establishment.. an absurd theater populated by virtuosos of masked performance. A society consumed by superficial veneers, canonizing consumerism and measuring human dignity by automotive brand and bank balance.</p>
            <p>They drafted the standard catalogue: graduate, get employed, mortgage your existence to financial lenders, marry to appease communal conventions, and procreate to feed new flesh into the identical meat-grinder. Hypocrisy here is no malfunction; it is the lubricating oil that keeps the machine spinning. The genuine soul is ostracized; the deviant is hunted as an existential hazard to the sedated herd.</p>

            <div class="section-heading">The Theological System: The Prohibited Interrogations</div>
            <p>Here we reach the ultimate labyrinth.. the apex of the pyramid invoked to sanctify everything prior: the divine apparatus as exported to us. I never accepted the distorted portrait of divinity they purveyed: a vengeful, vigilant sovereign transacting with humanity through crude commercial balance sheets of reward and retribution.</p>
            <p>Inside me resides a longing for something infinitely greater, a cosmic presence, a peace unadulterated and unconditional. Yet their texts and doctrines converted faith into an instrument of domination, an armed watchtower suppressing thought and outlawing wonder. They seek not your communion with the Divine, but your submission to the version they tailored to legitimize their own tyranny.</p>

            <div class="section-heading">Nine Years Remaining: Defying the Matrix</div>
            <p>I stand at thirty-one, stripped bare of all these systems. I disavow them, and they disavow me. Non-conformity is no vanity I flaunt; it is an agonizing reality I inhabit daily. Observing the strings that manipulate the marionettes incapacitates one from enjoying the spectacle.</p>
            <p>I shall not survive until forty. I shall perish before it—not because my biology will disintegrate, but because the ultimatum is resolved: either I capitulate, lower my head, fasten the mask, and negotiate terms with 'The System' until whatever remains of my humanity suffocates.. or I endure in this existential insurrection, resisting every current until I burn and dissipate with honor. In either outcome, the man who carries my name today, whose heart beats with truth and defiance, will cease to exist in nine years.</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سأموت قبل الأربعين' : 'I Will Die Before Forty'}</span>
        <span>7</span>
      </div>
    </div>

    <!-- 6. ARTICLE 3 (Page 8 & 9) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — دراسة فلسفية' : 'Midaan Magazine — Philosophical Study'}</span>
        <span>${isAr ? 'حبر اليقين' : 'Ink of Certainty'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <h2 class="article-title">${isAr ? 'حبر اليقين: من مشقة الوداع إلى سكينة الشهادة' : 'Ink of Certainty: From Parting Hardship to Serenity'}</h2>
        <div class="article-meta">${isAr ? 'بقلم: صوت ميدان • دراسة سيكولوجية وسردية • أكتوبر 2026' : 'By: Midaan Voice • Psychological & Narrative Study • October 2026'}</div>

        <div class="content">
          ${isAr ? `
            <p>تُعد كتابة الوصية واحدة من أكثر التجارب الإنسانية عُمقاً وقسوة؛ فهي اللحظة التي يواجه فيها الإنسان فكرة الفناء وجهاً لوجه، ويحاول اختزال عمر كامل بمشاعره وأفكاره وعلاقاته في سطور معدودة. إنها اعتراف خطي بالرحيل، ومحاولة يائسة وصادقة لمد جسر من الكلمات بين عالمين.</p>
            <p>ولكن حين تُقرأ وصايا الشهداء، نجد أنفسنا أمام ظاهرة نفسية فريدة: كيف يتحول هذا العبء الوجودي الثقيل إلى حالة من السكينة المطلقة والراحة النفسية؟</p>

            <div class="section-heading">مشقة البداية: مواجهة الحبر والعدم</div>
            <p>تنبع الصعوبة البالغة في كتابة الوصية من كونها خطوة تتطلب تجرداً كاملاً من دافع البقاء الفطري. الإنسان بطبيعته يميل إلى تأجيل فكرة الموت وتجاهلها ليستمر في العيش. لذلك عندما يمسك المرء القلم ليكتب كلماته الأخيرة، فإنه يكسر هذا الدفاع النفسي ويضع حداً فاصلاً بين "الآن" و"ما بعد".</p>
            <p>في هذه اللحظة، يعيش الإنسان العادي حالة من القلق والاضطراب؛ فالأسئلة تهاجمه: ماذا سأترك خلفي؟ كيف سيذكرني الناس؟ هل أوفيت بعهودي؟ إنها مواجهة مع الحيرة والندم المحتمل. وكما عبّر الشهيد باسل الأعرج بصدق وعفوية في مطلع وصيته: <em>"لكم من الصعب أن تكتب وصيتك"</em>، مبرزاً تلك الحيرة الفلسفية والنفسية التي تسبق صياغة الوداع الفكري.</p>

            <div class="pull-quote">
              "لكم من الصعب أن تكتب وصيتك.. تلك الحيرة الفلسفية التي تسبق صياغة الوداع الفكري قبل أن يتحول العبء إلى يقين خالص."
            </div>

            <div class="section-heading">التسامي النفسي: كيف وُلدت السكينة من رحم الخطر؟</div>
            <p>على الرغم من تلك الصعوبة البدئية، أظهرت النصوص الأخيرة للشهداء تحولاً نفسياً مذهلاً يتجاوز الاضطراب المعتاد لدى البشر في لحظات المقاربة من الموت. هذا التحول يمكن تفسيره من خلال أبعاد نفسية وفكرية راسخة:</p>
            <p><strong>1. حسم الحيرة والوصول إلى الأجوبة:</strong> الحيرة هي المصدر الأكبر للقلق النفسي الإنساني. الشهيد في اللحظة التي يقرر فيها المضي في طريقه يكون قد حسم أعمق أسئلته الوجودية. عندما قال باسل الأعرج: <em>"أنا الآن أسير إلى حتفي راضياً مقتنعاً وجدت أجوبتي"</em>، كان يعلن عن شروق حالة من السلام الداخلي نتيجة التوافق التام بين مبادئه وأفعاله.</p>
          ` : `
            <p>The drafting of a final will stands as one of the most agonizing and profound encounters of human existence; it is the exact instant wherein mortality is confronted unvarnished, attempting to compress an entire biography—its passions, doubts, and bonds—into brief lines. It is a written acknowledgment of farewell, a vulnerable endeavor to span a linguistic bridge across two realms.</p>
            <p>Yet when studying the testaments of Palestinian martyrs, one encounters a remarkable psychological phenomenon: how does this crushing existential burden metamorphose into absolute composure, serenity, and inward peace?</p>

            <div class="section-heading">The Hardship of the Threshold: Confronting Ink and the Void</div>
            <p>The immense gravity of composing a will originates in demanding unconditional detachment from biological self-preservation. Human psychology naturally defers contemplation of mortality to sustain daily function. Thus, when an individual grips the pen to inscribe final words, that protective defense collapses, engraving a definitive boundary between 'the now' and 'the beyond'.</p>
            <p>Here, ordinary individuals experience disquiet: What remains behind? How shall memory treat me? Have I honored my vows? It is a confrontation with uncertainty. As the martyr-intellectual Basil al-Araj phrased it with raw candor: <em>"How difficult it is to write your own testament"</em>, illuminating the philosophical hesitation preceding parting reflections.</p>

            <div class="pull-quote">
              "How difficult it is to write your own testament.. the philosophical hesitation that precedes parting before burden turns to certainty."
            </div>

            <div class="section-heading">Psychological Sublimation: Serenity from Mortal Peril</div>
            <p>Notwithstanding the initial threshold, the final testaments reveal a startling psychological transformation surpassing standard existential agitation. This metamorphosis unfolds across three foundational dimensions:</p>
            <p><strong>1. Resolving the Labyrinth and Attaining Certainty:</strong> Uncertainty is the supreme source of psychic anxiety. The martyr, having embraced their trajectory, has definitively answered life's heaviest questions. When Basil al-Araj declared: <em>"I march toward my end content, convinced, having found my answers"</em>, he proclaimed an inward dawn born of seamless synthesis between ethics and action.</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'حبر اليقين' : 'Ink of Certainty'}</span>
        <span>8</span>
      </div>
    </div>

    <!-- ARTICLE 3 Continued (Page 9) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — دراسة فلسفية' : 'Midaan Magazine — Philosophical Study'}</span>
        <span>${isAr ? 'حبر اليقين (تابع)' : 'Ink of Certainty (Cont.)'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <div class="content">
          ${isAr ? `
            <p><strong>2. التجرد من "الأنا" والانصهار في الفكرة:</strong> في علم النفس الحديث، يرتبط الخوف من الموت غالباً بالخوف من ضياع الذات أو "الأنا". لكن الشهيد يمر بعملية تسامٍ (Sublimation) تجعله يرى نفسه ليس كجسد فانٍ، بل كامتداد لفكرة أسمى—كالوطن أو الحرية أو الكرامة. عندما تذوب "الأنا" الفردية في "النحن" الجماعية، يفقد الموت قوته المرعبة ويتحول من نهاية مأساوية إلى وسيلة لإحياء المجموع، كما يظهر في وصية عدي التميمي الذي كتب بوعي تام أن هدفه هو تحريك مئات الشباب ليحملوا البنادق من بعده.</p>
            <p><strong>3. قلب معادلة الخوف والمواجهة المباشرة:</strong> تتسم وصايا الميدان (مثل رسالة إبراهيم النابلسي أو وديع الحوح) بنبرة صوتية ونفسية تخلو تماماً من التردد أو الانكسار. نفسياً، المواجهة المباشرة والمقبلة (غير المدبرة) تمنح العقل البشري تدفقاً من الشجاعة الأدرينالينية واليقين الروحي الذي يطرد الخوف. الشهيد لا ينتظر الموت السلبي، بل يذهب إلى مصيره بنشاط وإرادة، وهذا الامتلاك لقرار النهاية يمنحه تفوقاً نفسياً هائلاً على محاصريه.</p>

            <div class="section-heading">الأثر النفسي للوصية: نقل العبء إلى الأحياء</div>
            <p>تتحول وصية الشهيد في نهاية المطاف من وثيقة رثاء شخصية إلى أداة توجيه نفسي وفكري للأحياء. الشهيد، بوصوله إلى غايته وسكينته، يضع القلم ويرحل تاركاً خلفه "الأسئلة" برسم الإجابة لمن بقي حياً. إنه يقول بلسان الحال: "أنا وجدت إجابتي واطمأن قلبي، فماذا أنتم فاعلون؟".</p>
            <p>إن الراحة النفسية والمكانة العالية التي تعكسها هذه النصوص ليست مجرد نتاج لحظة عاطفية عابرة، بل هي خلاصة وعي فكري وتصالح تام مع الذات. لقد أثبتت هذه الكلمات أن القلم، عندما يُغمس في حبر اليقين، يملك القدرة على هزم الخوف من الموت، وتحويل أصعب كتابة في حياة الإنسان إلى وثيقة للخلود والطمأنينة.</p>
          ` : `
            <p><strong>2. Transcending the Ego and Merging into the Cause:</strong> Modern psychoanalysis frequently correlates thanatophobia with terror over ego extinction. Yet the martyr undergoes profound sublimation, perceiving the self not as frail biological matter, but as an enduring vehicle for higher ideals—liberation, dignity, and homelands. When individual ego dissolves into the collective 'we', death loses its paralyzing potency and transforms from catastrophe into collective renewal, evidenced in Oday al-Tamimi's declaration that his mission was to stir hundreds of youths to shoulder the vanguard after him.</p>
            <p><strong>3. Inverting the Calculus of Fear through Direct Engagement:</strong> Battlefield testaments (such as the voice dispatches of Ibrahim al-Nabulsi or Wadee al-Hawah) exhibit vocal frequencies devoid of hesitation. Direct forward confrontation releases physiological resolve combined with spiritual conviction that expels dread. Refusing passive demise, the martyr advances autonomously, seizing destiny and securing psychological mastery over besieging forces.</p>

            <div class="section-heading">The Psychological Resonance: Bequeathing the Inquest to the Living</div>
            <p>Ultimately, the martyr's testament evolves from personal eulogy into an intellectual catalyst directed at the living. Having attained tranquility, the author lays down the instrument, departing while casting existential interrogations upon those left behind. The subtext is clear: "I have arrived at my certainty and stilled my heart; what will you do now?".</p>
            <p>The composure radiating from these words is no temporary emotional impulse, but distilled consciousness and radical peace. They demonstrate that when the pen is submerged into the ink of certainty, it possesses the virtue to overcome mortality, transmuting life's most formidable composition into a charter of transcendence and calm.</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'حبر اليقين' : 'Ink of Certainty'}</span>
        <span>9</span>
      </div>
    </div>

    <!-- 7. ARTICLE 4 (Page 10, 11 & 12) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — أرشيف وتوثيق' : 'Midaan Magazine — Historical Registry'}</span>
        <span>${isAr ? 'سجل وصايا الشهداء الفلسطينيين' : 'Register of Palestinian Martyrs\' Wills'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <h2 class="article-title">${isAr ? 'سجل وصايا الشهداء الفلسطينيين' : 'Register of Palestinian Martyrs\' Wills'}</h2>
        <div class="article-meta">${isAr ? 'إعداد: توثيق ميدان الأرشيفي • سجل خالد في الوجدان الوطني • أكتوبر 2026' : 'Compiled by: Midaan Archival Research • Immortal National Ledger • October 2026'}</div>

        <div class="content">
          ${isAr ? `
            <p>وثيقة فكرية وتاريخية تجمع أبرز وصايا الشهداء الفلسطينيين التي شكلت محطات فارقة في الوعي الجمعي، وتنوعت بين التأصيل الثقافي الثوري والرسائل الميدانية العفوية تحت النيران.</p>
            
            <div class="section-heading">جدول تعريفي بالوصايا المدرجة في السجل</div>
            <table class="data-table">
              <tr>
                <th>الشهيد</th>
                <th>العام</th>
                <th>طبيعة الوصية</th>
              </tr>
              <tr><td>باسل الأعرج</td><td>2017</td><td>فكرية / ثقافية ثورية</td></tr>
              <tr><td>بهاء عليان</td><td>2015</td><td>الوصايا العشر (اجتماعية وفكرية)</td></tr>
              <tr><td>دلال المغربي</td><td>1978</td><td>سياسية وعسكرية استراتيجية</td></tr>
              <tr><td>تامر الكيلاني</td><td>2022</td><td>تنظيمية وروحية</td></tr>
              <tr><td>إبراهيم النابلسي</td><td>2022</td><td>ميدانية (تسجيل صوتي تحت الحصار)</td></tr>
              <tr><td>عدي التميمي</td><td>2022</td><td>ميدانية مكتوبة (أثناء المطاردة)</td></tr>
              <tr><td>يحيى عياش</td><td>1996</td><td>مقولات ومنهج اشتباك</td></tr>
              <tr><td>وديع الحوح</td><td>2022</td><td>ميدانية (عبر اللاسلكي العسكري)</td></tr>
              <tr><td>غسان كنفاني</td><td>1972</td><td>أدبية وفلسفية مستخلصة</td></tr>
            </table>

            <div class="section-heading">القسم الأول: الوصايا الفكرية والسياسية</div>
            <p><strong>1. وصية الشهيد المثقف باسل الأعرج (2017):</strong><br/>
            "تحية العروبة والوطن والتحرير، أما بعد، فإن كنتم تقرؤون هذا فهذا يعني أني قد مت، وقد صعدت الروح إلى خالقها، وأدعو الله أن ألاقيه بقلب سليم مقبل غير مدبر بإخلاص بلا ذرة رياء.<br/>
            لكم من الصعب أن تكتب وصيتك، ومنذ سنين انقضت وأنا أتأمل كل وصايا الشهداء وتلك الحيرة كانت تفاجئني دائماً: مختصر مفيد دون إطالة. لماذا نكتب وصايانا؟ هل نكتبها لنرسم طريقاً لمن بعدنا أم نكتبها لتكون ملحمة شخصية، أم نكتبها كإعلان براءة من ذنب تركناه خلفنا؟<br/>
            أنا الآن أسير إلى حتفي راضياً مقتنعاً، وجدت أجوبتي، يا ويلي ما أحمقني، وهل هناك ما هو أكثر بلاغة وأفصح من فعل الشهيد؟ وكان من المفروض أن أكتب هذا قبل شهور طويلة إلا أن ما أقعدني عن هذا هو أن هذا سؤالكم أنتم الأحياء، فلماذا أجيب أنا عنكم؟ فلتبحثوا أنتم، أما نحن أهل القبور فلا نبحث إلا عن رحمة الله."</p>
          ` : `
            <p>An intellectual and historical archive cataloging foundational testaments of Palestinian martyrs that defined watershed epochs in collective awareness, oscillating between deep ideological grounding and spontaneous combat messages under fire.</p>

            <div class="section-heading">Synoptic Index of Documented Testaments</div>
            <table class="data-table">
              <tr>
                <th>Martyr</th>
                <th>Year</th>
                <th>Classification</th>
              </tr>
              <tr><td>Basil al-Araj</td><td>2017</td><td>Revolutionary intellectual & cultural theory</td></tr>
              <tr><td>Baha Alyan</td><td>2015</td><td>The Ten Commandments (Social & civic)</td></tr>
              <tr><td>Dalal al-Mughrabi</td><td>1978</td><td>Strategic political & military imperative</td></tr>
              <tr><td>Tamer al-Kilani</td><td>2022</td><td>Organizational discipline & spiritual resolve</td></tr>
              <tr><td>Ibrahim al-Nabulsi</td><td>2022</td><td>Field audio dispatch under siege</td></tr>
              <tr><td>Oday al-Tamimi</td><td>2022</td><td>Field manuscript during active manhunt</td></tr>
              <tr><td>Yahya Ayyash</td><td>1996</td><td>Strategic doctrine & combat methodology</td></tr>
              <tr><td>Wadee al-Hawah</td><td>2022</td><td>Tactical transmission via military radio</td></tr>
              <tr><td>Ghassan Kanafani</td><td>1972</td><td>Distilled philosophical & literary paradigms</td></tr>
            </table>

            <div class="section-heading">Part One: Intellectual and Political Testaments</div>
            <p><strong>1. Testament of Intellectual Martyr Basil al-Araj (2017):</strong><br/>
            "Greetings of Arab dignity, homeland, and liberation. To proceed: If you are reading this, it signifies that I have passed away, and my spirit has ascended to its Creator. I pray to meet God with a sound heart, advancing never retreating, in pure sincerity devoid of vanity.<br/>
            How burdensome it is to write one's own testament. For long years I contemplated the wills of all martyrs; their brevity always astonished me: concise, purposeful, without superfluity. Why do we compose our wills? Do we write them to illuminate a path for those who follow, or do we write them as personal epics, or as declarations of absolution from sins left in our wake?<br/>
            I march toward my end content and convinced, having uncovered my answers. Woe unto me, how foolish was I—could anything prove more eloquent or articulate than the deed of the martyr? I ought to have written this months ago, yet what stayed my hand was knowing that this is an inquiry that belongs to you, the living. Why should I answer on your behalf? Seek for yourselves; as for us in the chambers of the grave, we seek nothing save the mercy of God."</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء' : 'Register of Martyrs\' Wills'}</span>
        <span>10</span>
      </div>
    </div>

    <!-- ARTICLE 4 Continued (Page 11) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — أرشيف وتوثيق' : 'Midaan Magazine — Historical Registry'}</span>
        <span>${isAr ? 'سجل وصايا الشهداء الفلسطينيين (تابع)' : 'Register of Palestinian Martyrs\' Wills (Cont.)'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <div class="content">
          ${isAr ? `
            <p><strong>2. الوصايا العشر للشهيد بهاء عليان (2015):</strong><br/>
            • أوصي الفصائل بعدم تبني شهادتي، فموتي كان للوطن وليس لكم.<br/>
            • أوصي بعدم طباعة البوسترات لي، فذاكرتكم أضعف من أن تبقيها، والجدران أقبح من أن تزينوها.<br/>
            • أوصي الأهالي بألا يحزنوا، بل يزغردوا، فلا تبكوا عليّ بل ابكوا على أنفسكم.<br/>
            • أوصي الصحفيين بألا يصوروا جثتي، فهذا يؤذي أمي.<br/>
            • أوصي ألا يكتبوا على قبري أي شعار أو اسم فصيل، بل يُكتب: هذا قبر الشهيد بهاء عليان.</p>

            <p><strong>3. وصية الشهيدة دلال المغربي (1978):</strong><br/>
            "وصيتي لكم جميعاً أيها الإخوة حملة البنادق أن تستمروا في الكفاح.. أرجو أن تتحدوا جميعاً في صف واحد وتوجيه البنادق إلى العدو الصهيوني. إن استقلال الإرادة الفلسطينية لا يتحقق إلا ضمن البندقية المستقلة."</p>

            <p><strong>4. وصية الشهيد تامر الكيلاني (2022):</strong><br/>
            "أوصيكم ألا تبكوا عليّ بل زغردوا، وأوصيكم بعدم تنزيل أي صورة لي دون تغطية وجهي كي لا يُؤخذ عني طابع الاستعراض، وأطلب أن يُوضع سيفي الذي في غرفتي على قبري."</p>

            <div class="section-heading">القسم الثاني: وصايا الميدان والاشتباك</div>
            <p><strong>5. رسالة الشهيد إبراهيم النابلسي (2022):</strong><br/>
            "أنا استشهدت يا جماعة.. أنا بحب إمي كتير، وبحياة عرضكم ما حدا يترك البارودة، أنا محاصر ورايح أستشهد، ادعولي."</p>

            <p><strong>6. رسالة الشهيد عدي التميمي (2022):</strong><br/>
            "أنا البطل عدي التميمي، منفذ عملية مخيم شعفاط. أعلم أنني لن أحرر فلسطين بعمليتي، ولكن نفذتها وأنا أعلم أن الهدف الأساسي أن أحرك مئات الشباب ليحملوا البنادق من بعدي."</p>
          ` : `
            <p><strong>2. The Ten Wills of Martyr Baha Alyan (2015):</strong><br/>
            • I bid the factions not to adopt my martyrdom; my death was for the homeland, never for your apparatus.<br/>
            • I forbid the printing of commemorative posters; your collective memory is too frail to preserve them, and the walls too grim to be adorned.<br/>
            • I urge my family not to mourn, but to ululate with pride; weep not over me, but weep over your own state.<br/>
            • I command journalists not to photograph my corpse; such imagery wounds my mother.<br/>
            • I demand that no partisan insignia or factional acronym be inscribed upon my resting place; let it read simply: Here lies the martyr Baha Alyan.</p>

            <p><strong>3. Testament of Martyr Dalal al-Mughrabi (1978):</strong><br/>
            "My testament to all of you, comrades bearing arms: continue the struggle without pause. I beseech you to unite in a single line, directing your rifles exclusively toward the Zionist adversary. Sovereign Palestinian destiny can never be realized except through an independent rifle."</p>

            <p><strong>4. Testament of Martyr Tamer al-Kilani (2022):</strong><br/>
            "I enjoin you not to shed tears over me, but to rejoice with honor. I prohibit the circulation of any unmasked portrait of mine, lest my legacy be misconstrued as vanity. And I request that the blade hanging in my room be placed upon my grave."</p>

            <div class="section-heading">Part Two: Battlefield Testaments Under Fire</div>
            <p><strong>5. Message of Martyr Ibrahim al-Nabulsi (2022):</strong><br/>
            "I have attained martyrdom, my people.. I love my mother immensely. By all that you hold sacred, never abandon the rifle. I am besieged and advancing to my end; pray for me."</p>

            <p><strong>6. Message of Martyr Oday al-Tamimi (2022):</strong><br/>
            "I am the fighter Oday al-Tamimi, who carried out the Shuafat operation. I know well that my solitary operation will not liberate Palestine, but I executed it knowing that its primary purpose is to mobilize hundreds of youths to shoulder arms after me."</p>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء' : 'Register of Martyrs\' Wills'}</span>
        <span>11</span>
      </div>
    </div>

    <!-- ARTICLE 4 Continued (Page 12) -->
    <div class="page">
      <div class="page-header">
        <span>${isAr ? 'مجلة ميدان — أرشيف وتوثيق' : 'Midaan Magazine — Historical Registry'}</span>
        <span>${isAr ? 'سجل وصايا الشهداء (خاتمة السجل)' : 'Register of Martyrs\' Wills (Conclusion)'}</span>
      </div>

      <div style="margin-top: 8mm;">
        <div class="content">
          ${isAr ? `
            <p><strong>7. مقولة الشهيد يحيى عياش (1996):</strong><br/>
            "بإمكان اليهود اقتلاع جسدي من فلسطين، غير أنهم لن يستطيعوا اقتلاع الفكرة من عقول وقلوب الشباب.. إن المعركة لم تنتهِ ولن تنتهي إلا بزوال الاحتلال."</p>

            <p><strong>8. رسالة الشهيد وديع الحوح (2022):</strong><br/>
            "لا تستسلموا.. اضربوهم من كل مكان، ما حد يرمي سلاحه، إحنا مشاريع شهادة يا شباب، ما حد يزعل علينا، استمروا، وراكم رجال."</p>

            <div class="section-heading">القسم الثالث: وصايا أدبية وفلسفية من وحي القضية</div>
            <p><strong>9. وصية الأديب الشهيد غسان كنفاني (رؤية مستخلصة):</strong></p>
            <p>• <strong>عن الموت:</strong> "إن قضية الموت ليست على الإطلاق قضية الميت.. إنها قضية الباقين المنتظرين بمرارة دورهم."</p>
            <p>• <strong>عن الصمت:</strong> "لماذا لم تدقوا جدران الخزان؟ لماذا لم تقولوا؟ لماذا؟"</p>
            <p>• <strong>عن غزة والتمسك بالأرض:</strong> "لا يا صديقي، إني لن آتي إليك.. سأبقى هنا ولن أبرح أبداً. إنني أكتشف نفسي في غزة، هذه الملفات المعجونة بالدم هي وحدها التي تعطي للحياة معنى."</p>

            <div class="pull-quote" style="margin-top: 24px;">
              "إن توثيق هذه الوصايا في مجلة ميدان هو عهد مستمر بأن الرواية لا تُهزم، وأن الكلمة الشاهدة تبقى حية عبر الأجيال."
            </div>
          ` : `
            <p><strong>7. Maxim of Martyr Yahya Ayyash (1996):</strong><br/>
            "The occupiers possess the capacity to uproot my physical body from Palestine, but they will never succeed in uprooting the idea from the intellect and hearts of the youth. The battle has not concluded, and will never conclude until the occupation is abolished."</p>

            <p><strong>8. Message of Martyr Wadee al-Hawah (2022):</strong><br/>
            "Do not surrender.. strike them from every vantage. Let no fighter discard their weapon. We are projects of martyrdom, comrades; grieve not for our departure. Persevere; there are steadfast men behind you."</p>

            <div class="section-heading">Part Three: Literary Testaments Inspired by the Cause</div>
            <p><strong>9. Philosophical Vision of Ghassan Kanafani (Distilled Legacy):</strong></p>
            <p>• <strong>On Mortality:</strong> "The problem of death is never the concern of the deceased.. it is the excruciating burden of those left behind, bitterly awaiting their turn."</p>
            <p>• <strong>On Complicity and Silence:</strong> "Why did you not pound on the walls of the tanker? Why did you remain silent? Why?"</p>
            <p>• <strong>On Gaza and the Soil:</strong> "No, my friend, I shall never come to you in exile.. I shall remain here and never depart. I discover my true self in Gaza; these dossiers kneaded with blood are the solitary things that grant existence meaning."</p>

            <div class="pull-quote" style="margin-top: 24px;">
              "Documenting these wills within Midaan Magazine is our continuing pledge: that narrative is never vanquished, and witness words endure forever."
            </div>
          `}
        </div>
      </div>

      <div class="page-footer">
        <span>${isAr ? 'سجل وصايا الشهداء' : 'Register of Martyrs\' Wills'}</span>
        <span>12</span>
      </div>
    </div>

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
  await browser.close();
  fs.unlinkSync(tempHtmlPath);
  console.log(`Finished ${outputPath}`);
}

async function run() {
  const magazineDir = path.join(__dirname, '..', 'public', 'magazine');
  if (!fs.existsSync(magazineDir)) fs.mkdirSync(magazineDir, { recursive: true });

  const arPath = path.join(magazineDir, 'issue-zero.pdf');
  const enPath = path.join(magazineDir, 'issue-zero-en.pdf');

  await buildPdf('ar', arPath);
  await buildPdf('en', enPath);
  console.log('All bilingual PDFs generated successfully!');
}

run();
