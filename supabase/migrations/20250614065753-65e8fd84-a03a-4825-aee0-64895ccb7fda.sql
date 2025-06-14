
-- Check if RLS policies exist for orders table that might be blocking admin updates
-- First, let's add an admin policy to allow admins to update all orders

-- Add policy for admins to update orders
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Also ensure admins can update order items
CREATE POLICY "Admins can update all order items"
  ON public.order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
