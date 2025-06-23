
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const OrderTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Items</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Payment</TableHead>
        <TableHead>Order Status</TableHead>
        <TableHead>Shipping Status</TableHead>
        <TableHead>Courier Info</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrderTableHeader;
