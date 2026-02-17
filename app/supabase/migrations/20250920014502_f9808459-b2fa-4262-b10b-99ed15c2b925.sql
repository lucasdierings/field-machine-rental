-- Create alerts table for producers to receive machine notifications
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category TEXT,
  location JSONB,
  radius_km INTEGER DEFAULT 50,
  min_power INTEGER,
  max_power INTEGER,
  price_range JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
CREATE POLICY "Users can manage their own alerts" 
ON public.alerts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create machine_bookings table for tracking rental history
CREATE TABLE public.machine_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_id UUID NOT NULL REFERENCES public.machines ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.machine_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for machine_bookings
CREATE POLICY "Users can view bookings they are involved in" 
ON public.machine_bookings 
FOR SELECT 
USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create bookings as renters" 
ON public.machine_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Owners can update their machine bookings" 
ON public.machine_bookings 
FOR UPDATE 
USING (auth.uid() = owner_id);

-- Update machines table to allow insertions by authenticated users
DROP POLICY IF EXISTS "machines_public_rows" ON public.machines;

-- New RLS policies for machines
CREATE POLICY "Anyone can view machines" 
ON public.machines 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert machines" 
ON public.machines 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own machines" 
ON public.machines 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own machines" 
ON public.machines 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Add auth_user_id reference to machines table
ALTER TABLE public.machines 
ADD COLUMN auth_owner_id UUID REFERENCES auth.users;

-- Update existing machines to have auth_owner_id
UPDATE public.machines 
SET auth_owner_id = auth.uid() 
WHERE auth_owner_id IS NULL;

-- Create user_profiles table to store additional user data
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  phone TEXT,
  cpf_cnpj TEXT,
  address JSONB,
  user_type TEXT CHECK (user_type IN ('producer', 'owner')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can manage their own profile" 
ON public.user_profiles 
FOR ALL 
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Profiles are publicly readable for business purposes" 
ON public.user_profiles 
FOR SELECT 
USING (true);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (auth_user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();