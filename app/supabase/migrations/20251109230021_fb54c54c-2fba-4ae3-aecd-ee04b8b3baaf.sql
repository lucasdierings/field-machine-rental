-- Fix search_path issues in existing functions

-- Fix notify_new_booking function
CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix validate_user_cpf_cnpj function
CREATE OR REPLACE FUNCTION public.validate_user_cpf_cnpj()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    IF NEW.cpf_cnpj IS NOT NULL AND NOT validate_cpf_cnpj(NEW.cpf_cnpj) THEN
        RAISE EXCEPTION 'CPF/CNPJ inválido: %', NEW.cpf_cnpj;
    END IF;
    RETURN NEW;
END;
$function$;

-- Fix validate_booking_availability function
CREATE OR REPLACE FUNCTION public.validate_booking_availability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
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

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.user_profiles (auth_user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$function$;

-- Fix delete_machine_files function
CREATE OR REPLACE FUNCTION public.delete_machine_files()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    DELETE FROM machine_images WHERE machine_id = OLD.id;
    RETURN OLD;
END;
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Fix update_user_rating function
CREATE OR REPLACE FUNCTION public.update_user_rating()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    new_rating NUMERIC;
BEGIN
    SELECT calculate_user_rating(NEW.reviewed_id) INTO new_rating;
    
    UPDATE user_profiles
    SET rating = new_rating
    WHERE auth_user_id = NEW.reviewed_id;
    
    RETURN NEW;
END;
$function$;

-- Fix notify_booking_status_change function
CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
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

-- Fix admin_approve_document function
CREATE OR REPLACE FUNCTION public.admin_approve_document(document_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Apenas administradores podem aprovar documentos';
    END IF;
    
    UPDATE user_documents
    SET 
        verified = true,
        verified_at = NOW(),
        verified_by = auth.uid(),
        rejection_reason = NULL
    WHERE id = document_id;
    
    UPDATE user_profiles up
    SET verified = true
    WHERE auth_user_id IN (
        SELECT user_id FROM user_documents WHERE id = document_id
    )
    AND NOT EXISTS (
        SELECT 1 FROM user_documents ud
        WHERE ud.user_id = up.auth_user_id
        AND ud.verified = false
    );
    
    RETURN true;
END;
$function$;

-- Fix admin_reject_document function
CREATE OR REPLACE FUNCTION public.admin_reject_document(document_id uuid, reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Apenas administradores podem rejeitar documentos';
    END IF;
    
    UPDATE user_documents
    SET 
        verified = false,
        verified_at = NOW(),
        verified_by = auth.uid(),
        rejection_reason = reason
    WHERE id = document_id;
    
    UPDATE user_profiles
    SET verified = false
    WHERE auth_user_id IN (
        SELECT user_id FROM user_documents WHERE id = document_id
    );
    
    PERFORM create_notification(
        (SELECT user_id FROM user_documents WHERE id = document_id),
        'document_rejected',
        'Documento Rejeitado',
        'Um dos seus documentos foi rejeitado. Motivo: ' || reason,
        '/profile/documents'
    );
    
    RETURN true;
END;
$function$;

-- Fix admin_deactivate_machine function
CREATE OR REPLACE FUNCTION public.admin_deactivate_machine(machine_id uuid, reason text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Apenas administradores podem desativar máquinas';
    END IF;
    
    UPDATE machines
    SET status = 'inactive'
    WHERE id = machine_id;
    
    PERFORM create_notification(
        (SELECT owner_id FROM machines WHERE id = machine_id),
        'machine_deactivated',
        'Máquina Desativada',
        COALESCE('Sua máquina foi desativada. Motivo: ' || reason, 'Sua máquina foi desativada pela administração.'),
        '/machines/' || machine_id
    );
    
    RETURN true;
END;
$function$;