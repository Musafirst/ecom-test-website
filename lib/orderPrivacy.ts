function asRecord(value: unknown) {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function nullableString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function nullableNumber(value: unknown) {
  const number = typeof value === 'string' || typeof value === 'number' ? Number(value) : Number.NaN
  return Number.isFinite(number) ? number : null
}

function minimizeShippingAddress(value: unknown) {
  const address = asRecord(value)
  if (Object.keys(address).length === 0) return null

  return {
    first_name: nullableString(address.first_name),
    last_name: nullableString(address.last_name),
    company: nullableString(address.company),
    address1: nullableString(address.address1),
    address2: nullableString(address.address2),
    city: nullableString(address.city),
    province: nullableString(address.province),
    zip: nullableString(address.zip),
    country_code: nullableString(address.country_code),
  }
}
function minimizeLineItems(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.slice(0, 250).map((entry) => {
    const item = asRecord(entry)
    return {
      id: nullableString(item.id) ?? (typeof item.id === 'number' ? String(item.id) : null),
      variant_id: nullableString(item.variant_id) ?? (typeof item.variant_id === 'number' ? String(item.variant_id) : null),
      sku: nullableString(item.sku),
      title: nullableString(item.title),
      quantity: nullableNumber(item.quantity),
      price: nullableNumber(item.price),
    }
  })
}

// Store only fields needed for order support and statutory record keeping.
// Shopify remains the payment processor; never persist payment-card details.
export function minimizeShopifyOrder(order: Record<string, unknown>) {
  const customer = asRecord(order.customer)
  const shopifyCreatedAt = order.created_at ? new Date(String(order.created_at)) : new Date()
  const expiresAt = new Date(shopifyCreatedAt)
  expiresAt.setFullYear(expiresAt.getFullYear() + 7)

  return {
    shopify_order_id: String(order.id),
    shopify_order_number: order.order_number ? String(order.order_number) : null,
    customer_email: nullableString(order.email) ?? nullableString(customer.email),
    customer_first_name: nullableString(customer.first_name),
    customer_last_name: nullableString(customer.last_name),
    line_items: minimizeLineItems(order.line_items),
    subtotal_price: nullableNumber(order.subtotal_price),
    total_shipping: nullableNumber(asRecord(asRecord(order.total_shipping_price_set).shop_money).amount),
    total_tax: nullableNumber(order.total_tax),
    total_price: nullableNumber(order.total_price),
    currency: nullableString(order.currency),
    financial_status: nullableString(order.financial_status),
    fulfillment_status: nullableString(order.fulfillment_status),
    shipping_address: minimizeShippingAddress(order.shipping_address),
    shopify_created_at: shopifyCreatedAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  }
}
