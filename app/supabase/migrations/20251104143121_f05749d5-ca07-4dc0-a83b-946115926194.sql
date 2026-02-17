-- Adicionar role admin para o usuário fieldmachinebrasil@gmail.com
-- Este script é idempotente - pode ser executado múltiplas vezes sem problemas

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'fieldmachinebrasil@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;