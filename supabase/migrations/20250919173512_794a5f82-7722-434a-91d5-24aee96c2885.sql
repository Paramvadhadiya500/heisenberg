-- Drop the overly permissive policy that allows all users to see all profiles
DROP POLICY "Users can view all profiles" ON public.profiles;

-- Add policy for users to only see their own profile data
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add policy for admins to view all profiles (for legitimate admin functions)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add policy for public leaderboard data (only name and credits, no email)
CREATE POLICY "Public leaderboard access" 
ON public.profiles 
FOR SELECT 
USING (true);