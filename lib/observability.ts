type MetricLabels = Record<string, string | number | boolean | null | undefined>

type CounterMetric =
  | 'api_requests_total'
  | 'api_errors_total'
  | 'cart_operations_total'
  | 'lead_submissions_total'
  | 'shopify_webhooks_total'
  | 'next_request_errors_total'

type DurationMetric = 'api_request_duration_ms'

type MetricRegistry = {
  counters: Map<string, number>
  durations: Map<string, { count: number; sum: number; max: number }>
  startedAt: string
}

const sensitiveKeyPattern = /(address|authorization|body|cart|cookie|email|first_name|last_name|name|notes|password|payload|phone|secret|token)/i
const safeValuePattern = /^[a-zA-Z0-9_./:-]+$/
const registryKey = '__jammTradeMetricRegistry'

function getRegistry() {
  const globalRegistry = globalThis as typeof globalThis & {
    [registryKey]?: MetricRegistry
  }

  globalRegistry[registryKey] ??= {
    counters: new Map(),
    durations: new Map(),
    startedAt: new Date().toISOString(),
  }

  return globalRegistry[registryKey]
}

function sanitizeLabels(labels: MetricLabels = {}) {
  return Object.fromEntries(
    Object.entries(labels)
      .filter(([key, value]) => !sensitiveKeyPattern.test(key) && value !== undefined && value !== null)
      .map(([key, value]) => {
        const normalized = String(value)
        return [key, safeValuePattern.test(normalized) ? normalized.slice(0, 80) : 'redacted']
      })
      .sort(([left], [right]) => left.localeCompare(right)),
  )
}

function metricKey(name: string, labels: MetricLabels = {}) {
  return `${name}:${JSON.stringify(sanitizeLabels(labels))}`
}

function errorDetails(error: unknown) {
  if (!error || typeof error !== 'object') return { errorType: 'unknown' }

  const candidate = error as { name?: unknown; code?: unknown; status?: unknown }
  return {
    errorType: typeof candidate.name === 'string' ? candidate.name.slice(0, 80) : 'Error',
    errorCode: typeof candidate.code === 'string' || typeof candidate.code === 'number'
      ? String(candidate.code).slice(0, 80)
      : undefined,
    errorStatus: typeof candidate.status === 'string' || typeof candidate.status === 'number'
      ? String(candidate.status).slice(0, 20)
      : undefined,
  }
}
export function incrementMetric(name: CounterMetric, labels: MetricLabels = {}, amount = 1) {
  const registry = getRegistry()
  const key = metricKey(name, labels)
  registry.counters.set(key, (registry.counters.get(key) ?? 0) + amount)
}

export function observeDuration(name: DurationMetric, milliseconds: number, labels: MetricLabels = {}) {
  const registry = getRegistry()
  const key = metricKey(name, labels)
  const current = registry.durations.get(key) ?? { count: 0, sum: 0, max: 0 }
  const duration = Math.max(0, Math.round(milliseconds))

  registry.durations.set(key, {
    count: current.count + 1,
    sum: current.sum + duration,
    max: Math.max(current.max, duration),
  })
}

export function recordApiResult(route: string, status: number, startedAt: number) {
  const labels = { route, status }
  incrementMetric('api_requests_total', labels)
  observeDuration('api_request_duration_ms', Date.now() - startedAt, { route })

  if (status >= 500) {
    incrementMetric('api_errors_total', labels)
  }
}

export function logEvent(event: string, details: MetricLabels = {}) {
  console.info(JSON.stringify({
    level: 'info',
    event,
    ...sanitizeLabels(details),
    timestamp: new Date().toISOString(),
  }))
}

export function logWarning(event: string, details: MetricLabels = {}) {
  console.warn(JSON.stringify({
    level: 'warn',
    event,
    ...sanitizeLabels(details),
    timestamp: new Date().toISOString(),
  }))
}

export function logError(event: string, error: unknown, details: MetricLabels = {}) {
  console.error(JSON.stringify({
    level: 'error',
    event,
    ...sanitizeLabels(details),
    ...errorDetails(error),
    timestamp: new Date().toISOString(),
  }))
}

export function getMetricSnapshot() {
  const registry = getRegistry()

  return {
    startedAt: registry.startedAt,
    generatedAt: new Date().toISOString(),
    scope: 'current-server-instance',
    counters: Object.fromEntries(registry.counters),
    durations: Object.fromEntries(registry.durations),
  }
}
