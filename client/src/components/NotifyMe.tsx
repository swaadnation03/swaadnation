"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from '@/lib/api';


interface NotifyMeProps {
  productId: string;
  productName: string;
}

export default function NotifyMe({ productId, productName }: NotifyMeProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/stock-alerts/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          email,
          name,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubscribed(true);
        setShowModal(false);
        alert(`We'll notify you when ${productName} is back in stock!`);
      } else {
        alert(data.error || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 rounded-lg text-center">
        <p className="text-green-700 text-xs sm:text-sm">
          ✓ You'll be notified when back in stock!
        </p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-3 sm:mt-4 bg-gray-100 text-gray-700 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Notify Me When Available
      </button>

      {/* Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            {/* Modal Header - Responsive */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 sm:p-4 rounded-t-lg">
              <h2 className="text-lg sm:text-xl font-bold text-white">Get Notified</h2>
              <p className="text-green-100 text-xs sm:text-sm">We'll email you when {productName} is back in stock</p>
            </div>
            
            {/* Modal Body - Responsive padding */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 sm:p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 sm:p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
              </div>
              
              {/* Buttons - Responsive layout */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
                >
                  {isSubmitting ? "Subscribing..." : "Notify Me"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base order-1 sm:order-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}