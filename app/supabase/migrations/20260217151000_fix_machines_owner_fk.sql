-- FIX: Corrige a foreign key de machines.owner_id para apontar para auth.users(id)

-- 1. Descobrir e remover a FK existente
DO $$
DECLARE
    fk_name text;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.table_name = 'machines'
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'owner_id'
        AND tc.table_schema = 'public';

    IF fk_name IS NOT NULL THEN
        RAISE NOTICE 'Removendo FK existente: %', fk_name;
        EXECUTE 'ALTER TABLE public.machines DROP CONSTRAINT ' || fk_name;
    ELSE
        RAISE NOTICE 'Nenhuma FK encontrada para owner_id';
    END IF;
END $$;

-- 2. Recriar a FK apontando para auth.users(id)
ALTER TABLE public.machines
ADD CONSTRAINT machines_owner_id_fkey
FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;
