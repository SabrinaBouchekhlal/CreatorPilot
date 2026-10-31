ALTER TABLE public.trend_signals
  ADD COLUMN IF NOT EXISTS observed_at timestamptz,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS evidence_type text;

ALTER TABLE public.trend_signals
  ALTER COLUMN is_verified SET DEFAULT false;

UPDATE public.trend_signals
SET is_verified = false
WHERE observed_at IS NULL
   OR source_url ILIKE '%example.com%';

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_insert_own ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT TO authenticated USING (id = auth.uid()::text);
CREATE POLICY users_insert_own ON public.users
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid()::text);
CREATE POLICY users_update_own ON public.users
  FOR UPDATE TO authenticated USING (id = auth.uid()::text) WITH CHECK (id = auth.uid()::text);

DROP POLICY IF EXISTS brand_profiles_own ON public.brand_profiles;
CREATE POLICY brand_profiles_own ON public.brand_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS content_decisions_own ON public.content_decisions;
CREATE POLICY content_decisions_own ON public.content_decisions
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS calendar_items_own ON public.calendar_items;
CREATE POLICY calendar_items_own ON public.calendar_items
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS library_items_own ON public.library_items;
CREATE POLICY library_items_own ON public.library_items
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS instagram_connections_own ON public.instagram_connections;
CREATE POLICY instagram_connections_own ON public.instagram_connections
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);

DROP POLICY IF EXISTS audit_logs_select_own ON public.audit_logs;
CREATE POLICY audit_logs_select_own ON public.audit_logs
  FOR SELECT TO authenticated USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS trend_signals_read ON public.trend_signals;
CREATE POLICY trend_signals_read ON public.trend_signals
  FOR SELECT TO authenticated USING (true);
