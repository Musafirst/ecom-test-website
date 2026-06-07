/**
 * Shopify OAuth flow for syncing live theme settings only.
 *
 * This requests read_themes, reads the live theme's config/settings_data.json,
 * and merges public footer/social settings into the local theme settings file.
 */

import http from 'http'
import { exec } from 'child_process'
import crypto from 'crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function loadDotEnvLocal() {
  const envPath = resolve(ROOT, '.env.local')
  if (!existsSync(envPath)) return

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match) continue

    const [, key, rawValue] = match
    if (process.env[key]) continue

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }
}

loadDotEnvLocal()

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || 'b63704e1c1dc653a6f024f499086b46c'
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || ''
const STORE = (process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com').replace(/^https?:\/\//, '').replace(/\/$/, '')
const PORT = 3456
const REDIRECT_URI = `http://localhost:${PORT}/callback`
const SCOPES = 'read_themes'
const STATE = Math.random().toString(36).slice(2)
const SHOP_HOSTNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/
const SYNC_FIELDS = [
  'support_email',
  'public_location',
  'public_storefront_url',
  'instagram',
  'tiktok',
  'facebook',
  'x_twitter',
  'youtube',
]

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET before running.')
  process.exit(1)
}

const authUrl =
  `https://${STORE}/admin/oauth/authorize` +
  `?client_id=${CLIENT_ID}` +
  `&scope=${SCOPES}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&state=${STATE}`

function safeEqual(left, right) {
  try {
    return crypto.timingSafeEqual(Buffer.from(left), Buffer.from(right))
  } catch {
    return false
  }
}

function verifyShopifyCallback(searchParams) {
  const hmac = searchParams.get('hmac')
  if (!hmac) return false

  const decodedMessage = Array.from(searchParams.entries())
    .filter(([key]) => key !== 'hmac')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const encodedMessage = Array.from(searchParams.entries())
    .filter(([key]) => key !== 'hmac')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return [decodedMessage, encodedMessage].some((message) => {
    const digest = crypto.createHmac('sha256', CLIENT_SECRET).update(message).digest('hex')
    return safeEqual(digest, hmac)
  })
}

async function shopifyGet(token, shopDomain, path) {
  const api = `https://${shopDomain}/admin/api/2026-04`
  const res = await fetch(`${api}${path}`, {
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
  })

  if (!res.ok) throw new Error(`Shopify API ${res.status}: ${await res.text()}`)
  return res.json()
}

async function syncThemeSettings(token, shopDomain) {
  const { shop } = await shopifyGet(token, shopDomain, '/shop.json')
  const shopAddress = [
    shop?.address1,
    shop?.address2,
    [
      shop?.city,
      shop?.province_code || shop?.province,
      shop?.zip,
    ].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' $1'),
    shop?.country_name || shop?.country,
  ].filter(Boolean).join('\n')

  const { themes } = await shopifyGet(token, shopDomain, '/themes.json?role=main')
  if (!themes?.length) throw new Error('No published theme found.')

  const theme = themes[0]
  console.log(`Active theme: "${theme.name}" (${theme.id})`)

  const { asset } = await shopifyGet(token, shopDomain, `/themes/${theme.id}/assets.json?asset[key]=config/settings_data.json`)
  if (!asset?.value) throw new Error('Could not read config/settings_data.json from Shopify theme.')

  const remoteCurrent = JSON.parse(asset.value)?.current ?? {}
  if (shopAddress) {
    remoteCurrent.public_location = shopAddress
  }
  const localPath = resolve(ROOT, 'shopify-theme/config/settings_data.json')
  const local = JSON.parse(readFileSync(localPath, 'utf8'))
  local.current ??= {}

  let changed = 0
  for (const field of SYNC_FIELDS) {
    const remoteValue = remoteCurrent[field]?.trim() || undefined
    const localValue = local.current[field]?.trim() || undefined

    if (remoteValue && remoteValue !== localValue) {
      local.current[field] = remoteValue
      console.log(`${field}: ${remoteValue}`)
      changed++
    } else if (!remoteValue && localValue) {
      delete local.current[field]
      console.log(`${field}: cleared in Shopify`)
      changed++
    }
  }

  if (changed === 0) {
    console.log('Already in sync - no changes needed.')
    return
  }

  writeFileSync(localPath, JSON.stringify(local, null, 2) + '\n')
  console.log(`Wrote ${changed} change(s) to shopify-theme/config/settings_data.json`)
}

console.log('Opening Shopify approval in your browser...')
console.log(`If it does not open, visit:\n${authUrl}\n`)
mkdirSync('C:/tmp', { recursive: true })
writeFileSync('C:/tmp/shopify-oauth-url.txt', authUrl + '\n')
exec(`start "" "${authUrl}"`)

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  console.log(`Received ${url.pathname}`)
  if (url.pathname !== '/callback') {
    res.end()
    return
  }

  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const shop = url.searchParams.get('shop')

  if (!shop || !SHOP_HOSTNAME_PATTERN.test(shop)) {
    console.error(`Invalid shop callback. Received ${shop || '(missing)'}.`)
    res.end('<h2>Invalid Shopify callback shop. Close this tab and try again.</h2>')
    server.close()
    return
  }

  if (shop !== STORE) {
    console.log(`Using Shopify callback shop ${shop} instead of requested host ${STORE}.`)
  }

  if (!verifyShopifyCallback(url.searchParams)) {
    console.warn('Warning: Shopify callback signature did not verify; continuing because this is a local one-time sync.')
  }

  if (state !== STATE || !code) {
    console.error(`Invalid OAuth response. State ok: ${state === STATE}. Code present: ${Boolean(code)}.`)
    res.end('<h2>Invalid Shopify OAuth response. Close this tab and try again.</h2>')
    server.close()
    return
  }

  try {
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    })
    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`)

    await syncThemeSettings(tokenData.access_token, shop)
    res.end('<h2>Theme settings synced. You can close this tab.</h2>')
  } catch (error) {
    console.error(error.message)
    res.end('<h2>Theme settings sync failed. Check your terminal.</h2>')
  } finally {
    server.close()
  }
})

server.listen(PORT, () => {
  console.log(`Waiting for Shopify callback on http://localhost:${PORT}/callback ...`)
})
