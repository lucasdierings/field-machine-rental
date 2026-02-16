-- 1. Fix ambiguous function check_machine_availability

DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, date, date);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, timestamp, timestamp);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, text, text);

CREATE OR REPLACE FUNCTION public.check_machine_availability(
    machine_uuid uuid,
    start_dt date,
    end_dt date
)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1
        FROM bookings
        WHERE machine_id = machine_uuid
        AND status IN ('pending', 'confirmed') 
        AND (
            (start_date, end_date) OVERLAPS (start_dt, end_dt)
        )
    );
END;
$function$;

-- 2. Create search_alerts table
CREATE TABLE IF NOT EXISTS public.search_alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid, -- Optional, can happen before login
    email text, -- Optional if user not logged in
    category text,
    location text, 
    radius_km integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Reset Data (Preserving Admin)
-- Implemented as a manual step recommendation or a separate dangerous script.
-- For this migration file, we focus on schema and functions.
