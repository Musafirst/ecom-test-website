import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getMetricSnapshot, logWarning } from '@/lib/observability'

export const dynamic = 'force-dynamic'

function safeEqual(left: string, right: string) {
  try {
    return crypto.timingSafeEqual(Buffer.from(left), Buffer.from(right))
  } catch {
    return false
  }
}

export function GET(req: NextRequest) {
  const expectedToken = process.env.OBSERVABILITY_METRICS_TOKEN
  const providedToken = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''

  if (!expectedToken || !safeEqual(providedToken, expectedToken)) {
    logWarning('metrics.unauthorized')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(getMetricSnapshot(), {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
