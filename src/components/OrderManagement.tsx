import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X, Package, Truck, Phone, Search, CheckCircle, AlertCircle, Image, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_screenshot_url: string | null;
  delivery_address: any;
  phone: string;
  shipping_status: string;
  courier_name: string;
  courier_contact: string;
  tracking_id: string;
  created_at: string;
  user_profile: {
    email: string;
    full_name: string;
  } | null;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    } | null;
  }[];
}

interface EditingOrder {
  id: string;
  status: string;
  shipping_status: string;
  courier_name: string;
  courier_contact: string;
  tracking_id: string;
}

const OrderManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<EditingOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.slice(0, 8).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm]);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          total_amount,
          status,
          payment_method,
          payment_screenshot_url,
          delivery_address,
          phone,
          shipping_status,
          courier_name,
          courier_contact,
          tracking_id,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders fetch error:', ordersError);
        throw ordersError;
      }

      console.log('Orders fetched:', ordersData);

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              price,
              product:products (
                name
              )
            `)
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
          }

          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', order.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          }

          return {
            ...order,
            user_profile: userProfile,
            order_items: orderItems || []
          };
        })
      );

      console.log('Orders with items:', ordersWithItems);
      setOrders(ordersWithItems);
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

  const handleEdit = (order: Order) => {
    setEditingOrder({
      id: order.id,
      status: order.status || 'pending',
      shipping_status: order.shipping_status || 'pending',
      courier_name: order.courier_name || '',
      courier_contact: order.courier_contact || '',
      tracking_id: order.tracking_id || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
  };

  const handleSave = async () => {
    if (!editingOrder || saving) return;

    setSaving(true);
    try {
      console.log('=== STARTING ORDER UPDATE ===');
      console.log('Order ID:', editingOrder.id);
      
      const updateData = {
        status: editingOrder.status,
        shipping_status: editingOrder.shipping_status,
        courier_name: editingOrder.courier_name || null,
        courier_contact: editingOrder.courier_contact || null,
        tracking_id: editingOrder.tracking_id || null,
        updated_at: new Date().toISOString(),
      };

      console.log('Update data:', updateData);

      const { data: currentUser } = await supabase.auth.getUser();
      console.log('Current user:', currentUser?.user?.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser?.user?.id)
        .single();
      
      console.log('User profile:', profile);

      const { data: existingOrder, error: checkError } = await supabase
        .from('orders')
        .select('id, status, shipping_status')
        .eq('id', editingOrder.id)
        .single();

      if (checkError) {
        console.error('Error checking order existence:', checkError);
        throw new Error(`Order not found: ${checkError.message}`);
      }

      console.log('Existing order:', existingOrder);

      const { data: updateResult, error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', editingOrder.id)
        .select('*');

      console.log('Update result:', updateResult);
      console.log('Update error:', updateError);

      if (updateError) {
        console.error('Database update failed:', updateError);
        throw new Error(`Update failed: ${updateError.message}`);
      }

      if (!updateResult || updateResult.length === 0) {
        throw new Error('No rows were updated. Order may not exist or you may not have permission.');
      }

      console.log('Update successful:', updateResult[0]);

      const updatedOrder = updateResult[0];
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === editingOrder.id 
            ? {
                ...order,
                status: updatedOrder.status,
                shipping_status: updatedOrder.shipping_status,
                courier_name: updatedOrder.courier_name,
                courier_contact: updatedOrder.courier_contact,
                tracking_id: updatedOrder.tracking_id,
              }
            : order
        )
      );

      setEditingOrder(null);
      
      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      console.log('=== ORDER UPDATE COMPLETED ===');

    } catch (error: any) {
      console.error('=== ORDER UPDATE FAILED ===');
      console.error('Error details:', error);
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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

  const getShippingStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'shipped':
      case 'out_for_delivery': return <Truck className="h-4 w-4 text-blue-600" />;
      default: return <Package className="h-4 w-4 text-orange-600" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600';
      case 'confirmed': return 'text-blue-600';
      case 'processing': return 'text-purple-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Package className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Order Management</span>
        </CardTitle>
        <CardDescription>Manage orders and shipping status with enhanced editing capabilities</CardDescription>
        
        <div className="flex items-center space-x-2 mt-4">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
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
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
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
                    </TableCell>
                    <TableCell>
                      {editingOrder?.id === order.id ? (
                        <Select
                          value={editingOrder.status}
                          onValueChange={(value) => 
                            setEditingOrder({...editingOrder, status: value})
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`capitalize font-medium ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder?.id === order.id ? (
                        <Select
                          value={editingOrder.shipping_status}
                          onValueChange={(value) => 
                            setEditingOrder({...editingOrder, shipping_status: value})
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {getShippingStatusIcon(order.shipping_status)}
                          <span className={`capitalize font-medium ${getShippingStatusColor(order.shipping_status)}`}>
                            {getShippingStatusLabel(order.shipping_status)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder?.id === order.id ? (
                        <div className="space-y-2 min-w-48">
                          <div>
                            <Label className="text-xs">Courier Name</Label>
                            <Input
                              placeholder="Courier name"
                              value={editingOrder.courier_name}
                              onChange={(e) => 
                                setEditingOrder({...editingOrder, courier_name: e.target.value})
                              }
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Contact</Label>
                            <Input
                              placeholder="Phone number"
                              value={editingOrder.courier_contact}
                              onChange={(e) => 
                                setEditingOrder({...editingOrder, courier_contact: e.target.value})
                              }
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Tracking ID</Label>
                            <Input
                              placeholder="Tracking ID"
                              value={editingOrder.tracking_id}
                              onChange={(e) => 
                                setEditingOrder({...editingOrder, tracking_id: e.target.value})
                              }
                              className="h-8"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          {order.courier_name && (
                            <div className="flex items-center space-x-1 mb-1">
                              <Truck className="h-3 w-3" />
                              <span>{order.courier_name}</span>
                            </div>
                          )}
                          {order.courier_contact && (
                            <div className="flex items-center space-x-1 mb-1">
                              <Phone className="h-3 w-3" />
                              <span>{order.courier_contact}</span>
                            </div>
                          )}
                          {order.tracking_id && (
                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              ID: {order.tracking_id}
                            </div>
                          )}
                          {!order.courier_name && !order.courier_contact && !order.tracking_id && (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingOrder?.id === order.id ? (
                        <div className="flex space-x-1">
                          <Button 
                            onClick={handleSave} 
                            size="sm" 
                            variant="default"
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-3 w-3" />
                            {saving && <span className="ml-1 animate-pulse">...</span>}
                          </Button>
                          <Button 
                            onClick={handleCancelEdit} 
                            size="sm" 
                            variant="outline"
                            disabled={saving}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleEdit(order)} 
                          size="sm" 
                          variant="outline"
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            {searchTerm ? (
              <>
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">No orders match your search criteria.</p>
              </>
            ) : (
              <>
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">Orders will appear here when customers place them.</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
