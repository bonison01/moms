
-- Enable RLS on products table if not already enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to select products
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to update products
CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true);

-- Allow authenticated users to delete products
CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- Create storage policies for the product-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to view files (since bucket is public)
CREATE POLICY "Anyone can view product images" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'product-images');

-- Allow authenticated users to update their uploaded files
CREATE POLICY "Authenticated users can update images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');
