-- Explicitly drop all possible variations to clear ambiguity
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, date, date);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, timestamp, timestamp);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, timestamp with time zone, timestamp with time zone);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, text, text);

-- Create a single, canonical version using DATE
CREATE OR REPLACE FUNCTION public.check_machine_availability(
    machine_id uuid,
    start_date date,
    end_date date
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1
        FROM bookings
        WHERE bookings.machine_id = check_machine_availability.machine_id
        AND status IN ('pending', 'confirmed')
        AND (
            (bookings.start_date, bookings.end_date) OVERLAPS (check_machine_availability.start_date, check_machine_availability.end_date)
        )
    );
END;
$$
