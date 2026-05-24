"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { API_URL} from '@/lib/api';


type Order = {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    price: number;
    qty: number;
  }>;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Processing":
        return "🔄";
      case "Shipped":
        return "📦";
      case "Delivered":
        return "✅";
      case "Cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header - Responsive */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">View and track your order history</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-6 text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Empty State - Responsive */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">🛒</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">You haven't placed any orders yet.</p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-green-600 to-green-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header - Responsive stacking */}
                  <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4">
                      
                      {/* Order ID */}
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-xs sm:text-sm text-gray-500">Order ID</p>
                        <p className="font-mono text-xs sm:text-sm font-semibold text-green-700 break-all">
                          {order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      
                      {/* Date */}
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">Placed on</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      
                      {/* Total Amount */}
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">Total Amount</p>
                        <p className="text-base sm:text-lg font-bold text-green-600">₹{order.total}</p>
                      </div>
                      
                      {/* Status Badge */}
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <span>{getStatusIcon(order.status)}</span>
                          <span>{order.status}</span>
                        </span>
                      </div>
                      
                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-600 hover:text-green-700 text-xs sm:text-sm font-medium transition-colors"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview - Responsive */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            {item.name} × {item.qty}
                          </span>
                          <span className="font-medium text-gray-900">
                            ₹{item.price * item.qty}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs sm:text-sm text-gray-500">
                          +{order.items.length - 3} more item(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address - Responsive */}
                  <div className="bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-xs sm:text-sm">
                      <span className="text-gray-500">📦 Delivering to:</span>
                      <span className="text-gray-700 break-words">{order.customer.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal - Responsive */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header - Responsive */}
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <h2 className="text-lg sm:text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body - Responsive padding */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                
                {/* Order Status */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Order Status</p>
                      <p className="text-base sm:text-xl font-semibold text-gray-500">{selectedOrder.status}</p>
                    </div>
                    <div className="text-2xl sm:text-4xl">{getStatusIcon(selectedOrder.status)}</div>
                  </div>
                </div>

                {/* Order Information */}
                <div>
                  <h3 className="font-semibold text-green-700 text-xs sm:text-sm uppercase tracking-wide mb-2 sm:mb-3">
                    Order Information
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-500 w-full sm:w-24">Order ID:</span>
                      <span className="font-mono text-gray-500 break-all">{selectedOrder._id}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-500 w-full sm:w-24">Placed on:</span>
                      <span className="text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-500 w-full sm:w-24">Payment Method:</span>
                      <span className="text-gray-500">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                <div>
                  <h3 className="font-semibold text-green-700 text-xs sm:text-sm uppercase tracking-wide mb-2 sm:mb-3">
                    Delivery Details
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-500 w-full sm:w-24">Name:</span>
                      <span className="text-gray-500">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-500 w-full sm:w-24">Phone:</span>
                      <span className="text-gray-500">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <span className="text-gray-500 w-full sm:w-24">Address:</span>
                      <span className="text-gray-500 flex-1 break-words">{selectedOrder.customer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Items Ordered */}
                <div>
                  <h3 className="font-semibold text-green-700 text-xs sm:text-sm uppercase tracking-wide mb-2 sm:mb-3">
                    Items Ordered
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200 last:border-0 gap-2 sm:gap-0">
                          <div>
                            <p className="font-medium text-gray-500 text-sm sm:text-base">{item.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Quantity: {item.qty}</p>
                          </div>
                          <p className="font-semibold text-green-600 text-sm sm:text-base">₹{item.price * item.qty}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <span className="font-bold text-gray-500">Total</span>
                      <span className="text-lg sm:text-xl font-bold text-green-600">₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer - Responsive */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}