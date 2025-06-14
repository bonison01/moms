
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

interface DashboardStatsProps {
  orders: any[];
}

const DashboardStats = ({ orders }: DashboardStatsProps) => {
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.shipping_status === 'delivered').length;
  const pendingOrders = orders.filter(order => order.shipping_status === 'pending').length;
  const shippedOrders = orders.filter(order => order.shipping_status === 'shipped').length;
  const outForDeliveryOrders = orders.filter(order => order.shipping_status === 'out_for_delivery').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  const totalSpent = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total_amount, 0);

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'All time orders'
    },
    {
      title: 'Delivered',
      value: deliveredOrders,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Successfully delivered'
    },
    {
      title: 'In Transit',
      value: shippedOrders + outForDeliveryOrders,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Currently shipping'
    },
    {
      title: 'Pending',
      value: pendingOrders,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Awaiting processing'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent}`,
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Lifetime spending'
    },
    {
      title: 'Cancelled',
      value: cancelledOrders,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Cancelled orders'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.title}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">{stat.description}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
