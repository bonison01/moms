
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useCart } from '@/hooks/useCartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  showBuyNowAndCart?: boolean; // New prop to control which buttons to show
}

const ProductCard = ({ product, showBuyNowAndCart = false }: ProductCardProps) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product.id, 1);
    }
  };

  const handleBuyNow = () => {
    if (isAuthenticated) {
      // Add to cart and navigate to checkout
      addToCart(product.id, 1).then(() => {
        navigate('/checkout');
      });
    } else {
      // Guest checkout with product data
      navigate('/checkout', { 
        state: { 
          guestCheckout: true,
          product: product,
          quantity: 1
        }
      });
    }
  };

  const displayPrice = product.offer_price || product.price;
  const hasOffer = product.offer_price && product.offer_price < product.price;

  return (
    <Card className="h-full flex flex-col group hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image_url || '/placeholder-image.png'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
              Featured
            </Badge>
          )}
          {hasOffer && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              Sale
            </Badge>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between p-4">
        <div>
          <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">
                ₹{displayPrice}
              </span>
              {hasOffer && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            {product.category && (
              <Badge variant="outline" className="mt-2">
                {product.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {showBuyNowAndCart ? (
            <>
              {/* Buy Now and Add to Cart buttons for signature products */}
              <Button 
                onClick={handleBuyNow}
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Buy Now'}
              </Button>
              
              {isAuthenticated && product.stock_quantity > 0 && (
                <Button 
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full"
                >
                  Add to Cart
                </Button>
              )}
              
              <Link to={`/product/${product.id}`} className="w-full">
                <Button variant="ghost" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Original buttons for other product displays */}
              <div className="flex space-x-2">
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                
                {isAuthenticated && product.stock_quantity > 0 && (
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
