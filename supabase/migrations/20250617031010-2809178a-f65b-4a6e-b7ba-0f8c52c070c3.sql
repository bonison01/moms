
-- Allow guest users to insert orders (where user_id can be null)
CREATE POLICY "Allow guest order creation"
  ON public.orders FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Allow guest users to insert order items for their orders
CREATE POLICY "Allow guest order items creation"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND (user_id IS NULL OR user_id = auth.uid())
    )
  );

-- Update the orders table to allow null user_id for guest orders
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
