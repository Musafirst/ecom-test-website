/**
 * Overwrites the Shopify shop's built-in legal policies to match the website.
 *
 * Required Admin API scopes: write_legal, write_content
 *
 * Run:
 *   SHOPIFY_ADMIN_TOKEN=<token> node scripts/update-shopify-policies.mjs
 */

const STORE = process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

if (!TOKEN) {
  console.error('Error: set SHOPIFY_ADMIN_TOKEN=<your-admin-token> before running.');
  process.exit(1);
}

const ADMIN_URL = `https://${STORE}/admin/api/2024-01/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

// ── Policy bodies (HTML) — derived from the website page components ──────────

const PRIVACY_POLICY = `<p>Jamm Trade respects customer privacy. This policy explains how information is used to operate the storefront, process orders, and support customers.</p>
<h2>Information We Collect</h2>
<p>Jamm Trade may collect contact details, shipping details, billing details, order history, device information, and messages sent to customer support.</p>
<p>Payment information is handled through secure Shopify checkout and payment providers. Jamm Trade does not store full card numbers on this website.</p>
<h2>How Information Is Used</h2>
<p>Customer information is used to process orders, provide shipping updates, prevent fraud, respond to support requests, improve the storefront, and comply with legal obligations.</p>
<h2>Service Providers</h2>
<p>Jamm Trade may share necessary order and site information with Shopify, payment processors, fulfillment providers, carriers, analytics services, and other service providers used to operate the store.</p>
<h2>Customer Choices</h2>
<p>Customers may contact Jamm Trade to request help with privacy questions, order data, or communication preferences.</p>`;

const REFUND_POLICY = `<p>Jamm Trade reviews every order with care. This policy explains how returns, refunds, and exchanges are handled for eligible purchases.</p>
<h2>Return Window</h2>
<p>Eligible items may be requested for return within 14 days of delivery. Items must be unused, unopened, in original retail packaging, and in the same condition received.</p>
<p>For fragrance products, the outer seal and packaging must remain intact unless the item arrived damaged or incorrect.</p>
<h2>Non-Returnable Items</h2>
<p>Opened fragrances, used electronics, personal care items, gift cards, final sale items, and products damaged after delivery are not eligible for return.</p>
<h2>Damaged or Incorrect Orders</h2>
<p>If an order arrives damaged, defective, or incorrect, contact Jamm Trade within 48 hours of delivery with the order number and clear photos of the item and packaging.</p>
<p>Approved claims may be resolved with a replacement, exchange, or refund depending on inventory and order details.</p>
<h2>Refund Timing</h2>
<p>Approved refunds are issued to the original payment method after the returned item is received and inspected. Bank or card processing times may vary.</p>`;

const SHIPPING_POLICY = `<p>Jamm Trade ships eligible orders with tracked delivery and careful packaging for fragrances, electronics, and curated essentials.</p>
<h2>Processing Time</h2>
<p>Orders are typically processed within 1 to 3 business days after payment is confirmed, excluding weekends and holidays.</p>
<h2>Shipping Rates and Delivery</h2>
<p>Shipping rates, available methods, estimated delivery dates, taxes, and duties are calculated at secure Shopify checkout before payment is completed.</p>
<p>Delivery estimates are provided by the carrier and may vary due to address accuracy, weather, carrier volume, or customs processing.</p>
<h2>Tracking</h2>
<p>When tracking is available, customers receive shipment details by email after the order has been fulfilled.</p>
<h2>Address Accuracy</h2>
<p>Customers are responsible for entering a complete and accurate shipping address. Contact Jamm Trade quickly if an address needs correction before fulfillment.</p>`;

const TERMS_OF_SERVICE = `<p>These terms govern use of the Jamm Trade storefront and purchases made through secure Shopify checkout.</p>
<h2>Store Use</h2>
<p>By using this website, you agree to provide accurate account, contact, billing, and shipping information when placing an order.</p>
<p>Jamm Trade may refuse or cancel orders that appear fraudulent, contain pricing errors, violate these terms, or cannot be fulfilled.</p>
<h2>Product Information</h2>
<p>Jamm Trade works to present product titles, images, descriptions, availability, and pricing accurately. Minor packaging or presentation differences may occur by supplier or production batch.</p>
<h2>Pricing and Payment</h2>
<p>Prices are shown in the storefront currency and confirmed at checkout. Taxes, shipping, and applicable duties are calculated during checkout before payment is submitted.</p>
<h2>Checkout and Fulfillment</h2>
<p>Purchases are completed through secure Shopify checkout. Order fulfillment depends on payment authorization, inventory availability, and successful carrier acceptance.</p>`;

// ── Update shop policies ──────────────────────────────────────────────────────

console.log(`\nUpdating Shopify policies for ${STORE}...\n`);

const data = await gql(`
  mutation UpdatePolicies($policies: [ShopPolicyInput!]!) {
    shopPoliciesUpdate(shopPolicies: $policies) {
      userErrors { field message }
      shopPolicies {
        type
        title
      }
    }
  }
`, {
  policies: [
    { type: 'PRIVACY_POLICY',   body: PRIVACY_POLICY   },
    { type: 'REFUND_POLICY',    body: REFUND_POLICY    },
    { type: 'SHIPPING_POLICY',  body: SHIPPING_POLICY  },
    { type: 'TERMS_OF_SERVICE', body: TERMS_OF_SERVICE },
  ],
});

const { userErrors, shopPolicies } = data.shopPoliciesUpdate;

if (userErrors?.length) {
  console.error('Errors:', JSON.stringify(userErrors, null, 2));
  process.exit(1);
}

for (const policy of shopPolicies ?? []) {
  console.log(`✓ ${policy.title} (${policy.type})`);
}

console.log('\nDone. Shopify policies now match the website.');
