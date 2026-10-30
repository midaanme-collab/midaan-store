const puppeteer = require('puppeteer');
const path = require('path');

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });

  // 1. Mobile Homepage
  console.log('Navigating to Mobile Homepage...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-mobile-home.png'), fullPage: false });
  console.log('Saved screenshot-mobile-home.png');

  // 2. Mobile Arabic Article (art-1)
  console.log('Navigating to Mobile Arabic Article...');
  await page.goto('http://localhost:3000/magazine/ar/articles/art-1/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-mobile-article-ar.png'), fullPage: false });
  console.log('Saved screenshot-mobile-article-ar.png');

  // 3. Mobile English Article (art-1)
  console.log('Navigating to Mobile English Article...');
  await page.goto('http://localhost:3000/magazine/en/articles/art-1/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-mobile-article-en.png'), fullPage: false });
  console.log('Saved screenshot-mobile-article-en.png');

  // 4. Mobile Cart Drawer
  console.log('Setting up Cart on Homepage...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  
  // Set localStorage with item and valid storage key
  await page.evaluate(() => {
    localStorage.setItem('midaan-storage', JSON.stringify({
      state: {
        cart: [{
          id: 'cart-helmet-item',
          garment: 'tshirt',
          color: 'white',
          size: 'L',
          placement: 'center',
          artMode: 'presets',
          price: 35.0,
          priceUSD: 50.0,
          productTitle: 'تيشيرت خوذة الكوفية — الإصدار الأبيض',
          previewImage: '/helmet-back-white.jpg',
          isPrePrinted: true,
          quantity: 1
        }],
        currency: 'JOD',
        theme: 'dark'
      },
      version: 0
    }));
  });

  // Reload to let zustand hydrate the cart
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  // Click the Cart button in the header
  const cartBtn = await page.$('button[aria-label="Open Cart"]');
  if (cartBtn) {
    await cartBtn.click();
    console.log('Clicked Open Cart button');
    await new Promise(r => setTimeout(r, 600));
  } else {
    console.error('Could not find Open Cart button!');
  }

  await page.screenshot({ path: path.join(__dirname, '..', 'screenshot-mobile-cart.png'), fullPage: false });
  console.log('Saved screenshot-mobile-cart.png');

  await browser.close();
  console.log('All mobile screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
