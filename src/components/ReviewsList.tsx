
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, User } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface ReviewsListProps {
  productId?: string; // undefined means brand reviews
  refreshTrigger: number;
}

const ReviewsList = ({ productId, refreshTrigger }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          comment,
          created_at,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      } else {
        query = query.is('product_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      setReviews(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Number(avg.toFixed(1)));
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 p-4 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex text-yellow-400 text-xl mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-900">{averageRating}</span>
            </div>
            <div className="text-gray-600">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Star className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">
            Be the first to {productId ? 'review this product' : 'review our brand'}!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.profiles?.full_name || 'Anonymous User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
