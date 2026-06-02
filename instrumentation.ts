import { incrementMetric, logError, logEvent } from '@/lib/observability'

type RequestErrorContext = {
  routePath?: string
  routerKind?: string
  routeType?: string
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    logEvent('runtime.started')
  }
}

export function onRequestError(error: unknown, _request: unknown, context: RequestErrorContext) {
  const route = context.routePath ?? 'unknown'
  incrementMetric('next_request_errors_total', { route })
  logError('next.request_error', error, {
    route,
    routerKind: context.routerKind,
    routeType: context.routeType,
  })
}
