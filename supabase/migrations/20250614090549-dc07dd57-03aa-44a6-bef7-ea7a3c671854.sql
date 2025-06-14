
-- Create a table for product and brand reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NULL, -- NULL means it's a brand review
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint for product_id
ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_product 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- Add foreign key constraint for user_id (referencing profiles table)
ALTER TABLE public.reviews 
ADD CONSTRAINT fk_reviews_user 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Add Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  TO public 
  USING (true);

-- Policy: Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid()::text = user_id::text);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid()::text = user_id::text);
