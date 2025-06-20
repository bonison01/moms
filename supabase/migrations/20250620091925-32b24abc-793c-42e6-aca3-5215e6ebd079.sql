
-- Update banner_settings table to support multiple banners
ALTER TABLE public.banner_settings 
ADD COLUMN display_order INTEGER DEFAULT 1,
ADD COLUMN is_published BOOLEAN DEFAULT true;

-- Create index for ordering banners
CREATE INDEX idx_banner_settings_display_order ON public.banner_settings(display_order, is_active);

-- Update products table to add offer_price and improve category management
ALTER TABLE public.products 
ADD COLUMN offer_price NUMERIC DEFAULT NULL,
ADD COLUMN image_urls TEXT[] DEFAULT NULL;

-- Update category field to use enum for better consistency
CREATE TYPE product_category AS ENUM ('chicken', 'red_meat', 'chilli_condiments', 'other');

-- Temporarily allow null values for the migration
ALTER TABLE public.products ALTER COLUMN category TYPE TEXT;

-- Update existing products to use new category format (convert existing data)
UPDATE public.products 
SET category = CASE 
  WHEN LOWER(category) LIKE '%chicken%' THEN 'chicken'
  WHEN LOWER(category) LIKE '%meat%' OR LOWER(category) LIKE '%beef%' OR LOWER(category) LIKE '%mutton%' THEN 'red_meat'
  WHEN LOWER(category) LIKE '%chilli%' OR LOWER(category) LIKE '%condiment%' OR LOWER(category) LIKE '%sauce%' THEN 'chilli_condiments'
  ELSE 'other'
END
WHERE category IS NOT NULL;

-- Now change the column type to use the enum
ALTER TABLE public.products ALTER COLUMN category TYPE product_category USING category::product_category;

-- Create function to automatically reduce stock when order is placed
CREATE OR REPLACE FUNCTION reduce_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Only reduce stock when order status changes to 'confirmed' or 'processing'
  IF (NEW.status IN ('confirmed', 'processing') AND OLD.status = 'pending') THEN
    -- Reduce stock for each product in the order
    UPDATE public.products 
    SET stock_quantity = GREATEST(0, stock_quantity - oi.quantity),
        updated_at = NOW()
    FROM public.order_items oi
    WHERE products.id = oi.product_id 
    AND oi.order_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically reduce stock when order status changes
CREATE TRIGGER trigger_reduce_stock
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION reduce_product_stock();

-- Create function to restore stock if order is cancelled
CREATE OR REPLACE FUNCTION restore_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Restore stock when order status changes to 'cancelled' from a confirmed state
  IF (NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'processing', 'shipped')) THEN
    -- Restore stock for each product in the order
    UPDATE public.products 
    SET stock_quantity = stock_quantity + oi.quantity,
        updated_at = NOW()
    FROM public.order_items oi
    WHERE products.id = oi.product_id 
    AND oi.order_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to restore stock when order is cancelled
CREATE TRIGGER trigger_restore_stock
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION restore_product_stock();
