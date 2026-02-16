-- DANGEROUS: This script resets the database data.
-- 1. Truncate tables with CASCADE to likely clean associated data (like notifications)
-- Note: 'user_profiles' is likely a public table that mirrors auth.users.
-- We cannot easily delete auth.users from here without the Supabase dashboard usage, but we can clean public tables.

-- Allow inserts on search_alerts for non-authenticated users if needed (for alerts)
-- First, ensure the table exists
CREATE TABLE IF NOT EXISTS public.search_alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid, -- Optional
    email text, -- Optional
    category text,
    location text, 
    radius_km integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reset Public Data
TRUNCATE TABLE public.search_alerts CASCADE;
TRUNCATE TABLE public.reviews CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.machines CASCADE;
TRUNCATE TABLE public.notifications CASCADE;

-- Clean user_profiles (Public Table)
-- Preserving ONLY the admin email
DELETE FROM public.user_profiles 
WHERE email NOT IN ('lucasdierings12@gmail.com', 'lucasdierings12@gmail');

-- TO DELETE USERS FROM AUTHENTICATION (Supabase Auth):
-- You must go to the Authentication tab in your Supabase Dashboard
-- Select all users except your admin account and delete them manually.
-- This script CANNOT delete from auth.users due to safety policies in SQL Editor.

-- Enable 'public' insert policy for search_alerts to fix the registration error
ALTER TABLE public.search_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.search_alerts;

CREATE POLICY "Enable insert for all users" 
ON public.search_alerts 
FOR INSERT 
WITH CHECK (true);

-- Ensure machines table has 'specifications' column if not already
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}'::jsonb;

