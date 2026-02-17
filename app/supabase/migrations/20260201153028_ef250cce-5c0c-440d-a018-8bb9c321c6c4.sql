-- Zerar taxa da plataforma
UPDATE public.app_settings 
SET value = '0' 
WHERE key = 'platform_fee_percentage';

-- Inserir se não existir
INSERT INTO public.app_settings (key, value, description)
VALUES ('platform_fee_percentage', '0', 'Taxa da plataforma em % (0 = sem taxa)')
ON CONFLICT (key) DO UPDATE SET value = '0';

-- Criar tabela de disponibilidade do prestador
CREATE TABLE IF NOT EXISTS public.provider_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'PR',
    is_available BOOLEAN DEFAULT true,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(provider_id, date, start_time)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_provider_availability_date ON public.provider_availability(date);
CREATE INDEX IF NOT EXISTS idx_provider_availability_city ON public.provider_availability(city);
CREATE INDEX IF NOT EXISTS idx_provider_availability_provider ON public.provider_availability(provider_id);

-- Habilitar RLS
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Providers can manage their availability"
ON public.provider_availability
FOR ALL
USING (provider_id = auth.uid())
WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Anyone can view available slots"
ON public.provider_availability
FOR SELECT
USING (is_available = true);

-- Atualizar trigger de booking para marcar disponibilidade como ocupada
CREATE OR REPLACE FUNCTION public.mark_availability_booked()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Quando um booking é confirmado, marcar a disponibilidade como não disponível
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        UPDATE public.provider_availability
        SET is_available = false, booking_id = NEW.id
        WHERE provider_id = NEW.owner_id
        AND date BETWEEN NEW.start_date AND NEW.end_date
        AND is_available = true;
    END IF;
    
    -- Quando um booking é cancelado, liberar a disponibilidade
    IF NEW.status IN ('cancelled', 'rejected') AND OLD.status = 'confirmed' THEN
        UPDATE public.provider_availability
        SET is_available = true, booking_id = NULL
        WHERE booking_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS booking_availability_trigger ON public.bookings;
CREATE TRIGGER booking_availability_trigger
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.mark_availability_booked();

-- Atualizar função de cálculo para não cobrar taxa
CREATE OR REPLACE FUNCTION public.calc_booking_fees_from_machine()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_price numeric;
  base_amount numeric;
  chosen_price numeric;
  qty numeric := COALESCE(NEW.quantity, 1);
  ptype text := COALESCE(NEW.price_type, 'day');
BEGIN
  -- Fetch machine price depending on price_type
  SELECT
    COALESCE(
      CASE ptype
        WHEN 'hour' THEN m.price_hour
        WHEN 'hectare' THEN m.price_hectare
        ELSE m.price_day
      END,
    0)
  INTO chosen_price
  FROM public.machines m
  WHERE m.id = NEW.machine_id;

  IF chosen_price IS NULL THEN
    chosen_price := 0;
  END IF;

  base_amount := ROUND((COALESCE(chosen_price,0) * qty)::numeric, 2);

  NEW.delivery_fee := COALESCE(NEW.delivery_fee, 0);
  
  -- Sem taxa de plataforma
  NEW.platform_fee := 0;

  NEW.total_price := base_amount;
  NEW.total_amount := ROUND(base_amount + NEW.delivery_fee, 2);

  RETURN NEW;
END;
$$;