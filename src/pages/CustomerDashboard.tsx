import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, ShoppingBag, Package, Clock, LogOut, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileEditForm from '@/components/ProfileEditForm';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditToggle = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleProfileSave = () => {
    setIsEditingProfile(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600';
      case 'confirmed': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getShippingStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600';
      case 'shipped': return 'text-blue-600';
      case 'out_for_delivery': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
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

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.shipping_status === 'delivered').length;
  const pendingOrders = orders.filter(order => order.shipping_status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">Welcome back, {profile?.full_name || user?.email}</p>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Account Information & Saved Address */}
              <div className="lg:col-span-1">
                <ProfileEditForm 
                  isEditing={isEditingProfile}
                  onEditToggle={handleEditToggle}
                  onSave={handleProfileSave}
                />
              </div>

              {/* Orders & Activity */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                      <div className="text-sm text-gray-500">Total Orders</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{deliveredOrders}</div>
                      <div className="text-sm text-gray-500">Delivered</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{pendingOrders}</div>
                      <div className="text-sm text-gray-500">Pending</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                    <CardDescription>Your order history and shipping status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500">Loading orders...</div>
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 space-y-4">
                            {/* Order Header */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString()} • 
                                  {order.payment_method?.toUpperCase() || 'COD'}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">₹{order.total_amount}</div>
                                <div className={`text-sm capitalize ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </div>
                              </div>
                            </div>

                            {/* Shipping Status */}
                            {order.shipping_status && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                    <Truck className="h-4 w-4" />
                                    <span>Shipping Status</span>
                                  </h5>
                                  <div className={`text-sm font-medium ${getShippingStatusColor(order.shipping_status)}`}>
                                    {getShippingStatusLabel(order.shipping_status)}
                                  </div>
                                </div>
                                
                                {(order.courier_name || order.courier_contact || order.tracking_id) && (
                                  <div className="text-sm space-y-1">
                                    {order.courier_name && (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">Courier:</span>
                                        <span className="font-medium">{order.courier_name}</span>
                                      </div>
                                    )}
                                    {order.courier_contact && (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">Contact:</span>
                                        <span>{order.courier_contact}</span>
                                      </div>
                                    )}
                                    {order.tracking_id && (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">Tracking ID:</span>
                                        <span className="font-mono text-sm">{order.tracking_id}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Order Items */}
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">Items:</h5>
                              {order.order_items?.map((item) => (
                                <div key={item.id} className="flex items-center space-x-3 text-sm">
                                  <img
                                    src={item.product?.image_url || '/placeholder.svg'}
                                    alt={item.product?.name || 'Product'}
                                    className="h-10 w-10 rounded object-cover"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                                    <p className="text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Delivery Address */}
                            {order.delivery_address && (
                              <div className="text-sm">
                                <h5 className="font-medium text-gray-700 mb-1">Delivery Address:</h5>
                                <div className="text-gray-600">
                                  <p>{order.delivery_address.full_name}</p>
                                  <p>{order.delivery_address.address_line_1}</p>
                                  {order.delivery_address.address_line_2 && (
                                    <p>{order.delivery_address.address_line_2}</p>
                                  )}
                                  <p>{order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}</p>
                                  {order.phone && <p>Phone: {order.phone}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-4">
                          Start shopping to see your orders here
                        </p>
                        <Button onClick={() => window.location.href = '/shop'}>
                          Browse Products
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
