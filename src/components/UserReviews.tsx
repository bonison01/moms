
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import ReviewCard from './ReviewCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  title: string;
  comment: string;
  rating: number;
  created_at: string;
  user_id: string;
}

interface UserReviewsProps {
  onWriteReview?: () => void;
}

const UserReviews = ({ onWriteReview }: UserReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, title, comment, rating, created_at, user_id')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Your Reviews</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-20 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Your Reviews</span>
          </CardTitle>
          {onWriteReview && (
            <Button
              onClick={onWriteReview}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Write Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} compact={true} />
            ))}
            {reviews.length >= 3 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  View All Reviews
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No reviews yet</p>
            {onWriteReview && (
              <Button
                onClick={onWriteReview}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Write Your First Review
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserReviews;
