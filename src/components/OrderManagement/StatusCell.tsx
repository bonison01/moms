
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle, Package, Truck } from 'lucide-react';
import { EditingOrder } from './types';

interface StatusCellProps {
  status: string;
  type: 'order' | 'shipping';
  isEditing?: boolean;
  editingOrder?: EditingOrder;
  onStatusChange?: (field: keyof EditingOrder, value: string) => void;
}

const StatusCell = ({ status, type, isEditing, editingOrder, onStatusChange }: StatusCellProps) => {
  const getStatusColor = (status: string, type: 'order' | 'shipping') => {
    if (type === 'shipping') {
      switch (status) {
        case 'pending': return 'text-orange-600';
        case 'shipped': return 'text-blue-600';
        case 'out_for_delivery': return 'text-purple-600';
        case 'delivered': return 'text-green-600';
        case 'cancelled': return 'text-red-600';
        default: return 'text-gray-600';
      }
    } else {
      switch (status) {
        case 'pending': return 'text-orange-600';
        case 'confirmed': return 'text-blue-600';
        case 'processing': return 'text-purple-600';
        case 'completed': return 'text-green-600';
        case 'cancelled': return 'text-red-600';
        default: return 'text-gray-600';
      }
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

  const getShippingStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'shipped':
      case 'out_for_delivery': return <Truck className="h-4 w-4 text-blue-600" />;
      default: return <Package className="h-4 w-4 text-orange-600" />;
    }
  };

  if (isEditing && editingOrder && onStatusChange) {
    const fieldName = type === 'shipping' ? 'shipping_status' : 'status';
    const currentValue = type === 'shipping' ? editingOrder.shipping_status : editingOrder.status;

    return (
      <Select
        value={currentValue}
        onValueChange={(value) => onStatusChange(fieldName, value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {type === 'shipping' ? (
            <>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    );
  }

  if (type === 'shipping') {
    return (
      <div className="flex items-center space-x-2">
        {getShippingStatusIcon(status)}
        <span className={`capitalize font-medium ${getStatusColor(status, type)}`}>
          {getShippingStatusLabel(status)}
        </span>
      </div>
    );
  }

  return (
    <span className={`capitalize font-medium ${getStatusColor(status, type)}`}>
      {status}
    </span>
  );
};

export default StatusCell;
