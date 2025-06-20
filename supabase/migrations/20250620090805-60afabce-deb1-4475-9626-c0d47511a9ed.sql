
-- Create a table for banner settings
CREATE TABLE public.banner_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Authentic Flavors',
  subtitle TEXT NOT NULL DEFAULT 'Traditional Recipes',
  image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=600&fit=crop',
  button_text TEXT NOT NULL DEFAULT 'Shop Now',
  button_link TEXT NOT NULL DEFAULT '/shop',
  secondary_button_text TEXT NOT NULL DEFAULT 'Our Story',
  secondary_button_link TEXT NOT NULL DEFAULT '/about',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default banner settings
INSERT INTO public.banner_settings (
  title, 
  subtitle, 
  image_url, 
  button_text, 
  button_link,
  secondary_button_text,
  secondary_button_link
) VALUES (
  'Authentic Flavors',
  'Traditional Recipes',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=600&fit=crop',
  'Shop Now',
  '/shop',
  'Our Story',
  '/about'
);

-- Enable Row Level Security
ALTER TABLE public.banner_settings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view banner settings
CREATE POLICY "Anyone can view banner settings" 
  ON public.banner_settings 
  FOR SELECT 
  USING (true);

-- Create policy that allows only admins to update banner settings
CREATE POLICY "Only admins can update banner settings" 
  ON public.banner_settings 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy that allows only admins to insert banner settings
CREATE POLICY "Only admins can insert banner settings" 
  ON public.banner_settings 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy that allows only admins to delete banner settings
CREATE POLICY "Only admins can delete banner settings" 
  ON public.banner_settings 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
