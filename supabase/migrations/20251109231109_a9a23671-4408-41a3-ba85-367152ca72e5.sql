-- Create private schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS private;

-- Grant usage on private schema
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT USAGE ON SCHEMA private TO anon;

-- Check if function exists and grant permissions
DO $$
BEGIN
  -- Grant execute permission on the is_admin function if it exists
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'private' AND p.proname = 'is_admin'
  ) THEN
    GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO authenticated;
    GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO anon;
  END IF;
END $$;