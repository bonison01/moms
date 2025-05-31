
interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  location?: string;
}

const TestimonialCard = ({ name, rating, comment, location }: TestimonialCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-4 italic">"{comment}"</p>
      <div className="text-sm">
        <div className="font-semibold text-gray-800">{name}</div>
        {location && <div className="text-gray-500">{location}</div>}
      </div>
    </div>
  );
};

export default TestimonialCard;
