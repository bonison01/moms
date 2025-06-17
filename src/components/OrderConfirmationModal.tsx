
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Phone, MapPin } from 'lucide-react';

interface OrderItem {
  product: {
    name: string;
    image_url?: string;
  };
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  total_amount: number;
  delivery_address: {
    full_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
  };
  phone: string;
  payment_method: string;
  order_items: OrderItem[];
}

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: OrderData | null;
  customerEmail: string;
}

const OrderConfirmationModal = ({ isOpen, onClose, orderData, customerEmail }: OrderConfirmationModalProps) => {
  if (!orderData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            <span>Order Placed Successfully!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Order Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <p className="font-mono font-medium">#{orderData.id.slice(0, 8)}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Amount:</span>
                <p className="font-bold text-lg">₹{orderData.total_amount}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <p className="capitalize">{orderData.payment_method}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p>{customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {orderData.order_items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{orderData.total_amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Delivery Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div className="text-sm">
                  <p className="font-medium">{orderData.delivery_address.full_name}</p>
                  <p>{orderData.delivery_address.address_line_1}</p>
                  {orderData.delivery_address.address_line_2 && (
                    <p>{orderData.delivery_address.address_line_2}</p>
                  )}
                  <p>
                    {orderData.delivery_address.city}, {orderData.delivery_address.state} {orderData.delivery_address.postal_code}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-sm">{orderData.phone}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• We'll process your order within 1-2 business days</li>
              <li>• You'll receive a confirmation email with tracking details</li>
              <li>• Expected delivery: 3-5 business days</li>
              <li>• You can track your order status in your dashboard</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Continue Shopping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationModal;
