-- Fix user deletion error: "null value in column user_id of relation user_documents violates not-null constraint"
-- This happens because the foreign key was set to ON DELETE SET NULL, but the column doesn't allow nulls.
-- We change it to ON DELETE CASCADE so documents are deleted when the user is deleted.

DO $$
DECLARE
    fk_name text;
BEGIN
    -- Find the Foreign Key name for user_id on user_documents table
    SELECT constraint_name INTO fk_name
    FROM information_schema.key_column_usage
    WHERE table_name = 'user_documents' 
    AND column_name = 'user_id' 
    AND table_schema = 'public';

    -- Drop the existing constraint if found
    IF fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.user_documents DROP CONSTRAINT ' || fk_name;
    END IF;
END $$;

-- Add the correct Foreign Key constraint
ALTER TABLE public.user_documents
ADD CONSTRAINT user_documents_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;
