
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  Truck,
  CreditCard,
  FileText,
  Clock
} from 'lucide-react';

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

interface DetailedOrder {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  delivery_address: any;
  phone: string;
  shipping_status: string;
  courier_name: string;
  courier_contact: string;
  tracking_id: string;
  estimated_delivery_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image_url: string;
      description: string;
      category: string;
    };
  }[];
}

const OrderDetails = ({ orderId, onBack }: OrderDetailsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId]);

  const fetchOrderDetails = async () => {
    try {
      console.log('Fetching order details for:', orderId);
      
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product:products (
              id,
              name,
              image_url,
              description,
              category
            )
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching order details:', error);
        throw error;
      }

      console.log('Order details fetched:', orderData);
      setOrder(orderData);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShippingStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'shipped': return 'Shipped';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Badge className={getShippingStatusColor(order.shipping_status)}>
            {getShippingStatusLabel(order.shipping_status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                    <img
                      src={item.product?.image_url || '/placeholder.svg'}
                      alt={item.product?.name || 'Product'}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{item.product?.name || 'Unknown Product'}</h4>
                      {item.product?.description && (
                        <p className="text-gray-600 text-sm">{item.product.description}</p>
                      )}
                      {item.product?.category && (
                        <p className="text-gray-500 text-sm">Category: {item.product.category}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                        <span className="text-sm text-gray-600">Price: ₹{item.price} each</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
                
                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount:</span>
                    <span>₹{order.total_amount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Information */}
        <div className="space-y-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-gray-900 capitalize">{order.payment_method?.toUpperCase() || 'COD'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Order Status</label>
                  <p className="text-gray-900 capitalize">{order.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-gray-900">{new Date(order.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Shipping Status</label>
                  <p className="text-gray-900">{getShippingStatusLabel(order.shipping_status)}</p>
                </div>
                {order.courier_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Courier</label>
                    <p className="text-gray-900">{order.courier_name}</p>
                  </div>
                )}
                {order.courier_contact && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Courier Contact</label>
                    <p className="text-gray-900">{order.courier_contact}</p>
                  </div>
                )}
                {order.tracking_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tracking ID</label>
                    <p className="text-gray-900 font-mono text-sm">{order.tracking_id}</p>
                  </div>
                )}
                {order.estimated_delivery_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Estimated Delivery</span>
                    </label>
                    <p className="text-gray-900">{new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          {order.delivery_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.delivery_address.full_name}</p>
                  <p className="text-gray-700">{order.delivery_address.address_line_1}</p>
                  {order.delivery_address.address_line_2 && (
                    <p className="text-gray-700">{order.delivery_address.address_line_2}</p>
                  )}
                  <p className="text-gray-700">
                    {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}
                  </p>
                  {order.phone && (
                    <p className="text-gray-700 flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{order.phone}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Order Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
