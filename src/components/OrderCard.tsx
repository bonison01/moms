
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  Truck,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';

interface OrderCardProps {
  order: {
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
    order_items: {
      id: string;
      quantity: number;
      price: number;
      product: {
        name: string;
        image_url: string;
      };
    }[];
  };
  onViewDetails: (orderId: string) => void;
}

const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <Badge className={getShippingStatusColor(order.shipping_status)}>
                {getShippingStatusLabel(order.shipping_status)}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>{order.order_items?.length || 0} items</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">₹{order.total_amount}</div>
            <div className="text-sm text-gray-500 capitalize">
              {order.payment_method?.toUpperCase() || 'COD'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(order.id)}
              className="flex items-center space-x-1"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span>{isExpanded ? 'Less' : 'More'}</span>
            </Button>
          </div>
          
          {order.tracking_id && (
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-4 w-4 text-blue-600" />
              <span className="font-mono text-blue-600">{order.tracking_id}</span>
            </div>
          )}
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Order Items Preview */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Items Ordered:</h4>
              <div className="space-y-2">
                {order.order_items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-sm">
                    <img
                      src={item.product?.image_url || '/placeholder.svg'}
                      alt={item.product?.name || 'Product'}
                      className="h-8 w-8 rounded object-cover"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{item.product?.name || 'Unknown Product'}</span>
                      <span className="text-gray-500 ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-medium">₹{item.price}</span>
                  </div>
                ))}
                {order.order_items?.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{order.order_items.length - 3} more items
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            {order.delivery_address && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Delivery Address:</span>
                </h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-medium">{order.delivery_address.full_name}</p>
                  <p>{order.delivery_address.address_line_1}</p>
                  {order.delivery_address.address_line_2 && (
                    <p>{order.delivery_address.address_line_2}</p>
                  )}
                  <p>{order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}</p>
                  {order.phone && (
                    <p className="flex items-center space-x-1 mt-1">
                      <Phone className="h-3 w-3" />
                      <span>{order.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Details */}
            {(order.courier_name || order.courier_contact || order.estimated_delivery_date) && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Truck className="h-4 w-4" />
                  <span>Shipping Details:</span>
                </h4>
                <div className="text-sm space-y-1 bg-blue-50 p-3 rounded">
                  {order.courier_name && (
                    <p><span className="font-medium">Courier:</span> {order.courier_name}</p>
                  )}
                  {order.courier_contact && (
                    <p><span className="font-medium">Contact:</span> {order.courier_contact}</p>
                  )}
                  {order.estimated_delivery_date && (
                    <p><span className="font-medium">Expected Delivery:</span> {new Date(order.estimated_delivery_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Order Notes:</h4>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
