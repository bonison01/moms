-- Update the notify_admin_order_placed function to also send email notifications
CREATE OR REPLACE FUNCTION public.notify_admin_order_placed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_email TEXT;
  notification_message TEXT;
BEGIN
  -- Get user email
  SELECT email INTO user_email 
  FROM public.profiles 
  WHERE id = NEW.user_id;
  
  -- Create notification message
  notification_message := format('Customer %s placed an order worth ₹%s (Order ID: %s)', 
                                 COALESCE(user_email, 'Unknown'), 
                                 NEW.total_amount,
                                 NEW.id);
  
  -- Create notification in database
  PERFORM create_admin_notification(
    'order_placed',
    'New Order Placed',
    notification_message,
    NEW.user_id,
    NEW.id
  );
  
  -- Send email notification
  PERFORM net.http_post(
    url := 'https://azpkssmprrcafslqkxea.supabase.co/functions/v1/send-admin-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGtzc21wcnJjYWZzbHFreGVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc5MzAyOSwiZXhwIjoyMDY0MzY5MDI5fQ.P4jOXxj6_v4LPlmdOjdOIKHXC_e8Tn66Cp6X8DP7YWg"}'::jsonb,
    body := json_build_object(
      'type', 'order_placed',
      'title', 'New Order Placed',
      'message', notification_message,
      'adminEmail', 'khbonison@gmail.com'
    )::jsonb
  );
  
  RETURN NEW;
END;
$function$;

-- Update the notify_admin_cart_add function to also send email notifications
CREATE OR REPLACE FUNCTION public.notify_admin_cart_add()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_email TEXT;
  product_name TEXT;
  notification_message TEXT;
BEGIN
  -- Get user email and product name
  SELECT email INTO user_email 
  FROM public.profiles 
  WHERE id = NEW.user_id;
  
  SELECT name INTO product_name 
  FROM public.products 
  WHERE id = NEW.product_id;
  
  -- Create notification message
  notification_message := format('Customer %s added %s to cart (Quantity: %s)', 
                                 COALESCE(user_email, 'Unknown'), 
                                 COALESCE(product_name, 'Unknown Product'), 
                                 NEW.quantity);
  
  -- Create notification in database
  PERFORM create_admin_notification(
    'cart_add',
    'Item Added to Cart',
    notification_message,
    NEW.user_id,
    NULL
  );
  
  -- Send email notification
  PERFORM net.http_post(
    url := 'https://azpkssmprrcafslqkxea.supabase.co/functions/v1/send-admin-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGtzc21wcnJjYWZzbHFreGVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc5MzAyOSwiZXhwIjoyMDY0MzY5MDI5fQ.P4jOXxj6_v4LPlmdOjdOIKHXC_e8Tn66Cp6X8DP7YWg"}'::jsonb,
    body := json_build_object(
      'type', 'cart_add',
      'title', 'Item Added to Cart',
      'message', notification_message,
      'adminEmail', 'khbonison@gmail.com'
    )::jsonb
  );
  
  RETURN NEW;
END;
$function$;