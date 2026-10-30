const puppeteer = require('puppeteer');
const path = require('path');

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Desktop Arabic Article 1
  await page.setViewport({ width: 1440, height: 1800 });
  await page.goto('http://localhost:3000/magazine/ar/articles/art-1/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-article-ar-art1.png') });
  console.log('Saved screenshot-article-ar-art1.png');

  // 2. Desktop English Article 1
  await page.setViewport({ width: 1440, height: 1800 });
  await page.goto('http://localhost:3000/magazine/en/articles/art-1/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-article-en-art1.png') });
  console.log('Saved screenshot-article-en-art1.png');

  // 3. Mobile Arabic Article 1
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/magazine/ar/articles/art-1/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-article-mobile-art1.png') });
  console.log('Saved screenshot-article-mobile-art1.png');

  // 4. Desktop Magazine Landing with all articles
  await page.setViewport({ width: 1440, height: 1600 });
  await page.goto('http://localhost:3000/magazine/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-magazine-landing.png') });
  console.log('Saved screenshot-magazine-landing.png');

  // 5. Desktop Issue Zero Reader with Bilingual PDF download triggers
  await page.setViewport({ width: 1440, height: 1600 });
  await page.goto('http://localhost:3000/magazine/issue-zero/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-issue-zero-reader.png') });
  console.log('Saved screenshot-issue-zero-reader.png');

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
