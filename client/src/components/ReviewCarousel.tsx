"use client";

import { useEffect, useState, useRef } from "react";
import { API_URL } from '@/lib/api';


type Review = {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
};

export default function ReviewCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchReviews();
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (reviews.length > 0 && slidesPerView > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, reviews.length - slidesPerView);
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reviews.length, slidesPerView]);

  const handleResize = () => {
    let newSlidesPerView = 1;
    if (window.innerWidth >= 1024) newSlidesPerView = 3;
    else if (window.innerWidth >= 768) newSlidesPerView = 2;
    else newSlidesPerView = 1;
    
    setSlidesPerView(newSlidesPerView);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/approved?minRating=4&limit=10`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, reviews.length - slidesPerView);
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const visibleReviews = reviews.slice(currentIndex, currentIndex + slidesPerView);
  const totalSlides = Math.max(0, reviews.length - slidesPerView + 1);

  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header - Responsive */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Loved by thousands across India ⭐
          </p>
        </div>

        <div className="relative">
          {/* Reviews Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visibleReviews.map((review) => (
              <div
                key={review._id}
                className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                {/* Stars - Responsive */}
                <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill={star <= review.rating ? "#FFC107" : "none"}
                      stroke="#FFC107"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill={star <= review.rating ? "#FFC107" : "none"}
                        stroke="#FFC107"
                      />
                    </svg>
                  ))}
                </div>
                
                {/* Title - Responsive */}
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2 line-clamp-1">
                  {review.title}
                </h3>
                
                {/* Comment - Responsive */}
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                  "{review.comment}"
                </p>
                
                {/* Footer - Responsive */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <p className="font-semibold text-green-700 text-sm sm:text-base">
                    - {review.userName}
                  </p>
                  {review.isVerifiedPurchase && (
                    <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-0.5 sm:py-1 rounded-full">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots - Responsive */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    currentIndex === index
                      ? "w-6 sm:w-8 bg-green-600"
                      : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}