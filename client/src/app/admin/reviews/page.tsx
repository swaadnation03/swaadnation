"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { API_URL } from '@/lib/api';


type Review = {
  _id: string;
  product: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpful: string[];
  createdAt: string;
};

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  // useEffect(() => {
  //   fetchReviews();
  // }, []);

  useEffect(() => {
    if (user?.token) {
      fetchReviews();
    }
  }, [user?.token]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/admin/all`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/admin/${reviewId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        alert("Review approved!");
        fetchReviews();
      } else {
        alert("Failed to approve review");
      }
    } catch (error) {
      console.error("Error approving review:", error);
      alert("Error approving review");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`${API_URL}/api/reviews/admin/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        alert("Review deleted!");
        fetchReviews();
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review");
    }
  };

  const getFilteredReviews = () => {
    if (filter === "pending") return reviews.filter(r => !r.isApproved);
    if (filter === "approved") return reviews.filter(r => r.isApproved);
    return reviews;
  };

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
        Approved
      </span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-3 h-3 sm:w-4 sm:h-4"
            viewBox="0 0 24 24"
            fill={star <= rating ? "#FFC107" : "none"}
            stroke="#FFC107"
            strokeWidth="1.5"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ))}
      </div>
    );
  };

  const filteredReviews = getFilteredReviews();
  const pendingCount = reviews.filter(r => !r.isApproved).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Review Moderation</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Approve or delete customer reviews</p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500">Total Reviews</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{reviews.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500">Pending Approval</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500">Approved Reviews</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{reviews.filter(r => r.isApproved).length}</p>
            </div>
          </div>

          {/* Filter Tabs - Responsive */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                filter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Reviews
            </button>
          </div>

          {/* Reviews List - Responsive */}
          <div className="space-y-3 sm:space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-gray-500 text-base sm:text-lg">No reviews found</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                  
                  {/* Review Header - Responsive */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="w-full sm:w-auto">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getRatingStars(review.rating)}
                        {getStatusBadge(review.isApproved)}
                        {review.isVerifiedPurchase && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                        {review.title}
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-base mt-2">
                        {review.comment}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                      <p className="text-xs text-gray-500 break-all">{review.user?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Review Footer - Responsive */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Product: <span className="font-medium">{review.product?.name}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Helpful: {review.helpful?.length || 0} people
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {!review.isApproved && (
                        <button
                          onClick={() => approveReview(review._id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}