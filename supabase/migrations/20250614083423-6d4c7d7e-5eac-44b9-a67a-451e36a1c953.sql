
-- Add the featured column to the products table
ALTER TABLE public.products 
ADD COLUMN featured boolean DEFAULT false;
