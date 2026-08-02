'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

// The ID is interpolated into an inline script, so only accept the
// alphanumeric shape TikTok actually issues (e.g. C0FVA2RC77U9K3LDMSQG).
const rawPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
const pixelId = rawPixelId && /^[A-Za-z0-9]+$/.test(rawPixelId) ? rawPixelId : undefined

// Official TikTok pixel base code. The snippet stubs window.ttq as a command
// queue immediately, so lib/analytics.ts can call ttq.track() before
// events.js finishes loading. The snippet's own ttq.page() covers the first
// page; the effect below re-fires it on client-side route changes, which a
// Next.js app never triggers a full load for.
function baseCode(id: string) {
  return `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${id}');
  ttq.page();
}(window, document, 'ttq');`
}

export function TikTokPixel() {
  const pathname = usePathname()
  const isFirstPage = useRef(true)

  useEffect(() => {
    if (!pixelId) return
    if (isFirstPage.current) {
      isFirstPage.current = false
      return
    }
    window.ttq?.page()
  }, [pathname])

  if (!pixelId) return null

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: baseCode(pixelId) }}
    />
  )
}
