-- Fix search_path in functions
CREATE OR REPLACE FUNCTION public.validate_booking_availability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM machines 
        WHERE id = NEW.machine_id 
        AND status = 'available'
    ) THEN
        RAISE EXCEPTION 'Máquina não está disponível para reserva';
    END IF;
    
    IF NOT check_machine_availability(NEW.machine_id, NEW.start_date, NEW.end_date) THEN
        RAISE EXCEPTION 'Máquina já possui reserva confirmada para este período';
    END IF;
    
    IF NEW.start_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Data de início não pode ser no passado';
    END IF;
    
    IF NEW.end_date < NEW.start_date THEN
        RAISE EXCEPTION 'Data de término deve ser posterior à data de início';
    END IF;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_machine_owner()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles
        WHERE auth_user_id = NEW.owner_id
        AND verified = true
    ) THEN
        RAISE EXCEPTION 'Apenas usuários verificados podem cadastrar máquinas';
    END IF;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_user_cpf_cnpj()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    IF NEW.cpf_cnpj IS NOT NULL AND NOT validate_cpf_cnpj(NEW.cpf_cnpj) THEN
        RAISE EXCEPTION 'CPF/CNPJ inválido: %', NEW.cpf_cnpj;
    END IF;
    RETURN NEW;
END;
$function$;