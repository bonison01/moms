
-- First, let's disable RLS temporarily and recreate all policies from scratch
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow anonymous users to insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow users to view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow all inserts to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all inserts to order_items" ON public.order_items;

-- Create very simple policies that definitely work
CREATE POLICY "Enable insert for all users on orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users on order_items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users on orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Enable select for authenticated users on order_items" ON public.order_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Re-enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
