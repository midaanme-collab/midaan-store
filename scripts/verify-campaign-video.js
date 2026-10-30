const puppeteer = require('puppeteer');
const path = require('path');

async function verify() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Desktop Verification
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#collab', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Find the collab section
  const collabSection = await page.$('#collab');
  if (collabSection) {
    await collabSection.screenshot({ path: path.join(__dirname, '..', 'screenshot-desktop-collab-video.png') });
    console.log('Saved screenshot-desktop-collab-video.png');
  }

  // 2. Mobile Verification
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#collab', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const mobileSection = await page.$('#collab');
  if (mobileSection) {
    await mobileSection.screenshot({ path: path.join(__dirname, '..', 'screenshot-mobile-collab-video.png') });
    console.log('Saved screenshot-mobile-collab-video.png');
  }

  await browser.close();
  console.log('All verification screenshots captured!');
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
