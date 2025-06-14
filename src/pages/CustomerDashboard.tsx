
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, ShoppingBag, LogOut, Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileEditForm from '@/components/ProfileEditForm';
import OrderCard from '@/components/OrderCard';
import OrderDetails from '@/components/OrderDetails';
import DashboardStats from '@/components/DashboardStats';
import FeaturedProducts from '@/components/FeaturedProducts';

interface Order {
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
}

const CustomerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'dashboard' | 'orderDetails'>('dashboard');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for user:', user?.id);
      
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          payment_method,
          delivery_address,
          phone,
          shipping_status,
          courier_name,
          courier_contact,
          tracking_id,
          estimated_delivery_date,
          notes,
          created_at,
          order_items (
            id,
            quantity,
            price,
            product:products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Orders fetched:', ordersData);
      setOrders(ordersData || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Your data has been updated",
    });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleProfileSave = () => {
    setIsEditingProfile(false);
  };

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('orderDetails');
  };

  const handleBackToDashboard = () => {
    setSelectedOrderId(null);
    setCurrentView('dashboard');
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_items?.some(item => 
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || order.shipping_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (currentView === 'orderDetails' && selectedOrderId) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Details</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Detailed information about your order</p>
                </div>
                <Button onClick={handleSignOut} variant="outline" size={isMobile ? "sm" : "default"}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <OrderDetails 
              orderId={selectedOrderId} 
              onBack={handleBackToDashboard}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Welcome back, {profile?.full_name || user?.email}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  disabled={refreshing}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Dashboard Stats */}
          <div className="mb-6 sm:mb-8">
            <DashboardStats orders={orders} />
          </div>

          <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-3 gap-6 lg:gap-8'}`}>
            
            {/* Account Information & Saved Address */}
            <div className={`${isMobile ? 'order-2' : 'lg:col-span-1'}`}>
              <div className="sticky top-4">
                <ProfileEditForm 
                  isEditing={isEditingProfile}
                  onEditToggle={handleEditToggle}
                  onSave={handleProfileSave}
                />
              </div>
            </div>

            {/* Orders & Activity */}
            <div className={`${isMobile ? 'order-1' : 'lg:col-span-2'} space-y-6`}>
              
              {/* Featured Products Section */}
              <div className="animate-fade-in">
                <FeaturedProducts />
              </div>
              
              {/* Orders Section */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        <span>Your Orders</span>
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Your order history and shipping status
                      </CardDescription>
                    </div>
                  </div>

                  {/* Search and Filter Controls */}
                  {orders.length > 0 && (
                    <div className="flex flex-col gap-3 mt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search orders by ID or product name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <Filter className="h-4 w-4 mr-2 text-gray-500" />
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200 shadow-lg">
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center px-4 py-2 text-gray-500">
                        <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                        Loading orders...
                      </div>
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                      {filteredOrders.map((order, index) => (
                        <div 
                          key={order.id} 
                          className="animate-fade-in hover-scale"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <OrderCard
                            order={order}
                            onViewDetails={handleViewOrderDetails}
                          />
                        </div>
                      ))}
                      
                      {/* Show filtered results info */}
                      {filteredOrders.length !== orders.length && (
                        <div className="text-center py-4 text-sm text-gray-500 bg-blue-50 rounded-lg">
                          Showing {filteredOrders.length} of {orders.length} orders
                        </div>
                      )}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders match your filters</h3>
                      <p className="text-gray-500 mb-4 text-sm sm:text-base">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                        className="hover-scale"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-4 text-sm sm:text-base">
                        Start shopping to see your orders here
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/shop'}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover-scale"
                      >
                        Browse Products
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
