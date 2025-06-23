
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image } from 'lucide-react';
import { Order } from './types';

interface PaymentCellProps {
  order: Order;
}

const PaymentCell = ({ order }: PaymentCellProps) => {
  return (
    <div className="text-sm">
      <div className="flex items-center space-x-2 mb-1">
        <span className="capitalize">{order.payment_method}</span>
      </div>
      {order.payment_screenshot_url && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-1"
            >
              <Image className="h-3 w-3" />
              <span>View Screenshot</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payment Screenshot - Order #{order.id.slice(0, 8)}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <img 
                src={order.payment_screenshot_url} 
                alt="Payment Screenshot"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-500 mt-2">
                Uploaded by customer for payment verification
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {!order.payment_screenshot_url && order.payment_method === 'online' && (
        <span className="text-xs text-gray-400 italic">No screenshot uploaded</span>
      )}
    </div>
  );
};

export default PaymentCell;
