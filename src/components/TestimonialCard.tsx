
interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  location?: string;
  image?: string;
}

const TestimonialCard = ({ name, rating, comment, location, image }: TestimonialCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="flex text-black">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-black' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-4 italic">"{comment}"</p>
      <div className="flex items-center space-x-3">
        {image && (
          <img 
            src={image} 
            alt={name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
        )}
        <div className="text-sm">
          <div className="font-semibold text-black">{name}</div>
          {location && <div className="text-gray-500">{location}</div>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
