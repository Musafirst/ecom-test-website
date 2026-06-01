# Google Merchant Center Readiness

This storefront is prepared for Google Merchant Center review with public policy pages, footer policy links, product metadata, product JSON-LD, and Shopify checkout integration.

## Storefront Requirements

- Refund Policy: `/shop/refund-policy`
- Shipping Policy: `/shop/shipping-policy`
- Privacy Policy: `/shop/privacy-policy`
- Terms of Service: `/shop/terms-of-service`
- Contact Page: `/shop/contact`
- Product pages: `/shop/product/[handle]`
- Checkout: `/shop/checkout`, with live Shopify checkout URLs created through `/api/shopify/cart`

## Shopify Google & YouTube App Setup

Complete these steps inside Shopify admin:

1. Install the official Google & YouTube sales channel.
2. Connect the correct Google account.
3. Connect or create the Google Merchant Center account for Jamm Trade.
4. Confirm the Merchant Center website URL is `https://www.jammtrade.com`.
5. Let Shopify claim or verify the domain through the Google & YouTube channel.
6. Confirm shipping settings and returns settings in Shopify match the public policy pages.
7. Make all approved products available to the Google & YouTube sales channel.
8. Fill required Google product attributes in Shopify, including product category, brand, GTIN or MPN when available, condition, age group, gender when applicable, and custom product status for items without GTINs.
9. Review Merchant Center diagnostics after the first sync and fix item-level warnings before launching Shopping campaigns.

## Shopify Checkout Logo Link

The local Jamm Trade checkout page logo points to `NEXT_PUBLIC_SITE_URL` and falls back to `https://www.jammtrade.com`.

The hosted Shopify checkout logo/link is controlled in Shopify, not in this Next.js storefront. Keep the customer-facing website on Vercel at `https://www.jammtrade.com`, keep the Shopify fallback subdomain no-indexed, and review Shopify checkout branding and return links so customers return to the canonical website.

## Feed Quality Notes

- Product titles should be clean product names without promotional claims or excessive punctuation.
- Product descriptions should describe the actual item, scent profile or device features, contents, and use case.
- Product images should show the actual product clearly and match the product sold on the page.
- Product prices, availability, and currency should match between Shopify, product pages, checkout, and the Google feed.
- Avoid submitting demo or placeholder products to Google Merchant Center.

## Environment

The checkout API requires:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NEXT_PUBLIC_SITE_URL=https://www.jammtrade.com`
