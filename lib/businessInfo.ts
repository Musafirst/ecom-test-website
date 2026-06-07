import shopifyThemeSettings from '@/shopify-theme/config/settings_data.json'
import { site } from '@/lib/site'

type ShopifyThemeSettings = {
  current?: Record<string, string | undefined>
}

const currentSettings = (shopifyThemeSettings as ShopifyThemeSettings).current ?? {}

function cleanSetting(value?: string) {
  return value?.trim() || undefined
}

export const businessInfo = {
  name: `${site.name} LLC`,
  supportEmail: cleanSetting(process.env.NEXT_PUBLIC_SUPPORT_EMAIL) ?? cleanSetting(currentSettings.support_email) ?? site.supportEmail,
  publicLocation: cleanSetting(process.env.NEXT_PUBLIC_PUBLIC_LOCATION) ?? cleanSetting(currentSettings.public_location) ?? site.publicLocation,
}
