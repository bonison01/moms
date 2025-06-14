
-- Add estimated delivery date column to orders for better tracking
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS estimated_delivery_date timestamp with time zone;

-- Add order notes column for any special instructions
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS notes text;

-- Create policy for order items if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'order_items' 
        AND policyname = 'Users can view their own order items'
    ) THEN
        CREATE POLICY "Users can view their own order items" 
        ON public.order_items 
        FOR SELECT 
        USING (
            EXISTS (
                SELECT 1 FROM public.orders 
                WHERE orders.id = order_items.order_id 
                AND orders.user_id = auth.uid()
            )
        );
    END IF;
END $$;
