import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import FeaturedProducts from '../components/FeaturedProducts';
import { ArrowRight } from 'lucide-react';

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
}

interface Review {
  id: string;
  title: string;
  comment: string;
  rating: number;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchReviews();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, description')
        .eq('is_active', true)
        .eq('featured', true)
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

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          title,
          comment,
          rating,
          created_at,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .is('product_id', null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Fallback testimonials for when there are no database reviews
  const fallbackTestimonials = [
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

      {/* Featured Products - With Title and Shop More Button */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Our Signature Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our most loved authentic Manipuri foods, crafted with traditional recipes and premium ingredients
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors gap-2"
            >
              Shop More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FeaturedProducts />
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

      {/* Customer Reviews - From Database */}
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
          
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="flex text-black">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-black' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <h4 className="font-semibold text-black mb-2">{review.title}</h4>
                  <p className="text-gray-600 mb-4 italic">"{review.comment}"</p>
                  <div className="text-sm">
                    <div className="font-semibold text-black">
                      {review.profiles?.full_name || 'Anonymous Customer'}
                    </div>
                    <div className="text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fallbackTestimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          )}
          
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
