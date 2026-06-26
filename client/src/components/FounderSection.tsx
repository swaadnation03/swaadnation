"use client";

import { useState } from "react";

export default function FounderSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="py-12 sm:py-16 bg-[#FFF2DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Founder Image - Responsive sizing */}
          <div className="md:w-2/5 flex justify-center">
            <div className="relative">
              {/* Decorative rings - responsive size */}
              <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-16 sm:w-24 h-16 sm:h-24 bg-orange-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 w-14 sm:w-20 h-14 sm:h-20 bg-green-500 rounded-full opacity-20"></div>

              {!imageError ? (
                <img
                  src="/founder.jpg"
                  alt="Aditya Singh - Founder"
                  className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover shadow-2xl border-4 border-white"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-green-600 to-orange-500 shadow-2xl flex flex-col items-center justify-center text-white border-4 border-white">
                  <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3">👨‍🍳</div>
                  <div className="font-bold text-lg sm:text-xl md:text-2xl">Aditya Singh</div>
                  <div className="text-xs sm:text-sm opacity-90 mt-1">Founder & CEO</div>
                </div>
              )}
            </div>
          </div>

          {/* Content - Responsive text sizes */}
          <div className="md:w-3/5 text-center md:text-left px-4 sm:px-0">
            
            {/* Badge - Responsive */}
            <div className="inline-block bg-orange-100 text-orange-700 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              👨‍🍳 Meet Our Founder
            </div>

            {/* Heading - Responsive */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              From Our Founder's Heart
            </h2>
            
            {/* Divider */}
            <div className="w-16 sm:w-20 h-1 bg-orange-500 mx-auto md:mx-0 mb-5 sm:mb-6"></div>

            {/* Quote - Responsive text */}
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-5 sm:mb-6 italic">
              "I am Adarsh Kumar, Founder of Swaad Nation, and I started this journey with a simple vision – 
              to deliver premium quality, hygienic, and truly delightful products to every household.
              For me, this is not just a business, but a passion where I put my thoughts, efforts, and 
              integrity into every product. I strongly believe that the true identity of any product is 
              not just defined by its quality, but by the trust it carries. That is why every product at 
              Swaad Nation is crafted through strict quality standards and modern hygienic processes, 
              ensuring a consistently exceptional experience. My goal is to build Swaad Nation into a 
              trusted Indian brand that becomes a part of every home. Your trust is my greatest strength."
            </p>

            {/* Founder Name - Responsive */}
            <div className="mb-5 sm:mb-6">
              <p className="font-semibold text-green-700 text-lg sm:text-xl">
                – Adarsh Kumar
              </p>
              <p className="text-gray-500 text-sm sm:text-base">Founder & CEO, Swaad Nation</p>
              <p className="text-xs sm:text-sm text-orange-600 mt-1 italic">
                "My Mission – Quality First, Taste Always"
              </p>
            </div>

            {/* Contact Buttons - Responsive spacing and sizes */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
              <a
                href="tel:+919508273820"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-full text-xs sm:text-sm hover:bg-green-700 transition-all hover:scale-105 shadow-md"
              >
                📞 Call Us
              </a>
              <a
                href="https://wa.me/919508273820"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-full text-xs sm:text-sm hover:bg-green-600 transition-all hover:scale-105 shadow-md"
              >
                💬 WhatsApp
              </a>
              <a
                href="mailto:adarshkdubey62@gmail.com"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600 text-white rounded-full text-xs sm:text-sm hover:bg-gray-700 transition-all hover:scale-105 shadow-md"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}