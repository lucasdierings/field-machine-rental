-- Primeiro, remover a view existente
DROP VIEW IF EXISTS admin_platform_stats;

-- Criar view admin_platform_stats para o dashboard administrativo
CREATE VIEW admin_platform_stats AS
SELECT
  -- Usuários
  (SELECT COUNT(*) FROM user_profiles) as total_users,
  (SELECT COUNT(*) FROM user_profiles WHERE verified = true) as verified_users,
  (SELECT COUNT(*) FROM user_profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30d,
  (SELECT COUNT(*) FROM user_profiles WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_users_7d,
  
  -- Máquinas
  (SELECT COUNT(*) FROM machines) as total_machines,
  (SELECT COUNT(*) FROM machines WHERE status = 'available') as available_machines,
  (SELECT COUNT(*) FROM machines WHERE status = 'rented') as rented_machines,
  (SELECT COUNT(*) FROM machines WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_machines_30d,
  
  -- Reservas
  (SELECT COUNT(*) FROM bookings) as total_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'in_progress') as active_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'completed') as completed_bookings,
  (SELECT COUNT(*) FROM bookings WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_bookings_30d,
  
  -- Receita
  (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'completed') as total_revenue,
  (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'completed' AND created_at >= CURRENT_DATE - INTERVAL '30 days') as revenue_30d,
  (SELECT COALESCE(SUM(platform_fee), 0) FROM bookings WHERE status = 'completed') as total_platform_fees,
  
  -- Reviews e Leads
  (SELECT COUNT(*) FROM reviews) as total_reviews,
  (SELECT ROUND(AVG(rating), 2) FROM reviews) as average_rating,
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM leads WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_leads_30d;