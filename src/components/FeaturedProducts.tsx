
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCartContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  offers: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description, offers')
        .eq('is_active', true)
        .limit(isMobile ? 2 : 4)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Featured Products
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
              Loading products...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm animate-fade-in overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Featured Products</span>
          </CardTitle>
          <Link to="/shop">
            <Button variant="outline" size={isMobile ? "sm" : "default"} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ExternalLink className="h-4 w-4 mr-1" />
              {isMobile ? "Shop" : "View All"}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {products.length > 0 ? (
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group border rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'space-x-4'}`}>
                  <div className={`${isMobile ? 'w-full h-32' : 'w-20 h-20'} bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className={`font-semibold text-gray-900 group-hover:text-purple-600 transition-colors ${isMobile ? 'text-base' : 'text-sm'} line-clamp-1`}>
                      {product.name}
                    </h3>
                    <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'} line-clamp-2`}>
                      {product.description}
                    </p>
                    {product.offers && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          {product.offers}
                        </span>
                      </div>
                    )}
                    <div className={`flex items-center ${isMobile ? 'justify-between' : 'justify-between'} pt-2`}>
                      <span className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-lg'}`}>
                        ₹{product.price.toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" size={isMobile ? "sm" : "sm"} className="hover-scale">
                            View
                          </Button>
                        </Link>
                        <Button
                          size={isMobile ? "sm" : "sm"}
                          onClick={() => handleAddToCart(product)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover-scale"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500">No featured products available</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedProducts;
