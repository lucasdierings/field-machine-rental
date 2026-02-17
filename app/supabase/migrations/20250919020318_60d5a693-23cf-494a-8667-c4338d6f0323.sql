-- Enable Row Level Security on login_google table
ALTER TABLE public.login_google ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admins can access all login_google records
CREATE POLICY "Admins can manage all Google login data" 
ON public.login_google 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles r 
    WHERE r.user_id = auth.uid() 
    AND r.role = 'admin'::app_role
  )
);

-- Policy 2: Users can only access their own Google login data
CREATE POLICY "Users can access their own Google login data" 
ON public.login_google 
FOR SELECT 
USING (
  user_id = auth.uid()::text
);

-- Policy 3: Restrict insert/update to system operations only (admins)
CREATE POLICY "Only admins can modify Google login data" 
ON public.login_google 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles r 
    WHERE r.user_id = auth.uid() 
    AND r.role = 'admin'::app_role
  )
);

CREATE POLICY "Only admins can update Google login data" 
ON public.login_google 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles r 
    WHERE r.user_id = auth.uid() 
    AND r.role = 'admin'::app_role
  )
);

-- Policy 4: Restrict delete to admins only
CREATE POLICY "Only admins can delete Google login data" 
ON public.login_google 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles r 
    WHERE r.user_id = auth.uid() 
    AND r.role = 'admin'::app_role
  )
);