
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description, features')
        .eq('featured', true)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse aspect-square rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="aspect-square">
          <ProductCard
            {...product}
            className="h-full"
            imageClassName="aspect-square object-cover"
            showFullDescription={false}
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
