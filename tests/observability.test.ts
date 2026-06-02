import { describe, expect, it, vi } from 'vitest'
import { getMetricSnapshot, incrementMetric, logError } from '@/lib/observability'

describe('privacy-safe observability', () => {
  it('redacts sensitive labels and raw error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    logError('lead.failed', new Error('customer@example.com token=secret'), {
      email: 'customer@example.com',
      route: '/api/jamm-cargo',
      token: 'secret',
    })

    const logged = String(consoleSpy.mock.calls[0][0])
    expect(logged).toContain('/api/jamm-cargo')
    expect(logged).not.toContain('customer@example.com')
    expect(logged).not.toContain('secret')
    consoleSpy.mockRestore()
  })

  it('collects low-cardinality counters without sensitive labels', () => {
    incrementMetric('lead_submissions_total', {
      form: 'cargo',
      result: 'accepted',
      email: 'customer@example.com',
    })

    const serialized = JSON.stringify(getMetricSnapshot())
    expect(serialized).toContain('lead_submissions_total')
    expect(serialized).toContain('accepted')
    expect(serialized).not.toContain('customer@example.com')
  })
})
