
-- First, let's completely reset the RLS setup and be very explicit about permissions
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies completely
DROP POLICY IF EXISTS "Enable insert for all users on orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for all users on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Enable select for authenticated users on orders" ON public.orders;
DROP POLICY IF EXISTS "Enable select for authenticated users on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous users to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow anonymous users to insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow users to view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow all inserts to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all inserts to order_items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow guest order creation" ON public.orders;
DROP POLICY IF EXISTS "Allow guest order items creation" ON public.order_items;

-- Create very permissive INSERT policies that work for both authenticated and anonymous users
CREATE POLICY "orders_insert_policy" ON public.orders
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "order_items_insert_policy" ON public.order_items
  FOR INSERT 
  WITH CHECK (true);

-- Create SELECT policies only for authenticated users to view their own data
CREATE POLICY "orders_select_policy" ON public.orders
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "order_items_select_policy" ON public.order_items
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create UPDATE policies for admins
CREATE POLICY "orders_update_admin_policy" ON public.orders
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "order_items_update_admin_policy" ON public.order_items
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Re-enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon role explicitly (no sequences needed for UUID tables)
GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;
