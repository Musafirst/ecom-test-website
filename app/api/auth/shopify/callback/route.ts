/**
 * Shopify OAuth callback — exchanges the authorization code for an access token
 * then immediately pushes all legal policies to the Shopify store.
 *
 * Triggered when the user approves the OAuth flow at:
 * /admin/oauth/authorize?client_id=...&redirect_uri=https://jammtrade.com/api/auth/shopify/callback
 */

import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID     = 'b63704e1c1dc653a6f024f499086b46c'
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET ?? ''
const STORE         = 'shop.jammtrade.com'

const PRIVACY_POLICY = `<p>Jamm Trade respects customer privacy. This policy explains how information is used to operate the storefront, process orders, and support customers.</p>
<h2>Information We Collect</h2>
<p>Jamm Trade may collect contact details, shipping details, billing details, order history, device information, and messages sent to customer support.</p>
<p>Payment information is handled through secure Shopify checkout and payment providers. Jamm Trade does not store full card numbers on this website.</p>
<h2>How Information Is Used</h2>
<p>Customer information is used to process orders, provide shipping updates, prevent fraud, respond to support requests, improve the storefront, and comply with legal obligations.</p>
<h2>Service Providers</h2>
<p>Jamm Trade may share necessary order and site information with Shopify, payment processors, fulfillment providers, carriers, analytics services, and other service providers used to operate the store.</p>
<h2>Customer Choices</h2>
<p>Customers may contact Jamm Trade to request help with privacy questions, order data, or communication preferences. For privacy questions, contact us at contact@jammtrade.com.</p>`

const REFUND_POLICY = `<p>Jamm Trade reviews every order with care. This policy explains how returns, refunds, and exchanges are handled for eligible purchases.</p>
<h2>Return Window</h2>
<p>Eligible items may be requested for return within 14 days of delivery. Items must be unused, unopened, in original retail packaging, and in the same condition received.</p>
<p>For fragrance products, the outer seal and packaging must remain intact unless the item arrived damaged or incorrect.</p>
<h2>Non-Returnable Items</h2>
<p>Opened fragrances, used electronics, personal care items, gift cards, final sale items, and products damaged after delivery are not eligible for return.</p>
<h2>Damaged or Incorrect Orders</h2>
<p>If an order arrives damaged, defective, or incorrect, contact Jamm Trade within 48 hours of delivery with the order number and clear photos of the item and packaging. Approved claims may be resolved with a replacement, exchange, or refund depending on inventory and order details.</p>
<h2>Refund Timing</h2>
<p>Approved refunds are issued to the original payment method after the returned item is received and inspected. Bank or card processing times may vary.</p>`

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
<p>If your order arrives damaged, please contact us within 48 hours of delivery at contact@jammtrade.com with photos of the damage and your order number.</p>`

const TERMS_OF_SERVICE = `<p>These terms govern use of the Jamm Trade storefront and purchases made through secure Shopify checkout.</p>
<h2>Store Use</h2>
<p>By using this website, you agree to provide accurate account, contact, billing, and shipping information when placing an order. Jamm Trade may refuse or cancel orders that appear fraudulent, contain pricing errors, violate these terms, or cannot be fulfilled.</p>
<h2>Product Information</h2>
<p>Jamm Trade works to present product titles, images, descriptions, availability, and pricing accurately. Minor packaging or presentation differences may occur by supplier or production batch.</p>
<h2>Pricing and Payment</h2>
<p>Prices are shown in the storefront currency and confirmed at checkout. Taxes, shipping, and applicable duties are calculated during checkout before payment is submitted. Payments are processed securely through Shopify and approved payment providers.</p>
<h2>Checkout and Fulfillment</h2>
<p>Purchases are completed through secure Shopify checkout. Order fulfillment depends on payment authorization, inventory availability, and successful carrier acceptance.</p>`

async function updatePolicies(token: string) {
  const res = await fetch(`https://${STORE}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({
      query: `
        mutation UpdatePolicies($policies: [ShopPolicyInput!]!) {
          shopPoliciesUpdate(shopPolicies: $policies) {
            userErrors { field message }
            shopPolicies { type title }
          }
        }
      `,
      variables: {
        policies: [
          { type: 'PRIVACY_POLICY',   body: PRIVACY_POLICY   },
          { type: 'REFUND_POLICY',    body: REFUND_POLICY    },
          { type: 'SHIPPING_POLICY',  body: SHIPPING_POLICY  },
          { type: 'TERMS_OF_SERVICE', body: TERMS_OF_SERVICE },
        ],
      },
    }),
  })

  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))

  const { userErrors, shopPolicies } = json.data.shopPoliciesUpdate
  if (userErrors?.length) throw new Error(JSON.stringify(userErrors))

  return shopPolicies as { type: string; title: string }[]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
      <h2>❌ OAuth error: ${error}</h2>
      <p>${searchParams.get('error_description') ?? ''}</p>
    </body></html>`, { headers: { 'Content-Type': 'text/html' } })
  }

  if (!code) {
    return new NextResponse('<html><body style="font-family:sans-serif;padding:40px"><h2>❌ No code received.</h2></body></html>',
      { headers: { 'Content-Type': 'text/html' } })
  }

  if (!CLIENT_SECRET) {
    return new NextResponse('<html><body style="font-family:sans-serif;padding:40px"><h2>❌ SHOPIFY_CLIENT_SECRET env var not set.</h2></body></html>',
      { headers: { 'Content-Type': 'text/html' } })
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${STORE}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
  })
  const tokenData = await tokenRes.json() as { access_token?: string; error?: string }

  if (!tokenData.access_token) {
    return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
      <h2>❌ Token exchange failed</h2><pre>${JSON.stringify(tokenData, null, 2)}</pre>
    </body></html>`, { headers: { 'Content-Type': 'text/html' } })
  }

  // Update policies
  try {
    const updated = await updatePolicies(tokenData.access_token)
    const list = updated.map(p => `<li>✓ ${p.title}</li>`).join('')
    return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
      <h2>✅ Shopify policies updated!</h2>
      <ul>${list}</ul>
      <p>Your website will reflect these changes within 5 minutes.</p>
      <p><a href="/shop">Back to shop</a></p>
    </body></html>`, { headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    return new NextResponse(`<html><body style="font-family:sans-serif;padding:40px">
      <h2>❌ Policy update failed</h2><pre>${err}</pre>
    </body></html>`, { headers: { 'Content-Type': 'text/html' } })
  }
}
