
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Authentic Flavors",
    subtitle: "Traditional Recipes passed down through generations",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=400&fit=crop",
    buttonText: "Discover Our Heritage",
    buttonLink: "/about"
  },
  {
    id: 2,
    title: "Special Offer",
    subtitle: "Get 20% off on all traditional pickles this week",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=400&fit=crop",
    buttonText: "Shop Now",
    buttonLink: "/shop"
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Discover our latest authentic Manipuri delicacies",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1200&h=400&fit=crop",
    buttonText: "Explore",
    buttonLink: "/shop"
  }
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Carousel className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0 relative">
                  <div className="relative h-48 md:h-64">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                      <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-bold">{banner.title}</h3>
                        <p className="text-lg md:text-xl opacity-90">{banner.subtitle}</p>
                        <a
                          href={banner.buttonLink}
                          className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          {banner.buttonText}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default BannerCarousel;
