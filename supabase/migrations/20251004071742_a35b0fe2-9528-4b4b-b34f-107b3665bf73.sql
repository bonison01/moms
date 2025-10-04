-- Add columns for password reset verification
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reset_code text,
ADD COLUMN IF NOT EXISTS reset_code_expires timestamp with time zone;