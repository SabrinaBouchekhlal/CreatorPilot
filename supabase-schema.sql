-- CreatorPilot application tables for Supabase PostgreSQL.
-- Run this once in Supabase SQL Editor before deploying the app.

create table if not exists public.users (
  id text primary key,
  email text not null unique,
  name text not null,
  role text not null default 'creator_pro',
  workspace_id text not null default 'ws-default-01',
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.brand_profiles (
  id text primary key,
  user_id text not null unique references public.users(id) on delete cascade,
  name text not null,
  niche text not null,
  target_audience text not null,
  voice_tone text not null,
  primary_offer text not null,
  content_language text not null default 'ar_standard',
  content_dialect text not null default 'ar_standard',
  constraints text not null default '',
  pillars text not null default '[]',
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists public.content_decisions (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  rank integer not null,
  title text not null,
  trend_id text,
  platform text not null,
  format text not null,
  confidence text not null,
  freshness text not null,
  recommended_timing text not null,
  why_recommended text not null,
  what_is_uncertain text not null,
  hook text not null,
  outline text not null,
  cta text not null,
  status text not null default 'proposed',
  created_at timestamp not null default now()
);

create table if not exists public.calendar_items (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  title text not null,
  platform text not null,
  format text not null,
  time text not null,
  horizon text not null default '48h',
  pillar text not null,
  status text not null default 'draft',
  hook text,
  notes text,
  decision_id text,
  created_at timestamp not null default now()
);

create table if not exists public.library_items (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  content text not null,
  tags text not null default '[]',
  created_at timestamp not null default now()
);

create table if not exists public.instagram_connections (
  id text primary key,
  user_id text not null unique references public.users(id) on delete cascade,
  is_connected boolean not null default false,
  account_name text,
  account_type text,
  token_expires_at text,
  permissions text,
  metrics text,
  updated_at timestamp not null default now()
);

create table if not exists public.audit_logs (
  id text primary key,
  user_id text not null,
  action text not null,
  details text not null,
  status text not null,
  timestamp timestamp not null default now()
);

create table if not exists public.trend_signals (
  id text primary key,
  title text not null,
  source text not null,
  source_url text not null,
  category text not null,
  velocity integer not null,
  freshness_days integer not null,
  observed_at timestamptz,
  region text,
  language text,
  evidence_type text,
  decay_status text not null,
  confidence text not null,
  is_verified boolean not null default false,
  niche_fit_score integer not null,
  summary text not null
);

create index if not exists content_decisions_user_id_idx on public.content_decisions(user_id);
create index if not exists calendar_items_user_id_idx on public.calendar_items(user_id);
create index if not exists library_items_user_id_idx on public.library_items(user_id);
create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);

alter table public.users enable row level security;
alter table public.brand_profiles enable row level security;
alter table public.content_decisions enable row level security;
alter table public.calendar_items enable row level security;
alter table public.library_items enable row level security;
alter table public.instagram_connections enable row level security;
alter table public.audit_logs enable row level security;
alter table public.trend_signals enable row level security;

create policy users_select_own on public.users
  for select to authenticated using (id = auth.uid()::text);
create policy users_insert_own on public.users
  for insert to authenticated with check (id = auth.uid()::text);
create policy users_update_own on public.users
  for update to authenticated using (id = auth.uid()::text) with check (id = auth.uid()::text);

create policy brand_profiles_own on public.brand_profiles
  for all to authenticated
  using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy content_decisions_own on public.content_decisions
  for all to authenticated
  using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy calendar_items_own on public.calendar_items
  for all to authenticated
  using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy library_items_own on public.library_items
  for all to authenticated
  using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy instagram_connections_own on public.instagram_connections
  for all to authenticated
  using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy audit_logs_select_own on public.audit_logs
  for select to authenticated using (user_id = auth.uid()::text);
create policy trend_signals_read on public.trend_signals
  for select to authenticated using (true);
