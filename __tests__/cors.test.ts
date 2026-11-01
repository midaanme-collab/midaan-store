/**
 * Comprehensive Automated Tests for CORS Protection & Origin Validation
 * Cloudflare Worker Backend — Midaan Collective
 */

import worker, { isAllowedOrigin, getCorsHeaders, Env } from '../worker/index';

const mockEnv: Env = {
  ASSETS: {
    fetch: jest.fn().mockImplementation(async () => new Response('Asset Content', { status: 200 })),
  },
};

describe('CORS Origin Allowlist Validation (isAllowedOrigin)', () => {
  const allowedTestCases = [
    'https://midaan.store',
    'https://www.midaan.store',
    'https://midaan-store.pages.dev',
    'https://preview-123.midaan-store.pages.dev',
    'https://cultural-store-expansion.midaan-store.pages.dev',
    'https://midaan-store.subdomain.workers.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8787',
    'http://127.0.0.1:8787',
  ];

  test.each(allowedTestCases)('allows legitimate origin: %s', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(true);
  });

  const disallowedTestCases = [
    'https://malicious.com',
    'https://evil-hacker.com',
    'https://midaan.store.attacker.com',
    'https://midaan-store.pages.dev.malicious.net',
    'http://midaan.store', // Insecure HTTP for production domain
    'http://www.midaan.store',
    'https://phishing-midaan.com',
    '',
    null as unknown as string,
    undefined as unknown as string,
  ];

  test.each(disallowedTestCases)('rejects unauthorized or forged origin: %s', (origin) => {
    expect(isAllowedOrigin(origin)).toBe(false);
  });
});

describe('CORS Headers Generator (getCorsHeaders)', () => {
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

describe('Worker CORS Preflight (OPTIONS /api/shipping/quote)', () => {
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

  test('returns 204 for Cloudflare preview deployment origin', async () => {
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
});

describe('Worker CORS POST Handling (/api/shipping/quote)', () => {
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

  test('allows same-origin / server-to-server request without Origin header', async () => {
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
  });
});
