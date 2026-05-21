# Jamm Trade — Shopify Theme

A custom Shopify theme that mirrors jammtrade.com's exact visual design.
Built for Dawn architecture compatibility and Shopify Online Store 2.0.

---

## Directory Structure

```
jammtrade-shopify-theme/
├── assets/
│   ├── theme.css          ← All styles (full design system)
│   └── theme.js           ← Slider, menu, ATC, cart, gallery
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   └── theme.liquid       ← Master layout wrapper
├── locales/
│   └── en.default.json
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── hero-slideshow.liquid
│   ├── shop-shortcuts.liquid
│   ├── featured-products.liquid
│   ├── collection-grid.liquid
│   ├── secondary-categories.liquid
│   ├── trust-bar.liquid
│   └── footer.liquid
├── snippets/
│   └── product-card.liquid
└── templates/
    ├── index.liquid        ← Homepage (uses index.json)
    ├── index.json          ← Default section order + content
    ├── collection.liquid
    ├── product.liquid
    └── cart.liquid         ← ✅ Logo links to jammtrade.com, not Shopify
```

---

## How to Import into Shopify

### Option 1 — Shopify CLI (recommended)
```bash
npm install -g @shopify/cli @shopify/theme
shopify theme push --store your-store.myshopify.com --path ./jammtrade-shopify-theme
```

### Option 2 — Zip upload
1. Zip the entire `jammtrade-shopify-theme/` folder
2. Shopify Admin → Online Store → Themes → Add theme → Upload zip file
3. Click "Customize" on the newly uploaded theme

---

## Post-import Setup (required)

### 1. Upload your logo
Themes → Customize → Header section → Upload logo image
Use: `jamm-trade-exact-transparent.webp` from your brand_assets folder

### 2. Upload hero images
Themes → Customize → Hero Slideshow → each slide → upload image
Images are in: `public/images/` (hero-main-commerce.webp, hero-perfumes.webp, etc.)

### 3. Upload collection images
Themes → Customize → Collection Grid → each card → upload image
Use: `public/images/collections/featured-oud.png`, `featured-amber.png`, `featured-daily.png`

### 4. Upload category images
Themes → Customize → Secondary Categories → Clothing → `public/product-images/jamm-hoodie.webp`
Electronics → any electronics product image

### 5. Link collections
Themes → Customize → Featured Products → select your "Perfumes" or all-products collection
Themes → Customize → Collection Grid → link Oud, Amber, Daily collections

### 6. Fix the newsletter
Go to: Shopify Admin → Apps → find an email capture app (Klaviyo, Mailchimp, etc.)
The newsletter form in footer.liquid uses Shopify's native `{% form 'customer' %}` — 
it will work out of the box for customer email capture tied to Shopify's customer list.

### 7. Add social links
Themes → Customize → Footer → Instagram URL / TikTok URL

---

## The Logo-to-Homepage Fix

The root issue you described (logo at checkout going to Shopify storefront instead of jammtrade.com)
is fixed in `templates/cart.liquid`:

```liquid
<!-- cart.liquid line ~11 -->
<a href="{{ routes.root_url }}" ...>
```

`routes.root_url` resolves to your Shopify store's root — which IS jammtrade.com if you have a
custom domain set. Make sure in Shopify Admin → Settings → Domains that jammtrade.com is set as
the PRIMARY domain. Then all `routes.root_url` references point to jammtrade.com automatically.

---

## Collections to Create in Shopify

Create these collections (Online Store → Products → Collections) and tag products accordingly:

| Handle       | Title       | Use for                          |
|-------------|-------------|----------------------------------|
| `oud`       | Oud         | Oud fragrances                   |
| `amber`     | Amber       | Amber fragrances                 |
| `daily`     | Daily       | Daily-wear fragrances            |
| `electronics` | Electronics | Electronics products            |
| `clothing`  | Clothing    | Clothing (coming soon)           |
| `perfumes`  | Perfumes    | All fragrances (for featured section) |

---

## Customization Reference

| Section            | Key Settings                          |
|--------------------|---------------------------------------|
| Header             | Logo image, logo width                |
| Announcement Bar   | Text, show/hide toggle                |
| Hero Slideshow     | Up to 10 slides, each with image/title/CTA |
| Shop Shortcuts     | 6 quick-nav cards, fully editable     |
| Featured Products  | Choose collection, set count (2–12)   |
| Collection Grid    | 3 cards, link to real collections     |
| Secondary Categories | 2 cards for Clothing + Electronics  |
| Trust Bar          | 4 trust items, icon picker, labels    |
| Footer             | Logo, tagline, social links, email    |

---

## Notes

- Fonts: Cormorant Garamond + DM Sans loaded from Google Fonts
- No external JS dependencies — vanilla JS only
- Fully mobile responsive
- Accessibility: proper ARIA labels, focus management, reduced-motion support
- Performance: lazy loading on all non-hero images, minimal CSS (no framework)
