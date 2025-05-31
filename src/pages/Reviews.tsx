
import Layout from '../components/Layout';
import TestimonialCard from '../components/TestimonialCard';

const Reviews = () => {
  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'The beef pickles are absolutely amazing! They remind me of my grandmother\'s cooking. The flavors are so authentic and rich. I\'ve ordered multiple jars and they never disappoint.',
      location: 'New York, NY'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Best quality food products I\'ve ever ordered online. The packaging was excellent and the taste exceeded all my expectations. Will definitely be a repeat customer!',
      location: 'San Francisco, CA'
    },
    {
      name: 'Emma Davis',
      rating: 5,
      comment: 'The Chicken Sinju is incredible. The flavors are so authentic and delicious. You can really taste the quality ingredients and traditional preparation methods.',
      location: 'Chicago, IL'
    },
    {
      name: 'Robert Miller',
      rating: 5,
      comment: 'Outstanding products! The beef pickles have become a staple in our household. The traditional flavors are exactly what I was looking for.',
      location: 'Austin, TX'
    },
    {
      name: 'Lisa Thompson',
      rating: 5,
      comment: 'Momsgoogoo Foods has brought authentic flavors to our dinner table. The quality is exceptional and the taste is unforgettable. Highly recommended!',
      location: 'Miami, FL'
    },
    {
      name: 'David Wilson',
      rating: 5,
      comment: 'I\'ve tried many similar products, but none compare to the quality and authenticity of Momsgoogoo Foods. The attention to detail is remarkable.',
      location: 'Seattle, WA'
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Reviews</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Hear what our customers have to say about our products
          </p>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-yellow-50 px-6 py-4 rounded-lg">
              <div className="flex text-yellow-400 text-2xl mr-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}/5</div>
                <div className="text-sm text-gray-600">Based on {reviews.length} reviews</div>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review, index) => (
              <TestimonialCard key={index} {...review} />
            ))}
          </div>

          {/* Leave a Review Call-to-Action */}
          <div className="mt-16 text-center">
            <div className="bg-orange-50 p-8 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Experience</h3>
              <p className="text-gray-600 mb-6">
                Have you tried our products? We'd love to hear about your experience! 
                Your feedback helps us continue to improve and helps other customers 
                make informed decisions.
              </p>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Reviews;
