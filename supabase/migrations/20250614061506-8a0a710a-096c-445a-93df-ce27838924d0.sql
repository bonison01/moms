
-- Add shipping tracking fields to the orders table
ALTER TABLE public.orders 
ADD COLUMN shipping_status TEXT DEFAULT 'pending',
ADD COLUMN courier_name TEXT,
ADD COLUMN courier_contact TEXT,
ADD COLUMN tracking_id TEXT;

-- Update the existing orders to have a default shipping status
UPDATE public.orders 
SET shipping_status = 'pending' 
WHERE shipping_status IS NULL;
