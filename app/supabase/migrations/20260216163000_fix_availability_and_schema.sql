-- Drop the ambiguous function if it exists (forcing cleanup of overloads)
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, date, date);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, timestamp, timestamp);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, timestamp with time zone, timestamp with time zone);

-- Recreate the function with specific types (using DATE as it's sufficient for daily rentals)
CREATE OR REPLACE FUNCTION public.check_machine_availability(
    machine_uuid uuid,
    start_dt date,
    end_dt date
)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if there are any overlapping bookings with status 'confirmed' or 'pending'
    -- (We might want to exclude rejected/cancelled)
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

-- Add operator_type to machines if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'machines' AND column_name = 'operator_type') THEN
        ALTER TABLE machines ADD COLUMN operator_type TEXT CHECK (operator_type IN ('owner', 'hired'));
    END IF;
END $$;

-- Add platform_rating to reviews if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'platform_rating') THEN
        ALTER TABLE reviews ADD COLUMN platform_rating NUMERIC;
    END IF;
END $$;
