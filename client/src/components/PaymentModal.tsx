"use client";

import { useState } from "react";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";
import { API_URL} from '@/lib/api';


interface PaymentModalProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onFailure: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ amount, orderId, onSuccess, onFailure }: PaymentModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user?.token) {
      alert("Please login again to continue");
      onFailure();
      return;
    }

    setLoading(true);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load payment gateway. Please try again.");
      setLoading(false);
      onFailure();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          amount: amount,
          orderId: orderId,
          receipt: `order_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status}`);
      }

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Swaad Nation",
        description: "Payment for your order",
        image: "/logo.png",
        order_id: orderData.orderId,
        handler: async (razorpayResponse: any) => {
          const verifyResponse = await fetch(`${API_URL}/api/payments/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              orderId: orderId,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            alert("Payment successful!");
            onSuccess();
          } else {
            alert("Payment verification failed!");
            onFailure();
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#2E7D32",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 text-sm sm:text-base"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ₹${amount} via Razorpay`
        )}
      </button>
    </>
  );
}