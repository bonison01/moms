
-- Add new columns to banner_settings table for size and position controls
ALTER TABLE public.banner_settings 
ADD COLUMN IF NOT EXISTS banner_height integer DEFAULT 350,
ADD COLUMN IF NOT EXISTS banner_width integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS text_position text DEFAULT 'center',
ADD COLUMN IF NOT EXISTS image_position text DEFAULT 'center',
ADD COLUMN IF NOT EXISTS overlay_opacity integer DEFAULT 60;
