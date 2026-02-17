-- Funções de validação de CPF e CNPJ para PostgreSQL
-- Implementa os algoritmos oficiais de validação de documentos brasileiros

-- ============================================
-- VALIDAÇÃO DE CPF
-- ============================================
CREATE OR REPLACE FUNCTION public.validate_cpf(cpf TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  numbers TEXT;
  digit1 INT;
  digit2 INT;
  sum INT;
  i INT;
BEGIN
  -- Remove caracteres não numéricos
  numbers := regexp_replace(cpf, '[^0-9]', '', 'g');
  
  -- Verifica se tem 11 dígitos
  IF length(numbers) != 11 THEN
    RETURN FALSE;
  END IF;
  
  -- Rejeita CPFs com todos dígitos iguais
  IF numbers ~ '^(\d)\1{10}$' THEN
    RETURN FALSE;
  END IF;
  
  -- Calcula primeiro dígito verificador
  sum := 0;
  FOR i IN 0..8 LOOP
    sum := sum + substring(numbers, i+1, 1)::INT * (10 - i);
  END LOOP;
  digit1 := 11 - (sum % 11);
  IF digit1 >= 10 THEN
    digit1 := 0;
  END IF;
  
  -- Calcula segundo dígito verificador
  sum := 0;
  FOR i IN 0..9 LOOP
    sum := sum + substring(numbers, i+1, 1)::INT * (11 - i);
  END LOOP;
  digit2 := 11 - (sum % 11);
  IF digit2 >= 10 THEN
    digit2 := 0;
  END IF;
  
  -- Verifica se os dígitos calculados conferem
  RETURN substring(numbers, 10, 1)::INT = digit1 
     AND substring(numbers, 11, 1)::INT = digit2;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- VALIDAÇÃO DE CNPJ
-- ============================================
CREATE OR REPLACE FUNCTION public.validate_cnpj(cnpj TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  numbers TEXT;
  digit1 INT;
  digit2 INT;
  sum INT;
  weight INT;
  i INT;
BEGIN
  -- Remove caracteres não numéricos
  numbers := regexp_replace(cnpj, '[^0-9]', '', 'g');
  
  -- Verifica se tem 14 dígitos
  IF length(numbers) != 14 THEN
    RETURN FALSE;
  END IF;
  
  -- Rejeita CNPJs com todos dígitos iguais
  IF numbers ~ '^(\d)\1{13}$' THEN
    RETURN FALSE;
  END IF;
  
  -- Calcula primeiro dígito verificador
  sum := 0;
  weight := 5;
  FOR i IN 0..11 LOOP
    sum := sum + substring(numbers, i+1, 1)::INT * weight;
    weight := CASE WHEN weight = 2 THEN 9 ELSE weight - 1 END;
  END LOOP;
  digit1 := 11 - (sum % 11);
  IF digit1 >= 10 THEN
    digit1 := 0;
  END IF;
  
  -- Calcula segundo dígito verificador
  sum := 0;
  weight := 6;
  FOR i IN 0..12 LOOP
    sum := sum + substring(numbers, i+1, 1)::INT * weight;
    weight := CASE WHEN weight = 2 THEN 9 ELSE weight - 1 END;
  END LOOP;
  digit2 := 11 - (sum % 11);
  IF digit2 >= 10 THEN
    digit2 := 0;
  END IF;
  
  -- Verifica se os dígitos calculados conferem
  RETURN substring(numbers, 13, 1)::INT = digit1 
     AND substring(numbers, 14, 1)::INT = digit2;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- VALIDAÇÃO COMBINADA CPF/CNPJ
-- ============================================
CREATE OR REPLACE FUNCTION public.validate_cpf_cnpj(doc TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  numbers TEXT;
BEGIN
  -- Permite valores nulos (validação opcional)
  IF doc IS NULL OR doc = '' THEN
    RETURN TRUE;
  END IF;

  numbers := regexp_replace(doc, '[^0-9]', '', 'g');
  
  IF length(numbers) = 11 THEN
    RETURN validate_cpf(doc);
  ELSIF length(numbers) = 14 THEN
    RETURN validate_cnpj(doc);
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON FUNCTION public.validate_cpf(TEXT) IS 'Valida CPF brasileiro usando algoritmo oficial com dígitos verificadores';
COMMENT ON FUNCTION public.validate_cnpj(TEXT) IS 'Valida CNPJ brasileiro usando algoritmo oficial com dígitos verificadores';
COMMENT ON FUNCTION public.validate_cpf_cnpj(TEXT) IS 'Valida CPF ou CNPJ automaticamente baseado no comprimento (11 ou 14 dígitos)';

-- ============================================
-- CONSTRAINT PARA user_profiles
-- ============================================
-- Adiciona constraint de validação na tabela user_profiles
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS valid_cpf_cnpj;

ALTER TABLE public.user_profiles
ADD CONSTRAINT valid_cpf_cnpj 
CHECK (validate_cpf_cnpj(cpf_cnpj));
