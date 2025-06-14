
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
}

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description')
        .eq('is_active', true)
        .limit(4)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching featured products:', error);
        return;
      }

      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'The chicken pickle is absolutely divine! It tastes exactly like my grandmother used to make in Manipur. The authentic flavors brought back so many childhood memories.',
      location: 'Mumbai, Maharashtra',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Outstanding quality! I ordered the fermented fish and it was perfectly seasoned. The packaging was excellent and delivery was prompt. Highly recommended!',
      location: 'Delhi, India',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Anita Devi',
      rating: 5,
      comment: 'Finally found authentic Manipuri food online! The spice blend is perfect and you can taste the traditional preparation methods. Will definitely order again.',
      location: 'Bangalore, Karnataka',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Authentic Flavors,<br />
              <span className="text-gray-300">Traditional Recipes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Discover the taste of tradition with our handcrafted pickles and specialty foods, 
              made with love and authentic recipes passed down through generations.
            </p>
            <div className="space-x-4">
              <Link
                to="/shop"
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors inline-block"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Login Section - Only show if not authenticated */}
      {!isAuthenticated && (
        <section className="py-12 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Already a Customer?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Sign in to your account to track orders, save favorites, and enjoy a personalized shopping experience.
            </p>
            <div className="space-x-4">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Customer Login
              </Link>
              <Link
                to="/auth"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors inline-block"
              >
                Create Account
              </Link>
            </div>
            <div className="mt-4">
              <Link
                to="/auth?admin=true"
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Admin Login →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Our Signature Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Taste the difference that authentic ingredients and traditional methods make
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {featuredProducts.map((product) => (
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
            <div className="text-center py-8">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Made with Love, Served with Pride
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Momsgoogoo Foods, we believe that the best flavors come from time-honored 
                traditions and the finest ingredients. Every jar, every bite tells a story 
                of heritage and passion for authentic taste.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our products are crafted in small batches using traditional methods, 
                ensuring that each item meets our high standards for quality and flavor.
              </p>
              <Link
                to="/about"
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="lg:pl-8">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop"
                alt="Traditional cooking"
                className="rounded-lg shadow-lg w-full grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Real reviews from our valued customers across India
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/reviews"
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
            >
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
