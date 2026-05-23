"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import StarRating from "./StarRating";
import { API_URL } from '@/lib/api';


type Review = {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpful: string[];
  createdAt: string;
};

type RatingDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as RatingDistribution,
  });

  useEffect(() => {
    fetchReviews();
    fetchRatingStats();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/reviews/product/${productId}`,
      );
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingStats = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/reviews/rating/${productId}`,
      );
      const data = await res.json();
      setStats({
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        ratingDistribution: data.ratingDistribution || {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to leave a review");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment,
        }),
      });

      if (res.ok) {
        alert("Review submitted! It will appear after approval.");
        setTitle("");
        setComment("");
        setRating(5);
        fetchReviews();
        fetchRatingStats();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingCount = (star: number): number => {
    return stats.ratingDistribution[star as keyof RatingDistribution] || 0;
  };

  if (loading)
    return <div className="text-center py-6 sm:py-8 text-sm sm:text-base">Loading reviews...</div>;

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Customer Reviews</h3>

      {/* Rating Summary - Responsive */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
          
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gray-900">
              {stats.averageRating || 0}
            </div>
            <StarRating
              rating={Math.round(stats.averageRating)}
              readonly
              size={16}
            />
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              Based on {stats.totalReviews} reviews
            </div>
          </div>
          
          {/* Rating Distribution Bars */}
          <div className="flex-1 w-full space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = getRatingCount(star);
              const percentage =
                stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm w-6 sm:w-8">{star} ★</span>
                  <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 w-8 sm:w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Write Review Form - Responsive */}
      {user && (
        <div className="bg-gray-50 border rounded-lg p-4 sm:p-6 mb-5 sm:mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Write a Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <StarRating rating={rating} onRating={setRating} size={24} />
            </div>
            
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            {/* Review Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product"
                className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-y text-sm sm:text-base"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-3 sm:p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      {review.userName}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 py-0.5 sm:px-2 rounded-full">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} readonly size={14} />
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mt-2 text-sm sm:text-base">
                {review.title}
              </h4>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{review.comment}</p>
              <div className="mt-2 text-xs text-gray-400">
                {review.helpful?.length || 0} people found this helpful
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}