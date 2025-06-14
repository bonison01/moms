
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ExternalLink, Sparkles, Heart, Eye, ArrowRight } from 'lucide-react';
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

// Product slug mapping for existing products
const productSlugMap: Record<string, string> = {
  'seasoned-fermented-fish': 'seasoned-fermented-fish',
  'chicken-pickle': 'chicken-pickle',
  'spicy-lentil-crisp': 'spicy-lentil-crisp',
  'spicy-soybean-crisp': 'spicy-soybean-crisp',
  'dry-chilli-chutney': 'dry-chilli-chutney',
  'spicy-stink-beans': 'spicy-stink-beans',
  'bamboo-shoot-chicken-pickle': 'bamboo-shoot-chicken-pickle'
};

const getProductSlug = (productName: string): string => {
  // Convert product name to slug format
  const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return productSlugMap[slug] || slug;
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
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
        .eq('featured', true)
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
        title: "🛒 Added to Cart",
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

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast({
          title: "💔 Removed from favorites",
          description: "Product removed from your wishlist",
        });
      } else {
        newFavorites.add(productId);
        toast({
          title: "❤️ Added to favorites",
          description: "Product added to your wishlist",
        });
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-60"></div>
        <div className="relative">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-black mr-3 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold text-black">
                Our Signature Products
              </h2>
            </div>
            <div className="w-24 h-1 bg-black mx-auto mb-6 rounded-full"></div>
          </div>
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-3 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
              <span className="text-lg font-medium">Discovering amazing products for you...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background with subtle gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-60"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-300 to-gray-200 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-black mr-3 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Our Signature Products
            </h2>
          </div>
          <div className="w-24 h-1 bg-black mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Handcrafted with love, perfected with tradition. Discover the authentic flavors that make every meal extraordinary.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className={`grid gap-8 mb-12 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className="group relative bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                  >
                    <Heart
                      className={`h-5 w-5 transition-all duration-300 ${
                        favorites.has(product.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-64">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                      hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="flex space-x-3">
                        <Link to={`/product/${getProductSlug(product.name)}`}>
                          <Button
                            size="sm"
                            className="bg-white/20 border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Quick View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Offer Badge */}
                    {product.offers && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          <span className="text-xs font-semibold">{product.offers}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors duration-300 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-bold text-black">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">per unit</span>
                        </div>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Link to={`/product/${getProductSlug(product.name)}`} className="block">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300 py-3 rounded-xl"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black mb-3">
                    Discover More Amazing Products
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Explore our complete collection of handcrafted delicacies and traditional favorites
                  </p>
                  <Link to="/shop">
                    <Button className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <span className="mr-2">Explore All Products</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
              <Sparkles className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">No Featured Products Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're curating the perfect selection of signature products for you. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
