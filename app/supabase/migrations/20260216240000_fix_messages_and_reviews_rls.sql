-- =============================================================
-- Fix: RLS for messages and reviews tables
-- Enables in-app chat and review flow
-- =============================================================

-- -------------------------------------------------------
-- 1. MESSAGES TABLE - enable RLS + policies
-- -------------------------------------------------------
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can mark messages as read" ON public.messages;

-- Only sender and receiver can read messages
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Only authenticated users can send messages (as sender)
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Only receiver can mark messages as read
CREATE POLICY "Users can mark messages as read"
ON public.messages FOR UPDATE
USING (auth.uid() = receiver_id);

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- -------------------------------------------------------
-- 2. REVIEWS TABLE - ensure RLS + correct policies
-- -------------------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

-- Reviews are public (appear on machine detail pages)
CREATE POLICY "Anyone can read reviews"
ON public.reviews FOR SELECT
USING (true);

-- Only authenticated users can create reviews, as reviewer
CREATE POLICY "Authenticated users can create reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

-- Reviewers can update their own reviews (e.g., edit comment)
CREATE POLICY "Users can update own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = reviewer_id);

-- -------------------------------------------------------
-- 3. BOOKINGS - ensure 'completed' status is updatable by owner
-- (owner needs to mark as completed)
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = renter_id OR auth.uid() = owner_id);
