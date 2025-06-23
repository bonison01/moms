
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { Order, EditingOrder } from './types';
import PaymentCell from './PaymentCell';
import StatusCell from './StatusCell';
import CourierInfoCell from './CourierInfoCell';

interface OrderRowProps {
  order: Order;
  editingOrder: EditingOrder | null;
  saving: boolean;
  onEdit: (order: Order) => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onFieldChange: (field: keyof EditingOrder, value: string) => void;
}

const OrderRow = ({ 
  order, 
  editingOrder, 
  saving, 
  onEdit, 
  onSave, 
  onCancelEdit, 
  onFieldChange 
}: OrderRowProps) => {
  const isEditing = editingOrder?.id === order.id;

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium">
        #{order.id.slice(0, 8)}
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{order.user_profile?.full_name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{order.user_profile?.email || 'N/A'}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {order.order_items?.map((item, idx) => (
            <div key={item.id}>
              {item.product?.name || 'Unknown Product'} (x{item.quantity})
              {idx < order.order_items.length - 1 && <br />}
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell>₹{order.total_amount}</TableCell>
      <TableCell>
        <PaymentCell order={order} />
      </TableCell>
      <TableCell>
        <StatusCell 
          status={order.status}
          type="order"
          isEditing={isEditing}
          editingOrder={editingOrder}
          onStatusChange={onFieldChange}
        />
      </TableCell>
      <TableCell>
        <StatusCell 
          status={order.shipping_status}
          type="shipping"
          isEditing={isEditing}
          editingOrder={editingOrder}
          onStatusChange={onFieldChange}
        />
      </TableCell>
      <TableCell>
        <CourierInfoCell 
          courierName={order.courier_name}
          courierContact={order.courier_contact}
          trackingId={order.tracking_id}
          isEditing={isEditing}
          editingOrder={editingOrder}
          onFieldChange={onFieldChange}
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex space-x-1">
            <Button 
              onClick={onSave} 
              size="sm" 
              variant="default"
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-3 w-3" />
              {saving && <span className="ml-1 animate-pulse">...</span>}
            </Button>
            <Button 
              onClick={onCancelEdit} 
              size="sm" 
              variant="outline"
              disabled={saving}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => onEdit(order)} 
            size="sm" 
            variant="outline"
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
