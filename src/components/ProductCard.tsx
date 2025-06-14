
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { useCart } from '@/hooks/useCartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  features?: string[] | null;
  className?: string;
  imageClassName?: string;
  showFullDescription?: boolean;
  compact?: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image_url, 
  description, 
  features,
  className = "",
  imageClassName = "aspect-[4/3] w-full object-cover",
  showFullDescription = true,
  compact = false
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(id, 1);
      toast({
        title: "Added to Cart",
        description: `${name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const truncatedDescription = description && description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;

  if (compact) {
    return (
      <Link to={`/product/${id}`} className={`block ${className}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group h-full flex flex-col overflow-hidden">
          <div className="relative overflow-hidden">
            <img
              src={image_url || '/placeholder.svg'}
              alt={name}
              className={`${imageClassName}`}
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-yellow-400 text-black px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-sm">
              ⭐ 4.9
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
          
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 group-hover:text-black transition-colors line-clamp-2 leading-tight">
              {name}
            </h3>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="text-lg font-bold text-black">
                ₹{price.toLocaleString()}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="bg-black text-white p-1.5 rounded-full hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                aria-label={`Add ${name} to cart`}
              >
                <ShoppingCart className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${id}`} className={`block ${className}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group h-full flex flex-col overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={image_url || '/placeholder.svg'}
            alt={name}
            className={`${imageClassName}`}
            loading="lazy"
          />
          <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
            ⭐ 4.9
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        
        <div className="p-4 lg:p-5 flex-1 flex flex-col">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2 group-hover:text-black transition-colors line-clamp-2 leading-tight">
            {name}
          </h3>
          
          {showFullDescription && description && (
            <p className="text-gray-600 text-sm lg:text-base mb-3 flex-1 leading-relaxed">
              {truncatedDescription}
            </p>
          )}
          
          {features && features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    {feature}
                  </span>
                ))}
                {features.length > 2 && (
                  <span className="text-gray-500 text-xs px-2.5 py-1 font-medium">
                    +{features.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="text-xl lg:text-2xl font-bold text-black">
              ₹{price.toLocaleString()}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-black text-white p-2.5 lg:p-3 rounded-full hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
