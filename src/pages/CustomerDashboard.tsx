import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, ShoppingBag, LogOut, Search, Filter, RefreshCw, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderCard from '@/components/OrderCard';
import OrderDetails from '@/components/OrderDetails';
import DashboardStats from '@/components/DashboardStats';
import FeaturedProducts from '@/components/FeaturedProducts';
import UserReviews from '@/components/UserReviews';
import ReviewForm from '@/components/ReviewForm';
import DashboardNavigation from '@/components/DashboardNavigation';
import AccountInfo from '@/components/AccountInfo';
import SavedAddress from '@/components/SavedAddress';

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
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'dashboard' | 'orderDetails'>('dashboard');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeSection, setActiveSection] = useState('account');

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
    navigate('/');
  };

  const handleEditToggle = () => {
    
  };

  const handleProfileSave = () => {
    
  };

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('orderDetails');
  };

  const handleBackToDashboard = () => {
    setSelectedOrderId(null);
    setCurrentView('dashboard');
  };

  const handleWriteReview = () => {
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
  };

  const handleViewChange = (view: string) => {
    setActiveSection(view);
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
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Order Details</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Detailed information about your order</p>
                </div>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'account':
        return <AccountInfo />;
      case 'address':
        return <SavedAddress />;
      case 'reviews':
        return <UserReviews onWriteReview={handleWriteReview} />;
      case 'orders':
      default:
        return (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <ShoppingBag className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">Your Orders</span>
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
                      placeholder={isMobile ? "Search orders..." : "Search orders by ID or product name..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="w-full sm:w-64">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                        <Filter className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
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
            <CardContent className="pt-0 overflow-hidden">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center px-4 py-2 text-gray-500">
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                    <span>Loading orders...</span>
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
                  <p className="text-gray-500 mb-4 px-4">
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
                  <p className="text-gray-500 mb-4 px-4">
                    Start shopping to see your orders here
                  </p>
                  <Button 
                    onClick={() => navigate('/shop')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover-scale"
                  >
                    Browse Products
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">My Account</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base truncate">
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
                  <span>Refresh</span>
                </Button>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Dashboard Stats */}
          <div className="mb-6 lg:mb-8">
            <DashboardStats orders={orders} />
          </div>

          {/* Featured Products Section */}
          <div className="mb-6 lg:mb-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                      <ShoppingBag className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">Our Signature Products</span>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Discover our most popular and carefully selected items
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => navigate('/shop')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover-scale flex items-center gap-2"
                    size={isMobile ? "sm" : "default"}
                  >
                    <span>Shop More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <FeaturedProducts />
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <DashboardNavigation currentView={activeSection} onViewChange={handleViewChange} />

          {/* Dynamic Content */}
          <div className="space-y-6">
            {renderActiveSection()}
          </div>
        </div>
      </main>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Write a Review</h2>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
