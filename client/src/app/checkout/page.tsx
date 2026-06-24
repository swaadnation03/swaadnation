"use client";

import { useCart } from "../../context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PaymentModal from "@/components/PaymentModal";
import { trackPurchase } from "@/lib/analytics";
import { API_URL } from '@/lib/api';


export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Coupon related states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Payment method states
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = subtotal > 499 ? 0 : 40;

  // Calculate discount
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal + deliveryFee - discount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.phone.match(/^[0-9]{10}$/))
      newErrors.phone = "Enter valid 10-digit phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponError("");
        alert(`Coupon applied! You saved ₹${data.coupon.discount}`);
      }
    } catch (error) {
      setCouponError("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleOrder = async () => {
  if (!validateForm()) return;
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  if (!user) {
    alert("Please login to place order");
    router.push("/login");
    return;
  }

  setIsSubmitting(true);

  const cleanItems = cart.map(({ _id, ...item }) => ({
    name: item.name,
    price: item.price,
    qty: item.qty,
  }));

  const orderData = {
    customer: form,
    items: cleanItems,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    discount: discount,
    total: total,
    paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
    paymentStatus: paymentMethod === "cod" ? "pending" : "initiated",
    status: "Pending",
    appliedCoupon: appliedCoupon
      ? {
          code: appliedCoupon.code,
          discount: appliedCoupon.discount,
        }
      : null,
  };

  try {
    if (paymentMethod === "cod") {
      // For COD: Create order immediately
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          ...orderData,
          paymentStatus: "pending",
          status: "Pending",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      clearCart();
      setIsSubmitting(false);
      router.push("/order-success");
    } else {
      // For online payment: Store order data temporarily and show payment modal (DON'T CREATE ORDER YET)
      setSavedOrderId(JSON.stringify(orderData));
      setShowPaymentModal(true);
      setIsSubmitting(false);
    }
  } catch (err) {
    console.log("ERROR:", err);
    alert("Error placing order: " + (err instanceof Error ? err.message : "Unknown error"));
    setIsSubmitting(false);
  }
};

  // Handle successful payment
  const handlePaymentSuccess = () => {
    clearCart();
    setShowPaymentModal(false);
    setSavedOrderId(null);
    router.push("/order-success");
  };

  // Handle payment failure - order will be deleted by PaymentModal
  const handlePaymentFailure = () => {
    alert("Payment cancelled or failed. Order has been removed.");
    setShowPaymentModal(false);
    setSavedOrderId(null);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Cart is empty
          </h2>
          <Link
            href="/#products"
            className="text-green-600 hover:text-green-700 text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Checkout 🧾</h1>

        {/* Responsive Layout: Stack on mobile, side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Delivery Form - Full width on mobile */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Delivery Details
              </h2>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className={`w-full p-2.5 sm:p-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.name ? "border-red-500" : "border-gray-200"
                    }`}
                    onChange={handleChange}
                    value={form.name}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    className={`w-full p-2.5 sm:p-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.phone ? "border-red-500" : "border-gray-200"
                    }`}
                    onChange={handleChange}
                    value={form.phone}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    placeholder="Enter your complete delivery address"
                    className={`w-full p-2.5 sm:p-3 text-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    }`}
                    onChange={handleChange}
                    value={form.address}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary - Full width on mobile */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Cart Items List - Responsive max height */}
                <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="border-t pt-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={!!appliedCoupon}
                      className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase text-gray-900 placeholder:text-gray-400 text-sm"
                    />
                    {!appliedCoupon ? (
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        🎉 Coupon "{appliedCoupon.code}" applied! You saved ₹{appliedCoupon.discount}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Subtotal</span>
                    <span className="text-gray-900 text-sm">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600 text-sm" : "text-gray-900 text-sm"}>
                      {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Discount</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-green-600">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Only Online Payment - COD removed */}                
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Online Payment</span>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Credit/Debit Card, UPI, Net Banking
                      </p>
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleOrder}
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all shadow-md ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-green-700 hover:to-green-600 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  `Place Order • ₹${total}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal - Responsive */}
      {/* {showPaymentModal && savedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="bg-gradient-to-r from-green-600 to-green-500 -m-6 mb-4 p-4 rounded-t-lg">
              <h2 className="text-lg sm:text-xl font-bold text-white">Complete Payment</h2>
            </div>
            <p className="text-gray-600 mb-6 mt-4 text-sm sm:text-base px-2">
              Complete your payment of <span className="font-bold text-green-600">₹{total}</span> to confirm the order.
            </p>
            <PaymentModal
              amount={total}
              orderData={savedOrderId}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSavedOrderId(null);
                alert("Payment cancelled.");
              }}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}

      {showPaymentModal && savedOrderId && (
  <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-800 px-6 pt-6 pb-8 relative overflow-hidden">
        {/* subtle decorative pattern */}
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-2 top-10 w-16 h-16 rounded-full bg-white/5" />
        
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-xs font-medium tracking-wide uppercase mb-1">
              Swaad Nation
            </p>
            <h2 className="text-xl font-bold text-white">
              Complete your payment
            </h2>
          </div>
          <button
            onClick={() => {
              setShowPaymentModal(false);
              setSavedOrderId(null);
            }}
            className="text-white/70 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Amount card — overlapping the header for depth */}
      <div className="px-6 -mt-5 relative">
        <div className="bg-white rounded-xl shadow-md border border-stone-100 px-5 py-4 flex items-center justify-between">
          <span className="text-sm text-stone-500">Amount due</span>
          <span className="text-2xl font-bold text-emerald-700">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-6">
        <p className="text-stone-600 text-sm text-center mb-5">
          Pay securely to confirm your order. We'll start preparing your meal the moment payment goes through.
        </p>

        <PaymentModal
          amount={total}
          orderData={savedOrderId}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />

        <button
          onClick={() => {
            setShowPaymentModal(false);
            setSavedOrderId(null);
          }}
          className="w-full mt-4 text-stone-400 hover:text-stone-600 transition-colors text-sm font-medium py-2"
        >
          Cancel and edit order
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}