
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
    <Card className="hover:shadow-md transition-shadow duration-200 w-full overflow-hidden">
      <CardContent className="p-4 sm:p-6 w-full">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-semibold text-base sm:text-lg truncate">Order #{order.id.slice(0, 8)}</h3>
              <Badge className={`${getStatusColor(order.status)} text-xs`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <Badge className={`${getShippingStatusColor(order.shipping_status)} text-xs`}>
                {getShippingStatusLabel(order.shipping_status)}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4 flex-shrink-0" />
                <span>{order.order_items?.length || 0} items</span>
              </div>
            </div>
          </div>
          <div className="text-right w-full sm:w-auto flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</div>
            <div className="text-sm text-gray-500 capitalize">
              {order.payment_method?.toUpperCase() || 'COD'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(order.id)}
              className="flex items-center space-x-1 flex-1 sm:flex-none"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 flex-1 sm:flex-none"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span>{isExpanded ? 'Less' : 'More'}</span>
            </Button>
          </div>
          
          {order.tracking_id && (
            <div className="flex items-center space-x-2 text-sm w-full sm:w-auto">
              <Truck className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="font-mono text-blue-600 truncate">{order.tracking_id}</span>
            </div>
          )}
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4 w-full">
            {/* Order Items Preview */}
            <div className="w-full">
              <h4 className="font-medium text-gray-700 mb-2">Items Ordered:</h4>
              <div className="space-y-2 w-full">
                {order.order_items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-sm w-full">
                    <img
                      src={item.product?.image_url || '/placeholder.svg'}
                      alt={item.product?.name || 'Product'}
                      className="h-8 w-8 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate block">{item.product?.name || 'Unknown Product'}</span>
                      <span className="text-gray-500">× {item.quantity}</span>
                    </div>
                    <span className="font-medium flex-shrink-0">₹{item.price.toLocaleString()}</span>
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
              <div className="w-full">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>Delivery Address:</span>
                </h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded w-full">
                  <p className="font-medium truncate">{order.delivery_address.full_name}</p>
                  <p className="truncate">{order.delivery_address.address_line_1}</p>
                  {order.delivery_address.address_line_2 && (
                    <p className="truncate">{order.delivery_address.address_line_2}</p>
                  )}
                  <p className="truncate">{order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}</p>
                  {order.phone && (
                    <p className="flex items-center space-x-1 mt-1">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{order.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Details */}
            {(order.courier_name || order.courier_contact || order.estimated_delivery_date) && (
              <div className="w-full">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Truck className="h-4 w-4 flex-shrink-0" />
                  <span>Shipping Details:</span>
                </h4>
                <div className="text-sm space-y-1 bg-blue-50 p-3 rounded w-full">
                  {order.courier_name && (
                    <p><span className="font-medium">Courier:</span> <span className="truncate">{order.courier_name}</span></p>
                  )}
                  {order.courier_contact && (
                    <p><span className="font-medium">Contact:</span> <span className="truncate">{order.courier_contact}</span></p>
                  )}
                  {order.estimated_delivery_date && (
                    <p><span className="font-medium">Expected Delivery:</span> <span className="truncate">{new Date(order.estimated_delivery_date).toLocaleDateString()}</span></p>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="w-full">
                <h4 className="font-medium text-gray-700 mb-2">Order Notes:</h4>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded break-words">{order.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
