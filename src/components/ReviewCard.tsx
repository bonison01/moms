
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    comment: string;
    rating: number;
    created_at: string;
    user_id: string;
  };
  compact?: boolean;
}

const ReviewCard = ({ review, compact = false }: ReviewCardProps) => {
  return (
    <Card className={`${compact ? 'shadow-sm border-gray-100' : 'shadow-md'} bg-white`}>
      <CardContent className={`${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-start justify-between mb-2">
          <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-1`}>
            {review.title}
          </h4>
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} ${
                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        <p className={`text-gray-600 ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>
          {review.comment}
        </p>
        
        <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-400 mt-2`}>
          {new Date(review.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
