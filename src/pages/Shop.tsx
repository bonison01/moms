
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Loader2, Package, ShoppingCart, User } from 'lucide-react';
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
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
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

  const handleBuyNow = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase products.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // For now, show a success message - this can be enhanced with actual payment processing
    toast({
      title: "Purchase Initiated",
      description: `Starting purchase process for ${product.name}`,
    });
    
    // Navigate to product detail page for full purchase flow
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to cart.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // For now, show a success message - this can be enhanced with actual cart functionality
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our carefully crafted collection of traditional foods
          </p>
          
          {/* Authentication Status */}
          <div className="mt-8">
            {isAuthenticated ? (
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <User className="h-5 w-5" />
                <span>Welcome back, {user?.email}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-yellow-300">Sign in to purchase products</p>
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  Sign In / Register
                </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-black">₹{product.price}</span>
                        {product.stock_quantity !== null && (
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock_quantity}
                          </span>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleBuyNow(product)}
                          className="w-full bg-black text-white hover:bg-gray-800"
                          disabled={product.stock_quantity === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.stock_quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                        </Button>
                        
                        <Button
                          onClick={() => handleAddToCart(product)}
                          variant="outline"
                          className="w-full"
                          disabled={product.stock_quantity === 0}
                        >
                          Add to Cart
                        </Button>
                        
                        <Button
                          onClick={() => navigate(`/product/${product.id}`)}
                          variant="ghost"
                          className="w-full text-sm"
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
          
          {/* Coming Soon Section - only show if we have products */}
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
