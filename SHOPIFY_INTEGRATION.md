# Shopify Backend Commerce Guide

The public storefront is the Vercel/Next.js app in this repository. Shopify is
used as the backend commerce system for product data, inventory availability,
legal policies, cart creation, orders, and secure checkout.

Customers should browse product and collection pages on the Next.js site. They
only leave the site when the app sends them to the Shopify-hosted checkout URL.

## Environment

Set these values in `.env.local` and Vercel:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
```

If either value is missing, development previews fall back to `data/products.ts`.
Production renders a temporary-unavailable state and never exposes demo catalog items.

## Main Files

- `lib/shopifyQueries.ts`: GraphQL queries and mutations. Add Shopify fields here first.
- `lib/shopify.ts`: Storefront API fetcher, Shopify-to-`JammProduct` mapper, collection/category inference, and cart mutations.
- `lib/products.ts`: App-facing product facade. Pages should import product helpers from here, not directly from Shopify.
- `types/product.ts`: Stable product contract used by components.
- `app/api/shopify/cart/route.ts`: Server route that creates or updates a Shopify cart.
- `components/product/ProductPurchasePanel.tsx`: Adds a product to local UI cart and Shopify cart.
- `components/shop/CheckoutCart.tsx`: Renders local cart state and redirects to Shopify checkout when available.

## Product Flow

1. A page calls `getAllProducts`, `getFeaturedProducts`, `getCollectionProducts`, or `getProductByHandle` from `lib/products.ts`.
2. `lib/products.ts` calls Shopify helpers in `lib/shopify.ts`.
3. `lib/shopify.ts` fetches Shopify Storefront API data and maps each product into `JammProduct`.
4. If Shopify is unavailable or returns no products, local demo products from `data/products.ts` are used only outside production.
5. Components render the same `JammProduct` shape in both live and fallback modes.

## Cart Flow

1. `ProductPurchasePanel` writes the selected item to `localStorage` so the cart page updates immediately.
2. If the product has a Shopify `variantId`, it posts to `/api/shopify/cart`.
3. The API route creates a Shopify cart or adds lines to the existing Shopify cart id stored in an httpOnly cookie.
4. The returned Shopify `checkoutUrl` is stored in `localStorage`.
5. `CheckoutCart` sends the customer to Shopify checkout when that URL exists.

## Public Storefront Rules

- Keep `NEXT_PUBLIC_SITE_URL` set to the Vercel/Next.js production domain, such
  as `https://jammtrade.com` or `https://www.jammtrade.com`.
- Keep `SHOPIFY_STORE_DOMAIN` set to the Shopify backend domain, usually the
  permanent `*.myshopify.com` domain. Do not use it as the canonical website URL.
- Do not point the primary public domain away from Vercel unless you want
  Shopify to become the visible website.
- Keep the Shopify theme as a `noindex, follow` fallback. Preview it unpublished
  first; publishing requires `PUBLISH_SHOPIFY_THEME=true` and must not replace
  the Next.js site as the canonical storefront.
- Use Shopify Admin for backend commerce changes: products, variants, stock,
  shipping rates, taxes, payments, policies, and orders.
- Use this repo for public website changes: layout, navigation, SEO, product
  pages, collections, cart UI, and legal page presentation.

## Common Bug Checks

- Build logs show `401 Unauthorized`: confirm `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is a Storefront API token for this exact shop, not an Admin API token, and that the Storefront API sales channel/app is enabled.
- Product missing from a collection: check the Shopify collection handle/title, product type, and tags. Mapping rules live in `getProductCollection`, `getCategory`, and `getSubcategory` in `lib/shopify.ts`.
- Product page says out of stock: check selected variant availability in Shopify. Exact stock counts require the `unauthenticated_read_product_inventory` Storefront API scope; this app only uses `availableForSale` by default.
- Add to cart works locally but not in Shopify: confirm the product has variants and the mapped `variantId` is present.
- Checkout button does not open Shopify: the Shopify cart API call failed, env
  vars are missing, or the request origin is not included in `proxy.ts`.
- Images fail in production: add the Shopify image hostname to `next.config.mjs` remote image patterns if it is not already allowed.

## Verification

Run:

```bash
npm.cmd run build
```

On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution policy blocks `npm.ps1`.
