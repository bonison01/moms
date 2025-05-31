
import Layout from '../components/Layout';
import TestimonialCard from '../components/TestimonialCard';

const Reviews = () => {
  const reviews = [
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'The chicken pickle is absolutely divine! It tastes exactly like my grandmother used to make in Manipur. The authentic flavors brought back so many childhood memories. Ordered 5 jars at once!',
      location: 'Mumbai, Maharashtra',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Outstanding quality! I ordered the fermented fish and it was perfectly seasoned. The packaging was excellent and delivery was prompt. My wife who is from Manipur was amazed by the authenticity.',
      location: 'Delhi, India',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Anita Devi',
      rating: 5,
      comment: 'Finally found authentic Manipuri food online! The spice blend is perfect and you can taste the traditional preparation methods. The bamboo shoot pickle is my favorite. Will definitely order again.',
      location: 'Bangalore, Karnataka',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Suresh Patel',
      rating: 5,
      comment: 'Being away from Northeast, I was craving authentic Manipuri flavors. Momsgoogoo Foods delivered exactly what I needed. The dry chilli chutney is absolutely perfect with rice.',
      location: 'Ahmedabad, Gujarat',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Kavita Singh',
      rating: 5,
      comment: 'My daughter studies in Delhi and she was missing home food. I ordered multiple items for her and she said they taste just like home. Thank you for maintaining the authentic flavors!',
      location: 'Imphal, Manipur',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Arun Thapa',
      rating: 5,
      comment: 'The spicy soybean crisp is addictive! I shared it with my friends and now everyone is asking where to buy it. Great taste and excellent quality. Highly recommend to everyone.',
      location: 'Kolkata, West Bengal',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
    }
  ];

  const instagramPhotos = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=300&fit=crop'
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Reviews</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Real feedback from our valued customers across India
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {reviews.map((review, index) => (
              <TestimonialCard key={index} {...review} />
            ))}
          </div>

          {/* Instagram Photos Section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-black mb-6">Follow us on Instagram</h3>
            <p className="text-gray-600 mb-8">See how our customers enjoy Momsgoogoo Foods</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {instagramPhotos.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={photo} 
                    alt={`Customer photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Leave a Review Call-to-Action */}
          <div className="text-center">
            <div className="bg-gray-50 p-8 rounded-lg max-w-2xl mx-auto border border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-4">Share Your Experience</h3>
              <p className="text-gray-600 mb-6">
                Have you tried our products? We'd love to hear about your experience! 
                Your feedback helps us continue to improve and helps other customers 
                make informed decisions.
              </p>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
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
