import shopifyThemeSettings from '@/shopify-theme/config/settings_data.json'

type ShopifyThemeSettings = {
  current?: Record<string, string | undefined>
}

export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook' | 'x' | 'youtube'

export type SocialLink = {
  platform: SocialPlatform
  label: string
  url: string
}

const currentSettings = (shopifyThemeSettings as ShopifyThemeSettings).current ?? {}

function cleanUrl(value?: string) {
  return value?.trim() || undefined
}

const configuredSocialLinks = [
  {
    platform: 'instagram',
    label: 'Instagram',
    url: cleanUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ?? cleanUrl(currentSettings.instagram) ?? '',
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    url: cleanUrl(process.env.NEXT_PUBLIC_TIKTOK_URL) ?? cleanUrl(currentSettings.tiktok) ?? '',
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    url: cleanUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL) ?? cleanUrl(currentSettings.facebook) ?? '',
  },
  {
    platform: 'x',
    label: 'X',
    url: cleanUrl(process.env.NEXT_PUBLIC_X_URL) ?? cleanUrl(currentSettings.x_twitter) ?? '',
  },
  {
    platform: 'youtube',
    label: 'YouTube',
    url: cleanUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL) ?? cleanUrl(currentSettings.youtube) ?? '',
  },
] satisfies SocialLink[]

export const socialLinks = configuredSocialLinks.filter((link) => Boolean(link.url))
