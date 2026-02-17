-- Drop the foreign table since it poses a security risk and cannot have RLS applied
-- Foreign tables cannot have Row Level Security policies, making them inherently insecure
DROP FOREIGN TABLE IF EXISTS public.login_google;