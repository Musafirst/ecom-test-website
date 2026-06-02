# PII Handling Guide

Jamm Trade collects only the personal information needed for checkout, order
support, discount claims, cargo quotes, and fleet inquiries.

## Data Boundaries

| Data | System of record | Purpose | Retention |
|---|---|---|---|
| Checkout and payment details | Shopify | Checkout, payment, fulfillment | Managed in Shopify |
| Minimized order copy | Supabase `orders` | Order support and statutory records | 7 years |
| Cargo inquiry | Supabase `jamm_cargo_leads` | Shipping quote follow-up | 2 years |
| Fleet inquiry | Supabase `jamm_fleet_leads` | Rental inquiry follow-up | 2 years |
| Discount email | Supabase `discount_claims` | Prevent repeated claims | Cleanup after 2 years |

## Rules

- Never store or log payment-card details. Shopify handles payment processing.
- Never log names, emails, phone numbers, addresses, request bodies, cart IDs,
  order numbers, tokens, cookies, or free-form notes.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, Shopify tokens, and observability tokens
  server-side. Never prefix them with `NEXT_PUBLIC_`.
- Store only whitelisted Shopify webhook fields. Arbitrary line-item properties
  are intentionally discarded because they may contain customer-entered text.
- Keep RLS enabled on lead tables. Only server routes using the service-role key
  may insert or read records.

## Retention Cleanup

Run `supabase-migrations.sql` in the Supabase SQL editor after deployment. It
adds `expires_at` to lead tables and creates:

```sql
select public.cleanup_expired_pii();
```

Schedule that statement daily with Supabase Cron. The function removes expired
lead records, old discount claims, and order records whose seven-year retention
period has ended.

## Observability

- `GET /api/health` is public and intentionally minimal.
- `GET /api/metrics` requires `Authorization: Bearer <OBSERVABILITY_METRICS_TOKEN>`.
- Metrics are per server instance and reset when a serverless instance is
  replaced. Use Vercel logs or an external collector for durable dashboards.
- Metric labels are deliberately low-cardinality and exclude customer data.
