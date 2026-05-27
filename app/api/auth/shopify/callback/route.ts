/**
 * Shopify OAuth callback — exchanges the authorization code for an access token
 * then immediately pushes all legal policies and fixes product data.
 *
 * Triggered when the user approves the OAuth flow at:
 * https://jamm-trade.myshopify.com/admin/oauth/authorize?client_id=b63704e1c1dc653a6f024f499086b46c&scope=write_content,write_products&redirect_uri=https://jammtrade.com/api/auth/shopify/callback
 */

import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID     = 'b63704e1c1dc653a6f024f499086b46c'
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET ?? ''
const STORE         = 'jamm-trade.myshopify.com'

const PRIVACY_POLICY = `<p>Jamm Trade LLC ("Jamm Trade," "we," "us," or "our") is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you visit jammtrade.com or shop.jammtrade.com or make a purchase.</p>

<h2>Information We Collect</h2>
<p>When you place an order or contact us, we may collect: your name, email address, shipping and billing address, phone number, payment information (processed securely by Shopify and its payment partners — we never store full card numbers), order history, and communications sent to our support team.</p>
<p>We may also collect non-personal browsing data such as device type, browser, and pages visited through analytics tools.</p>

<h2>How We Use Your Information</h2>
<p>We use your information to: process and fulfill orders, send order confirmations and shipping updates, respond to support inquiries, detect and prevent fraud, improve our storefront, and comply with legal obligations.</p>
<p>We do not sell or rent your personal information to third parties.</p>

<h2>Service Providers</h2>
<p>Jamm Trade uses the following service providers to operate the store: Shopify Inc. (checkout, payment processing, and order management), Supabase (order receipt storage and discount claim records), and shipping carriers for order fulfillment. These providers access your information only as necessary to perform their services.</p>

<h2>Cookies</h2>
<p>Our storefront uses cookies and local storage to maintain your shopping cart, remember preferences, and improve site functionality. By continuing to use the site, you consent to this use.</p>

<h2>Data Retention</h2>
<p>Order records are retained for a minimum of 7 years as required for accounting and legal compliance. You may contact us to request access to, correction of, or deletion of your personal data where applicable under law.</p>

<h2>Your Rights</h2>
<p>Depending on your location, you may have rights to access, correct, or request deletion of your personal data. To exercise these rights, contact us at contact@jammtrade.com.</p>

<h2>Contact</h2>
<p>For privacy questions, contact Jamm Trade LLC at: contact@jammtrade.com. We aim to respond within 5 business days.</p>`

const REFUND_POLICY = `<p>Jamm Trade LLC reviews every order with care. This policy explains how returns, refunds, and exchanges are handled.</p>

<h2>Return Window</h2>
<p>Eligible items may be returned within <strong>14 days of the delivery date</strong>. To initiate a return, contact us at contact@jammtrade.com with your order number and reason for return before sending any item back.</p>
<p>Items must be: unused and unopened, in their original retail packaging, in the same condition as received, and accompanied by proof of purchase.</p>

<h2>Fragrance Returns</h2>
<p>For fragrance products, the outer seal and original packaging must remain fully intact. Opened or used fragrances are not eligible for return unless the item arrived damaged, defective, or incorrect.</p>

<h2>Electronics Returns</h2>
<p>Electronics must be unused and in original packaging with all accessories and documentation included. Items that have been powered on, registered, or show signs of use are not eligible for return unless defective.</p>

<h2>Non-Returnable Items</h2>
<p>The following items are not eligible for return: opened fragrances, used or registered electronics, personal care items, gift cards, final sale or clearance items, and items damaged after delivery due to customer handling.</p>

<h2>Damaged, Defective, or Incorrect Orders</h2>
<p>If your order arrives damaged, defective, or not as described, contact us at contact@jammtrade.com within <strong>48 hours of delivery</strong> with: your order number, a description of the issue, and clear photos of the item and packaging. Approved claims will be resolved with a replacement, exchange, or full refund depending on availability.</p>

<h2>Refund Process</h2>
<p>Once a return is approved and the item is received and inspected, refunds are issued to the original payment method. Please allow 5–10 business days for the refund to appear, depending on your bank or card issuer.</p>
<p>Return shipping costs are the responsibility of the customer unless the return is due to a Jamm Trade error.</p>

<h2>Contact</h2>
<p>To start a return or ask a question about your order, email contact@jammtrade.com with your order number. Support hours: Monday–Friday, 10:00 AM–6:00 PM ET.</p>`

const SHIPPING_POLICY = `<p>Jamm Trade LLC ships eligible orders with careful packaging and tracked delivery from the United States.</p>

<h2>Processing Time</h2>
<p>Orders are typically processed within <strong>1–3 business days</strong> after payment is confirmed, excluding weekends and US federal holidays. During high-volume periods, processing may take up to 5 business days. You will receive a shipping confirmation email once your order has been dispatched.</p>

<h2>Shipping Rates and Methods</h2>
<p>Shipping rates, available delivery methods, estimated delivery dates, and applicable taxes are calculated at checkout before you complete payment. Rates are based on the delivery destination, package weight, and selected shipping method.</p>

<h2>Estimated Delivery Times</h2>
<ul>
  <li><strong>United States:</strong> 3–7 business days after dispatch</li>
  <li><strong>International:</strong> 7–21 business days after dispatch, depending on destination country and customs clearance</li>
</ul>
<p>Delivery times are estimates and are not guaranteed. Delays may occur due to carrier volume, weather, customs processing, or other factors outside our control.</p>

<h2>Order Tracking</h2>
<p>When tracking is available, you will receive a shipment confirmation email with a tracking number after your order is fulfilled. Use the tracking number on the carrier's website to follow your delivery.</p>

<h2>International Orders — Customs and Duties</h2>
<p>International shipments may be subject to import duties, taxes, and customs fees charged by the destination country. These charges are the sole responsibility of the recipient and are not included in the purchase price or shipping fee paid to Jamm Trade. Please check your local customs regulations before ordering.</p>

<h2>Address Accuracy</h2>
<p>You are responsible for providing a complete and accurate shipping address at checkout. Jamm Trade is not responsible for orders delivered to an incorrect address provided by the customer. Orders returned due to an undeliverable address may require additional shipping fees for reshipment.</p>

<h2>Damaged Items in Transit</h2>
<p>If your order arrives damaged during shipping, contact us at contact@jammtrade.com within <strong>48 hours of delivery</strong> with your order number and photos of the damaged item and packaging. We will work with you to resolve the issue.</p>

<h2>Contact</h2>
<p>For shipping questions, email contact@jammtrade.com. Support hours: Monday–Friday, 10:00 AM–6:00 PM ET.</p>`

const TERMS_OF_SERVICE = `<p>These Terms of Service ("Terms") govern your use of the Jamm Trade LLC storefront at jammtrade.com and shop.jammtrade.com ("Site") and any purchases made through it. By using the Site or placing an order, you agree to these Terms.</p>

<h2>About Jamm Trade LLC</h2>
<p>Jamm Trade LLC is an independent retailer based in the United States. We are not officially affiliated with, sponsored by, or endorsed by any third-party brand whose products appear on this Site unless explicitly stated. All brand names, trademarks, and product names referenced are the property of their respective owners. We sell authentic products sourced from authorized distributors and suppliers.</p>

<h2>Account and Order Information</h2>
<p>You agree to provide accurate, current, and complete information when placing an order, including your name, email, shipping address, and payment details. Jamm Trade reserves the right to refuse or cancel any order that appears fraudulent, contains a pricing error, cannot be fulfilled due to inventory, or violates these Terms.</p>

<h2>Product Information</h2>
<p>We work to present accurate product titles, descriptions, images, availability, and pricing. Minor differences in packaging, shade, or presentation may occur by production batch or supplier. Product images are representative; actual packaging may vary.</p>

<h2>Pricing and Payment</h2>
<p>All prices are displayed in US dollars and are subject to change without prior notice. Final pricing — including shipping, taxes, and any applicable duties — is confirmed at checkout before payment is submitted. Payments are processed securely through Shopify and approved third-party payment providers. Jamm Trade does not store payment card information.</p>

<h2>Order Fulfillment</h2>
<p>Placing an order constitutes an offer to purchase. Orders are confirmed upon successful payment authorization and inventory verification. In the event an item is out of stock after an order is placed, we will notify you promptly and offer a refund or suitable alternative.</p>

<h2>Intellectual Property</h2>
<p>All original content on this Site, including the Jamm Trade name, lotus mark, logos, and original design elements, is the property of Jamm Trade LLC. Unauthorized reproduction or use is prohibited.</p>

<h2>Limitation of Liability</h2>
<p>To the fullest extent permitted by applicable law, Jamm Trade LLC shall not be liable for indirect, incidental, special, or consequential damages arising from the use of this Site or the purchase of products, including delays in delivery or product unavailability.</p>

<h2>Governing Law</h2>
<p>These Terms are governed by the laws of the United States and the state in which Jamm Trade LLC operates. Any disputes shall be resolved in the applicable jurisdiction.</p>

<h2>Changes to These Terms</h2>
<p>Jamm Trade LLC reserves the right to update these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.</p>

<h2>Contact</h2>
<p>For questions about these Terms, contact Jamm Trade LLC at: contact@jammtrade.com. Support hours: Monday–Friday, 10:00 AM–6:00 PM ET.</p>`

type AdminImage   = { id: number; alt: string | null }
type AdminVariant = { id: number; title: string; option1: string; price: string; compareAtPrice: string | null }
type AdminProduct = { id: number; title: string; vendor: string; images: AdminImage[]; variants: AdminVariant[] }

async function adminFetch(path: string, token: string, method = 'GET', body?: unknown) {
  const res = await fetch(`https://${STORE}/admin/api/2024-10${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) throw new Error(`Admin API ${method} ${path} → ${res.status}`)
  return res.json()
}

// Small delay to stay well within Shopify's 2 req/s Admin REST rate limit.
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function fixProducts(token: string): Promise<string[]> {
  const { products }: { products: AdminProduct[] } = await adminFetch(
    '/products.json?limit=250&fields=id,title,vendor,images,variants&variants[]=id&variants[]=title&variants[]=option1&variants[]=price&variants[]=compare_at_price',
    token,
  )

  const log: string[] = []

  for (const product of products) {
    // ── 1. Strip "Wholesale" supplier prefixes from image alt texts ──────────
    for (const img of product.images ?? []) {
      if (img.alt && /wholesale/i.test(img.alt)) {
        await delay(550)
        await adminFetch(`/products/${product.id}/images/${img.id}.json`, token, 'PUT', {
          image: { id: img.id, alt: product.title },
        })
        log.push(`Alt text fixed on image for "${product.title}"`)
      }
    }

    // ── 2. Fix "Headphons" typo ───────────────────────────────────────────────
    if (/Headphons/i.test(product.title)) {
      const fixed = product.title
        .replace(/Headphons/gi, 'Headphones')
        .replace(/\bAnc\b/g, 'ANC')
        .replace(/Noisecancelling/gi, 'Noise-Cancelling')
        .replace(/Over-The-Ear/gi, 'Over-Ear')
      await delay(550)
      await adminFetch(`/products/${product.id}.json`, token, 'PUT', {
        product: { id: product.id, title: fixed },
      })
      log.push(`Title fixed: "${product.title}" → "${fixed}"`)
    }

    // ── 3. Add vendor prefix to generic "Wireless Earbuds" title ─────────────
    if (product.title === 'Wireless Earbuds' && product.vendor && product.vendor !== 'Jamm Trade') {
      const fixed = `${product.vendor} Wireless Earbuds`
      await delay(550)
      await adminFetch(`/products/${product.id}.json`, token, 'PUT', {
        product: { id: product.id, title: fixed },
      })
      log.push(`Title fixed: "Wireless Earbuds" → "${fixed}"`)
    }

    // ── 4. Fix variant title "Case of 1" → "1 Bottle", "Title" → "Default Title"
    for (const variant of product.variants ?? []) {
      if (variant.title === 'Case of 1') {
        await delay(550)
        await adminFetch(`/variants/${variant.id}.json`, token, 'PUT', {
          variant: { id: variant.id, option1: '1 Bottle' },
        })
        log.push(`Variant fixed on "${product.title}": "Case of 1" → "1 Bottle"`)
      }
      if (variant.title === 'Title') {
        await delay(550)
        await adminFetch(`/variants/${variant.id}.json`, token, 'PUT', {
          variant: { id: variant.id, option1: 'Default Title' },
        })
        log.push(`Variant fixed on "${product.title}": "Title" → "Default Title"`)
      }
    }

    // ── 5. Sync image alt text to match the current product title ────────────
    // Catches cases where the title was fixed but the image alt text still has
    // the old value (e.g. Aura 360 typo was fixed in the title but not images).
    for (const img of product.images ?? []) {
      if (img.alt && img.alt !== product.title && !/wholesale/i.test(img.alt)) {
        // Only fix if the alt text looks like a stale product-name string
        // (contains the product's handle keywords), not a curated descriptive alt.
        const titleWords = product.title.toLowerCase().split(/\s+/).filter(w => w.length > 4)
        const altLower   = img.alt.toLowerCase()
        const overlap    = titleWords.filter(w => altLower.includes(w)).length
        if (overlap >= 3) {
          await delay(550)
          await adminFetch(`/products/${product.id}/images/${img.id}.json`, token, 'PUT', {
            image: { id: img.id, alt: product.title },
          })
          log.push(`Alt text synced for "${product.title}"`)
        }
      }
    }

    // ── 6. Remove compareAtPrice when it is ≤ the actual price (data error) ──
    for (const variant of product.variants ?? []) {
      if (variant.compareAtPrice !== null && parseFloat(variant.compareAtPrice) <= parseFloat(variant.price)) {
        await delay(550)
        await adminFetch(`/variants/${variant.id}.json`, token, 'PUT', {
          variant: { id: variant.id, compare_at_price: null },
        })
        log.push(`Removed invalid compareAtPrice on "${product.title}"`)
      }
    }
  }

  return log
}

// Shopify's public Admin API has no mutation to update system-level shop policies.
// We create/update them as standard Pages instead. They go live at
// shop.jammtrade.com/pages/{handle} and can be linked in Admin → Settings → Policies.
async function updatePolicies(token: string): Promise<{ title: string; url: string }[]> {
  const POLICIES = [
    { title: 'Privacy Policy',   handle: 'privacy-policy',   body_html: PRIVACY_POLICY   },
    { title: 'Refund Policy',    handle: 'refund-policy',    body_html: REFUND_POLICY    },
    { title: 'Shipping Policy',  handle: 'shipping-policy',  body_html: SHIPPING_POLICY  },
    { title: 'Terms of Service', handle: 'terms-of-service', body_html: TERMS_OF_SERVICE },
  ]

  const results: { title: string; url: string }[] = []

  for (const policy of POLICIES) {
    await delay(550)
    const existing = await adminFetch(
      `/pages.json?handle=${policy.handle}&fields=id,handle`,
      token,
    ) as { pages: { id: number }[] }

    if (existing.pages?.length > 0) {
      const pageId = existing.pages[0].id
      await delay(550)
      await adminFetch(`/pages/${pageId}.json`, token, 'PUT', {
        page: { id: pageId, title: policy.title, body_html: policy.body_html },
      })
    } else {
      await delay(550)
      await adminFetch('/pages.json', token, 'POST', {
        page: { title: policy.title, handle: policy.handle, body_html: policy.body_html },
      })
    }

    results.push({ title: policy.title, url: `https://shop.jammtrade.com/pages/${policy.handle}` })
  }

  return results
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code  = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
        <h2>❌ OAuth error: ${error}</h2>
        <p>${searchParams.get('error_description') ?? ''}</p>
      </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    if (!code) {
      return new NextResponse('<html><body style="font-family:sans-serif;padding:40px"><h2>❌ No code received.</h2></body></html>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    if (!CLIENT_SECRET) {
      return new NextResponse('<html><body style="font-family:sans-serif;padding:40px"><h2>❌ SHOPIFY_CLIENT_SECRET env var not set.</h2></body></html>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    const tokenRes = await fetch(`https://${STORE}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    })
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string }

    if (!tokenData.access_token) {
      return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
        <h2>❌ Token exchange failed</h2><pre>${JSON.stringify(tokenData, null, 2)}</pre>
      </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }

    try {
      const [updatedPolicies, productFixes] = await Promise.all([
        updatePolicies(tokenData.access_token),
        fixProducts(tokenData.access_token),
      ])
      const policyList = updatedPolicies.map(p =>
        `<li>&#10003;<strong>${p.title}</strong> — <a href="${p.url}">${p.url}</a></li>`
      ).join('')
      const fixList = productFixes.length
        ? productFixes.map(f => `<li>&#10003;${f}</li>`).join('')
        : '<li>No product changes needed.</li>'
      return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px;max-width:760px">
        <h2>Shopify store updated!</h2>

        <h3>Product fixes</h3>
        <ul>${fixList}</ul>

        <h3>Policy pages created</h3>
        <ul>${policyList}</ul>

        <div style="margin-top:24px;padding:16px;background:#fff3cd;border:1px solid #ffc107;border-radius:6px">
          <strong>One manual step remaining:</strong><br>
          Go to <a href="https://jamm-trade.myshopify.com/admin/settings/legal" target="_blank">
            Shopify Admin → Settings → Policies
          </a> and paste each page URL above into the corresponding policy field, then save.
          This links the pages as your store's official checkout policies.
        </div>

        <p style="margin-top:20px"><a href="/shop">Back to shop</a></p>
      </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    } catch (err) {
      return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
        <h2>❌ Update failed</h2><pre>${err}</pre>
      </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
    }
  } catch (err) {
    return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
      <h2>❌ Unexpected error</h2><pre>${String(err)}</pre>
    </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  }
}
