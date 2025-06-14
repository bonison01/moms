
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardStatsProps {
  orders: any[];
}

const DashboardStats = ({ orders }: DashboardStatsProps) => {
  const isMobile = useIsMobile();
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
      description: 'All time orders',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Delivered',
      value: deliveredOrders,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Successfully delivered',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'In Transit',
      value: shippedOrders + outForDeliveryOrders,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Currently shipping',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Pending',
      value: pendingOrders,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Awaiting processing',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Lifetime spending',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Cancelled',
      value: cancelledOrders,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Cancelled orders',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className={`grid gap-2 sm:gap-3 lg:gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1 cursor-pointer animate-fade-in hover-scale"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className={`p-2 sm:p-3 lg:p-4 ${isMobile ? 'space-y-1' : 'space-y-2 sm:space-y-3'}`}>
              <div className="flex items-start justify-between">
                <div className={`p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${stat.color}`} />
                </div>
                {!isMobile && (
                  <div className={`w-1.5 sm:w-2 h-6 sm:h-8 rounded-full bg-gradient-to-b ${stat.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                )}
              </div>
              
              <div className="space-y-0.5 sm:space-y-1">
                <div className={`${isMobile ? 'text-sm' : 'text-lg sm:text-xl'} font-bold text-gray-900 group-hover:text-gray-800 transition-colors leading-tight`}>
                  {stat.value}
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-700 leading-tight`}>
                  {stat.title}
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 leading-tight ${isMobile ? 'line-clamp-1' : ''}`}>
                  {stat.description}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
