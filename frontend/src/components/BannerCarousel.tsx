import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Banner } from '../types';

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length, nextSlide]);

  if (!banners || banners.length === 0) return null;

  return (
    <div 
      className="relative group w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-navy-950 border border-white/5"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div 
        className="flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full relative aspect-[21/9] sm:aspect-[21/7] md:aspect-[21/6]">
            <img 
              src={banner.image} 
              alt={banner.title || 'Banner'} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
              <div className="px-8 sm:px-16 md:px-24 max-w-2xl">
                {banner.title && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 sm:mb-4 animate-slide-up">
                    {banner.title}
                  </h2>
                )}
                {banner.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg text-navy-200 mb-4 sm:mb-8 max-w-md line-clamp-2 animate-slide-up delay-100">
                    {banner.subtitle}
                  </p>
                )}
                {banner.ctaText && banner.ctaLink && (
                  <Link 
                    to={banner.ctaLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-navy-300 text-navy-950 font-bold text-sm hover:bg-white transition-colors animate-slide-up delay-200 shadow-glow"
                  >
                    {banner.ctaText} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-3 sm:top-4 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronLeft className="w-4 sm:w-6 h-4 sm:h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-3 sm:top-4 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-100 transition-opacity hover:bg-black/50"
          >
            <ChevronRight className="w-4 sm:w-6 h-4 sm:h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;