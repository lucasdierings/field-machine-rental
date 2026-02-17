-- Enable Row Level Security on blog_posts table
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts table
-- Allow public read access to published blog posts
CREATE POLICY "Published blog posts are publicly readable" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

-- Allow admins to manage all blog posts
CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles r 
  WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM user_roles r 
  WHERE r.user_id = auth.uid() AND r.role = 'admin'::app_role
));

-- Enable Row Level Security on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews table
-- Allow public read access to all reviews
CREATE POLICY "Reviews are publicly readable" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Allow authenticated users to create reviews for their own bookings
CREATE POLICY "Users can create reviews for their bookings" 
ON public.reviews 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM bookings b 
  WHERE b.id = booking_id 
  AND (b.renter_id = reviewer_id OR b.owner_id = reviewer_id)
  AND EXISTS (
    SELECT 1 FROM users u 
    WHERE u.auth_user_id = auth.uid() 
    AND u.id = reviewer_id
  )
));

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM users u 
  WHERE u.auth_user_id = auth.uid() 
  AND u.id = reviewer_id
));

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM users u 
  WHERE u.auth_user_id = auth.uid() 
  AND u.id = reviewer_id
));