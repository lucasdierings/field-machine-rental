-- Conceder acesso admin para fieldmachinebrasil@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('3ab89e68-73d5-4243-96dc-1c22029f7c7b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;