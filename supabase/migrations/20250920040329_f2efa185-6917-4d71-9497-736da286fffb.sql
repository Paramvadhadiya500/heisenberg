-- Fix admin access to manage all users in profiles table
-- Create a security definer function to check admin role safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Allow admins to view all profiles using the safe function
CREATE POLICY "Admins can view all profiles safely" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR public.is_admin()
);

-- Allow admins to update all profiles (for credit management)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin());

-- Allow admins to insert profiles (if needed)
CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (public.is_admin() OR auth.uid() = user_id);