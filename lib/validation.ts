export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null

  const cleaned = value.trim()
  return cleaned && cleaned.length <= maxLength ? cleaned : null
}

export function cleanEmail(value: unknown) {
  const email = cleanText(value, 254)?.toLowerCase()
  return email && emailPattern.test(email) ? email : null
}
