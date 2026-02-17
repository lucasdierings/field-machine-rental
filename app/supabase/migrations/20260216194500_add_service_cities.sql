-- Add service_cities column to machines table
-- This allows storing multiple cities a machine serves
ALTER TABLE public.machines 
ADD COLUMN IF NOT EXISTS service_cities text[] DEFAULT '{}';

-- Index for searching (GIN index for array)
CREATE INDEX IF NOT EXISTS idx_machines_service_cities ON public.machines USING GIN(service_cities);
