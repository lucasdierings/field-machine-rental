-- Exclui funções ambíguas para garantir que apenas uma versão correta exista
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, date, date);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, timestamp, timestamp);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, timestamp with time zone, timestamp with time zone);
DROP FUNCTION IF EXISTS public.check_machine_availability(uuid, text, text);

-- Cria a versão definitiva da função de disponibilidade
CREATE OR REPLACE FUNCTION public.check_machine_availability(
    machine_uuid uuid,
    start_dt date,
    end_dt date
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$ LANGUAGE plpgsql;
