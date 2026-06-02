import { describe, expect, it } from 'vitest'
import { parseCargoLead, parseFleetLead } from '@/lib/apiValidation'
import { cleanEmail, cleanText } from '@/lib/validation'

describe('shared validation', () => {
  it('normalizes valid customer emails', () => {
    expect(cleanEmail('  PERSON@Example.COM ')).toBe('person@example.com')
  })

  it('rejects invalid and oversized text', () => {
    expect(cleanEmail('not-an-email')).toBeNull()
    expect(cleanText('1234', 3)).toBeNull()
  })
})
describe('lead validation', () => {
  it('accepts and trims a cargo lead after consent', () => {
    const parsed = parseCargoLead({
      full_name: '  Jane Doe ',
      email: ' JANE@example.com ',
      destination_country: ' Ghana ',
      item_type: ' Personal effects ',
      consent_accepted: true,
    })

    expect(parsed.data).toMatchObject({
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      destination_country: 'Ghana',
      item_type: 'Personal effects',
      consent_accepted: true,
    })
  })

  it('requires explicit cargo consent', () => {
    expect(parseCargoLead({
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      destination_country: 'Ghana',
      item_type: 'Personal effects',
    }).error).toMatch(/agree to be contacted/i)
  })

  it('bounds fleet platform selections and requires a usable phone number', () => {
    const parsed = parseFleetLead({
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '2155550100',
      state: 'PA',
      city: 'Philadelphia',
      license_status: 'valid',
      platform_interest: Array.from({ length: 12 }, (_, index) => `platform-${index}`),
      consent_accepted: true,
    })

    expect(parsed.data?.platform_interest?.split(', ')).toHaveLength(10)
    expect(parseFleetLead({
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '12',
      state: 'PA',
      city: 'Philadelphia',
      license_status: 'valid',
      consent_accepted: true,
    }).error).toMatch(/phone/i)
  })
})
