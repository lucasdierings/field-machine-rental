-- DANGEROUS: This script resets the database data.
-- Run this in the Supabase SQL Editor.

-- 1. Clean up dependent tables first to avoid Foreign Key constraint violations
DELETE FROM public.search_alerts;
DELETE FROM public.reviews;
DELETE FROM public.bookings;
DELETE FROM public.machines;
DELETE FROM public.notifications;

-- 2. Clean up users, preserving the admin
-- Note: This only deletes from the public.user_profiles table.
-- You cannot delete from auth.users via standard SQL queries in the Custom SQL Editor easily 
-- without specific permissions, but this cleans the application data.
DELETE FROM public.user_profiles 
WHERE email NOT IN ('lucasdierings12@gmail.com', 'lucasdierings12@gmail');

-- 3. Reset any counters or associated data if necessary
-- (Add other tables here if you created new ones, e.g. messages, chats)

-- 4. Verify the result
SELECT count(*) as remaining_users FROM public.user_profiles;
