
import { useState, useEffect, useRef } from 'react';
import { Coupon } from '@/types';
import { CouponCard } from './CouponCard';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedCouponsProps {
  coupons: Coupon[];
}

export const FeaturedCoupons = ({ coupons }: FeaturedCouponsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Number of coupons to show at once based on screen width
  const [slidesToShow, setSlidesToShow] = useState(3);
  
  useEffect(() => {
    // Check screen width and set slidesToShow accordingly
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        goToNextSlide();
      }, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentSlide, coupons.length, slidesToShow]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (coupons.length - slidesToShow + 1));
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? coupons.length - slidesToShow : prev - 1));
  };
  
  return (
    <div 
      className="relative pt-8 pb-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={goToNextSlide}
            disabled={currentSlide >= coupons.length - slidesToShow}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
        >
          {coupons.map((coupon) => (
            <div 
              key={coupon.id}
              className="pr-4"
              style={{ flex: `0 0 ${100 / slidesToShow}%` }}
            >
              <CouponCard coupon={coupon} className="h-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: coupons.length - slidesToShow + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary w-4' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
