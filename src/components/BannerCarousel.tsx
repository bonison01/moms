
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

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
    subtitle: "Traditional Recipes",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=600&fit=crop",
    buttonText: "Shop Now",
    buttonLink: "/shop"
  },
  {
    id: 2,
    title: "Premium Quality",
    subtitle: "Handcrafted with Love",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1920&h=600&fit=crop",
    buttonText: "Explore Products",
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
    <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="border-0 shadow-none overflow-hidden">
                <CardContent className="p-0 relative">
                  <div className="relative h-[500px] md:h-[600px]">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                      <div className="space-y-6 max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl md:text-6xl font-bold">
                          {banner.title}
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-light text-gray-300">
                          {banner.subtitle}
                        </h2>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                          Discover the taste of tradition with our handcrafted pickles and specialty foods, 
                          made with love and authentic recipes passed down through generations.
                        </p>
                        <div className="space-x-4 pt-4">
                          <Link
                            to={banner.buttonLink}
                            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
                          >
                            {banner.buttonText}
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
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  );
};

export default BannerCarousel;
