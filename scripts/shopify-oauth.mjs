/**
 * Shopify OAuth flow — gets an Admin API access token for the Shopify backend
 * then immediately runs the policy update.
 *
 * Run: node scripts/shopify-oauth.mjs
 */

import http from 'http'
import { exec } from 'child_process'
import crypto from 'crypto'

const CLIENT_ID     = process.env.SHOPIFY_CLIENT_ID     || ''
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || ''

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET before running.')
  process.exit(1)
}
const STORE         = (process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com').replace(/^https?:\/\//, '').replace(/\/$/, '')
const SUPPORT_EMAIL = 'contact@jammtrade.com'
const PORT          = 3456
const REDIRECT_URI  = `http://localhost:${PORT}/callback`
const SCOPES        = 'write_legal_policies'
const STATE         = Math.random().toString(36).slice(2)
const SHOP_HOSTNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/

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

  const message = Array.from(searchParams.entries())
    .filter(([key]) => key !== 'hmac')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const digest = crypto.createHmac('sha256', CLIENT_SECRET).update(message).digest('hex')

  return safeEqual(digest, hmac)
}

// ── Policy content (matches jammtrade.com website) ───────────────────────────

const PRIVACY_POLICY = `<p>Jamm Trade respects customer privacy. This policy explains how information is used to operate the storefront, process orders, and support customers.</p>
<h2>Information We Collect</h2>
<p>Jamm Trade may collect contact details, shipping details, billing details, order history, device information, and messages sent to customer support.</p>
<p>Payment information is handled through secure Shopify checkout and payment providers. Jamm Trade does not store full card numbers on this website.</p>
<h2>How Information Is Used</h2>
<p>Customer information is used to process orders, provide shipping updates, prevent fraud, respond to support requests, improve the storefront, and comply with legal obligations.</p>
<h2>Service Providers</h2>
<p>Jamm Trade may share necessary order and site information with Shopify, payment processors, fulfillment providers, carriers, analytics services, and other service providers used to operate the store.</p>
<h2>Customer Choices</h2>
<p>Customers may contact Jamm Trade to request help with privacy questions, order data, or communication preferences. For privacy questions, contact us at ${SUPPORT_EMAIL}.</p>`

const REFUND_POLICY = `<p>Jamm Trade reviews every order with care. This policy explains how returns, refunds, and exchanges are handled for eligible purchases.</p>
<h2>Return Window</h2>
<p>Eligible items may be requested for return within 14 days of delivery. Items must be unused, unopened, in original retail packaging, and in the same condition received.</p>
<p>For fragrance products, the outer seal and packaging must remain intact unless the item arrived damaged or incorrect.</p>
<h2>Non-Returnable Items</h2>
<p>Opened fragrances, used electronics, personal care items, gift cards, final sale items, and products damaged after delivery are not eligible for return.</p>
<h2>Damaged or Incorrect Orders</h2>
<p>If an order arrives damaged, defective, or incorrect, contact Jamm Trade within 48 hours of delivery with the order number and clear photos of the item and packaging. Approved claims may be resolved with a replacement, exchange, or refund depending on inventory and order details.</p>
<h2>Refund Timing</h2>
<p>Approved refunds are issued to the original payment method after the returned item is received and inspected. Bank or card processing times may vary.</p>
<p>To start a return, contact us at ${SUPPORT_EMAIL} with your order number.</p>`

const SHIPPING_POLICY = `<p>Jamm Trade ships eligible orders with tracked delivery and careful packaging for fragrances, electronics, and curated essentials.</p>
<h2>Processing Time</h2>
<p>Orders are typically processed within 1 to 3 business days after payment is confirmed, excluding weekends and holidays.</p>
<h2>Shipping Rates and Delivery</h2>
<p>Shipping rates, available methods, estimated delivery dates, taxes, and duties are calculated at secure Shopify checkout before payment is completed.</p>
<p>Estimated delivery times: United States 3–7 business days; international 7–21 business days depending on destination.</p>
<h2>Tracking</h2>
<p>When tracking is available, customers receive shipment details by email after the order has been fulfilled.</p>
<h2>Address Accuracy</h2>
<p>Customers are responsible for entering a complete and accurate shipping address. Orders returned due to incorrect addresses may require additional shipping fees for reshipment.</p>
<h2>Damaged Items</h2>
<p>If your order arrives damaged, please contact us within 48 hours of delivery at ${SUPPORT_EMAIL} with photos of the damage and your order number.</p>`

const TERMS_OF_SERVICE = `<p>These terms govern use of the Jamm Trade storefront and purchases made through secure Shopify checkout.</p>
<h2>Store Use</h2>
<p>By using this website, you agree to provide accurate account, contact, billing, and shipping information when placing an order. Jamm Trade may refuse or cancel orders that appear fraudulent, contain pricing errors, violate these terms, or cannot be fulfilled.</p>
<h2>Product Information</h2>
<p>Jamm Trade works to present product titles, images, descriptions, availability, and pricing accurately. Minor packaging or presentation differences may occur by supplier or production batch.</p>
<h2>Pricing and Payment</h2>
<p>Prices are shown in the storefront currency and confirmed at checkout. Taxes, shipping, and applicable duties are calculated during checkout before payment is submitted. Payments are processed securely through Shopify and approved payment providers.</p>
<h2>Checkout and Fulfillment</h2>
<p>Purchases are completed through secure Shopify checkout. Order fulfillment depends on payment authorization, inventory availability, and successful carrier acceptance.</p>
<p>For questions about these terms, contact us at ${SUPPORT_EMAIL}.</p>`

// ── Push policies to Shopify ─────────────────────────────────────────────────

async function updatePolicy(token, policy) {
  const url = `https://${STORE}/admin/api/2026-04/graphql.json`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({
      query: `
        mutation UpdatePolicy($policy: ShopPolicyInput!) {
          shopPolicyUpdate(shopPolicy: $policy) {
            userErrors { field message }
            shopPolicy { type title }
          }
        }
      `,
      variables: { policy },
    }),
  })

  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2))

  const { userErrors, shopPolicy } = json.data.shopPolicyUpdate
  if (userErrors?.length) throw new Error(JSON.stringify(userErrors, null, 2))

  console.log(`  Updated ${shopPolicy.title}`)
}

async function updatePolicies(token) {
  const policies = [
    { type: 'PRIVACY_POLICY',   body: PRIVACY_POLICY   },
    { type: 'REFUND_POLICY',    body: REFUND_POLICY    },
    { type: 'SHIPPING_POLICY',  body: SHIPPING_POLICY  },
    { type: 'TERMS_OF_SERVICE', body: TERMS_OF_SERVICE },
  ]

  for (const policy of policies) {
    await updatePolicy(token, policy)
  }
}

// ── OAuth flow ───────────────────────────────────────────────────────────────

console.log('\n🔐 Opening Shopify login in your browser...')
console.log('\nIf the browser does not open automatically, visit:\n')
console.log(authUrl + '\n')

// Open browser (Windows)
exec(`start "" "${authUrl}"`)

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== '/callback') { res.end(); return }

  const code  = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const shop  = url.searchParams.get('shop')

  if (!shop || !SHOP_HOSTNAME_PATTERN.test(shop) || shop !== STORE || !verifyShopifyCallback(url.searchParams)) {
    res.end('<h2>Invalid Shopify callback signature. Close this tab and try again.</h2>')
    server.close()
    return
  }

  if (state !== STATE) {
    res.end('<h2>❌ State mismatch. Close this tab and try again.</h2>')
    server.close()
    return
  }

  if (!code) {
    res.end('<h2>❌ No code received. Close this tab and try again.</h2>')
    server.close()
    return
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${STORE}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
  })
  const tokenData = await tokenRes.json()

  if (!tokenData.access_token) {
    console.error('❌ Token exchange failed:', tokenData)
    res.end('<h2>❌ Token exchange failed. Check your terminal.</h2>')
    server.close()
    return
  }

  console.log('✅ Authenticated!\n')
  console.log(`Updating Shopify policies for ${STORE}...\n`)

  try {
    await updatePolicies(tokenData.access_token)
    console.log('\n✅ Done — Shopify policies now match the website.')
    res.end('<h2>✅ Done! Shopify policies updated. You can close this tab.</h2>')
  } catch (err) {
    console.error('❌ Policy update failed:', err.message)
    res.end('<h2>❌ Policy update failed. Check your terminal.</h2>')
  }

  server.close()
})

server.listen(PORT, () => {
  console.log(`Waiting for Shopify callback on http://localhost:${PORT}/callback ...\n`)
})
