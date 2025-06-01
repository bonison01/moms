
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  category: string | null;
  is_active: boolean;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products for shop page...');
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description, category, is_active')
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our carefully crafted collection of traditional foods
          </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  price={`₹${product.price}`}
                  image={product.image_url || '/placeholder.svg'}
                  description={product.description || 'No description available'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Products Available</h3>
              <p className="text-gray-600 mb-8">
                We're working on adding new products. Please check back soon!
              </p>
            </div>
          )}
          
          {/* Coming Soon */}
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
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
