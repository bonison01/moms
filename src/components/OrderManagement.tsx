
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Package } from 'lucide-react';
import { Order, EditingOrder } from './OrderManagement/types';
import OrderTableHeader from './OrderManagement/OrderTableHeader';
import OrderRow from './OrderManagement/OrderRow';
import SearchBar from './OrderManagement/SearchBar';

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

  const handleFieldChange = (field: keyof EditingOrder, value: string) => {
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, [field]: value });
    }
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
        
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
        />
      </CardHeader>
      <CardContent>
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <OrderTableHeader />
              <TableBody>
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    editingOrder={editingOrder}
                    saving={saving}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancelEdit={handleCancelEdit}
                    onFieldChange={handleFieldChange}
                  />
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
