-- Credex MVP — run in Supabase SQL editor (or migrate) before using /api/share and /api/leads.
-- Uses service role from the Next.js server; enable RLS only if you add anon policies.

create table if not exists public.audit_shares (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_shares_created_at on public.audit_shares (created_at desc);

create table if not exists public.audit_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  company text,
  role text,
  team_size text,
  share_id text references public.audit_shares (id) on delete set null,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists audit_leads_ip_created on public.audit_leads (ip, created_at desc);
