-- Fix User Profiles RLS to allow Joins
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.user_profiles FOR SELECT
USING ( true );

-- Fix Bookings RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING ( auth.uid() = renter_id OR auth.uid() = owner_id );

DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
CREATE POLICY "Users can insert bookings"
ON public.bookings FOR INSERT
WITH CHECK ( auth.uid() = renter_id );

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING ( auth.uid() = renter_id OR auth.uid() = owner_id );
