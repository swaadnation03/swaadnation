"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from '@/lib/api';


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

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      fetchOrders();
    }
  }, [authLoading, user, isAdmin]);

  useEffect(() => {
    if (orders.length > 0) {
      applyFilters();
    }
  }, [statusFilter, searchTerm, dateFilter, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.token) {
        console.error("No token found");
        setError("Authentication required. Please login again.");
        return;
      }

      const res = await fetch(`${API_URL}/api/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }

      const data = await res.json();
      const ordersArray = Array.isArray(data) ? data : [];
      setOrders(ordersArray);
      setFilteredOrders(ordersArray);

      const totalRevenue = ordersArray.reduce(
        (sum: number, order: Order) => sum + order.total,
        0,
      );
      const pendingOrders = ordersArray.filter(
        (order: Order) => order.status === "Pending",
      ).length;
      const processingOrders = ordersArray.filter(
        (order: Order) => order.status === "Processing",
      ).length;
      const shippedOrders = ordersArray.filter(
        (order: Order) => order.status === "Shipped",
      ).length;
      const deliveredOrders = ordersArray.filter(
        (order: Order) => order.status === "Delivered",
      ).length;
      const cancelledOrders = ordersArray.filter(
        (order: Order) => order.status === "Cancelled",
      ).length;

      setStats({
        totalOrders: ordersArray.length,
        totalRevenue,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
      });
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(orders)) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customer?.name?.toLowerCase().includes(term) ||
          order.customer?.phone?.includes(term) ||
          order._id?.toLowerCase().includes(term),
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);

        switch (dateFilter) {
          case "today":
            return orderDate >= today;
          case "week": {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
        alert(`Order status updated to ${newStatus}`);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update status");
      }
    } catch (err) {
      console.log(err);
      alert("Error updating status");
    }
  };

  const deleteOrder = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await fetch(`${API_URL}/api/orders/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (res.ok) {
          fetchOrders();
          alert("Order deleted successfully");
        } else {
          alert("Failed to delete order");
        }
      } catch (err) {
        console.log(err);
        alert("Error deleting order");
      }
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

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setDateFilter("all");
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            You don't have permission to access this page.
          </p>
          <Link
            href="/"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={fetchOrders}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Manage and track all orders
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/products"
                className="bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Manage Products
              </Link>
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 px-3 py-2 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
            <p className="text-gray-500 text-xs">Total Orders</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
            <p className="text-gray-500 text-xs">Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              ₹{stats.totalRevenue}
            </p>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
            onClick={() => setStatusFilter("Pending")}
          >
            <p className="text-gray-500 text-xs">Pending</p>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
            onClick={() => setStatusFilter("Processing")}
          >
            <p className="text-gray-500 text-xs">Processing</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats.processingOrders}
            </p>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
            onClick={() => setStatusFilter("Shipped")}
          >
            <p className="text-gray-500 text-xs">Shipped</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {stats.shippedOrders}
            </p>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
            onClick={() => setStatusFilter("Delivered")}
          >
            <p className="text-gray-500 text-xs">Delivered</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {stats.deliveredOrders}
            </p>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
            onClick={() => setStatusFilter("Cancelled")}
          >
            <p className="text-gray-500 text-xs">Cancelled</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">
              {stats.cancelledOrders}
            </p>
          </div>
        </div>

        {/* Filter Section - Responsive */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by name, phone, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-44 lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Order Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-sm"
              >
                <option value="all">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="w-full sm:w-44 lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm w-full sm:w-auto"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-3 sm:mb-4 flex justify-between items-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {filteredOrders?.length || 0} of {orders?.length || 0}{" "}
            orders
          </p>
        </div>

        {/* Orders Table - Horizontal Scroll on Mobile */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {!filteredOrders || filteredOrders.length === 0 ? (
            <div className="text-center py-10 sm:py-12 px-4">
              <p className="text-gray-500 text-base sm:text-lg">
                No orders found matching your filters
              </p>
              {(statusFilter !== "all" ||
                searchTerm ||
                dateFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="mt-3 sm:mt-4 text-green-600 hover:text-green-700 text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[800px] lg:min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {order._id?.slice(-6) || "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer?.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items?.length || 0} item
                          {order.items?.length !== 1 ? "s" : ""}
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs text-green-600 hover:text-green-700"
                        >
                          View details
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{order.total || 0}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs sm:text-sm rounded-full border-0 font-semibold ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal - Keep existing but ensure it's responsive */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 sm:p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Order ID */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-green-700 text-xs sm:text-sm uppercase tracking-wide mb-2">
                  Order ID
                </h3>
                <p className="font-mono text-xs sm:text-sm text-gray-900 bg-white p-2 rounded border border-gray-200 break-all">
                  {selectedOrder._id}
                </p>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-green-700 text-xs sm:text-sm uppercase tracking-wide mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-500 sm:w-16">Name:</span>
                    <span className="font-medium text-gray-900 break-words">
                      {selectedOrder.customer?.name || "N/A"}
                    </span>
                  </p>
                  <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-gray-500 sm:w-16">Phone:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.customer?.phone || "N/A"}
                    </span>
                  </p>
                  <p className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <span className="text-gray-500 sm:w-16">Address:</span>
                    <span className="font-medium text-gray-900 flex-1 break-words">
                      {selectedOrder.customer?.address || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Rest of modal content - similar responsive adjustments */}
              {/* ... (Items, Payment Method, Dates sections with similar responsive classes) */}
            </div>

            <div className="border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-end">
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
  );
}