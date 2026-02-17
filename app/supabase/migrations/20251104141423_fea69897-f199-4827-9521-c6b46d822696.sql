-- Remove todas as views SECURITY DEFINER restantes
DROP VIEW IF EXISTS public.available_machines_view;
DROP VIEW IF EXISTS public.machine_pricing;
DROP VIEW IF EXISTS public.machine_public;
DROP VIEW IF EXISTS public.user_stats_view;

-- Corrige search_path nas funções que não têm
ALTER FUNCTION public.calculate_user_rating(uuid) SET search_path = public;
ALTER FUNCTION public.check_machine_availability(uuid, date, date) SET search_path = public;
ALTER FUNCTION public.create_notification(uuid, text, text, text, text) SET search_path = public;
ALTER FUNCTION public.calculate_booking_price(uuid, date, date, text, numeric) SET search_path = public;
ALTER FUNCTION public.can_user_review(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.current_auth_user_id() SET search_path = public;