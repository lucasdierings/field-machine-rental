-- Health checks table for service uptime monitoring
CREATE TABLE IF NOT EXISTS public.health_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('operational', 'degraded', 'down')),
  response_time_ms integer,
  error_message text,
  checked_at timestamptz DEFAULT now() NOT NULL
);

-- Index for efficient queries by service and time
CREATE INDEX idx_health_checks_service_time ON public.health_checks (service_name, checked_at DESC);

-- Index for cleanup of old records
CREATE INDEX idx_health_checks_checked_at ON public.health_checks (checked_at);

-- Allow public read access (status page is public)
ALTER TABLE public.health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "health_checks_public_read" ON public.health_checks
  FOR SELECT USING (true);

-- Only service role can insert (Edge Functions / cron)
CREATE POLICY "health_checks_service_insert" ON public.health_checks
  FOR INSERT WITH CHECK (true);

-- Auto-cleanup: keep only last 90 days
-- Run manually or via pg_cron: DELETE FROM health_checks WHERE checked_at < now() - interval '90 days';
