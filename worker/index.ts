/**
 * Cloudflare Worker Backend for Midaan Collective
 * Routes:
 * - POST /api/shipping/quote (Secure Aramex Rate Calculator)
 * - Static Assets fallback via env.ASSETS.fetch(request)
 *
 * Security Architecture & Threat Model:
 * 1. CORS is a browser-enforced origin isolation policy, NOT API authentication.
 *    Non-browser clients (curl, bots) can spoof or omit Origin headers.
 * 2. Unauthenticated public quote endpoint is protected by Defense-in-Depth:
 *    - Strict CORS Origin Allowlist (blocks cross-site script access from untrusted web domains).
 *    - Schema & Payload Sanitization (rejects malformed, oversized, or unauthorized destinations).
 *    - In-Memory Sliding-Window Rate Limiter (dampens per-isolate bursts at zero cost).
 *    - Zero-PII Response & Logging Policy (never returns or logs credentials, tokens, or customer PII).
 *    - Cloudflare WAF Edge Rate Limiting (recommended at edge proxy layer).
 */

import {
  AramexEnv,
  hasLiveAramexCredentials,
  validateShippingQuoteRequest,
  calculateLiveAramexRate,
  calculateMockAramexRate,
} from './aramex';

export interface Env extends AramexEnv {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

/**
 * Strict Origin Allowlist for Midaan Collective
 * Scoped strictly to:
 * - Verified Production Domains: https://midaan.store, https://www.midaan.store
 * - Midaan Cloudflare Pages Production & Branch Previews: *.midaan-store.pages.dev
 * - Midaan Cloudflare Workers Dev Domain: midaan-store.*.workers.dev
 * - Local Development Environments: localhost:3000, 127.0.0.1:3000, localhost:8787, 127.0.0.1:8787
 *
 * Note: Broad wildcards (*.workers.dev or *.pages.dev) are explicitly disallowed
 * to prevent unauthorized third-party projects from accessing the API.
 */
export const ALLOWED_ORIGIN_PATTERNS: (string | RegExp)[] = [
  'https://midaan.store',
  'https://www.midaan.store',
  'https://midaan-store.pages.dev',
  /^https:\/\/[a-z0-9\-]+\.midaan-store\.pages\.dev$/,
  /^https:\/\/midaan-store\.[a-z0-9\-]+\.workers\.dev$/,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8787',
  'http://127.0.0.1:8787',
];

/**
 * Validate incoming origin against strict allowlist.
 * Explicitly rejects null, undefined, empty strings, and string "null".
 */
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin || typeof origin !== 'string') {
    return false;
  }
  const normalized = origin.trim().toLowerCase();
  if (normalized === 'null' || normalized === '') {
    return false;
  }
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => {
    if (typeof pattern === 'string') {
      return normalized === pattern.toLowerCase();
    }
    return pattern.test(normalized);
  });
}

/**
 * Build standard CORS headers for an allowed origin
 */
export function getCorsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

// In-memory sliding window rate limiter (max 30 requests per minute per IP per isolate)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(ip: string, now: number = Date.now()): boolean {
  // Evict expired entries if map grows large to maintain bounded memory footprint
  if (rateLimitMap.size > 500) {
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 30;
}

export function resetRateLimitMap(): void {
  rateLimitMap.clear();
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. API Route: Shipping Quote
    if (url.pathname === '/api/shipping/quote') {
      const origin = request.headers.get('Origin');

      // Preflight OPTIONS Handler
      if (request.method === 'OPTIONS') {
        if (!origin || !isAllowedOrigin(origin)) {
          return new Response(
            JSON.stringify({ success: false, error: 'CORS origin not allowed' }),
            {
              status: 403,
              headers: {
                'Content-Type': 'application/json',
                'Vary': 'Origin',
              },
            }
          );
        }

        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(origin),
        });
      }

      // Method Enforcement
      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method Not Allowed' }),
          {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Strict Origin Enforcement for cross-origin requests
      if (origin && !isAllowedOrigin(origin)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'CORS origin not allowed',
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'Vary': 'Origin',
            },
          }
        );
      }

      // Base Response Headers
      const responseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Vary': 'Origin',
      };

      if (origin && isAllowedOrigin(origin)) {
        Object.assign(responseHeaders, getCorsHeaders(origin));
      }

      // Rate Limiting Check (Client IP)
      const clientIp = request.headers.get('cf-connecting-ip') || 'unknown-ip';
      if (isRateLimited(clientIp)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Too many quote requests. Please wait a minute and try again.',
          }),
          {
            status: 429,
            headers: responseHeaders,
          }
        );
      }

      try {
        const body = await request.json();
        const validation = validateShippingQuoteRequest(body);

        if (!validation.valid || !validation.sanitized) {
          return new Response(
            JSON.stringify({
              success: false,
              error: validation.error || 'Invalid request',
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        const validReq = validation.sanitized;

        // Zero-PII Sanitized Operational Log
        console.log(
          `[ShippingQuote] Dest: ${validReq.destination.countryCode}/${validReq.destination.city} | Items: ${validReq.items.reduce((sum, i) => sum + i.quantity, 0)} | Currency: ${validReq.currency}`
        );

        let quoteResponse;
        if (hasLiveAramexCredentials(env)) {
          quoteResponse = await calculateLiveAramexRate(validReq, env);
        } else {
          quoteResponse = calculateMockAramexRate(validReq);
        }

        return new Response(JSON.stringify(quoteResponse), {
          status: quoteResponse.success ? 200 : 422,
          headers: responseHeaders,
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Malformed JSON payload or server error',
          }),
          {
            status: 400,
            headers: responseHeaders,
          }
        );
      }
    }

    // 2. Static Assets Forwarding
    return env.ASSETS.fetch(request);
  },
};

export default worker;
