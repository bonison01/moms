import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { useCart } from '@/hooks/useCartContext';
import Layout from '../components/Layout';
import CartSidebar from '../components/CartSidebar';
import { Loader2, Package, ShoppingCart, User, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  category: string | null;
  is_active: boolean;
  stock_quantity: number | null;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { addToCart, cartCount, refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products for shop page...');
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description, category, is_active, stock_quantity')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data?.length || 0);
      setProducts(data || []);
      
      // Initialize quantities
      const initialQuantities: { [key: string]: number } = {};
      (data || []).forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (product: Product) => {
    console.log('🛒 Buy Now clicked for product:', product.name);
    
    if (isAuthenticated) {
      // For authenticated users: add to cart, refresh cart, then navigate
      try {
        console.log('🔄 Adding item to cart for authenticated user...');
        await addToCart(product.id, quantities[product.id] || 1);
        
        // Refresh cart to ensure latest data
        console.log('🔄 Refreshing cart data...');
        await refreshCart();
        
        // Small delay to ensure cart is updated
        setTimeout(() => {
          console.log('➡️ Navigating to checkout with updated cart...');
          navigate('/checkout');
        }, 100);
        
      } catch (error) {
        console.error('❌ Error in Buy Now for authenticated user:', error);
        toast({
          title: "Error",
          description: "Failed to process purchase. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // For guests: navigate directly with product data
      console.log('➡️ Guest checkout - navigating with product data...');
      navigate('/checkout', { 
        state: { 
          guestCheckout: true,
          product: product,
          quantity: quantities[product.id] || 1
        }
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product.id, quantities[product.id] || 1);
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  return (
    <Layout>
      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Cart Button - Fixed Position - Show for all users */}
      <Button
        onClick={handleCartClick}
        className="fixed bottom-6 right-6 z-40 rounded-full h-14 w-14 bg-black text-white hover:bg-gray-800 shadow-lg"
      >
        <ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Discover our carefully crafted collection of traditional foods
          </p>
          
          {/* Authentication Status */}
          <div className="mt-8">
            {isAuthenticated ? (
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <User className="h-5 w-5" />
                  <span>Welcome back, {user?.email}</span>
                </div>
                <Button 
                  onClick={handleCartClick}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cartCount})
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-blue-200 text-lg">Browse, shop, and checkout as a guest • Sign in for a better experience</p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    Sign In / Register
                  </Button>
                  <Button 
                    onClick={handleCartClick}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart ({cartCount})
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Products</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Choose from our selection of {products.length} premium products
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="aspect-square">
                      <img
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 md:p-4">
                      <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between mb-2 md:mb-4">
                        <span className="text-lg md:text-2xl font-bold text-black">₹{product.price}</span>
                        {product.stock_quantity !== null && (
                          <span className="text-xs md:text-sm text-gray-500">
                            Stock: {product.stock_quantity}
                          </span>
                        )}
                      </div>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-2 md:mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={quantities[product.id] <= 1}
                          className="h-6 w-6 md:h-8 md:w-8 p-0"
                        >
                          <Minus className="w-2 h-2 md:w-3 md:h-3" />
                        </Button>
                        <span className="text-xs md:text-sm font-medium px-1 md:px-3">{quantities[product.id] || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="h-6 w-6 md:h-8 md:w-8 p-0"
                        >
                          <Plus className="w-2 h-2 md:w-3 md:h-3" />
                        </Button>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-1 md:space-y-2">
                        <Button
                          onClick={() => handleBuyNow(product)}
                          className="w-full bg-black text-white hover:bg-gray-800 text-xs md:text-sm py-2 md:py-2"
                          disabled={product.stock_quantity === 0}
                        >
                          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          {product.stock_quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                        </Button>
                        
                        <Button
                          onClick={() => handleAddToCart(product)}
                          variant="outline"
                          className="w-full text-xs md:text-sm py-2 md:py-2"
                          disabled={product.stock_quantity === 0}
                        >
                          Add to Cart
                        </Button>
                        
                        <Button
                          onClick={() => navigate(`/product/${product.id}`)}
                          variant="ghost"
                          className="w-full text-xs md:text-sm py-1 md:py-2"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We're working on adding new products. Please check back soon!
              </p>
            </div>
          )}
          
          {/* Coming Soon Section */}
          {products.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md max-w-md mx-auto border border-gray-200">
                <h3 className="text-2xl font-bold text-black mb-4">More Products Coming Soon!</h3>
                <p className="text-gray-600 mb-6">
                  We're constantly working on new flavors and products to add to our collection. 
                  Stay tuned for exciting additions to the Momsgoogoo Foods family.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                  <p className="text-black font-medium">
                    Sign up for our newsletter to be the first to know about new products!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
