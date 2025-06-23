
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, Phone } from 'lucide-react';
import { EditingOrder } from './types';

interface CourierInfoCellProps {
  courierName: string;
  courierContact: string;
  trackingId: string;
  isEditing?: boolean;
  editingOrder?: EditingOrder;
  onFieldChange?: (field: keyof EditingOrder, value: string) => void;
}

const CourierInfoCell = ({ 
  courierName, 
  courierContact, 
  trackingId, 
  isEditing, 
  editingOrder, 
  onFieldChange 
}: CourierInfoCellProps) => {
  if (isEditing && editingOrder && onFieldChange) {
    return (
      <div className="space-y-2 min-w-48">
        <div>
          <Label className="text-xs">Courier Name</Label>
          <Input
            placeholder="Courier name"
            value={editingOrder.courier_name}
            onChange={(e) => onFieldChange('courier_name', e.target.value)}
            className="h-8"
          />
        </div>
        <div>
          <Label className="text-xs">Contact</Label>
          <Input
            placeholder="Phone number"
            value={editingOrder.courier_contact}
            onChange={(e) => onFieldChange('courier_contact', e.target.value)}
            className="h-8"
          />
        </div>
        <div>
          <Label className="text-xs">Tracking ID</Label>
          <Input
            placeholder="Tracking ID"
            value={editingOrder.tracking_id}
            onChange={(e) => onFieldChange('tracking_id', e.target.value)}
            className="h-8"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm">
      {courierName && (
        <div className="flex items-center space-x-1 mb-1">
          <Truck className="h-3 w-3" />
          <span>{courierName}</span>
        </div>
      )}
      {courierContact && (
        <div className="flex items-center space-x-1 mb-1">
          <Phone className="h-3 w-3" />
          <span>{courierContact}</span>
        </div>
      )}
      {trackingId && (
        <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
          ID: {trackingId}
        </div>
      )}
      {!courierName && !courierContact && !trackingId && (
        <span className="text-gray-400 italic">Not assigned</span>
      )}
    </div>
  );
};

export default CourierInfoCell;
