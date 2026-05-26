/**
 * Sets inventory to 10 for every product variant across all locations.
 *
 * Prerequisites — create a Shopify custom app with these Admin API scopes:
 *   read_products, write_inventory, read_inventory, read_locations
 *
 * Run:
 *   SHOPIFY_ADMIN_TOKEN=<token> node scripts/update-inventory.mjs
 *
 * Optional overrides:
 *   SHOPIFY_STORE_DOMAIN=<store>.myshopify.com   (defaults to jamm-trade)
 *   INVENTORY_QTY=<number>                        (defaults to 10)
 */

const STORE   = process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com';
const TOKEN   = process.env.SHOPIFY_ADMIN_TOKEN;
const QTY     = Number(process.env.INVENTORY_QTY ?? 10);

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

// Fetch the first location (primary fulfillment location).
async function getLocationId() {
  const data = await gql(`{ locations(first: 1) { edges { node { id name } } } }`);
  const loc = data.locations.edges[0]?.node;
  if (!loc) throw new Error('No locations found in this Shopify store.');
  console.log(`Using location: ${loc.name} (${loc.id})`);
  return loc.id;
}

// Paginate through all products and collect inventory item IDs + variant titles.
async function getAllInventoryItems() {
  const items = [];
  let cursor = null;
  let page = 0;

  while (true) {
    page++;
    const data = await gql(`
      query Products($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              title
              variants(first: 50) {
                edges {
                  node {
                    title
                    inventoryItem { id }
                  }
                }
              }
            }
          }
        }
      }
    `, { cursor });

    const { edges, pageInfo } = data.products;
    for (const { node: product } of edges) {
      for (const { node: variant } of product.variants.edges) {
        items.push({
          productTitle: product.title,
          variantTitle: variant.title,
          inventoryItemId: variant.inventoryItem.id,
        });
      }
    }

    process.stdout.write(`  fetched page ${page} (${items.length} variants so far)\r`);

    if (!pageInfo.hasNextPage) break;
    cursor = pageInfo.endCursor;
  }

  console.log(`\nFound ${items.length} variant(s) across ${page} page(s).`);
  return items;
}

// Set inventory for a batch of items (max 100 per mutation call).
async function setInventoryBatch(locationId, batch) {
  const quantities = batch.map(({ inventoryItemId }) => ({
    inventoryItemId,
    locationId,
    quantity: QTY,
  }));

  const data = await gql(`
    mutation SetQuantities($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup { id }
        userErrors { field message }
      }
    }
  `, {
    input: {
      name: 'available',
      reason: 'correction',
      quantities,
      ignoreCompareQuantity: true,
    },
  });

  const errors = data.inventorySetQuantities.userErrors;
  if (errors.length) throw new Error(JSON.stringify(errors, null, 2));
}

// ── main ──────────────────────────────────────────────────────────────────────

console.log(`\nConnecting to ${STORE}...\n`);

const locationId = await getLocationId();
const items      = await getAllInventoryItems();

const BATCH_SIZE = 100;
let done = 0;

for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const batch = items.slice(i, i + BATCH_SIZE);
  await setInventoryBatch(locationId, batch);
  done += batch.length;
  console.log(`Updated ${done}/${items.length} variants...`);
}

console.log(`\nDone. Set inventory = ${QTY} for all ${items.length} variant(s).`);
