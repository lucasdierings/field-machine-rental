-- Fix critical PII exposure in user_profiles table

-- 1. Drop overly permissive public policies
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable for business purposes" ON public.user_profiles;

-- 2. Create restrictive policies for authenticated users only
CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = auth_user_id);

-- 3. Allow viewing profiles of users you have bookings with
CREATE POLICY "Users can view profiles in active bookings"
ON public.user_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE (
      (bookings.renter_id = auth.uid() AND bookings.owner_id = user_profiles.auth_user_id)
      OR (bookings.owner_id = auth.uid() AND bookings.renter_id = user_profiles.auth_user_id)
    )
    AND bookings.status IN ('confirmed', 'active', 'completed')
  )
);

-- 4. Create a safe function to get limited public profile data for machine listings
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  profile_image text,
  rating numeric,
  verified boolean,
  city text,
  state text,
  total_services integer,
  total_rentals integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name,
    up.profile_image,
    up.rating,
    up.verified,
    up.address->>'city' as city,
    up.address->>'state' as state,
    up.total_services,
    up.total_rentals
  FROM public.user_profiles up
  WHERE up.auth_user_id = profile_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;

-- 5. Admin can still view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles FOR SELECT
TO authenticated
USING (private.is_admin(auth.uid()));