"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function OrderSuccessPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoRedirect && secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (autoRedirect && secondsLeft === 0) {
      router.push("/");
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoRedirect, secondsLeft, router]);

  const cancelRedirect = () => {
    setAutoRedirect(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 py-8 sm:py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        
        {/* Main Card - Responsive */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Success Animation - Responsive sizes */}
          <div className="relative h-24 sm:h-28 md:h-32 bg-gradient-to-r from-green-600 to-green-500">
            <div className="absolute -bottom-8 sm:-bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-100 rounded-full p-3 sm:p-4">
                <div className="bg-green-600 rounded-full p-2 sm:p-3">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content - Responsive padding */}
          <div className="pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
            
            {/* Title - Responsive */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully! 🎉
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              Thank you for your order. We'll deliver it to your doorstep soon.
            </p>

            {/* Order Details Card - Responsive */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-5 sm:mb-6 text-left">
              {/* Confirmation */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <span className="text-xl sm:text-2xl">📦</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Order Confirmation</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                    A confirmation email has been sent
                  </p>
                </div>
              </div>
              
              {/* Delivery */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">⏱️</span>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Estimated Delivery</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    3-5 business days
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Responsive stacking */}
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base"
              >
                Continue Shopping
              </Link>
              
              <Link
                href="/my-orders"
                className="block w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                View My Orders
              </Link>
            </div>

            {/* Redirect Timer - Responsive */}
            {autoRedirect && (
              <p className="text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
                Redirecting to home page in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...
                <button
                  onClick={cancelRedirect}
                  className="ml-2 text-green-600 hover:text-green-700 underline font-medium"
                >
                  Stay here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}