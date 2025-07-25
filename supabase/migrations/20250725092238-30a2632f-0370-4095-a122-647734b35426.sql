-- Create trigger for new orders to send notifications
DROP TRIGGER IF EXISTS notify_admin_on_order_insert ON public.orders;
CREATE TRIGGER notify_admin_on_order_insert
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_order_placed();

-- Create trigger for cart additions to send notifications  
DROP TRIGGER IF EXISTS notify_admin_on_cart_add ON public.cart_items;
CREATE TRIGGER notify_admin_on_cart_add
  AFTER INSERT ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_cart_add();