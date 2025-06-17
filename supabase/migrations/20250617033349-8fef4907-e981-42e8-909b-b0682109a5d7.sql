
-- Drop the current overly permissive policies
DROP POLICY IF EXISTS "Allow all inserts to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all inserts to order_items" ON public.order_items;

-- Create proper policies that allow both authenticated and anonymous users
CREATE POLICY "Allow authenticated users to insert orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow anonymous users to insert orders"
  ON public.orders FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow authenticated users to insert order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

CREATE POLICY "Allow anonymous users to insert order items"
  ON public.order_items FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id IS NULL
    )
  );

-- Keep the existing SELECT policies for viewing orders
CREATE POLICY "Allow users to view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view their own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );
