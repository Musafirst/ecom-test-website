/**
 * Uploads the Jamm Trade Shopify theme via Admin API.
 *
 * Shopify is intended to stay backend-only for Jamm Trade. The Vercel/Next.js
 * app is the public storefront; Shopify should provide products, cart, orders,
 * policies, and secure checkout. This script therefore uploads themes as
 * unpublished by default and only publishes when explicitly allowed.
 *
 * Setup:
 *   1. Shopify Admin → Settings → Apps → Develop apps → Create app
 *   2. Admin API scopes: write_themes, read_themes
 *   3. Install app and copy the Admin API access token
 *   4. Run: SHOPIFY_ADMIN_TOKEN=<token> node scripts/deploy-shopify-theme.mjs
 *
 * Optional:
 *   Set PUBLISH_SHOPIFY_THEME=true only if you intentionally want Shopify to
 *   become the public storefront for its attached sales channel/domain.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const STORE  = process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com'
const TOKEN  = process.env.SHOPIFY_ADMIN_TOKEN
const SHOULD_PUBLISH = process.env.PUBLISH_SHOPIFY_THEME === 'true'

if (!TOKEN) {
  console.error('Error: set SHOPIFY_ADMIN_TOKEN=<token> before running.')
  process.exit(1)
}

const BASE_URL = `https://${STORE}/admin/api/2024-01`

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
      ...(options.headers ?? {}),
    },
  })
  const json = await res.json()
  if (!res.ok) {
    console.error('Shopify API error:', JSON.stringify(json, null, 2))
    process.exit(1)
  }
  return json
}

// ── 1. Read and base64-encode the zip ─────────────────────────────────────
const zipPath = resolve(ROOT, 'jammtrade-shopify-theme-v3-shopify-upload.zip')
const zipBase64 = readFileSync(zipPath).toString('base64')
console.log('📦 Theme zip loaded:', zipPath)

// ── 2. Upload as a new theme ───────────────────────────────────────────────
console.log('⬆️  Uploading theme to Shopify...')
const { theme } = await api('/themes.json', {
  method: 'POST',
  body: JSON.stringify({
    theme: {
      name: `Jamm Trade v3 — ${new Date().toISOString().slice(0, 10)}`,
      src: `data:application/zip;base64,${zipBase64}`,
      role: 'unpublished',
    },
  }),
})
console.log(`✅ Theme uploaded — ID: ${theme.id}, name: "${theme.name}"`)

// ── 3. Wait for Shopify to process the theme ──────────────────────────────
console.log('⏳ Waiting for theme to finish processing...')
let ready = false
for (let i = 0; i < 20; i++) {
  await new Promise(r => setTimeout(r, 3000))
  const { theme: t } = await api(`/themes/${theme.id}.json`)
  if (t.processing === false) { ready = true; break }
  process.stdout.write('.')
}
if (!ready) {
  console.error('\n❌ Theme took too long to process. Check Shopify Admin manually.')
  process.exit(1)
}
console.log('\n✅ Theme processed.')

// ── 4. Publish only when explicitly requested ──────────────────────────────
if (!SHOULD_PUBLISH) {
  console.log('Theme upload complete. It remains unpublished so Vercel/Next.js stays the public storefront.')
  console.log('To publish intentionally, rerun with PUBLISH_SHOPIFY_THEME=true.')
  process.exit(0)
}

console.log('Publishing theme because PUBLISH_SHOPIFY_THEME=true...')
await api(`/themes/${theme.id}.json`, {
  method: 'PUT',
  body: JSON.stringify({ theme: { id: theme.id, role: 'main' } }),
})
console.log('Theme published.')
console.log(`   https://${STORE}`)
