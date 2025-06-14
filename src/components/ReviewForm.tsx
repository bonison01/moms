
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  productId?: string; // undefined means brand review
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0 || !title.trim() || !comment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a rating, title, and comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: productId || null,
          rating,
          title: title.trim(),
          comment: comment.trim(),
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-xl">
      <h3 className="text-xl font-bold text-black">
        {productId ? 'Write a Product Review' : 'Write a Brand Review'}
      </h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-1 transition-colors ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
              }`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-h-[120px] focus:ring-black"
          placeholder="Share your detailed experience..."
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 mt-1">{comment.length}/1000 characters</p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0 || !title.trim() || !comment.trim()}
        className="w-full bg-black text-white hover:bg-gray-800"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
