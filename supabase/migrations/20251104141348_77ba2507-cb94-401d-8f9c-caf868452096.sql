-- Remove SECURITY DEFINER views e mantém apenas funções seguras
-- As views serão substituídas por funções que já existem e validam permissões admin

DROP VIEW IF EXISTS public.admin_platform_stats;
DROP VIEW IF EXISTS public.admin_users_list;
DROP VIEW IF EXISTS public.admin_bookings_list;
DROP VIEW IF EXISTS public.admin_machines_list;
DROP VIEW IF EXISTS public.admin_pending_documents;
DROP VIEW IF EXISTS public.admin_analytics_summary;

-- As funções SECURITY DEFINER já existem e são seguras pois verificam is_admin():
-- - get_admin_platform_stats()
-- - get_admin_users_list(p_limit, p_offset)
-- - get_admin_machines_list(p_limit, p_offset)
-- - get_admin_bookings_list(p_limit, p_offset)
-- - get_admin_pending_documents()
-- - get_admin_analytics_summary(p_start_date, p_end_date)

-- Todas essas funções verificam permissão admin antes de retornar dados sensíveis