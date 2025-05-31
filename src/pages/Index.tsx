
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';

const Index = () => {
  const featuredProducts = [
    {
      id: 'chicken-pickle',
      name: 'Chicken Pickle',
      price: '₹1,299',
      image: '/lovable-uploads/5d3d1fda-566d-4288-867d-21ed4494e26f.png',
      description: 'A product of Manipur - Just like homemade chicken pickle with traditional spices and authentic flavors.'
    },
    {
      id: 'seasoned-fermented-fish',
      name: 'Seasoned Fermented Fish',
      price: '₹1,599',
      image: '/lovable-uploads/b4742f71-5f91-4c9b-8dfa-88d0e668b696.png',
      description: 'Ngari Angouba - Traditional seasoned fermented fish, roasted and ready to eat with authentic spices.'
    }
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
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
