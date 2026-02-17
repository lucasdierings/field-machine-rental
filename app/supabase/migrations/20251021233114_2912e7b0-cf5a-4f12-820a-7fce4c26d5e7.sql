-- Fix remaining functions without search_path
CREATE OR REPLACE FUNCTION public.calculate_booking_price(machine_uuid uuid, start_dt date, end_dt date, pricing_type text, quantity_val numeric DEFAULT NULL::numeric)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
DECLARE
    machine_record RECORD;
    days INT;
    total NUMERIC;
    platform_fee_pct NUMERIC := 0.10;
    result JSONB;
BEGIN
    SELECT * INTO machine_record
    FROM machines
    WHERE id = machine_uuid;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Máquina não encontrada';
    END IF;
    
    CASE pricing_type
        WHEN 'hour' THEN
            IF machine_record.price_hour IS NULL THEN
                RAISE EXCEPTION 'Máquina não tem preço por hora configurado';
            END IF;
            total := machine_record.price_hour * COALESCE(quantity_val, 1);
            
        WHEN 'day' THEN
            IF machine_record.price_day IS NULL THEN
                RAISE EXCEPTION 'Máquina não tem preço por dia configurado';
            END IF;
            days := end_dt - start_dt + 1;
            total := machine_record.price_day * days;
            
        WHEN 'hectare' THEN
            IF machine_record.price_hectare IS NULL THEN
                RAISE EXCEPTION 'Máquina não tem preço por hectare configurado';
            END IF;
            IF quantity_val IS NULL THEN
                RAISE EXCEPTION 'Quantidade de hectares é obrigatória';
            END IF;
            total := machine_record.price_hectare * quantity_val;
            
        ELSE
            RAISE EXCEPTION 'Tipo de preço inválido: %', pricing_type;
    END CASE;
    
    result := jsonb_build_object(
        'subtotal', total,
        'platform_fee', ROUND(total * platform_fee_pct, 2),
        'total', ROUND(total * (1 + platform_fee_pct), 2),
        'days', COALESCE(days, 0),
        'quantity', COALESCE(quantity_val, 0)
    );
    
    RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.can_user_review(booking_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM bookings
        WHERE id = booking_uuid
        AND status = 'completed'
        AND (renter_id = user_uuid OR owner_id = user_uuid)
        AND NOT EXISTS (
            SELECT 1 FROM reviews
            WHERE booking_id = booking_uuid
            AND reviewer_id = user_uuid
        )
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    PERFORM create_notification(
        NEW.owner_id,
        'new_booking',
        'Nova Solicitação de Reserva',
        'Você recebeu uma nova solicitação de reserva para sua máquina.',
        '/bookings/' || NEW.id
    );
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $function$
BEGIN
    IF OLD.status != NEW.status THEN
        PERFORM create_notification(
            NEW.renter_id,
            'booking_status_change',
            'Status da Reserva Atualizado',
            'O status da sua reserva foi alterado para: ' || NEW.status,
            '/bookings/' || NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$function$;