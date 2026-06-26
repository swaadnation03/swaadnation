// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { API_URL } from "@/lib/api";

// type Offer = {
//   _id: string;
//   title: string;
//   description: string;
//   image: string;
//   link?: string;
// };

// export default function OfferSlider() {
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     fetchOffers();
//   }, []);

  

//   useEffect(() => {
//     if (offers.length > 0) {
//       const interval = setInterval(() => {
//         setCurrentIndex((prev) => (prev + 1) % offers.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [offers.length]);

//   const fetchOffers = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/offers`);
//       const data = await res.json();
//       setOffers(data);
//     } catch (error) {
//       console.error("Error fetching offers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goToSlide = (index: number) => {
//     setCurrentIndex(index);
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % offers.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
//   };

//   if (loading || offers.length === 0) return null;

//   return (
//     <div className="w-full bg-gradient-to-r from-orange-50 to-green-50 py-6 sm:py-8 md:py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header - Responsive */}
//         <div className="text-center mb-4 sm:mb-6 md:mb-8">
//           <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-1 sm:mb-2">
//             🎉 Festival Special Offers 🎉
//           </h2>
//           <p className="text-center text-gray-600 text-xs sm:text-sm md:text-base">
//             Limited time deals on your favorite Bihari snacks!
//           </p>
//         </div>

//         {/* Carousel Container */}
//         <div className="relative">
//           {/* Main Slide */}
//           <div className="relative overflow-hidden rounded-xl shadow-lg">
//             <div
//               className="flex transition-transform duration-500 ease-out"
//               style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//             >
//               {offers.map((offer) => (
//                 <div key={offer._id} className="w-full flex-shrink-0 relative">
//                   {/* Image Container - Responsive aspect ratio */}
//                   <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] bg-gray-200">
//                     <img
//                       src={offer.image}
//                       alt={offer.title}
//                       className="w-full h-full object-cover sm:object-contain bg-gradient-to-r from-orange-100 to-green-100"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://via.placeholder.com/1200x400?text=Festival+Offer";
//                       }}
//                     />
//                   </div>

//                   {/* Overlay Content - Responsive padding and text sizes */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4 md:p-6 lg:p-8">
//                     <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-0.5 sm:mb-1 md:mb-2 line-clamp-2">
//                       {offer.title}
//                     </h3>
//                     <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3">
//                       {offer.description}
//                     </p>
//                     {offer.link && (
//                       <Link
//                         href={offer.link}
//                         className="inline-block bg-orange-500 text-white px-2.5 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors w-fit text-xs sm:text-sm md:text-base"
//                       >
//                         Shop Now →
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Navigation Buttons - Responsive sizing */}
//             {offers.length > 1 && (
//               <>
//                 <button
//                   onClick={prevSlide}
//                   className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 sm:p-1.5 md:p-2 rounded-full shadow-lg transition-all"
//                   aria-label="Previous slide"
//                 >
//                   <svg
//                     className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={nextSlide}
//                   className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 sm:p-1.5 md:p-2 rounded-full shadow-lg transition-all"
//                   aria-label="Next slide"
//                 >
//                   <svg
//                     className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Dots Indicator - Responsive */}
//           {offers.length > 1 && (
//             <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 mt-2 sm:mt-3 md:mt-4">
//               {offers.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => goToSlide(index)}
//                   className={`h-1 sm:h-1.5 md:h-2 rounded-full transition-all ${
//                     currentIndex === index
//                       ? "w-3 sm:w-4 md:w-6 lg:w-8 bg-orange-500"
//                       : "w-1 sm:w-1.5 md:w-2 bg-gray-300 hover:bg-gray-400"
//                   }`}
//                   aria-label={`Go to slide ${index + 1}`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

type Offer = {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
};

export default function OfferSlider() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (offers.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % offers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [offers.length]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/offers`);
      const data = await res.json();
      console.log("Offers:", data);
    console.log("Length:", data.length);
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % offers.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);

  if (loading || offers.length === 0) return null;

  return (
    <div className="w-full bg-[#FFF2DF] py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 ">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
            🎉 Festival Special Offers 🎉
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Limited time deals on your favorite Bihari snacks!
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {offers.map((offer) => (
                <div key={offer._id} className="w-full flex-shrink-0">
                  {/* Image fully visible — no cropping */}
                  <div className="relative w-full h-[200px] sm:h-[280px] md:h-[380px] lg:h-[440px] bg-white">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full"
                      // className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/1200x400?text=Festival+Offer";
                      }}
                    />

                    {/* Overlay — only a subtle bottom gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3 sm:p-4 md:p-6 lg:p-8">
                      <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-white mb-0.5 sm:mb-1 md:mb-2 line-clamp-1 drop-shadow">
                        {offer.title}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 line-clamp-1 drop-shadow">
                        {offer.description}
                      </p>
                      {offer.link && (
                        <Link
                          href={offer.link}
                          className="inline-block bg-orange-500 text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors w-fit text-xs sm:text-sm md:text-base"
                        >
                          Shop Now →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {offers.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all z-10"
                  aria-label="Previous slide"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all z-10"
                  aria-label="Next slide"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {offers.length > 1 && (
            <div className="flex justify-center gap-1.5 md:gap-2 mt-3 md:mt-4">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 md:h-2 rounded-full transition-all ${
                    currentIndex === index
                      ? "w-6 md:w-8 bg-orange-500"
                      : "w-1.5 md:w-2 bg-gray-300 hover:bg-gray-400"
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