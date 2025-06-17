
-- First, let's disable RLS temporarily to check if that's the issue
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated users to insert their orders" ON public.orders;
DROP POLICY IF EXISTS "Allow guest users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to view all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert their order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow guest users to insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow users to view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow admins to view all order items" ON public.order_items;

-- Create very permissive policies first to test
CREATE POLICY "Allow all inserts to orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all inserts to order_items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view their orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to view their order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Re-enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
