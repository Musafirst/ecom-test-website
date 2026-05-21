/**
 * Creates all required Shopify pages via Admin API.
 *
 * To get an Admin API access token:
 *   1. Go to your Shopify admin → Settings → Apps and sales channels
 *   2. Click "Develop apps" → Create an app (e.g. "Jamm Admin Scripts")
 *   3. Under "Configuration" → Admin API scopes, enable:
 *      write_content, write_online_store_pages
 *   4. Click "Install app" and copy the Admin API access token
 *   5. Run: SHOPIFY_ADMIN_TOKEN=<token> node scripts/create-shopify-pages.mjs
 */

const STORE = process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

if (!TOKEN) {
  console.error('Error: Set SHOPIFY_ADMIN_TOKEN=<your-token> before running.');
  process.exit(1);
}

const ADMIN_URL = `https://${STORE}/admin/api/2024-01/graphql.json`;

async function gql(query) {
  const res = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

function pageCreateMutation(alias, title, handle, templateSuffix, body = '') {
  const escaped = body.replace(/"""/g, '\\"\\"\\"');
  return `  ${alias}: pageCreate(page: {
    title: ${JSON.stringify(title)}
    handle: ${JSON.stringify(handle)}
    templateSuffix: ${JSON.stringify(templateSuffix)}
    body: ${JSON.stringify(body)}
  }) {
    page { id title handle templateSuffix }
    userErrors { field message }
  }`;
}

const PAGES = [
  {
    alias: 'contactPage',
    title: 'Contact',
    handle: 'contact',
    templateSuffix: 'contact',
    body: '',
  },
  {
    alias: 'privacyPage',
    title: 'Privacy Policy',
    handle: 'privacy-policy',
    templateSuffix: 'policy',
    body: `<h2>Information We Collect</h2>
<p>Jamm Trade may collect contact details, shipping details, billing details, order history, device information, and messages sent to customer support.</p>
<p>Payment information is handled through secure Shopify checkout and payment providers. Jamm Trade does not store full card numbers on this website.</p>
<h2>How Information Is Used</h2>
<p>Customer information is used to process orders, provide shipping updates, prevent fraud, respond to support requests, improve the storefront, and comply with legal obligations.</p>
<h2>Service Providers</h2>
<p>Jamm Trade may share necessary order and site information with Shopify, payment processors, fulfillment providers, carriers, analytics services, and other service providers used to operate the store.</p>
<h2>Customer Choices</h2>
<p>Customers may contact Jamm Trade to request help with privacy questions, order data, or communication preferences.</p>`,
  },
  {
    alias: 'refundPage',
    title: 'Refund Policy',
    handle: 'refund-policy',
    templateSuffix: 'policy',
    body: `<h2>Return Window</h2>
<p>Eligible items may be requested for return within 14 days of delivery. Items must be unused, unopened, in original retail packaging, and in the same condition received.</p>
<p>For fragrance products, the outer seal and packaging must remain intact unless the item arrived damaged or incorrect.</p>
<h2>Non-Returnable Items</h2>
<p>Opened fragrances, used electronics, personal care items, gift cards, final sale items, and products damaged after delivery are not eligible for return.</p>
<h2>Damaged or Incorrect Orders</h2>
<p>If an order arrives damaged, defective, or incorrect, contact Jamm Trade within 48 hours of delivery with the order number and clear photos of the item and packaging.</p>
<p>Approved claims may be resolved with a replacement, exchange, or refund depending on inventory and order details.</p>
<h2>Refund Timing</h2>
<p>Approved refunds are issued to the original payment method after the returned item is received and inspected. Bank or card processing times may vary.</p>`,
  },
  {
    alias: 'shippingPolicyPage',
    title: 'Shipping Policy',
    handle: 'shipping-policy',
    templateSuffix: 'policy',
    body: `<h2>Processing Time</h2>
<p>Orders are typically processed within 1 to 3 business days after payment is confirmed, excluding weekends and holidays.</p>
<h2>Shipping Rates and Delivery</h2>
<p>Shipping rates, available methods, estimated delivery dates, taxes, and duties are calculated at secure Shopify checkout before payment is completed.</p>
<p>Delivery estimates are provided by the carrier and may vary due to address accuracy, weather, carrier volume, or customs processing.</p>
<h2>Tracking</h2>
<p>When tracking is available, customers receive shipment details by email after the order has been fulfilled.</p>
<h2>Address Accuracy</h2>
<p>Customers are responsible for entering a complete and accurate shipping address. Contact Jamm Trade quickly if an address needs correction before fulfillment.</p>`,
  },
  {
    alias: 'shippingReturnsPage',
    title: 'Shipping & Returns',
    handle: 'shipping-returns',
    templateSuffix: 'policy',
    body: `<h2>Shipping</h2>
<p>Orders are typically processed within 1 to 3 business days after payment confirmation. Shipping rates and delivery estimates are confirmed during secure Shopify checkout.</p>
<h2>Returns</h2>
<p>Eligible return requests must be made within 14 days of delivery. Items must be unused, unopened, and in original retail packaging unless the item arrived damaged or incorrect.</p>
<h2>Support</h2>
<p>Contact Jamm Trade with your order number and product details for shipping, delivery, return, or damaged-item support.</p>`,
  },
  {
    alias: 'termsPage',
    title: 'Terms of Service',
    handle: 'terms-of-service',
    templateSuffix: 'policy',
    body: `<h2>Store Use</h2>
<p>By using this website, you agree to provide accurate account, contact, billing, and shipping information when placing an order.</p>
<p>Jamm Trade may refuse or cancel orders that appear fraudulent, contain pricing errors, violate these terms, or cannot be fulfilled.</p>
<h2>Product Information</h2>
<p>Jamm Trade works to present product titles, images, descriptions, availability, and pricing accurately. Minor packaging or presentation differences may occur by supplier or production batch.</p>
<h2>Pricing and Payment</h2>
<p>Prices are shown in the storefront currency and confirmed at checkout. Taxes, shipping, and applicable duties are calculated during checkout before payment is submitted.</p>
<h2>Checkout and Fulfillment</h2>
<p>Purchases are completed through secure Shopify checkout. Order fulfillment depends on payment authorization, inventory availability, and successful carrier acceptance.</p>`,
  },
  {
    alias: 'fleetPage',
    title: 'Jamm Fleet',
    handle: 'jamm-fleet',
    templateSuffix: 'jamm-fleet',
    body: '',
  },
  {
    alias: 'cargoPage',
    title: 'Jamm Cargo',
    handle: 'jamm-cargo',
    templateSuffix: 'jamm-cargo',
    body: '',
  },
  {
    alias: 'clothingPage',
    title: 'Clothing',
    handle: 'clothing',
    templateSuffix: 'clothing',
    body: '',
  },
];

const mutations = PAGES.map((p) =>
  pageCreateMutation(p.alias, p.title, p.handle, p.templateSuffix, p.body)
).join('\n\n');

const query = `mutation CreateAllPages {\n${mutations}\n}`;

console.log('Creating pages...\n');
const data = await gql(query);

for (const [key, result] of Object.entries(data)) {
  if (result.userErrors?.length) {
    console.error(`✗ ${key}: ${result.userErrors.map((e) => e.message).join(', ')}`);
  } else {
    console.log(`✓ ${result.page.title} → /pages/${result.page.handle}`);
  }
}
