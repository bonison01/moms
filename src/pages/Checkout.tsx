
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useCart } from '@/hooks/useCartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CreditCard, Truck, User } from 'lucide-react';

interface UserProfile {
  full_name?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
}

interface GuestCheckoutItem {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
  quantity: number;
}

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [saveProfile, setSaveProfile] = useState(true);
  
  // Guest checkout data from navigation state
  const guestCheckoutData = location.state as { guestCheckout?: boolean; product?: any; quantity?: number } | null;
  const isGuestCheckout = guestCheckoutData?.guestCheckout;
  const guestItem: GuestCheckoutItem | null = guestCheckoutData?.product ? {
    product: guestCheckoutData.product,
    quantity: guestCheckoutData.quantity || 1
  } : null;

  const [formData, setFormData] = useState({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: ''
  });

  useEffect(() => {
    // For guest checkout, we have items from navigation state
    if (isGuestCheckout && guestItem) {
      return; // Don't redirect, allow guest checkout
    }

    // For authenticated users, check if they have cart items
    if (isAuthenticated && cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      navigate('/shop');
      return;
    }

    // If authenticated, fetch user profile
    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  }, [isAuthenticated, cartItems, navigate, toast, isGuestCheckout, guestItem, user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, address_line_1, address_line_2, city, state, postal_code, phone')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('Profile data fetched:', data);
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['full_name', 'address_line_1', 'city', 'state', 'postal_code', 'phone'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]?.trim());
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ').replace(/_/g, ' ')}`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      console.log('🚀 Starting order placement process...');
      
      let totalAmount: number;
      let orderItems: any[];

      // Calculate total and prepare order items based on checkout type
      if (isGuestCheckout && guestItem) {
        totalAmount = guestItem.product.price * guestItem.quantity;
        orderItems = [{
          product_id: guestItem.product.id,
          quantity: guestItem.quantity,
          price: guestItem.product.price
        }];
        console.log('🛒 Guest checkout - Total:', totalAmount, 'Items:', orderItems);
      } else if (isAuthenticated && cartItems.length > 0) {
        totalAmount = getTotalAmount();
        orderItems = cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price
        }));
        console.log('🛒 Authenticated checkout - Total:', totalAmount, 'Items:', orderItems);
      } else {
        throw new Error('No items to checkout');
      }

      const deliveryAddress = {
        full_name: formData.full_name,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code
      };

      // Save profile if user is authenticated and requested
      if (isAuthenticated && user && saveProfile) {
        console.log('💾 Updating user profile with address info');
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: formData.full_name,
              address_line_1: formData.address_line_1,
              address_line_2: formData.address_line_2,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postal_code,
              phone: formData.phone,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (profileError) {
            console.error('❌ Error updating profile:', profileError);
          } else {
            console.log('✅ Profile updated successfully');
          }
        } catch (err) {
          console.error('❌ Exception updating profile:', err);
        }
      }

      // Create order with explicit handling for both authenticated and guest users
      const orderData = {
        user_id: isAuthenticated && user ? user.id : null,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        delivery_address: deliveryAddress,
        phone: formData.phone,
        status: 'pending'
      };

      console.log('📦 Creating order with data:', orderData);

      // Get current session to ensure we have the right auth context
      const { data: session } = await supabase.auth.getSession();
      console.log('🔐 Current session:', {
        hasSession: !!session.session,
        hasUser: !!session.session?.user,
        userId: session.session?.user?.id
      });

      // Try to create the order with proper error handling
      let orderResult;
      try {
        orderResult = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();
      } catch (insertError: any) {
        console.error('❌ Direct insert error:', insertError);
        
        // If RLS is still blocking, try a different approach
        console.log('🔄 Attempting alternative order creation...');
        
        // For guest users, ensure we're not setting any user_id
        const guestOrderData = {
          ...orderData,
          user_id: null // Explicitly set to null for guest orders
        };
        
        orderResult = await supabase
          .from('orders')
          .insert([guestOrderData])
          .select()
          .single();
      }

      const { data: order, error: orderError } = orderResult;

      if (orderError) {
        console.error('❌ Final order error:', {
          message: orderError.message,
          details: orderError.details,
          hint: orderError.hint,
          code: orderError.code
        });
        throw new Error(`Order creation failed: ${orderError.message}`);
      }

      if (!order) {
        throw new Error('Order creation failed - no order returned');
      }

      console.log('✅ Order created successfully:', order.id);

      // Create order items
      const orderItemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: order.id
      }));

      console.log('📝 Creating order items:', orderItemsWithOrderId);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId);

      if (itemsError) {
        console.error('❌ Order items error:', {
          message: itemsError.message,
          details: itemsError.details,
          hint: itemsError.hint,
          code: itemsError.code
        });
        throw new Error(`Order items creation failed: ${itemsError.message}`);
      }

      console.log('✅ Order items created successfully');

      // Clear cart only for authenticated users
      if (isAuthenticated && !isGuestCheckout) {
        await clearCart();
      }

      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order #${order.id.slice(0, 8)} has been placed for ₹${totalAmount}. You will receive a confirmation shortly.`,
      });

      // Navigate based on user type
      if (isAuthenticated) {
        navigate('/customer-dashboard');
      } else {
        navigate('/shop');
      }

    } catch (error: any) {
      console.error('❌ Checkout error details:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      
      // Provide user-friendly error messages
      let errorMessage = "There was an error processing your order. Please try again.";
      
      if (error.message?.includes('row-level security')) {
        errorMessage = "There was a security issue processing your order. Please refresh the page and try again.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Checkout Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get items to display (either cart items or guest item)
  const displayItems = isGuestCheckout && guestItem ? [guestItem] : 
    cartItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));

  const displayTotal = isGuestCheckout && guestItem ? 
    guestItem.product.price * guestItem.quantity : getTotalAmount();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/shop')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          
          {/* Show checkout type indicator */}
          {isGuestCheckout ? (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Guest Checkout</span>
                <span className="text-blue-600">•</span>
                <span className="text-blue-700">
                  <Button 
                    variant="link" 
                    className="text-blue-700 p-0 h-auto" 
                    onClick={() => navigate('/auth')}
                  >
                    Sign in
                  </Button> 
                  {" "}to save your information and track your order
                </span>
              </div>
            </div>
          ) : isAuthenticated && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Welcome back, {user?.email}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.image_url || '/placeholder.svg'}
                          alt={item.product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{displayTotal}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address_line_1">Address Line 1 *</Label>
                  <Input
                    id="address_line_1"
                    value={formData.address_line_1}
                    onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                    placeholder="Street address, building name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address_line_2">Address Line 2</Label>
                  <Input
                    id="address_line_2"
                    value={formData.address_line_2}
                    onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                    placeholder="Apartment, suite, unit (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code *</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="Postal Code"
                    required
                  />
                </div>

                {/* Only show save profile option for authenticated users */}
                {isAuthenticated && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-profile"
                      checked={saveProfile}
                      onCheckedChange={(checked) => setSaveProfile(checked as boolean)}
                    />
                    <Label htmlFor="save-profile" className="text-sm">
                      Save this information for future orders
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <Truck className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-600">Pay when your order arrives</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="online" id="online" disabled />
                    <Label htmlFor="online" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Online Payment</p>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-800 py-3"
              size="lg"
            >
              {isLoading ? 'Processing Order...' : `Place Order - ₹${displayTotal}`}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
