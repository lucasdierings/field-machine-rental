-- Support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text,
  user_email text,
  subject text NOT NULL,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'outro' CHECK (category IN ('duvida', 'reclamacao', 'sugestao', 'bug', 'outro')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  admin_notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  closed_at timestamptz
);

-- Indexes
CREATE INDEX idx_support_tickets_user ON public.support_tickets (user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets (status);
CREATE INDEX idx_support_tickets_created ON public.support_tickets (created_at DESC);

-- RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can read their own tickets
CREATE POLICY "support_tickets_user_read" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own tickets
CREATE POLICY "support_tickets_user_insert" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can read all tickets (via user_roles)
CREATE POLICY "support_tickets_admin_read" ON public.support_tickets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Admin can update any ticket
CREATE POLICY "support_tickets_admin_update" ON public.support_tickets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
