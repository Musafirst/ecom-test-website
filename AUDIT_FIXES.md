# Production Readiness Audit Fixes

## Public Storefront

- Centralized the customer support email and public location in `lib/site.ts`.
- Replaced the street address in routine footer/contact UI with `Philadelphia, PA`.
- Kept clothing navigation on the Next.js storefront at `/shop/collection/clothing`.
- Standardized production product failures to `Products are temporarily unavailable.`
- Normalized Shopify-provided policy email addresses to `contact@jammtrade.com`.
- Replaced unverified free-shipping and first-order promotion banner claims with factual checkout wording.
- Disabled the welcome discount popup unless matching Shopify promotion environment variables are explicitly configured.

## Shopify Theme

- Added editable `support_email`, `public_location`, and `public_storefront_url` theme settings with the same public defaults.
- Marked the Shopify fallback theme `noindex, follow` so Google treats the Next.js storefront as canonical.
- Routed Shopify theme navigation, collection cards, product cards, search results, services, contact, policies, and cart continuation links back to the Next.js storefront.
- Updated footer, mobile menu, contact, Jamm Cargo, and Jamm Fleet templates to use those settings.
- Kept Shopify-native add-to-cart, cart, and checkout actions on Shopify.
- Replaced the brittle browser-side featured-products API request with server-rendered Liquid cards and a catalog fallback.
- Removed the hardcoded Storefront token and outdated `2024-01` Storefront API request from the Shopify theme.
- Added intrinsic image dimensions and current `image_url` filters across the active theme.
- Published the validated Shopify fallback theme on June 1, 2026 after checking it as an unpublished preview.

## Security And Operations

- Kept Storefront API and Supabase service-role credentials server-side.
- Renamed the Supabase secret variable to `SUPABASE_SERVICE_ROLE_KEY`.
- Added bounded input validation for lead capture and cart API routes.
- Added cart line limits, Shopify variant ID validation, and HTTPS checkout URL checks.
- Hardened the optional Shopify Admin OAuth callback with configured client ID and CSRF state values.
- Added signed callback and shop-hostname verification to both Shopify OAuth maintenance paths.
- Updated Shopify Storefront and Admin API endpoints to the supported `2026-04` version.
- Fixed policy maintenance scripts to use Shopify's supported singular `shopPolicyUpdate` mutation and `write_legal_policies` scope.
- Added `.env.example` placeholders and React 19-compatible type package declarations.
- Migrated the deprecated Next.js middleware convention to `proxy.ts` and restored `npm run lint` as a TypeScript check.
- Upgraded Next.js to `16.2.6`, which removes the high-severity Proxy bypass advisory present in `16.2.5`.
- Limited Next.js static-generation concurrency to two workers so production builds remain reliable on memory-constrained machines.

## Merchant Data

- Product JSON-LD emits brand, SKU, GTIN, and MPN only when Shopify provides them.
- Add GTIN, MPN, brand, and product category values in Shopify when they are available. Do not invent identifiers.

## Remaining Advisory

- `npm audit` still reports a moderate PostCSS advisory from `next@16.2.6` because Next bundles `postcss@8.4.31`. The suggested automatic fix is an unsafe downgrade to Next 9, so it was not applied. Recheck after the next patched Next.js release.

## Remaining Live Follow-Up

The Shopify fallback theme is live. The remaining deployment and Shopify Admin
actions are:

1. Redeploy the Next.js storefront so the public footer and clothing navigation use the cleaned local source.
2. Run `scripts/update-shopify-policies.mjs` with a temporary Admin API token that has `write_legal_policies`, then verify Shopify Admin policies. The rendered live checkout privacy policy still displayed `musa@jammtrade.com` during the June 1, 2026 verification.
