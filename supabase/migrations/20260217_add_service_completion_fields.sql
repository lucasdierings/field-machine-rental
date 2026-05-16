-- =============================================
-- Migration: Add Service Completion Fields
-- Date: 2026-02-17
-- Description: Adds fields to bookings for tracking 
-- negotiated prices, billing type (hora/hectare/dia),
-- billing quantity, and completion timestamp.
-- Also creates a view for financial reporting.
-- =============================================

-- 1. Add new columns to bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS negotiated_price numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS billing_type text DEFAULT NULL CHECK (billing_type IN ('hora', 'hectare', 'dia', 'unidade', 'tonelada', 'km')),
ADD COLUMN IF NOT EXISTS billing_quantity numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS completed_at timestamptz DEFAULT NULL;

-- 2. Add comments for documentation
COMMENT ON COLUMN public.bookings.negotiated_price IS 'The final negotiated price between parties after service completion';
COMMENT ON COLUMN public.bookings.billing_type IS 'Type of billing: hora, hectare, dia, unidade, tonelada, km';
COMMENT ON COLUMN public.bookings.billing_quantity IS 'Quantity of billing units (e.g., 5 hours, 20 hectares)';
COMMENT ON COLUMN public.bookings.completed_at IS 'Timestamp when the service was marked as completed';

-- 3. Create or replace view for financial summaries
-- security_invoker = true makes the view run with the caller's privileges,
-- so the RLS policies on public.bookings are actually enforced.
CREATE OR REPLACE VIEW public.service_transactions
WITH (security_invoker = true) AS
SELECT
    b.id AS booking_id,
    b.machine_id,
    b.renter_id,
    b.owner_id,
    b.negotiated_price,
    b.billing_type,
    b.billing_quantity,
    b.completed_at,
    b.start_date,
    b.end_date,
    b.status,
    b.created_at,
    m.name AS machine_name,
    m.category AS machine_category,
    m.brand AS machine_brand
FROM public.bookings b
LEFT JOIN public.machines m ON m.id = b.machine_id
WHERE b.status = 'completed' 
  AND b.negotiated_price IS NOT NULL 
  AND b.negotiated_price > 0;

-- 4. Create index for faster financial queries
CREATE INDEX IF NOT EXISTS idx_bookings_completed 
ON public.bookings(owner_id, status, completed_at) 
WHERE status = 'completed';

CREATE INDEX IF NOT EXISTS idx_bookings_renter_completed 
ON public.bookings(renter_id, status, completed_at) 
WHERE status = 'completed';

-- 5. Grant Data API access to the view.
-- Starting May 30, 2026 (new projects) / Oct 30, 2026 (existing projects),
-- objects in "public" are NOT exposed to the Data API (supabase-js, PostgREST,
-- GraphQL) without an explicit GRANT. Required so this view stays reachable if
-- migrations are reapplied on a new project/branch.
-- RLS is enforced via security_invoker = true above + the existing policies on
-- public.bookings, so the view does not need its own policies.
GRANT SELECT ON public.service_transactions TO anon;
GRANT SELECT ON public.service_transactions TO authenticated;
GRANT SELECT ON public.service_transactions TO service_role;

-- 6. Backfill: for existing completed bookings, set negotiated_price from total_amount or total_price
UPDATE public.bookings 
SET negotiated_price = COALESCE(
    NULLIF(total_price, 0), 
    NULLIF(total_amount, 0)
),
completed_at = COALESCE(updated_at, created_at)
WHERE status = 'completed' 
  AND negotiated_price IS NULL
  AND (COALESCE(total_price, 0) > 0 OR COALESCE(total_amount, 0) > 0);
