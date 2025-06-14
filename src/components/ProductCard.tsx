
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
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image_url, 
  description, 
  features,
  className = "",
  imageClassName = "h-48 w-full object-cover",
  showFullDescription = true
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

  const truncatedDescription = description && description.length > 80 
    ? description.substring(0, 80) + '...' 
    : description;

  return (
    <Link to={`/product/${id}`} className={`block ${className}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={image_url || '/placeholder.svg'}
            alt={name}
            className={`${imageClassName} group-hover:scale-105 transition-transform duration-300`}
          />
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
            ⭐ 4.9
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-black transition-colors line-clamp-2">
            {name}
          </h3>
          
          {showFullDescription && description && (
            <p className="text-gray-600 text-sm mb-3 flex-1">
              {truncatedDescription}
            </p>
          )}
          
          {features && features.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {features.length > 2 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{features.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <div className="text-xl font-bold text-black">
              ₹{price}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
