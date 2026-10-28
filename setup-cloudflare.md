# Cloudflare Pages Static Export Setup

1. **Next.js Compatibility:**
   - The current application relies entirely on client-side state management (Zustand) and static asset delivery (images, PDF).
   - There are no Next.js App Router API routes `app/api/*` in use.
   - Therefore, a pure Static Site Generation (SSG) export via `output: 'export'` is fully compatible with the current architecture.

2. **Required Changes:**
   - Modified `next.config.ts` to include `output: 'export'` and `images: { unoptimized: true }` (because Next.js default image optimization relies on a Node.js runtime).
   - Added `out/` to `.gitignore` to prevent committing build artifacts.

3. **Cloudflare Pages Configuration:**
   To deploy this branch (`feature/cloudflare-pages`) on the free tier, follow these exact steps in the Cloudflare Dashboard:
   
   - Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select your GitHub repository (`midaan-store`).
   - In the **Set up builds and deployments** screen:
     - **Production branch:** Select `feature/cloudflare-pages` (or merge this to `main` and use `main`).
     - **Framework preset:** Select `Next.js (Static HTML Export)`.
     - **Build command:** `npm run build`
     - **Build output directory:** `out`
   - Click **Save and Deploy**.

4. **Testing Performed:**
   - Ran `npm run build` locally which successfully generated the `out/` directory containing `index.html`, `collab.html`, `manifest.json`, and all static assets.
   - Evaluated the `DropShowcase`, `Voice` (PDF viewer), and `Modals` elements which are entirely built as React client components (`'use client'`). They will hydrate correctly on Cloudflare's CDN.
