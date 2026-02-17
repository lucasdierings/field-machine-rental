-- Conceder acesso admin para lucasdierings12@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('e6ef6e9f-38c0-4539-827d-d84141411aff', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;