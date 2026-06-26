// const express = require("express");
// const router = express.Router();
// const Review = require("../models/Review");
// const Product = require("../models/productModel");
// const Order = require("../models/orderModel");
// const { protect, admin } = require("../middleware/authMiddleware");

// // Add review (authenticated users only)
// router.post("/", protect, async (req, res) => {
//   try {
//     const { productId, rating, title, comment } = req.body;
//     const userId = req.user._id;
//     const userName = req.user.name;

//     // Check if user already reviewed this product
//     const existingReview = await Review.findOne({ product: productId, user: userId });
//     if (existingReview) {
//       return res.status(400).json({ error: "You have already reviewed this product" });
//     }

//     // Check if user has purchased this product
//     const hasPurchased = await Order.findOne({
//       user: userId,
//       "items.productId": productId,
//       status: "Delivered",
//     });

//     const review = await Review.create({
//       product: productId,
//       user: userId,
//       userName,
//       rating,
//       title,
//       comment,
//       isVerifiedPurchase: !!hasPurchased,
//     });

//     // Update product average rating
//     const allReviews = await Review.find({ product: productId, isApproved: true });
//     const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
//     const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

//     await Product.findByIdAndUpdate(productId, {
//       averageRating: averageRating.toFixed(1),
//       totalReviews: allReviews.length,
//     });

//     res.status(201).json(review);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET approved reviews with optional min rating (for home page carousel)
// router.get("/approved", async (req, res) => {
//   try {
//     const { minRating = 0, limit = 10 } = req.query;
    
//     console.log(`Fetching approved reviews with minRating: ${minRating}, limit: ${limit}`);
    
//     const reviews = await Review.find({
//       isApproved: true,
//       rating: { $gte: parseInt(minRating) }
//     })
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));
    
//     console.log(`Found ${reviews.length} approved reviews`);
//     res.json(reviews);
//   } catch (error) {
//     console.error("Error fetching approved reviews:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get reviews for a product
// router.get("/product/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { page = 1, limit = 10 } = req.query;

//     const reviews = await Review.find({ product: productId, isApproved: true })
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Review.countDocuments({ product: productId, isApproved: true });

//     res.json({
//       reviews,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get average rating for a product
// router.get("/rating/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
    
//     const product = await Product.findById(productId);
//     const stats = await Review.aggregate([
//       { $match: { product: product._id, isApproved: true } },
//       { $group: {
//         _id: null,
//         averageRating: { $avg: "$rating" },
//         totalReviews: { $sum: 1 },
//         ratingCounts: { $push: "$rating" }
//       }}
//     ]);

//     const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     if (stats[0]) {
//       stats[0].ratingCounts.forEach(r => ratingDistribution[r]++);
//     }

//     res.json({
//       averageRating: product.averageRating || 0,
//       totalReviews: product.totalReviews || 0,
//       ratingDistribution,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Mark review as helpful
// router.post("/:id/helpful", protect, async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);
//     if (!review) {
//       return res.status(404).json({ error: "Review not found" });
//     }

//     if (review.helpful.includes(req.user._id)) {
//       review.helpful = review.helpful.filter(id => id.toString() !== req.user._id.toString());
//     } else {
//       review.helpful.push(req.user._id);
//     }

//     await review.save();
//     res.json({ helpfulCount: review.helpful.length });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: Get all reviews (for moderation)
// router.get("/admin/all", protect, admin, async (req, res) => {
//   try {
//     const reviews = await Review.find({})
//       .populate("product", "name")
//       .populate("user", "name email")
//       .sort({ createdAt: -1 });
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: Approve review
// router.put("/admin/:id/approve", protect, admin, async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);
//     if (!review) {
//       return res.status(404).json({ error: "Review not found" });
//     }

//     review.isApproved = true;
//     await review.save();

//     // Update product rating
//     const allReviews = await Review.find({ product: review.product, isApproved: true });
//     const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
//     const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

//     await Product.findByIdAndUpdate(review.product, {
//       averageRating: averageRating.toFixed(1),
//       totalReviews: allReviews.length,
//     });

//     res.json(review);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: Delete review
// router.delete("/admin/:id", protect, admin, async (req, res) => {
//   try {
//     const review = await Review.findByIdAndDelete(req.params.id);
//     if (!review) {
//       return res.status(404).json({ error: "Review not found" });
//     }

//     // Update product rating
//     const allReviews = await Review.find({ product: review.product, isApproved: true });
//     const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
//     const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

//     await Product.findByIdAndUpdate(review.product, {
//       averageRating: averageRating.toFixed(1),
//       totalReviews: allReviews.length,
//     });

//     res.json({ message: "Review deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;







const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const { protect, admin } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// ─── Shared helper ────────────────────────────────────────────────
const recalculateProductRating = async (productId) => {
  const allReviews = await Review.find({ product: productId, isApproved: true });
  const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
  await Product.findByIdAndUpdate(productId, {
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalReviews: allReviews.length,
  });
};

// ─── Add Review ───────────────────────────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    // Validate inputs
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ error: "productId, rating, title and comment are required" });
    }
    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
      return res.status(400).json({ error: "Rating must be a whole number between 1 and 5" });
    }
    if (title.length > 100) {
      return res.status(400).json({ error: "Title must be 100 characters or less" });
    }
    if (comment.length > 500) {
      return res.status(400).json({ error: "Comment must be 500 characters or less" });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }

    // ✅ ENFORCE: User must have a delivered order containing this product
    // Matches by product name since productId isn't stored on order items yet
    const hasPurchased = await Order.findOne({
      user: userId,
      status: "Delivered",
      "items.name": product.name,
    });

    if (!hasPurchased) {
      return res.status(403).json({
        error: "You can only review products you have purchased and received.",
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      userName,
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
      isVerifiedPurchase: true, // always true now — enforced above
    });

    await recalculateProductRating(productId);

    logger.info({ userId, productId, rating }, "Review submitted");
    res.status(201).json(review);
  } catch (error) {
    logger.error({ err: error }, "Add review error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get Approved Reviews (home page carousel) ────────────────────
router.get("/approved", async (req, res) => {
  try {
    const minRating = Math.min(5, Math.max(0, parseInt(req.query.minRating) || 0));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const reviews = await Review.find({
      isApproved: true,
      rating: { $gte: minRating },
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(reviews);
  } catch (error) {
    logger.error({ err: error }, "Fetch approved reviews error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get Reviews for a Product ────────────────────────────────────
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const reviews = await Review.find({ product: productId, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ product: productId, isApproved: true });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    logger.error({ err: error }, "Fetch product reviews error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get Rating Stats for a Product ──────────────────────────────
router.get("/rating/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const stats = await Review.aggregate([
      { $match: { product: product._id, isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingCounts: { $push: "$rating" },
        },
      },
    ]);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats[0]) {
      stats[0].ratingCounts.forEach((r) => ratingDistribution[r]++);
    }

    res.json({
      averageRating: product.averageRating || 0,
      totalReviews: product.totalReviews || 0,
      ratingDistribution,
    });
  } catch (error) {
    logger.error({ err: error }, "Fetch rating stats error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Mark Review as Helpful ───────────────────────────────────────
router.post("/:id/helpful", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot mark your own review as helpful" });
    }

    const alreadyMarked = review.helpful.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyMarked) {
      review.helpful = review.helpful.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      review.helpful.push(req.user._id);
    }

    await review.save();
    res.json({ helpfulCount: review.helpful.length });
  } catch (error) {
    logger.error({ err: error }, "Mark helpful error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Admin: Get All Reviews ───────────────────────────────────────
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("product", "name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    logger.error({ err: error }, "Admin fetch reviews error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Admin: Approve Review ────────────────────────────────────────
router.put("/admin/:id/approve", protect, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.isApproved = true;
    await review.save();

    await recalculateProductRating(review.product);

    logger.info({ reviewId: review._id, adminId: req.user._id }, "Review approved");
    res.json(review);
  } catch (error) {
    logger.error({ err: error }, "Approve review error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Admin: Delete Review ─────────────────────────────────────────
router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await recalculateProductRating(review.product);

    logger.info({ reviewId: review._id, adminId: req.user._id }, "Review deleted");
    res.json({ message: "Review deleted" });
  } catch (error) {
    logger.error({ err: error }, "Delete review error");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;