
-- Add payment screenshot column to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_screenshot_url text;

-- Update the orders table to include payment screenshot in the delivery address or create a separate field
COMMENT ON COLUMN public.orders.payment_screenshot_url IS 'URL to uploaded payment screenshot for online payments';
