-- 1. Fix Bookings with NULL owner_id by copying from Machines
-- This fixes the issue where bookings were created without an owner_id
UPDATE public.bookings b
SET owner_id = m.owner_id
FROM public.machines m
WHERE b.machine_id = m.id
AND b.owner_id IS NULL
AND m.owner_id IS NOT NULL;

-- 2. Ensure RLS allows Public Read on Machines (just in case)
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read machines" ON public.machines;
CREATE POLICY "Public read machines" ON public.machines FOR SELECT USING (true);

-- 3. Verify and fix User Profiles RLS (Again, just to be sure)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.user_profiles FOR SELECT
USING ( true );
