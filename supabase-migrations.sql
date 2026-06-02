-- ============================================================
-- Jamm Trade — Supabase migrations
-- Run these in the Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. jamm_cargo_leads
-- Stores shipping quote requests submitted via /jamm-cargo
-- ────────────────────────────────────────────────────────────
create table if not exists public.jamm_cargo_leads (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  email               text not null,
  phone               text,
  origin_location     text,
  destination_country text not null,
  destination_city    text,
  item_type           text not null,
  estimated_weight    text,
  preferred_timeline  text,
  notes               text,
  consent_accepted    boolean not null default true,
  created_at          timestamptz not null default now(),
  expires_at          timestamptz not null default (now() + interval '2 years')
);

-- Index for quick lookup by email
create index if not exists jamm_cargo_leads_email_idx
  on public.jamm_cargo_leads (email);

-- Disable public read/write — only service_role key can access
alter table public.jamm_cargo_leads enable row level security;

-- No RLS policies needed; the service_role key bypasses RLS entirely.
-- Public anon users have zero access to this table.


-- ────────────────────────────────────────────────────────────
-- 2. jamm_fleet_leads
-- Stores vehicle rental inquiries submitted via /jamm-fleet
-- ────────────────────────────────────────────────────────────
create table if not exists public.jamm_fleet_leads (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  email               text not null,
  phone               text not null,
  state               text not null,
  city                text not null,
  license_status      text not null,
  platform_interest   text,          -- comma-separated, e.g. "Uber, DoorDash"
  desired_start_date  text,          -- stored as text to avoid timezone issues
  rental_duration     text,
  insurance_status    text,
  notes               text,
  consent_accepted    boolean not null default true,
  created_at          timestamptz not null default now(),
  expires_at          timestamptz not null default (now() + interval '2 years')
);

-- Index for quick lookup by email
create index if not exists jamm_fleet_leads_email_idx
  on public.jamm_fleet_leads (email);

-- Disable public read/write — only service_role key can access
alter table public.jamm_fleet_leads enable row level security;

-- No RLS policies needed; the service_role key bypasses RLS entirely.
-- Public anon users have zero access to this table.


-- ────────────────────────────────────────────────────────────
-- HOW TO VIEW LEADS
-- ────────────────────────────────────────────────────────────
-- In Supabase Dashboard > Table Editor, open jamm_cargo_leads
-- or jamm_fleet_leads to browse submissions.
--
-- Or run in SQL Editor:
--   select * from public.jamm_cargo_leads order by created_at desc;
--   select * from public.jamm_fleet_leads order by created_at desc;


-- ============================================================
-- 3. PII retention maintenance
-- Run this section on existing projects after adding the tables above.
-- Schedule `select public.cleanup_expired_pii();` daily with Supabase Cron.
-- ============================================================

alter table public.jamm_cargo_leads
  add column if not exists expires_at timestamptz
  default (now() + interval '2 years');

alter table public.jamm_fleet_leads
  add column if not exists expires_at timestamptz
  default (now() + interval '2 years');

update public.jamm_cargo_leads
set expires_at = created_at + interval '2 years'
where expires_at is null;

update public.jamm_fleet_leads
set expires_at = created_at + interval '2 years'
where expires_at is null;

alter table public.jamm_cargo_leads
  alter column expires_at set not null;

alter table public.jamm_fleet_leads
  alter column expires_at set not null;

create or replace function public.cleanup_expired_pii()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.jamm_cargo_leads where expires_at < now();
  delete from public.jamm_fleet_leads where expires_at < now();

  if to_regclass('public.discount_claims') is not null then
    execute 'delete from public.discount_claims where created_at < now() - interval ''2 years''';
  end if;

  if to_regclass('public.orders') is not null then
    execute 'delete from public.orders where expires_at < now()';
  end if;
end;
$$;

revoke all on function public.cleanup_expired_pii() from public, anon, authenticated;
grant execute on function public.cleanup_expired_pii() to service_role;
