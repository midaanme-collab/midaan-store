const puppeteer = require('puppeteer');
const path = require('path');

async function capture() {
  console.log('Capturing updated mobile and desktop screenshots...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Mobile Product Detail Page (/products/drop-helmet-white)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/products/drop-helmet-white', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: 'screenshot-mobile-product-pdp.png', fullPage: false });
    console.log('Captured: screenshot-mobile-product-pdp.png');

    // Select size 'M' and Add to Bag
    await page.evaluate(() => {
      const sizeBtns = Array.from(document.querySelectorAll('button'));
      const mBtn = sizeBtns.find(b => b.textContent && b.textContent.trim() === 'M');
      if (mBtn) mBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // Click Add to Bag
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent && (b.textContent.includes('أضف إلى الحقيبة') || b.textContent.includes('Add to Bag')));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture Mobile Cart Drawer opened from PDP
    await page.screenshot({ path: 'screenshot-mobile-cart-from-pdp.png', fullPage: false });
    console.log('Captured: screenshot-mobile-cart-from-pdp.png');

    await page.close();
  }

  // 2. Desktop Product Detail Page
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/products/drop-helmet-white', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'screenshot-desktop-product-pdp.png', fullPage: false });
    console.log('Captured: screenshot-desktop-product-pdp.png');
    await page.close();
  }

  // 3. Mobile Article Page (/magazine/ar/articles/art-1)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/magazine/ar/articles/art-1', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: 'screenshot-mobile-article-refined.png', fullPage: false });
    console.log('Captured: screenshot-mobile-article-refined.png');

    // Scroll to next article card and footer controls
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight - 1100);
    });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: 'screenshot-mobile-article-bottom.png', fullPage: false });
    console.log('Captured: screenshot-mobile-article-bottom.png');

    await page.close();
  }

  // 4. About Page (/about)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'screenshot-about-page.png', fullPage: false });
    console.log('Captured: screenshot-about-page.png');
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
