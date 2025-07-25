-- Create trigger to notify admins when new orders are placed
CREATE TRIGGER trigger_notify_admin_order_placed
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_order_placed();