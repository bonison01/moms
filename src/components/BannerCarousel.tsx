
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BannerSetting {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  is_active: boolean;
}

const BannerCarousel = () => {
  const [api, setApi] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerSettings, setBannerSettings] = useState<BannerSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerSettings();
  }, []);

  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-progress every 5 seconds

    return () => clearInterval(timer);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const fetchBannerSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching banner settings:', error);
        // Use fallback settings if database fetch fails
        setBannerSettings({
          id: 'fallback',
          title: 'Authentic Flavors',
          subtitle: 'Traditional Recipes',
          image_url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=600&fit=crop',
          button_text: 'Shop Now',
          button_link: '/shop',
          secondary_button_text: 'Our Story',
          secondary_button_link: '/about',
          is_active: true,
        });
      } else {
        setBannerSettings(data);
      }
    } catch (error) {
      console.error('Error fetching banner settings:', error);
      // Use fallback settings
      setBannerSettings({
        id: 'fallback',
        title: 'Authentic Flavors',
        subtitle: 'Traditional Recipes',
        image_url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=600&fit=crop',
        button_text: 'Shop Now',
        button_link: '/shop',
        secondary_button_text: 'Our Story',
        secondary_button_link: '/about',
        is_active: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !bannerSettings) {
    return (
      <div className="w-full h-[350px] md:h-[400px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading banner...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel 
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          <CarouselItem>
            <Card className="border-0 shadow-none overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="relative h-[350px] md:h-[400px]">
                  <img
                    src={bannerSettings.image_url}
                    alt={bannerSettings.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div className="space-y-6 max-w-4xl mx-auto px-4">
                      <h1 className="text-4xl md:text-6xl font-bold">
                        {bannerSettings.title}
                      </h1>
                      <h2 className="text-2xl md:text-4xl font-light text-gray-300">
                        {bannerSettings.subtitle}
                      </h2>
                      <div className="space-x-4 pt-4">
                        <Link
                          to={bannerSettings.button_link}
                          className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
                        >
                          {bannerSettings.button_text}
                        </Link>
                        <Link
                          to={bannerSettings.secondary_button_link}
                          className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors inline-block"
                        >
                          {bannerSettings.secondary_button_text}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-8 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  );
};

export default BannerCarousel;
