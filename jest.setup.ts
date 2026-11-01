import '@testing-library/jest-dom';

// Lightweight Web Fetch polyfill for Jest (jsdom environment)
class MockHeaders {
  private map = new Map<string, string>();
  constructor(init?: Record<string, string> | MockHeaders) {
    if (init) {
      if (init instanceof MockHeaders) {
        init.map.forEach((v, k) => this.map.set(k, v));
      } else {
        for (const [k, v] of Object.entries(init)) {
          this.map.set(k.toLowerCase(), v);
        }
      }
    }
  }
  get(key: string): string | null {
    return this.map.get(key.toLowerCase()) ?? null;
  }
  set(key: string, value: string): void {
    this.map.set(key.toLowerCase(), value);
  }
}

class MockResponse {
  public body: any;
  public status: number;
  public headers: MockHeaders;

  constructor(body?: any, init?: { status?: number; headers?: Record<string, string> }) {
    this.body = body;
    this.status = init?.status ?? 200;
    this.headers = new MockHeaders(init?.headers);
  }

  async json(): Promise<any> {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body);
    }
    return this.body;
  }

  async text(): Promise<string> {
    if (typeof this.body === 'string') {
      return this.body;
    }
    return JSON.stringify(this.body);
  }
}

class MockRequest {
  public url: string;
  public method: string;
  public headers: MockHeaders;
  private _body: any;

  constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: any }) {
    this.url = url;
    this.method = (init?.method || 'GET').toUpperCase();
    this.headers = new MockHeaders(init?.headers);
    this._body = init?.body;
  }

  async json(): Promise<any> {
    if (typeof this._body === 'string') {
      return JSON.parse(this._body);
    }
    return this._body;
  }
}

if (typeof (global as any).Response === 'undefined') {
  (global as any).Response = MockResponse;
}
if (typeof (global as any).Request === 'undefined') {
  (global as any).Request = MockRequest;
}
if (typeof (global as any).Headers === 'undefined') {
  (global as any).Headers = MockHeaders;
}
if (typeof window !== 'undefined') {
  if (typeof (window as any).Response === 'undefined') (window as any).Response = MockResponse;
  if (typeof (window as any).Request === 'undefined') (window as any).Request = MockRequest;
  if (typeof (window as any).Headers === 'undefined') (window as any).Headers = MockHeaders;
}
