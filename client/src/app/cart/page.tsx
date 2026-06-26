"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackBeginCheckout } from "@/lib/analytics";
import { API_URL } from '@/lib/api';


export default function CartPage() {
  const router = useRouter();
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = 0;
  // const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleRemove = async (id: string) => {
    setIsRemoving(id);
    setTimeout(() => {
      removeFromCart(id);
      setIsRemoving(null);
    }, 300);
  };

  const handleProceedToCheckout = () => {
    trackBeginCheckout(total, cart.length);
    router.push("/checkout");
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `${API_URL}${imagePath}`;
    }
  
    return null;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Your Cart 🛒</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Looks like you haven't added any items yet.</p>
            <Link
              href="/#products"
              className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF2DF] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Your Cart 🛒</h1>
        
        {/* Responsive Layout: Stack on mobile, side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Cart Items - Full width on mobile */}
          <div className="w-full lg:w-2/3 space-y-4">
            {cart.map((item) => {
              const imageUrl = getImageUrl(item.image);
              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 transition-all duration-300 border border-gray-100 ${
                    isRemoving === item._id ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  {/* Responsive: Column on mobile, Row on tablet+ */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    
                    {/* Product Image - Centered on mobile */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto sm:mx-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const emoji = document.createElement('span');
                              emoji.className = 'text-3xl';
                              emoji.textContent = '🍪';
                              parent.appendChild(emoji);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-3xl">🍪</span>
                      )}
                    </div>
                    
                    {/* Product Details - Centered on mobile, left on tablet */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{item.name}</h3>
                          <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Quantity Controls - Centered on mobile, left on tablet */}
                      <div className="flex justify-center sm:justify-start items-center gap-3 mt-3">
                        <button
                          onClick={() => decreaseQty(item._id)}
                          className="w-8 h-8 text-black bg-gray-200 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-black text-center">{item.qty}</span>
                        <button
                          onClick={() => increaseQty(item._id)}
                          className="w-8 h-8 text-black bg-gray-200 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                        <span className="text-xs sm:text-sm text-gray-500 ml-2">
                          = ₹{item.price * item.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Continue Shopping */}
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mt-4 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
          
          {/* Order Summary - Sticky on desktop, normal on mobile */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20 lg:top-24 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Order Summary
              </h2>
              
              <div className="space-y-3 pb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Delivery Fee</span>
                  <span className="font-semibold text-black">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 pb-4 border-t border-gray-200">
                <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">₹{total}</span>
              </div>
              
              {deliveryFee > 0 && (
                <p className="text-xs sm:text-sm text-orange-600 bg-orange-50 p-2 rounded-lg mt-2 text-center sm:text-left">
                  ✨ Add ₹{499 - subtotal} more for free delivery!
                </p>
              )}
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}