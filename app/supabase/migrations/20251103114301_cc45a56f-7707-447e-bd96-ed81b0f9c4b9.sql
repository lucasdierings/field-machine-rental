-- Proteger views admin com funções seguras
-- Substituir views por funções SECURITY DEFINER que verificam permissão admin

-- Função helper is_admin já existe, vamos usá-la

-- 1. Função para buscar estatísticas da plataforma (admin only)
CREATE OR REPLACE FUNCTION get_admin_platform_stats()
RETURNS TABLE (
  total_users bigint,
  verified_users bigint,
  new_users_7d bigint,
  new_users_30d bigint,
  total_machines bigint,
  available_machines bigint,
  rented_machines bigint,
  new_machines_30d bigint,
  total_bookings bigint,
  pending_bookings bigint,
  confirmed_bookings bigint,
  active_bookings bigint,
  completed_bookings bigint,
  new_bookings_30d bigint,
  total_revenue numeric,
  revenue_30d numeric,
  total_platform_fees numeric,
  total_reviews bigint,
  average_rating numeric,
  total_leads bigint,
  new_leads_30d bigint
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores';
  END IF;

  RETURN QUERY
  SELECT * FROM admin_platform_stats LIMIT 1;
END;
$$;

-- 2. Função para listar usuários (admin only)
CREATE OR REPLACE FUNCTION get_admin_users_list(
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  auth_user_id uuid,
  full_name text,
  email varchar,
  phone text,
  cpf_cnpj text,
  user_types text[],
  profile_image text,
  verified boolean,
  rating numeric,
  total_transactions integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  machines_count bigint,
  rentals_count bigint,
  services_count bigint,
  pending_documents bigint,
  last_sign_in_at timestamp with time zone
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores';
  END IF;

  RETURN QUERY
  SELECT * FROM admin_users_list
  ORDER BY created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- 3. Função para listar máquinas (admin only)
CREATE OR REPLACE FUNCTION get_admin_machines_list(
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  brand text,
  model text,
  year integer,
  status text,
  price_hour numeric,
  price_day numeric,
  price_hectare numeric,
  location jsonb,
  created_at timestamp with time zone,
  owner_id uuid,
  owner_name text,
  owner_email varchar,
  owner_phone text,
  owner_verified boolean,
  total_bookings bigint,
  completed_bookings bigint,
  total_revenue numeric
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores';
  END IF;

  RETURN QUERY
  SELECT * FROM admin_machines_list
  ORDER BY created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- 4. Função para listar reservas (admin only)
CREATE OR REPLACE FUNCTION get_admin_bookings_list(
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  machine_name text,
  machine_category text,
  start_date date,
  end_date date,
  status text,
  payment_status text,
  total_price numeric,
  platform_fee numeric,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  renter_name text,
  renter_email varchar,
  renter_phone text,
  owner_name text,
  owner_email varchar,
  owner_phone text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores';
  END IF;

  RETURN QUERY
  SELECT * FROM admin_bookings_list
  ORDER BY created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- 5. Função para listar documentos pendentes (admin only)
CREATE OR REPLACE FUNCTION get_admin_pending_documents()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_name text,
  user_email varchar,
  user_phone text,
  cpf_cnpj text,
  document_type text,
  document_url text,
  created_at timestamp with time zone
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores';
  END IF;

  RETURN QUERY
  SELECT * FROM admin_pending_documents
  ORDER BY created_at ASC;
END;
$$;

-- 6. Função para analytics summary (admin only)
CREATE OR REPLACE FUNCTION get_admin_analytics_summary(
  p_start_date date DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  date date,
  event_type text,
  event_count bigint,
  unique_users bigint,
  unique_sessions bigint
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores';
  END IF;

  RETURN QUERY
  SELECT * FROM admin_analytics_summary
  WHERE admin_analytics_summary.date BETWEEN p_start_date AND p_end_date
  ORDER BY admin_analytics_summary.date DESC;
END;
$$;

-- Garantir que as views admin existentes não sejam acessíveis diretamente
-- (Elas continuam existindo para uso interno pelas funções)
REVOKE ALL ON admin_platform_stats FROM authenticated;
REVOKE ALL ON admin_users_list FROM authenticated;
REVOKE ALL ON admin_machines_list FROM authenticated;
REVOKE ALL ON admin_bookings_list FROM authenticated;
REVOKE ALL ON admin_pending_documents FROM authenticated;
REVOKE ALL ON admin_analytics_summary FROM authenticated;

-- Garantir que apenas as funções sejam acessíveis
GRANT EXECUTE ON FUNCTION get_admin_platform_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_users_list(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_machines_list(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_bookings_list(integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_pending_documents() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_analytics_summary(date, date) TO authenticated;
