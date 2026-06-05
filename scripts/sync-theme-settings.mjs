/**
 * Pulls social media URLs (and other theme settings) from the live Shopify theme
 * and merges them into shopify-theme/config/settings_data.json so the Next.js
 * storefront can read them via lib/socialLinks.ts.
 *
 * Setup:
 *   1. Shopify Admin → Settings → Apps → Develop apps → Create app
 *   2. Admin API scopes: read_themes
 *   3. Install app and copy the Admin API access token
 *   4. Run:
 *      SHOPIFY_ADMIN_TOKEN=<token> node scripts/sync-theme-settings.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const STORE = process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com'
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

if (!TOKEN) {
  console.error('Error: set SHOPIFY_ADMIN_TOKEN=<token> before running.')
  console.error('  Shopify Admin → Settings → Apps → Develop apps → read_themes scope')
  process.exit(1)
}

const API = `https://${STORE}/admin/api/2024-01`

async function shopifyGet(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shopify API ${res.status}: ${text}`)
  }
  return res.json()
}

// Get the published (main) theme
const { themes } = await shopifyGet('/themes.json?role=main')
if (!themes?.length) {
  console.error('No published theme found.')
  process.exit(1)
}
const theme = themes[0]
console.log(`Found active theme: "${theme.name}" (id ${theme.id})`)

// Fetch settings_data.json from that theme
const { asset } = await shopifyGet(
  `/themes/${theme.id}/assets.json?asset[key]=config/settings_data.json`
)
if (!asset?.value) {
  console.error('Could not read config/settings_data.json from Shopify theme.')
  process.exit(1)
}

const remoteSettings = JSON.parse(asset.value)
const remoteCurrent = remoteSettings?.current ?? {}

// Fields to sync (extend this list if you add more settings later)
const SOCIAL_FIELDS = ['instagram', 'tiktok', 'facebook', 'x_twitter', 'youtube']

const localPath = resolve(ROOT, 'shopify-theme/config/settings_data.json')
const local = JSON.parse(readFileSync(localPath, 'utf8'))

let changed = 0
for (const field of SOCIAL_FIELDS) {
  const remoteValue = remoteCurrent[field]?.trim() || undefined
  const localValue = local.current?.[field]?.trim() || undefined

  if (remoteValue && remoteValue !== localValue) {
    local.current[field] = remoteValue
    console.log(`  ${field}: ${remoteValue}`)
    changed++
  } else if (!remoteValue && localValue) {
    delete local.current[field]
    console.log(`  ${field}: (removed — cleared in Shopify)`)
    changed++
  }
}

if (changed === 0) {
  console.log('Already in sync — no changes needed.')
} else {
  writeFileSync(localPath, JSON.stringify(local, null, 2) + '\n')
  console.log(`\nWrote ${changed} change(s) to shopify-theme/config/settings_data.json`)
  console.log('Rebuild or restart Next.js to pick up the changes.')
}
