/**
 * Cloudflare Worker Backend for Midaan Collective
 * Routes:
 * - POST /api/shipping/quote (Secure Aramex Rate Calculator)
 * - Static Assets fallback via env.ASSETS.fetch(request)
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

// In-memory sliding window rate limiter (max 30 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 30;
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. API Route: Shipping Quote
    if (url.pathname === '/api/shipping/quote') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method Not Allowed' }),
          {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const clientIp = request.headers.get('cf-connecting-ip') || 'unknown-ip';
      if (isRateLimited(clientIp)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Too many quote requests. Please wait a minute and try again.',
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
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
              headers: { 'Content-Type': 'application/json' },
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
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Malformed JSON payload or server error',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // 2. Static Assets Forwarding
    return env.ASSETS.fetch(request);
  },
};

export default worker;
