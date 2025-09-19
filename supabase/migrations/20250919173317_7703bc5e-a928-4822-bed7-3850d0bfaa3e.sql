-- Update existing users with 0 credits to have 100 credits
UPDATE profiles SET credits = 100 WHERE credits = 0;