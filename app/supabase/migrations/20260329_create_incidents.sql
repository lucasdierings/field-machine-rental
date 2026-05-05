-- Incidents table for status page
CREATE TABLE IF NOT EXISTS public.incidents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
  created_at timestamptz DEFAULT now() NOT NULL,
  resolved_at timestamptz
);

-- Incident updates (timeline entries)
CREATE TABLE IF NOT EXISTS public.incident_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id uuid NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_incidents_created ON public.incidents (created_at DESC);
CREATE INDEX idx_incident_updates_incident ON public.incident_updates (incident_id, created_at DESC);

-- Public read access
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "incidents_public_read" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "incident_updates_public_read" ON public.incident_updates FOR SELECT USING (true);

-- Admin insert/update
CREATE POLICY "incidents_admin_insert" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "incidents_admin_update" ON public.incidents FOR UPDATE USING (true);
CREATE POLICY "incident_updates_admin_insert" ON public.incident_updates FOR INSERT WITH CHECK (true);
