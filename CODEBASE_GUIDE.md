# Jamm Trade Codebase Guide

This project is a Next.js storefront backed by Shopify commerce.

## Mental Model

- **Next.js on Vercel is the public website.** Pages, layout, navigation, cart UI,
  SEO metadata, and policy page presentation live in this repo.
- **Shopify is the commerce backend.** Product data, variants, inventory status,
  policies, cart creation, checkout, payments, orders, and shipping settings live
  in Shopify.
- **Checkout is the handoff point.** The app creates or syncs a Shopify cart,
  stores the returned checkout URL, then sends the customer to Shopify checkout.

## Important Folders

| Path | Purpose |
|---|---|
| `app/` | Next.js App Router pages, API routes, sitemap, robots, and layout. |
| `components/` | Reusable UI blocks split by domain: layout, product, shop, legal, hero, and UI primitives. |
| `lib/` | Shared business logic, Shopify API boundary, cart helpers, site constants, and utilities. |
| `data/` | Local fallback/demo product and collection data used when Shopify is unavailable. |
| `types/` | Shared TypeScript contracts, especially the normalized `JammProduct` shape. |
| `scripts/` | Manual Shopify/Admin maintenance scripts. These are not part of normal page rendering. |
| `_theme_check/` | Shopify theme assets kept for reference/testing only. The public site should stay on Next.js. |
| `public/` | Static images and brand assets served by Next.js. |

## Main Runtime Flow

1. A page calls helpers from `lib/products.ts`.
2. `lib/products.ts` delegates to Shopify helpers in `lib/shopify.ts`.
3. `lib/shopify.ts` calls the Shopify Storefront API and maps Shopify responses
   into the stable `JammProduct` type.
4. Components render `JammProduct` without needing to know Shopify's raw schema.
5. Cart UI writes a lightweight local cart and calls `/api/shopify/cart`.
6. `/api/shopify/cart` creates or syncs a Shopify cart and returns a checkout URL.

## Files To Know First

| File | Why it matters |
|---|---|
| `lib/site.ts` | Central brand/domain config for metadata, sitemap, robots, and CORS. |
| `lib/shopify.ts` | The Shopify boundary: fetches data, maps product shape, creates carts. |
| `lib/products.ts` | App-facing product facade used by pages. |
| `lib/cart.ts` | Browser-side cart storage and Shopify cart sync helpers. |
| `app/api/shopify/cart/route.ts` | Server route that keeps Storefront token use server-side. |
| `middleware.ts` | Request guard for CORS, webhook browser blocking, and security headers. |
| `next.config.mjs` | Global security headers and allowed remote image sources. |

## Editing Rules

- Change product facts in Shopify, not in page components.
- Change public presentation in `app/` and `components/`.
- Keep raw Shopify response handling inside `lib/shopify.ts`.
- Keep shared URLs, brand name, and support email in `lib/site.ts`.
- Keep comments short and useful. Prefer names that explain the code before
  adding comments.
- Do not publish Shopify themes unless intentionally moving the public storefront
  away from Vercel/Next.js.

## Verification

Run the production build after code changes:

```bash
npm.cmd run build
```

On Windows PowerShell, `npm.cmd` avoids script execution policy issues.
