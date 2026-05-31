# Production Readiness Audit Fixes

## Public Storefront

- Centralized the customer support email and public location in `lib/site.ts`.
- Replaced the street address in routine footer/contact UI with `Philadelphia, PA`.
- Kept clothing navigation on the Next.js storefront at `/shop/collection/clothing`.
- Standardized production product failures to `Products are temporarily unavailable.`
- Normalized Shopify-provided policy email addresses to `contact@jammtrade.com`.

## Shopify Theme

- Added editable `support_email` and `public_location` theme settings with the same public defaults.
- Updated footer, mobile menu, contact, Jamm Cargo, and Jamm Fleet templates to use those settings.
- Updated explicit clothing links to return customers to the Next.js storefront.

## Security And Operations

- Kept Storefront API and Supabase service-role credentials server-side.
- Renamed the Supabase secret variable to `SUPABASE_SERVICE_ROLE_KEY`.
- Added bounded input validation for lead capture and cart API routes.
- Added cart line limits, Shopify variant ID validation, and HTTPS checkout URL checks.
- Hardened the optional Shopify Admin OAuth callback with configured client ID and CSRF state values.
- Added `.env.example` placeholders and React 19-compatible type package declarations.
- Migrated the deprecated Next.js middleware convention to `proxy.ts` and restored `npm run lint` as a TypeScript check.
- Upgraded Next.js to `16.2.6`, which removes the high-severity Proxy bypass advisory present in `16.2.5`.

## Merchant Data

- Product JSON-LD emits brand, SKU, GTIN, and MPN only when Shopify provides them.
- Add GTIN, MPN, brand, and product category values in Shopify when they are available. Do not invent identifiers.

## Remaining Advisory

- `npm audit` still reports a moderate PostCSS advisory from `next@16.2.6` because Next bundles `postcss@8.4.31`. The suggested automatic fix is an unsafe downgrade to Next 9, so it was not applied. Recheck after the next patched Next.js release.
