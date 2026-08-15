/**
 * Aligns Shopify legal-policy text with the public storefront identity so that
 * Google's Misrepresentation checks see one consistent business across every
 * surface: legal name, physical address, support email, phone, and hours.
 *
 * The privacy policy body is Shopify-generated boilerplate, so it is patched by
 * targeted replacement rather than rewritten, to avoid dropping required clauses.
 *
 * Usage: node scripts/fix-policy-identity-consistency.mjs [--dry-run]
 */

import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const API_VERSION = '2026-04'

const IDENTITY = {
  legalName: 'Jamm Trade LLC',
  street: '100 Branford Rd',
  cityLine: 'Darby, PA 19023',
  country: 'United States',
  email: 'contact@jammtrade.com',
  phone: '(484) 521-6277',
  hours: 'Monday–Friday, 10:00 AM–6:00 PM ET',
  website: 'https://www.jammtrade.com',
}

const ADDRESS_ONE_LINE = `${IDENTITY.street}, ${IDENTITY.cityLine}, ${IDENTITY.country}`

function loadEnvLocal() {
  const file = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line)
    if (!match) continue
    const value = match[2].trim().replace(/^["']|["']$/g, '')
    if (!process.env[match[1]]) process.env[match[1]] = value
  }
}

loadEnvLocal()

const DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN || '6mx10k-xu.myshopify.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

if (!TOKEN) {
  console.error('SHOPIFY_ADMIN_TOKEN is required (set it in .env.local).')
  process.exit(1)
}

async function admin(query, variables) {
  const response = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  const text = await response.text()
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 400)}`)

  const json = JSON.parse(text)
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

const CONTACT_INFORMATION = `<p>CONTACT INFORMATION</p>
<p><strong>${IDENTITY.legalName}</strong><br>${IDENTITY.street}<br>${IDENTITY.cityLine}<br>${IDENTITY.country}</p>
<p>Website:<br>${IDENTITY.website}</p>
<p>Customer Support Email:<br>${IDENTITY.email}</p>
<p>Customer Support Phone:<br>${IDENTITY.phone}</p>
<p>Support Hours:<br>${IDENTITY.hours}</p>
<p>Response Time:<br>We aim to respond to customer inquiries within 1–2 business days.</p>
<p>For support, order inquiries, returns, or general questions, contact us by email or phone during support hours.</p>`

const LEGAL_NOTICE = `<p>LEGAL NOTICE</p>
<p>This website is operated by ${IDENTITY.legalName}.</p>
<p>Business Name:<br>${IDENTITY.legalName}</p>
<p>Business Address:<br>${IDENTITY.street}<br>${IDENTITY.cityLine}<br>${IDENTITY.country}</p>
<p>Website:<br>${IDENTITY.website}</p>
<p>Contact Email:<br>${IDENTITY.email}</p>
<p>Contact Phone:<br>${IDENTITY.phone}</p>
<p>Support Hours:<br>${IDENTITY.hours}</p>
<p>${IDENTITY.legalName} is an independent retailer. We are not officially affiliated with, sponsored by, or endorsed by any third-party brand whose products appear on this website unless explicitly stated. All brand names, trademarks, and product names referenced are the property of their respective owners.</p>
<p>By accessing this website, you agree to use it in accordance with applicable laws and these website policies.</p>
<p>Original Jamm Trade branding and content created by ${IDENTITY.legalName}, including the Jamm Trade name, lotus mark, logos, graphics, and designs, is owned by ${IDENTITY.legalName}. Third-party brand names, product names, trademarks, product descriptions, and product images belong to their respective owners.</p>
<p>${IDENTITY.legalName} makes reasonable efforts to ensure that all information on this website is accurate and up to date. However, we do not guarantee that all content is error-free, complete, or current at all times.</p>
<p>We reserve the right to modify products, pricing, policies, and website content at any time without prior notice.</p>
<p>For any legal or support inquiries, contact ${IDENTITY.email}.</p>`

// Disclosure of the analytics and advertising technologies the storefront
// actually loads. Google expects the privacy policy to match real behaviour.
const TRACKING_SECTION = `<h2>Cookies, Analytics, and Advertising Technologies</h2>
<p>We use cookies and similar technologies on our website to operate the store, remember your cart and preferences, measure how the website is used, and support marketing. In addition to Shopify's own functionality, we use the following third-party technologies:</p>
<ul>
<li><strong>Google Analytics 4</strong> (Google LLC) — website and ecommerce analytics, including page views, product views, add-to-cart events, and purchases. See the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.</li>
<li><strong>TikTok Pixel</strong> (TikTok Inc.) — measurement and advertising, including page views, add-to-cart events, checkout starts, and purchases. See the <a href="https://www.tiktok.com/legal/privacy-policy">TikTok Privacy Policy</a>.</li>
<li><strong>Shopify</strong> — ecommerce platform, checkout, and payment processing. See the <a href="https://www.shopify.com/legal/privacy">Shopify Privacy Policy</a>.</li>
</ul>
<p>You can limit or delete cookies through your browser settings. Disabling cookies may affect storefront, cart, analytics, or personalization features.</p>
`

function patchPrivacyPolicy(body) {
  const changes = []
  let next = body

  // The Shopify-generated contact block still carried a former business address.
  const staleAddress = /5941 Lansdowne Ave,\s*Philadelphia,\s*PA,?\s*19151,?\s*US/gi
  if (staleAddress.test(next)) {
    next = next.replace(staleAddress, ADDRESS_ONE_LINE)
    changes.push(`contact address -> ${ADDRESS_ONE_LINE}`)
  }

  // Name the operating entity rather than the trade name alone.
  if (next.includes('Jamm Trade operates this store')) {
    next = next.replace('Jamm Trade operates this store', `${IDENTITY.legalName} ("Jamm Trade") operates this store`)
    changes.push('named the legal entity in the opening paragraph')
  }

  // Publish the phone number alongside the email in the contact block.
  if (next.includes(`email us at ${IDENTITY.email} or contact us at`)) {
    next = next.replace(
      `email us at ${IDENTITY.email} or contact us at`,
      `email us at ${IDENTITY.email}, call us at ${IDENTITY.phone}, or write to us at`,
    )
    changes.push('added support phone to the contact block')
  }

  if (!next.includes('Cookies, Analytics, and Advertising Technologies')) {
    const anchor = '<h2>Third Party Websites and Links</h2>'
    if (next.includes(anchor)) {
      next = next.replace(anchor, TRACKING_SECTION + anchor)
      changes.push('disclosed Google Analytics 4 and TikTok Pixel')
    }
  }

  return { body: next, changes }
}

const POLICY_QUERY = `query { shop { shopPolicies { type body } } }`

const POLICY_MUTATION = `mutation UpdatePolicy($shopPolicy: ShopPolicyInput!) {
  shopPolicyUpdate(shopPolicy: $shopPolicy) {
    shopPolicy { type url }
    userErrors { field message }
  }
}`

async function main() {
  const data = await admin(POLICY_QUERY)
  const policies = Object.fromEntries(
    data.shop.shopPolicies.map((policy) => [policy.type, policy.body || '']),
  )

  const updates = []

  if (policies.CONTACT_INFORMATION !== CONTACT_INFORMATION) {
    updates.push({
      type: 'CONTACT_INFORMATION',
      body: CONTACT_INFORMATION,
      changes: ['support email -> contact@jammtrade.com', 'hours -> 10:00 AM–6:00 PM ET', 'added legal name, address, phone'],
    })
  }

  if (policies.LEGAL_NOTICE !== LEGAL_NOTICE) {
    updates.push({
      type: 'LEGAL_NOTICE',
      body: LEGAL_NOTICE,
      changes: ['removed second support email', 'added legal name, address, phone, hours'],
    })
  }

  const privacy = patchPrivacyPolicy(policies.PRIVACY_POLICY || '')
  if (privacy.changes.length) {
    updates.push({ type: 'PRIVACY_POLICY', body: privacy.body, changes: privacy.changes })
  }

  if (!updates.length) {
    console.log('All policies already consistent. Nothing to do.')
    return
  }

  for (const update of updates) {
    console.log(`\n${update.type}`)
    for (const change of update.changes) console.log(`  - ${change}`)

    if (DRY_RUN) {
      console.log('  (dry run, not written)')
      continue
    }

    const result = await admin(POLICY_MUTATION, {
      shopPolicy: { type: update.type, body: update.body },
    })

    const errors = result.shopPolicyUpdate.userErrors
    if (errors.length) throw new Error(`${update.type}: ${JSON.stringify(errors)}`)
    console.log(`  updated -> ${result.shopPolicyUpdate.shopPolicy.url}`)
  }
}

main().catch((error) => {
  console.error('\nFailed:', error.message)
  process.exit(1)
})
