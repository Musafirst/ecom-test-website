# Jamm Trade Shopify Theme

This theme is a commerce fallback for the Jamm Trade Shopify store. The public,
search-indexable storefront is the Next.js site at `https://www.jammtrade.com`.
Shopify remains responsible for products, inventory, cart, checkout, payments,
orders, and official checkout policies.

## Architecture Rules

- Keep the Shopify theme visually consistent with the Next.js storefront.
- Keep `<meta name="robots" content="noindex, follow">` in `layout/theme.liquid`.
- Route product browsing, category links, services, contact, and policy links
  back to the Next.js storefront.
- Keep Shopify-native cart actions and checkout actions on Shopify.
- Do not publish a theme change until the Next.js storefront and Shopify
  checkout policy content have been checked together.

## Shared Settings

Edit these values in Shopify Theme Editor under **Business information**:

| Setting | Production value |
|---|---|
| Customer support email | `contact@jammtrade.com` |
| Public business location | `Darby, Pennsylvania` |
| Canonical Next.js storefront URL | `https://www.jammtrade.com` |

The full return address should appear only where legally or operationally
required. Keep routine footer and contact UI limited to the public location.

## Upload Safely

The preferred route is Shopify CLI:

```bash
shopify theme push --store jamm-trade.myshopify.com --path ./shopify-theme --unpublished
```

Review the unpublished preview first. Publish only after checking navigation,
cart, checkout, contact details, policy links, and the `noindex` meta tag.

The repository also includes `scripts/deploy-shopify-theme.mjs`. It requires an
explicit `SHOPIFY_THEME_ZIP` path to a reviewed archive, uploads an unpublished
theme by default, and publishes only when `PUBLISH_SHOPIFY_THEME=true` is
explicitly set.

## Required Shopify Admin Follow-Up

Theme files cannot change Shopify checkout's official policy records. Run the
policy maintenance script with a temporary Admin API token that has the
`write_legal_policies` scope:

```bash
SHOPIFY_ADMIN_TOKEN=<token> node scripts/update-shopify-policies.mjs
```

Then review **Shopify Admin > Settings > Policies** and confirm that every
customer-facing policy uses `contact@jammtrade.com`.
