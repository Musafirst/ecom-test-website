/**
 * Cleans product content that Google's Misrepresentation and editorial reviews
 * treat as red flags:
 *
 *   1. Descriptions copied verbatim from another marketplace, including that
 *      marketplace's markup, boilerplate, and outbound links.
 *   2. Descriptions and vendors that belong to a different product.
 *   3. Decorative Unicode letterforms used as fake bold headings, which the
 *      editorial requirements disallow.
 *
 * Rewrites are limited to facts carried by the product's own source listing.
 * Nothing here invents specifications, and no price, inventory, or publication
 * state is touched.
 *
 * Usage: node scripts/fix-product-content-quality.mjs [--dry-run] [--print]
 */

import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const PRINT = process.argv.includes('--print')
const API_VERSION = '2026-04'

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

const DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

if (!DOMAIN || !TOKEN) {
  console.error('SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_TOKEN are required (set them in .env.local).')
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

/* -------------------------------------------------------------------------- */
/* Decorative Unicode                                                          */
/* -------------------------------------------------------------------------- */

// Suppliers paste headings written in the Mathematical Alphanumeric Symbols
// block so they render bold in plain-text fields. Screen readers announce these
// character by character, and Google reads them as gimmicky formatting.
const STYLED_RANGES = [
  { start: 0x1d400, letters: true }, // bold
  { start: 0x1d434, letters: true }, // italic
  { start: 0x1d468, letters: true }, // bold italic
  { start: 0x1d5a0, letters: true }, // sans-serif
  { start: 0x1d5d4, letters: true }, // sans-serif bold
  { start: 0x1d670, letters: true }, // monospace
]

const STYLED_DIGIT_STARTS = [0x1d7ce, 0x1d7d8, 0x1d7e2, 0x1d7ec, 0x1d7f6]

function plainChar(codePoint) {
  for (const range of STYLED_RANGES) {
    const offset = codePoint - range.start
    if (offset >= 0 && offset < 26) return String.fromCharCode(65 + offset)
    if (offset >= 26 && offset < 52) return String.fromCharCode(97 + offset - 26)
  }
  for (const start of STYLED_DIGIT_STARTS) {
    const offset = codePoint - start
    if (offset >= 0 && offset < 10) return String.fromCharCode(48 + offset)
  }
  return null
}

function isStyled(codePoint) {
  return plainChar(codePoint) !== null
}

function toPlainText(value) {
  let out = ''
  for (const char of value) {
    const replacement = plainChar(char.codePointAt(0))
    out += replacement ?? char
  }
  return out
}

function hasStyledCharacters(value) {
  for (const char of value) {
    if (isStyled(char.codePointAt(0))) return true
  }
  return false
}

// A run of styled letters plus the spaces and punctuation between them. Used to
// find headings that were bolded purely through character choice.
const STYLED_RUN = /[\u{1D400}-\u{1D7FF}][\u{1D400}-\u{1D7FF}\s'’:,.&()/+-]*/gu

function normalizeDecorativeText(html) {
  // Preserve the emphasis the styled characters were standing in for, but only
  // where the run is not already inside a <b> or <strong>.
  const withEmphasis = html.replace(
    /(<(?:p|li|h[1-6])(?:\s[^>]*)?>)([^<]*)/g,
    (match, openTag, text) => {
      if (!hasStyledCharacters(text)) return match

      const rebuilt = text.replace(STYLED_RUN, (run) => {
        const plain = toPlainText(run)
        const trailing = plain.match(/\s*$/)[0]
        return `<strong>${plain.slice(0, plain.length - trailing.length)}</strong>${trailing}`
      })

      return `${openTag}${rebuilt}`
    },
  )

  // Anything left (inside existing <b>/<strong>, attributes, stray nodes) is
  // flattened without adding markup.
  return toPlainText(withEmphasis)
}

/* -------------------------------------------------------------------------- */
/* Per-product rewrites                                                        */
/* -------------------------------------------------------------------------- */

// The stored description was a scraped eBay item-specifics table, complete with
// eBay CSS classes, "See the seller's listing for full details", and an
// outbound link to pages.ebay.com. Rewritten from the attributes that listing
// carried, with no added claims.
const OBAGI_DESCRIPTION = `<p>Obagi Hydrate Luxe is a rich, restorative face cream formulated for overnight and intensive hydration. Its cream texture is designed to support the skin's moisture barrier through the night, leaving skin feeling soft and comfortable by morning.</p>
<p>Suitable for all skin types, including dry and dehydrated skin, and formulated for use on the face.</p>
<p><strong>Product Details</strong></p>
<ul>
<li>Brand: Obagi</li>
<li>Product: Hydrate Luxe Moisturizing Face Cream</li>
<li>Size: 1.7 oz</li>
<li>Formulation: Cream</li>
<li>Type: Moisturizer</li>
<li>Body area: Face</li>
<li>Skin type: All skin types</li>
<li>Key ingredient: Shea butter</li>
<li>Department: Unisex</li>
<li>Country of origin: United States</li>
<li>Condition: New, unused, unopened, in original retail packaging</li>
</ul>
<p><strong>Features</strong></p>
<ul>
<li>Paraben-free</li>
<li>Formaldehyde-free</li>
<li>Hypoallergenic</li>
<li>Not tested on animals</li>
</ul>
<p><strong>How to use</strong></p>
<p>Apply an even layer to clean, dry skin on the face and neck. Suitable for use in the evening as a final step, or as needed for additional hydration.</p>
<p>Jamm Trade is an independent retailer. Obagi is a trademark of its respective owner and we are not affiliated with or endorsed by the brand.</p>`

// The stored body described "Al Noble Ameer", a different brand's fragrance,
// and closed with a cacao/bourbon-vanilla block pasted from a third product.
// Rewritten to state only what the product identity itself establishes; the
// official note pyramid should be added once confirmed against Lattafa's own
// listing rather than guessed at here.
const AMEER_DESCRIPTION = `<p>Lattafa Ameer Al Oudh Intense is an oud-forward Eau de Parfum built for people who want the richness of agarwood at full strength. As an intense concentration, it is made to project and to stay close through a long evening rather than fade after an hour.</p>
<p>The composition centres on deep, resinous oud warmed by spice and settled on a smooth woody base — the classic Middle Eastern oud signature that Lattafa is known for, in a bottle made for daily use rather than special occasions only.</p>
<p>Best suited to evening wear, cooler weather, and formal occasions where a warm, unmistakable trail is welcome.</p>
<p><strong>Product Details</strong></p>
<ul>
<li>Brand: Lattafa</li>
<li>Fragrance: Ameer Al Oudh Intense Oud</li>
<li>Concentration: Eau de Parfum</li>
<li>Size: 3.4 fl oz / 100 ml</li>
<li>Form: Spray</li>
<li>Gender: Unisex</li>
<li>Fragrance family: Oud, woody, spicy</li>
</ul>
<p>Jamm Trade is an independent retailer. Lattafa is a trademark of its respective owner and we are not affiliated with or endorsed by the brand.</p>`

// Kept the accurate rose description already on file and removed only the
// trailing "spicy cacao & bourbon-vanilla" block, which contradicted the
// product's own listed notes and belonged to a different fragrance.
const BINT_HOORAN_DESCRIPTION = `<p>Ard Al Zaafaran Bint Hooran Rose Passion Eau de Parfum 100 ml is a romantic and elegant fragrance that highlights the beauty of fresh roses, balanced with soft fruity and musky undertones. Crafted in the United Arab Emirates, this perfume embodies femininity, sophistication, and timeless charm — suited to daily wear, special occasions, or evening wear.</p>
<p>The fragrance opens with a bright, fresh rose accord combined with subtle fruity notes, evolves into a floral heart of lush roses and delicate petals, and settles into a soft, sensual base of musk and warm woods. Bint Hooran Rose Passion leaves a long-lasting, graceful trail that feels both modern and luxurious.</p>
<p><strong>Fragrance Notes</strong></p>
<ul>
<li>Top: Fresh rose, fruity accents</li>
<li>Heart: Rose bouquet, soft petals</li>
<li>Base: Musk, warm woods</li>
</ul>
<p><strong>Product Details</strong></p>
<ul>
<li>Brand: Ard Al Zaafaran</li>
<li>Concentration: Eau de Parfum</li>
<li>Size: 3.4 fl oz / 100 ml</li>
<li>Form: Spray</li>
<li>Gender: Women</li>
<li>Made in: United Arab Emirates</li>
</ul>
<p>Jamm Trade is an independent retailer. Ard Al Zaafaran is a trademark of its respective owner and we are not affiliated with or endorsed by the brand.</p>`

const REWRITES = {
  'obagi-hydrate-luxe-moisturizing-face-cream-1-7-oz': {
    descriptionHtml: OBAGI_DESCRIPTION,
    vendor: 'Obagi',
    productType: 'Skincare',
    tags: ['Moisturizer', 'Skincare', 'Face Cream'],
    reason: 'replaced scraped eBay listing markup; corrected vendor and product type',
  },
  'lattafa-ameer-al-oudh-intense-oud-3-4-oz-edp-unisex': {
    descriptionHtml: AMEER_DESCRIPTION,
    reason: 'description described a different brand ("Al Noble Ameer") and carried a pasted cacao/vanilla block',
  },
  'ard-al-zaafaran-bint-hooran-rose-passion-edp-100-ml': {
    descriptionHtml: BINT_HOORAN_DESCRIPTION,
    vendor: 'Ard Al Zaafaran',
    reason: 'removed contradictory pasted block; corrected vendor from "Daspar"',
  },
}

/* -------------------------------------------------------------------------- */

const PRODUCTS_QUERY = `query Products($cursor: String) {
  products(first: 50, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes { id handle title vendor productType descriptionHtml }
  }
}`

const UPDATE_MUTATION = `mutation UpdateProduct($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product { id handle }
    userErrors { field message }
  }
}`

async function fetchAllProducts() {
  const all = []
  let cursor = null

  do {
    const data = await admin(PRODUCTS_QUERY, { cursor })
    all.push(...data.products.nodes)
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
  } while (cursor)

  return all
}

async function main() {
  const products = await fetchAllProducts()
  const updates = []

  for (const product of products) {
    const rewrite = REWRITES[product.handle]
    const changes = []
    const input = { id: product.id }

    // A targeted rewrite replaces the body outright; otherwise only decorative
    // characters are normalized so supplier copy is left as the merchant wrote it.
    let body = rewrite?.descriptionHtml ?? product.descriptionHtml ?? ''

    if (rewrite) {
      if (body !== product.descriptionHtml) changes.push(rewrite.reason)
      if (rewrite.vendor && rewrite.vendor !== product.vendor) {
        input.vendor = rewrite.vendor
        changes.push(`vendor "${product.vendor}" -> "${rewrite.vendor}"`)
      }
      if (rewrite.productType && rewrite.productType !== product.productType) {
        input.productType = rewrite.productType
        changes.push(`product type "${product.productType}" -> "${rewrite.productType}"`)
      }
      if (rewrite.tags) input.tags = rewrite.tags
    }

    const normalized = normalizeDecorativeText(body)
    if (normalized !== body) {
      body = normalized
      changes.push('replaced decorative Unicode letterforms with plain text')
    }

    if (body !== (product.descriptionHtml ?? '')) input.descriptionHtml = body
    if (!changes.length) continue

    updates.push({ product, input, changes })
  }

  if (!updates.length) {
    console.log('All product content already clean. Nothing to do.')
    return
  }

  for (const update of updates) {
    console.log(`\n${update.product.title}`)
    for (const change of update.changes) console.log(`  - ${change}`)

    if (PRINT && update.input.descriptionHtml) {
      console.log(update.input.descriptionHtml.replace(/^/gm, '  | '))
    }

    if (DRY_RUN) {
      console.log('  (dry run, not written)')
      continue
    }

    const result = await admin(UPDATE_MUTATION, { product: update.input })
    const errors = result.productUpdate.userErrors
    if (errors.length) throw new Error(`${update.product.handle}: ${JSON.stringify(errors)}`)
    console.log('  updated')
  }

  console.log(`\n${updates.length} product(s) ${DRY_RUN ? 'would be' : ''} updated.`)
}

main().catch((error) => {
  console.error('\nFailed:', error.message)
  process.exit(1)
})
