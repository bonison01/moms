
-- Add address fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN address_line_1 TEXT,
ADD COLUMN address_line_2 TEXT,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN postal_code TEXT,
ADD COLUMN phone TEXT;

-- Update orders table to include payment method and delivery address
ALTER TABLE public.orders 
ADD COLUMN payment_method TEXT DEFAULT 'cod',
ADD COLUMN delivery_address JSONB,
ADD COLUMN phone TEXT;
