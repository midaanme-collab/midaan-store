/**
 * Comprehensive Automated Tests for CORS Protection, Rate Limiting & Origin Validation
 * Cloudflare Worker Backend — Midaan Collective
 */

import worker, {
  isAllowedOrigin,
  getCorsHeaders,
  isRateLimited,
  resetRateLimitMap,
  Env,
} from '../worker/index';

const mockEnv: Env = {
  ASSETS: {
    fetch: jest.fn().mockImplementation(async () => new Response('Asset Content', { status: 200 })),
  },
};

describe('1. CORS Origin Allowlist Validation (isAllowedOrigin)', () => {
  const allowedTestCases = [
    'https://midaan.store',
    'https://www.midaan.store',
    'https://midaan-store.pages.dev',
    'https://preview-123.midaan-store.pages.dev',
    'https://cultural-store-expansion.midaan-store.pages.dev',
    'https://midaan-store.subdomain.workers.dev', // Scoped strictly to midaan-store
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8787',
    'http://127.0.0.1:8787',
  ];

  test.each(allowedTestCases)('allows legitimate Midaan origin: %s', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(true);
  });

  const disallowedTestCases = [
    'https://other-worker.subdomain.workers.dev', // Broad workers.dev rejected
    'https://unrelated-worker.workers.dev',
    'https://other-project.pages.dev',           // Broad pages.dev rejected
    'https://malicious.com',
    'https://evil-hacker.com',
    'https://midaan.store.attacker.com',
    'https://midaan-store.pages.dev.malicious.net',
    'http://midaan.store',                       // Insecure HTTP for production domain
    'http://www.midaan.store',
    'https://phishing-midaan.com',
    'null',                                      // String 'null' (sandboxed iframe)
    '',
    null as unknown as string,
    undefined as unknown as string,
  ];

  test.each(disallowedTestCases)('rejects unauthorized, forged, or broad origin: %s', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(false);
  });
});

describe('2. CORS Headers Generator (getCorsHeaders)', () => {
  test('generates compliant headers for allowed origin', () => {
    const origin = 'https://midaan.store';
    const headers = getCorsHeaders(origin);

    expect(headers['Access-Control-Allow-Origin']).toBe('https://midaan.store');
    expect(headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type');
    expect(headers['Access-Control-Max-Age']).toBe('86400');
    expect(headers['Vary']).toBe('Origin');
  });
});

describe('3. Worker CORS Preflight (OPTIONS /api/shipping/quote)', () => {
  test('returns 204 with explicit CORS headers for authorized production origin', async () => {
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://midaan.store',
        'Access-Control-Request-Method': 'POST',
      },
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://midaan.store');
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
    expect(res.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    expect(res.headers.get('Vary')).toBe('Origin');
  });

  test('returns 204 for Midaan Cloudflare Pages preview deployment', async () => {
    const previewOrigin = 'https://feat-new-look.midaan-store.pages.dev';
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'OPTIONS',
      headers: {
        Origin: previewOrigin,
      },
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(previewOrigin);
  });

  test('returns 403 Forbidden for unauthorized origin preflight', async () => {
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://malicious-website.com',
      },
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('CORS origin not allowed');
  });

  test('returns 403 Forbidden for OPTIONS preflight with no Origin header', async () => {
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'OPTIONS',
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('returns 403 Forbidden for OPTIONS preflight with string null Origin', async () => {
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'OPTIONS',
      headers: {
        Origin: 'null',
      },
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});

describe('4. Worker CORS POST Handling & Origin Review (/api/shipping/quote)', () => {
  beforeEach(() => {
    resetRateLimitMap();
  });

  const validPayload = {
    destination: {
      countryCode: 'JO',
      city: 'Amman',
      governorate: 'Amman',
    },
    items: [
      {
        productId: 'drop-helmet-white',
        productTitle: 'Helmet White Tee',
        size: 'L',
        quantity: 1,
      },
    ],
    currency: 'JOD',
  };

  test('includes explicit Access-Control-Allow-Origin for authorized origin POST', async () => {
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://midaan.store',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://midaan.store');
    expect(res.headers.get('Vary')).toBe('Origin');
    const data = await res.json();
    expect(data.success).toBe(true);
    // Verify no credentials or private information leak in response
    expect(JSON.stringify(data)).not.toContain('ARAMEX_PASSWORD');
    expect(JSON.stringify(data)).not.toContain('ARAMEX_ACCOUNT_PIN');
    expect(data.options).toBeDefined();
    expect(data.options.length).toBeGreaterThan(0);
  });

  test('strictly blocks POST request with unauthorized Origin header (403)', async () => {
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://attacker.com',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('CORS origin not allowed');
  });

  test('allows same-origin / direct server-to-server request without Origin header and omits CORS header', async () => {
    const req = new Request('https://worker.local/api/shipping/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await worker.fetch(req, mockEnv);

    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.options.length).toBeGreaterThan(0);
  });
});

describe('5. In-Memory Rate Limiting Behavior', () => {
  beforeEach(() => {
    resetRateLimitMap();
  });

  test('permits requests within 30 requests per minute threshold', () => {
    const ip = '198.51.100.1';
    const now = 1000000;

    for (let i = 1; i <= 30; i++) {
      expect(isRateLimited(ip, now)).toBe(false);
    }
  });

  test('triggers rate limit on 31st request from same IP', () => {
    const ip = '198.51.100.2';
    const now = 1000000;

    for (let i = 1; i <= 30; i++) {
      isRateLimited(ip, now);
    }

    expect(isRateLimited(ip, now)).toBe(true);
  });

  test('resets rate limit count after 60-second window expires', () => {
    const ip = '198.51.100.3';
    const startTime = 1000000;

    for (let i = 1; i <= 31; i++) {
      isRateLimited(ip, startTime);
    }
    expect(isRateLimited(ip, startTime)).toBe(true);

    // Advance time by 61 seconds
    const afterExpiry = startTime + 61000;
    expect(isRateLimited(ip, afterExpiry)).toBe(false);
  });

  test('tracks different IP addresses independently', () => {
    const ipA = '198.51.100.10';
    const ipB = '198.51.100.20';
    const now = 1000000;

    for (let i = 1; i <= 31; i++) {
      isRateLimited(ipA, now);
    }
    expect(isRateLimited(ipA, now)).toBe(true);

    // IP B should NOT be rate limited
    expect(isRateLimited(ipB, now)).toBe(false);
  });
});
