import { expect, test } from '@playwright/test'

// Product handles below reflect current Shopify collection assignments
// (Shopify is the source of truth). A product may belong to several
// collections at once, so membership — not a derived "family" label — is what
// each collection page must reflect.
const SHARED_OUD_DAILY = 'swiss-arabian-oud-07' // assigned to Oud AND Daily
const SHARED_AMBER_DAILY = 'afnan-9pm' // assigned to Amber AND Daily
const OUD_ONLY = 'dehn-al-oud' // Oud only
const AMBER_ONLY = 'gucci-guilty' // Amber only
const KHAMRAH_AMBER_ONLY = 'lattafa-khamrah' // Amber only (not Daily, not Oud)

async function productHandlesOnPage(page: import('@playwright/test').Page) {
  const hrefs = await page
    .locator('.product a[href*="/shop/product/"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''))
  return hrefs
}

test.describe('Jamm Trade storefront smoke checks', () => {
  test('collection, clothing, fleet, and cargo pages render', async ({ page }) => {
    for (const path of ['/shop/collection/daily', '/shop/category/clothing', '/jamm-fleet', '/jamm-cargo']) {
      await page.goto(path)
      await expect(page.locator('body')).toBeVisible()
      await expect(page.locator('h1').first()).toBeVisible()
    }
  })

  test('shop shortcut clothing card points to clothing category', async ({ page }) => {
    await page.goto('/shop')
    await expect(page.getByRole('link', { name: /clothing/i }).first()).toHaveAttribute(
      'href',
      /\/shop\/category\/clothing$/,
    )
  })

  test('hero starts with house slide and keeps videos matched to slide order', async ({ page }) => {
    await page.goto('/shop')

    await expect(page.locator('.slide--house')).toHaveClass(/is-active/)
    await expect(page.locator('.hero__video--house')).toHaveClass(/is-active/)
    await expect(page.getByRole('heading', { name: /from essentials/i })).toBeVisible()

    await page.locator('.hero__dots .dot').nth(3).click()
    await expect(page.locator('.slide--clothing')).toHaveClass(/is-active/)
    await expect(page.locator('.hero__video--clothing')).toHaveClass(/is-active/)
    await expect(page.getByRole('heading', { name: /wear the mark/i })).toBeVisible()

    await page.locator('.hero__dots .dot').nth(4).click()
    await expect(page.locator('.slide--eco')).toHaveClass(/is-active/)
    await expect(page.locator('.hero__video.is-active')).toHaveCount(0)
    await expect(page.getByText(/tap a point to explore/i)).toBeVisible()
  })

  test('scent collection pages reflect Shopify membership (incl. shared products), no refresh needed', async ({ page }) => {
    // OUD: contains its oud-only and the oud+daily shared product; never amber-only ones.
    await page.goto('/shop/collection/oud')
    let handles = await productHandlesOnPage(page)
    expect(handles.length, 'oud page renders products on first load').toBeGreaterThan(0)
    expect(handles.some((h) => h.includes(OUD_ONLY))).toBe(true)
    expect(handles.some((h) => h.includes(SHARED_OUD_DAILY))).toBe(true)
    expect(handles.some((h) => h.includes(AMBER_ONLY))).toBe(false)
    expect(handles.some((h) => h.includes(KHAMRAH_AMBER_ONLY))).toBe(false)

    // AMBER: contains amber-only products; never the oud-only one.
    await page.goto('/shop/collection/amber')
    handles = await productHandlesOnPage(page)
    expect(handles.length).toBeGreaterThan(0)
    expect(handles.some((h) => h.includes(AMBER_ONLY))).toBe(true)
    expect(handles.some((h) => h.includes(KHAMRAH_AMBER_ONLY))).toBe(true)
    expect(handles.some((h) => h.includes(OUD_ONLY))).toBe(false)

    // DAILY: must include the shared oud+daily and amber+daily products that the
    // previous single-family filter wrongly dropped; never the oud-only/amber-only ones.
    await page.goto('/shop/collection/daily')
    handles = await productHandlesOnPage(page)
    expect(handles.length).toBeGreaterThan(0)
    expect(handles.some((h) => h.includes(SHARED_OUD_DAILY)), 'oud+daily product appears on daily').toBe(true)
    expect(handles.some((h) => h.includes(SHARED_AMBER_DAILY)), 'amber+daily product appears on daily').toBe(true)
    expect(handles.some((h) => h.includes(OUD_ONLY))).toBe(false)
    expect(handles.some((h) => h.includes(AMBER_ONLY))).toBe(false)
  })

  test('empty Shopify collection shows an empty state, not fake products', async ({ page }) => {
    // electronics-collection has no products assigned in Shopify.
    await page.goto('/shop/collection/electronics')
    const handles = await productHandlesOnPage(page)
    expect(handles.length, 'no product cards on an empty collection').toBe(0)
    await expect(page.getByText(/temporarily unavailable|no products/i).first()).toBeVisible()
  })
})
