-- Fix user_documents foreign key to reference auth.users instead of public.users
-- The auth.users table is managed by Supabase Auth, so we need to ensure the FK points there

-- Drop the existing foreign key constraint
ALTER TABLE public.user_documents
DROP CONSTRAINT IF EXISTS fk_user_documents_user;

-- Add new foreign key pointing to auth.users
ALTER TABLE public.user_documents
ADD CONSTRAINT fk_user_documents_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id 
ON public.user_documents(user_id);

-- Add index for verified status queries
CREATE INDEX IF NOT EXISTS idx_user_documents_verified 
ON public.user_documents(verified, user_id);
