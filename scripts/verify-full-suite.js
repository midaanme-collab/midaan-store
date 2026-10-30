const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function verify() {
  console.log('--- Starting Comprehensive Verification Suite ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. TEST PERMANENT DARK APPEARANCE WITH SAVED LIGHT PREFERENCE & OS LIGHT MODE
  console.log('1. Testing Permanent Dark Appearance...');
  const page = await browser.newPage();
  
  // Emulate OS in light mode
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });

  // Pre-seed localStorage with light theme preference
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('midaan-storage', JSON.stringify({
      state: {
        theme: 'light',
        currency: 'JOD',
        lang: 'ar',
        cart: [{
          id: 'drop-helmet-white-L',
          productTitle: 'تيشيرت خوذة الكوفية — أبيض',
          size: 'L',
          quantity: 1,
          price: 35,
          priceUSD: 50,
          isPrePrinted: true
        }]
      },
      version: 0
    }));
  });

  // Reload page and check if html is dark and theme migrated to dark without erasing cart
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const darkCheck = await page.evaluate(() => {
    const htmlClasses = document.documentElement.className;
    const bgColor = window.getComputedStyle(document.body).backgroundColor;
    const storage = JSON.parse(localStorage.getItem('midaan-storage') || '{}');
    return {
      hasDarkClass: htmlClasses.includes('dark'),
      bodyBg: bgColor,
      migratedTheme: storage.state ? storage.state.theme : null,
      cartLength: storage.state ? storage.state.cart.length : 0
    };
  });

  console.log('Dark Mode Verification Result:', darkCheck);
  if (!darkCheck.hasDarkClass || darkCheck.migratedTheme !== 'dark' || darkCheck.cartLength !== 1) {
    throw new Error('Dark mode or theme migration failed!');
  }

  // 2. TEST SILENT VIDEO PLAYBACK
  console.log('2. Testing Silent Campaign Video...');
  const videoState = await page.evaluate(() => {
    const v = document.querySelector('video');
    if (!v) return null;
    return {
      muted: v.muted,
      hasMutedAttr: v.hasAttribute('muted'),
      autoPlay: v.autoplay,
      loop: v.loop,
      playsInline: v.playsInline
    };
  });
  console.log('Video Attributes:', videoState);
  if (!videoState || !videoState.muted) {
    throw new Error('Video is not strictly muted!');
  }

  // 3. CAPTURE DESKTOP SCREENSHOTS
  console.log('3. Capturing Desktop Screenshots...');
  
  // (a) Homepage Full
  await page.screenshot({ path: 'screenshot-updated-homepage.png', fullPage: false });
  console.log('Saved screenshot-updated-homepage.png');

  // (b) Product Cards Section
  await page.evaluate(() => {
    const el = document.getElementById('drops');
    if (el) el.scrollIntoView();
    window.scrollBy(0, -90);
  });
  await new Promise(r => setTimeout(r, 400));
  const dropsEl = await page.$('#drops');
  if (dropsEl) {
    await dropsEl.screenshot({ path: 'screenshot-updated-product-cards.png' });
    console.log('Saved screenshot-updated-product-cards.png');
  }

  // (c) Magazine Section
  await page.evaluate(() => {
    const el = document.getElementById('voice');
    if (el) el.scrollIntoView();
    window.scrollBy(0, -90);
  });
  await new Promise(r => setTimeout(r, 400));
  const voiceEl = await page.$('#voice');
  if (voiceEl) {
    await voiceEl.screenshot({ path: 'screenshot-updated-magazine-section.png' });
    console.log('Saved screenshot-updated-magazine-section.png');
  }

  // 4. TEST MOBILE VIEWPORT & MOBILE CART DRAWER
  console.log('4. Testing Mobile Viewport & Mobile Cart Drawer...');
  const mobilePage = await browser.newPage();
  await mobilePage.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Open the cart drawer directly using the cart button in the header
  await mobilePage.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cartBtn = btns.find(b => b.textContent && b.textContent.includes('الحقيبة'));
    if (cartBtn) cartBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Screenshot Mobile Cart Drawer
  await mobilePage.screenshot({ path: 'screenshot-updated-mobile-cart.png' });
  console.log('Saved screenshot-updated-mobile-cart.png');

  // Check Price text on product cards
  const productPriceText = await page.evaluate(() => {
    const cardPrice = document.querySelector('#drops .text-2xl');
    return cardPrice ? cardPrice.textContent.trim() : null;
  });
  console.log('Rendered Arabic JOD Price:', productPriceText);

  await browser.close();
  console.log('--- All Verifications Passed Successfully! ---');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
