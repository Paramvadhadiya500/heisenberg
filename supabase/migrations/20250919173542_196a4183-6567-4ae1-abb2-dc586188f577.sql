-- Remove the problematic public policy that still exposes all data
DROP POLICY "Public leaderboard access" ON public.profiles;

-- Create a secure view for leaderboard that only exposes non-sensitive data
CREATE VIEW public.user_leaderboard AS
SELECT 
  user_id as id,
  name,
  credits
FROM public.profiles
ORDER BY credits DESC;

-- Allow all authenticated users to view the leaderboard (only name and credits)
ALTER VIEW public.user_leaderboard OWNER TO postgres;
GRANT SELECT ON public.user_leaderboard TO authenticated;