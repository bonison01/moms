import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { useCart } from '@/hooks/useCartContext';
import Layout from '../components/Layout';
import { ShoppingCart, User, Plus, Minus, Loader2, ArrowLeft, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  category: string | null;
  features: string[] | null;
  ingredients: string | null;
  nutrition_facts: any;
  offers: string | null;
  stock_quantity: number | null;
  is_active: boolean;
}

const Product = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', id);
      
      // First try to fetch by ID
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      // If not found by ID, try to fetch by slug (name converted to slug format)
      if (error && error.code === 'PGRST116') {
        console.log('Product not found by ID, trying to fetch by slug...');
        const { data: allProducts, error: allError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (!allError && allProducts) {
          // Find product by slug match
          const matchedProduct = allProducts.find(p => {
            const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            console.log(`Comparing slug "${slug}" with "${id}"`);
            return slug === id;
          });
          
          if (matchedProduct) {
            console.log('Found product by slug:', matchedProduct.name);
            data = matchedProduct;
            error = null;
          }
        }
      }

      if (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } else {
        console.log('Product fetched successfully:', data);
        setProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In to Purchase",
        description: "Create an account or sign in to complete your purchase.",
        variant: "default",
      });
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      navigate('/checkout');
      toast({
        title: "Redirecting to Checkout",
        description: `${quantity} x ${product.name} added to cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In to Add to Cart",
        description: "Create an account or sign in to save items to your cart.",
        variant: "default",
      });
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Product removed from your wishlist" : "Product added to your wishlist",
    });
  };

  const handleReviewSubmitted = () => {
    setReviewsRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/shop">
              <Button className="bg-black text-white hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Shop
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-600 hover:text-black transition-colors">Home</Link>
              <span className="text-gray-400">/</span>
              <Link to="/shop" className="text-gray-600 hover:text-black transition-colors">Shop</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
          </nav>

          {/* Guest Notice - Only shown as gentle information */}
          {!isAuthenticated && (
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Sign in to purchase and save to cart</span>
                </div>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Favorite Button */}
              <Button
                onClick={toggleFavorite}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>

              {/* Offer Badge */}
              {product.offers && (
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {product.offers}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8 out of 5)</span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-black">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.category && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <div className="mb-8">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock_quantity !== null && (
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector - Always show */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold px-4 py-2 bg-gray-50 rounded-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(1)}
                    disabled={product.stock_quantity !== null && quantity >= product.stock_quantity}
                    className="h-10 w-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons - Always show, no blocking */}
              <div className="space-y-4 mb-8">
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0}
                  className="w-full bg-black text-white hover:bg-gray-800 text-lg py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock_quantity === 0 ? 'Out of Stock' : `Buy Now - ₹${(product.price * quantity).toLocaleString()}`}
                </Button>
                
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  disabled={product.stock_quantity === 0}
                  className="w-full text-lg py-4 rounded-xl font-medium border-2 border-gray-200 hover:border-black transition-all duration-300"
                >
                  Add to Cart
                </Button>
              </div>

              {/* Product Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-black mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-black mb-4">Ingredients</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {/* Nutrition Facts */}
              {product.nutrition_facts && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-black mb-4">Nutrition Facts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.nutrition_facts).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-black capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-700">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <div className="border-t border-gray-200 pt-16">
              <h2 className="text-3xl font-bold text-black mb-8">Customer Reviews</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Reviews List */}
                <div>
                  <h3 className="text-xl font-bold text-black mb-6">Product Reviews</h3>
                  <ReviewsList 
                    productId={product.id} 
                    refreshTrigger={reviewsRefreshTrigger}
                  />
                </div>

                {/* Review Form */}
                <div>
                  <ReviewForm 
                    productId={product.id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;
