// "use client";

// import { useState } from "react";
// import Script from "next/script";
// import { useAuth } from "@/context/AuthContext";
// import { API_URL} from '@/lib/api';


// interface PaymentModalProps {
//   amount: number;
//   orderData: string; // JSON string of order data
//   onSuccess: () => void;
//   onFailure: () => void;
// }

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// export default function PaymentModal({ amount, orderData, onSuccess, onFailure }: PaymentModalProps) {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//  const handlePayment = async () => {
//   if (!user?.token) {
//     alert("Please login again to continue");
//     onFailure();
//     return;
//   }

//   setLoading(true);

//   const isScriptLoaded = await loadRazorpayScript();
//   if (!isScriptLoaded) {
//     alert("Failed to load payment gateway. Please try again.");
//     setLoading(false);
//     onFailure();
//     return;
//   }

//   try {
//     const response = await fetch(`${API_URL}/api/payments/create-order`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${user.token}`,
//       },
//       body: JSON.stringify({
//         amount: amount,
//         receipt: `order_${Date.now()}`,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to create order: ${response.status}`);
//     }

//     const paymentOrderData = await response.json();

//     if (!paymentOrderData.success) {
//       throw new Error(paymentOrderData.error || "Failed to create order");
//     }

//     const options = {
//       key: paymentOrderData.keyId,
//       amount: paymentOrderData.amount,
//       currency: paymentOrderData.currency,
//       name: "Swaad Nation",
//       description: "Payment for your order",
//       image: "/logo.png",
//       order_id: paymentOrderData.orderId,
//       handler: async (razorpayResponse: any) => {
//         // ✅ Payment Success - Verify and CREATE ORDER
//         try {
//           const verifyResponse = await fetch(`${API_URL}/api/payments/verify-payment`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${user.token}`,
//             },
//             body: JSON.stringify({
//               razorpay_order_id: razorpayResponse.razorpay_order_id,
//               razorpay_payment_id: razorpayResponse.razorpay_payment_id,
//               razorpay_signature: razorpayResponse.razorpay_signature,
//               razorpayOrderId: paymentOrderData.orderId,
//               orderData: orderData, // Pass the order data to create order after payment
//             }),
//           });

//           const verifyData = await verifyResponse.json();

//           if (verifyData.success) {
//             alert("Payment successful!");
//             onSuccess();
//           } else {
//             alert("Payment verification failed!");
//             onFailure();
//           }
//         } catch (error) {
//           console.error("Verification error:", error);
//           alert("Payment verification failed. Please contact support.");
//           onFailure();
//         }
//       },
//       modal: {
//         ondismiss: () => {
//           // ✅ User closed the payment modal (cancelled payment)
//           console.log("Payment modal closed by user");
//           setLoading(false);
//           alert("Payment cancelled.");
//           onFailure();
//         },
//       },
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   } catch (error) {
//     console.error("Payment error:", error);
//     alert("Payment failed. Please try again.");
//     onFailure();
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <>
//       <Script
//         src="https://checkout.razorpay.com/v1/checkout.js"
//         strategy="lazyOnload"
//       />
//       <button
//         onClick={handlePayment}
//         disabled={loading}
//         className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 text-sm sm:text-base"
//       >
//         {loading ? (
//           <span className="flex items-center justify-center gap-2">
//             <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//             </svg>
//             Processing...
//           </span>
//         ) : (
//           `Pay ₹${amount} via Razorpay`
//         )}
//       </button>
//     </>
//   );
// }


"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from '@/lib/api';

interface PaymentModalProps {
  amount: number;
  orderData: string; // JSON string of order data
  onSuccess: () => void;
  onFailure: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ amount, orderData, onSuccess, onFailure }: PaymentModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Don't load twice if already present
      if (window.Razorpay) {
        resolve(true);
        return;
      }
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
      // ✅ Send full orderData to server — amount is now computed server-side
      const response = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderData, // ✅ server reads items/coupon from this and computes the real total
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to create order (${response.status})`);
      }

      const paymentOrderData = await response.json();

      if (!paymentOrderData.success) {
        throw new Error(paymentOrderData.error || "Failed to create payment order");
      }

      const options = {
        key: paymentOrderData.keyId,
        amount: paymentOrderData.amount,       // ✅ server-computed amount in paise
        currency: paymentOrderData.currency,
        name: "Swaad Nation",
        description: "Payment for your order",
        image: "/logo.png",
        order_id: paymentOrderData.orderId,

        handler: async (razorpayResponse: any) => {
          // ✅ Only send the three Razorpay-generated fields — no client orderData here
          try {
            const verifyResponse = await fetch(`${API_URL}/api/payments/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                // ✅ removed: orderData — server reads it from Payment record now
                // ✅ removed: razorpayOrderId — already in razorpay_order_id
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onSuccess(); // ✅ removed alert — checkout page handles post-success UX
            } else {
              alert(verifyData.error || "Payment verification failed. Please contact support.");
              onFailure();
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed. Please contact support.");
            onFailure();
          }
        },

        modal: {
          ondismiss: () => {
            // User closed the Razorpay modal without paying
            setLoading(false);
            onFailure();
            // ✅ removed alert — checkout page shows its own cancel message
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // ✅ Handle payment failures surfaced by Razorpay (card declined, UPI timeout, etc.)
      razorpayInstance.on("payment.failed", (response: any) => {
        console.error("Razorpay payment failed:", response.error);
        alert(`Payment failed: ${response.error?.description || "Please try again."}`);
        setLoading(false);
        onFailure();
      });

      razorpayInstance.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.");
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
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
        `Pay ₹${amount.toLocaleString("en-IN")} via Razorpay`
      )}
    </button>
  );
}