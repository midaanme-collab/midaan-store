const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const alexandriaFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'Alexandria-Regular.ttf')).toString('base64');
const messiriFont = fs.readFileSync(path.join(__dirname, '..', 'public', 'fonts', 'ElMessiri-Bold.ttf')).toString('base64');

function getHtml(lang) {
  const isAr = lang === 'ar';
  return `<!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8">
    <style>
      @font-face { font-family: 'Alexandria'; src: url(data:font/truetype;charset=utf-8;base64,${alexandriaFont}) format('truetype'); }
      @font-face { font-family: 'El Messiri'; src: url(data:font/truetype;charset=utf-8;base64,${messiriFont}) format('truetype'); font-weight: 700; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #000; font-family: 'Alexandria', sans-serif; display: flex; justify-content: center; align-items: center; }
      .page.cover { padding: 16mm 16mm 14mm 16mm; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; width: 210mm; height: 297mm; position: relative; background: #FAF8F5; }
      .cover::before { content: ''; position: absolute; inset: 3.5mm; border: 1px solid #D5D0C0; pointer-events: none; }
      .cover-masthead { margin-top: 4mm; }
      .cover-brand { font-family: 'El Messiri', serif; font-size: 5.2rem; line-height: 1; font-weight: 700; color: #111; letter-spacing: -0.01em; }
      .cover-dot { color: #D80032; }
      .cover-subtitle { font-size: 0.82rem; font-weight: 600; color: #666; margin-top: 2.5mm; }
      .cover-center { display: flex; flex-direction: column; align-items: center; gap: 4.5mm; margin: auto 0; width: 100%; max-width: 170mm; }
      .cover-badge { display: inline-block; background: #D80032; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 1.5mm 4.5mm; border-radius: 9999px; }
      .cover-issue-title { font-family: 'El Messiri', serif; font-size: 4rem; font-weight: 700; color: #111; line-height: 1; margin: 2mm 0 1mm 0; }
      .cover-issue-num { font-size: 1.25rem; font-weight: 700; color: #D80032; margin-bottom: 3.5mm; }
      .cover-lead-summary { font-size: 0.88rem; line-height: 1.8; color: #333; max-width: 135mm; margin: 0 auto; font-weight: 500; }
      .cover-foot { width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: #777; font-weight: 600; border-top: 1px solid #E5E0D0; padding-top: 3.5mm; font-family: 'Alexandria', sans-serif; }
    </style>
  </head>
  <body>
    <div class="page cover">
      <div class="cover-masthead">
        <div class="cover-brand">${isAr ? 'مَـيـدَان' : 'MIDAAN'}<span class="cover-dot">.</span></div>
        <div class="cover-subtitle">${isAr ? 'مجلة فكرية وثقافية مستقلة • صُنعت في عمّان - فلسطين' : 'Independent Intellectual & Cultural Review • Amman • Palestine'}</div>
      </div>
      <div class="cover-center">
        <div class="cover-badge">${isAr ? 'الإصدار التأسيسي // خريف 2026' : 'FOUNDING ISSUE // AUTUMN 2026'}</div>
        <div class="cover-issue-title">${isAr ? 'انتحاب' : 'ENTIHAB'}</div>
        <div class="cover-issue-num">${isAr ? 'العدد صفر' : 'ISSUE ZERO'}</div>
        <div class="cover-lead-summary">
          ${isAr 
            ? 'توثيق سردية الشارع، صراع الأرض والسماء، وسجل وصايا الخالدين. منصة للرواية المستقلة والتعبير المدني الحر.'
            : 'Documenting the street narrative, the conflict of earth and sky, and the testaments of the immortal. An independent forum for memory and cultural resistance.'}
        </div>
      </div>
      <div class="cover-foot">
        <span>${isAr ? 'العدد 00' : 'ISSUE 00'}</span>
        <span style="font-family: monospace; letter-spacing: 1px;">MIDAAN ARCHIVE // HKJ-PAL-2026-ZERO</span>
        <span>${isAr ? 'حبر حر • ذاكرة تأبى النسيان' : 'Free Press • Unbroken Memory'}</span>
      </div>
    </div>
  </body>
  </html>`;
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // AR
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(getHtml('ar'), { waitUntil: 'load' });
    const el = await page.$('.page.cover');
    await el.screenshot({ path: path.join(__dirname, '..', 'public', 'magazine', 'issue-zero-cover-thumb.png') });
    await page.close();
  }

  // EN
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.setContent(getHtml('en'), { waitUntil: 'load' });
    const el = await page.$('.page.cover');
    await el.screenshot({ path: path.join(__dirname, '..', 'public', 'magazine', 'issue-zero-cover-thumb-en.png') });
    await page.close();
  }

  await browser.close();
  console.log('Successfully captured both cover thumbnails!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
