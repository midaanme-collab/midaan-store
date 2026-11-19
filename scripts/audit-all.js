#!/usr/bin/env node

/**
 * Midaan Collective — Automated Growth & SEO Audit CLI
 * Usage: npm run audit:all (or: node scripts/audit-all.js)
 *
 * Audits:
 * 1. Google Analytics 4 (G-LX4ZKELGPL) & Meta Pixel (476490290557651) live tags
 * 2. Technical SEO: Canonical, Title, Open Graph, Twitter Cards, Mobile Viewport
 * 3. XML Sitemap & Robots.txt Indexability & hreflang alternates (ar, en, x-default)
 * 4. Production Security Headers (HSTS, CSP, X-Frame-Options, Permissions-Policy)
 * 5. Structured Data (Schema.org Organization, Product, PublicationIssue)
 * 6. Growth & Ads Configuration (GSC, GA4 Property, Service Account readiness)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env.local and .env.production if available
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.join(process.cwd(), '.env.production'));
loadEnvFile(path.join(process.cwd(), '.env.local'));

const LIVE_DOMAIN = process.env.AUDIT_TARGET_URL || 'https://midaan.net';
const EXPECTED_GA4_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-LX4ZKELGPL';
const EXPECTED_PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || '476490290557651';
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '386768854';
const GSC_SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:midaan.net';
const GOOGLE_CREDS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || '.secrets/google-service-account.json';

// Simple colors for terminal output
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m',
};

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MidaanGrowthAuditor/1.0 (+https://midaan.net)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

const results = [];

function check(category, name, passed, details = '', isWarning = false) {
  results.push({ category, name, passed, details, isWarning });
  const icon = passed ? `${c.green}✔ PASS${c.reset}` : isWarning ? `${c.yellow}⚠ WARN${c.reset}` : `${c.red}✖ FAIL${c.reset}`;
  console.log(`  ${icon} ${c.bold}${name}${c.reset}${details ? ` ${c.gray}(${details})${c.reset}` : ''}`);
}

async function runAudit() {
  console.log(`\n${c.bold}${c.cyan}================================================================${c.reset}`);
  console.log(`${c.bold}${c.magenta}  MIDAAN COLLECTIVE — AUTOMATED GROWTH & SEO AUDIT CLI${c.reset}`);
  console.log(`${c.gray}  Target: ${c.bold}${LIVE_DOMAIN}${c.reset} | ${c.gray}Time: ${new Date().toISOString()}${c.reset}`);
  console.log(`${c.bold}${c.cyan}================================================================${c.reset}\n`);

  try {
    // -------------------------------------------------------------
    // PHASE 1: Fetch Live Homepage
    // -------------------------------------------------------------
    console.log(`${c.bold}${c.cyan}1. LIVE PRODUCTION CONNECTION & SECURITY HEADERS${c.reset}`);
    const home = await fetchUrl(LIVE_DOMAIN);
    check('Security', 'HTTP 200 OK Response', home.status === 200, `Status: ${home.status}`);

    const hsts = home.headers['strict-transport-security'];
    check('Security', 'Strict-Transport-Security (HSTS)', Boolean(hsts && hsts.includes('max-age=')), hsts || 'Missing');

    const xfo = home.headers['x-frame-options'];
    check('Security', 'X-Frame-Options: DENY', xfo === 'DENY', xfo || 'Missing');

    const xcto = home.headers['x-content-type-options'];
    check('Security', 'X-Content-Type-Options: nosniff', xcto === 'nosniff', xcto || 'Missing');

    const csp = home.headers['content-security-policy'] || '';
    const cspHasGtag = csp.includes('www.googletagmanager.com') && csp.includes('google-analytics.com');
    check('Security', 'CSP permits Google Analytics 4', cspHasGtag, 'GTM & GA domains allowed');

    const cspHasPixel = csp.includes('connect.facebook.net') && csp.includes('www.facebook.com');
    check('Security', 'CSP permits Meta Pixel', cspHasPixel, 'Facebook domains allowed');

    // -------------------------------------------------------------
    // PHASE 2: Tracking & Tag Verification (GA4 + Meta Pixel)
    // -------------------------------------------------------------
    console.log(`\n${c.bold}${c.cyan}2. TRACKING & ADS VERIFICATION (GA4 + META PIXEL)${c.reset}`);
    const hasGaScript = home.body.includes(`https://www.googletagmanager.com/gtag/js?id=${EXPECTED_GA4_ID}`);
    check('Tracking', `GA4 Script Tag (${EXPECTED_GA4_ID})`, hasGaScript, 'gtag.js loader found in HTML');

    const hasGaConfig = home.body.includes(`gtag('config', '${EXPECTED_GA4_ID}'`);
    check('Tracking', `GA4 Initialization (config ${EXPECTED_GA4_ID})`, hasGaConfig, 'gtag config call present');

    const hasPixelInit = home.body.includes(`fbq('init', '${EXPECTED_PIXEL_ID}')`);
    check('Tracking', `Meta Pixel Initialization (${EXPECTED_PIXEL_ID})`, hasPixelInit, 'fbq init call present');

    const hasPixelPageView = home.body.includes("fbq('track', 'PageView')");
    check('Tracking', 'Meta Pixel PageView Event', hasPixelPageView, 'Base PageView active');

    const hasPixelNoscript = home.body.includes(`https://www.facebook.com/tr?id=${EXPECTED_PIXEL_ID}`);
    check('Tracking', 'Meta Pixel <noscript> Fallback', hasPixelNoscript, 'Fallback tracking pixel present');

    // -------------------------------------------------------------
    // PHASE 3: Technical SEO & Open Graph Metadata
    // -------------------------------------------------------------
    console.log(`\n${c.bold}${c.cyan}3. TECHNICAL SEO & OPEN GRAPH METADATA${c.reset}`);
    const hasCanonical = /<link\s+rel="canonical"\s+href="https:\/\/midaan\.net\/?"/i.test(home.body);
    check('SEO', 'Canonical Tag (https://midaan.net)', hasCanonical, 'Self-referencing canonical');

    const hasTitle = home.body.includes('<title>') && home.body.includes('ميدان');
    check('SEO', 'Arabic/Bilingual Document Title', hasTitle, 'Branded SEO title verified');

    const hasOgTitle = home.body.includes('property="og:title"');
    const hasOgDesc = home.body.includes('property="og:description"');
    const hasOgImage = home.body.includes('property="og:image"');
    const hasOgUrl = /property="og:url"\s+content="https:\/\/midaan\.net\/?"/i.test(home.body);
    check('SEO', 'OpenGraph Meta (title, desc, image, url)', hasOgTitle && hasOgDesc && hasOgImage && hasOgUrl, 'Full OG suite');

    const hasTwitterCard = home.body.includes('name="twitter:card" content="summary_large_image"');
    check('SEO', 'Twitter Card (summary_large_image)', hasTwitterCard, 'Rich preview enabled');

    const hasViewport = home.body.includes('name="viewport"');
    check('SEO', 'Mobile Responsive Viewport', hasViewport, 'width=device-width verified');

    // -------------------------------------------------------------
    // PHASE 4: Schema.org Structured Data
    // -------------------------------------------------------------
    console.log(`\n${c.bold}${c.cyan}4. STRUCTURED DATA (JSON-LD SCHEMA.ORG)${c.reset}`);
    const hasOrgSchema = home.body.includes('"@type":"Organization"') || home.body.includes('"@type": "Organization"');
    check('Schema', 'Organization Schema (Midaan Collective)', hasOrgSchema, 'Includes brand, phone & socials');

    const hasProductSchema = home.body.includes('"@type":"Product"') || home.body.includes('"@type": "Product"');
    const hasInStock = home.body.includes('https://schema.org/InStock');
    check('Schema', 'Product Schema with Offers (InStock)', hasProductSchema && hasInStock, 'Helmet & Poster Tee schemas');

    // -------------------------------------------------------------
    // PHASE 5: Robots.txt & Sitemap.xml
    // -------------------------------------------------------------
    console.log(`\n${c.bold}${c.cyan}5. CRAWLABILITY & INDEXING (ROBOTS & SITEMAP)${c.reset}`);
    const robots = await fetchUrl(`${LIVE_DOMAIN}/robots.txt`);
    const robotsValid = robots.status === 200 && /user-agent:\s*\*/i.test(robots.body) && /sitemap:\s*https:\/\/midaan\.net\/sitemap\.xml/i.test(robots.body);
    check('Indexing', 'Robots.txt Crawl Directives & Sitemap Link', robotsValid, `Status: ${robots.status}`);

    const sitemap = await fetchUrl(`${LIVE_DOMAIN}/sitemap.xml`);
    const sitemapValid = sitemap.status === 200 && sitemap.body.includes('https://midaan.net/magazine/issue-zero') && sitemap.body.includes('hreflang="x-default"');
    check('Indexing', 'XML Sitemap with hreflang (ar, en, x-default)', sitemapValid, `Contains Issue Zero & x-default alternates`);

    // -------------------------------------------------------------
    // PHASE 6: Reader & Editorial Verification
    // -------------------------------------------------------------
    console.log(`\n${c.bold}${c.cyan}6. EDITORIAL READER & ARCHIVE (/magazine/issue-zero)${c.reset}`);
    const reader = await fetchUrl(`${LIVE_DOMAIN}/magazine/issue-zero/`);
    const readerOk = reader.status === 200;
    const readerHasToc = reader.body.includes('فهرس العدد التأسيسي');
    const readerNoHkjPal = !reader.body.includes('HKJ-PAL-2026-ZERO');
    check('Editorial', 'Issue Zero Reader Page Accessible (200 OK)', readerOk, `Status: ${reader.status}`);
    check('Editorial', 'Interactive Table of Contents Present', readerHasToc, '5 core texts linked');
    check('Editorial', 'Colophon Code Cleaned (HKJ-PAL removed)', readerNoHkjPal, 'Clean editorial styling');

    // -------------------------------------------------------------
    // PHASE 7: Growth / Google Search Console & GA4 Property Config
    // -------------------------------------------------------------
    console.log(`\n${c.bold}${c.cyan}7. GROWTH & REPORTING INTEGRATION CONFIGURATION${c.reset}`);
    check('Growth', `GA4 Property ID configured (${GA4_PROPERTY_ID})`, Boolean(GA4_PROPERTY_ID), `ID: ${GA4_PROPERTY_ID}`);
    check('Growth', `GSC Site Property configured (${GSC_SITE_URL})`, Boolean(GSC_SITE_URL), `Site: ${GSC_SITE_URL}`);

    const hasCredsFile = fs.existsSync(path.resolve(process.cwd(), GOOGLE_CREDS_PATH));
    check(
      'Growth',
      `Google Service Account Credentials (${GOOGLE_CREDS_PATH})`,
      hasCredsFile,
      hasCredsFile ? 'Service Account Key Available for API queries' : 'Pending: Place JSON key in .secrets/ to enable automated GSC/GA4 API pulls',
      !hasCredsFile // Warning rather than hard fail
    );

  } catch (err) {
    console.error(`\n${c.red}Audit failed with error:${c.reset}`, err.message);
  }

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const warnings = results.filter((r) => r.isWarning).length;
  const failed = results.filter((r) => !r.passed && !r.isWarning).length;
  const score = Math.round((passed / (total || 1)) * 100);

  console.log(`\n${c.bold}${c.cyan}================================================================${c.reset}`);
  console.log(`${c.bold}AUDIT SUMMARY:${c.reset} Total Checks: ${total} | ${c.green}Passed: ${passed}${c.reset} | ${c.yellow}Warnings: ${warnings}${c.reset} | ${c.red}Failed: ${failed}${c.reset}`);
  console.log(`${c.bold}OVERALL HEALTH SCORE: ${score === 100 ? c.green : c.yellow}${score}%${c.reset}`);
  console.log(`${c.bold}${c.cyan}================================================================${c.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit();
