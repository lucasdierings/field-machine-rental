CREATE OR REPLACE FUNCTION public.check_machine_availability(
    p_machine_id uuid,
    p_start_date date,
    p_end_date date
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1
        FROM bookings
        WHERE bookings.machine_id = p_machine_id
        AND status IN ('pending', 'confirmed')
        AND (
            (bookings.start_date, bookings.end_date) OVERLAPS (p_start_date, p_end_date)
        )
    );
END;
$$
