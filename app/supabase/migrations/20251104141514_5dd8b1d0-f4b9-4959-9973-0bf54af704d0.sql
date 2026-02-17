-- Corrige search_path nas funções restantes
ALTER FUNCTION public.check_machine_availability(uuid, date, date, uuid) SET search_path = public;
ALTER FUNCTION public.validate_cnpj(text) SET search_path = public;
ALTER FUNCTION public.validate_cpf(text) SET search_path = public;
ALTER FUNCTION public.validate_cpf_cnpj(text) SET search_path = public;
ALTER FUNCTION public.validate_email(text) SET search_path = public;
ALTER FUNCTION public.validate_phone_br(text) SET search_path = public;