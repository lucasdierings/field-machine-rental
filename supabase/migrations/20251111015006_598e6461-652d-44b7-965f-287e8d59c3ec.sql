-- Adicionar novos campos para categoria de transporte de cargas
ALTER TABLE machines 
ADD COLUMN IF NOT EXISTS has_munck boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS load_capacity_kg numeric,
ADD COLUMN IF NOT EXISTS price_per_km numeric,
ADD COLUMN IF NOT EXISTS price_per_ton numeric;

-- Comentários explicativos
COMMENT ON COLUMN machines.has_munck IS 'Se o caminhão possui munck (guindaste)';
COMMENT ON COLUMN machines.load_capacity_kg IS 'Capacidade de carga em quilogramas';
COMMENT ON COLUMN machines.price_per_km IS 'Preço por quilômetro rodado';
COMMENT ON COLUMN machines.price_per_ton IS 'Preço por tonelada transportada';