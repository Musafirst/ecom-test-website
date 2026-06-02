import { describe, expect, it } from 'vitest'
import { minimizeShopifyOrder } from '@/lib/orderPrivacy'

describe('Shopify order PII minimization', () => {
  it('keeps required order fields and drops arbitrary sensitive payload fields', () => {
    const minimized = minimizeShopifyOrder({
      id: 123,
      order_number: 1001,
      email: 'customer@example.com',
      created_at: '2026-06-01T12:00:00.000Z',
      customer: {
        first_name: 'Jane',
        last_name: 'Doe',
        phone: '2155550100',
      },
      shipping_address: {
        first_name: 'Jane',
        last_name: 'Doe',
        address1: '123 Main St',
        city: 'Philadelphia',
        province: 'PA',
        zip: '19103',
        country_code: 'US',
        phone: '2155550100',
      },
      line_items: [{
        id: 5,
        variant_id: 9,
        sku: 'SKU-1',
        title: 'Perfume',
        quantity: 1,
        price: '29.99',
        properties: [{ name: 'gift note', value: 'private note' }],
      }],
    })

    expect(minimized.shipping_address).not.toHaveProperty('phone')
    expect(minimized.line_items[0]).not.toHaveProperty('properties')
    expect(minimized.expires_at).toBe('2033-06-01T12:00:00.000Z')
  })
})
