const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const Order = require("../models/orderModel");
const { protect, admin } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many coupon attempts. Please try again later." },
});
// ============ ADMIN ROUTES ============

// Get all coupons (admin only)
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create coupon (admin only)
router.post("/admin/create", protect, admin, async (req, res) => {
  try {
    const { code, name, type, value, minOrderAmount, maxDiscount, endDate, usageLimit, perUserLimit, isFirstOrderOnly } = req.body;
    
    // Check if coupon code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }
    
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      name,
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || null,
      endDate,
      usageLimit: usageLimit || null,
      perUserLimit: perUserLimit || 1,
      isFirstOrderOnly: isFirstOrderOnly || false,
    });
    
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update coupon (admin only)
router.put("/admin/:id", protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete coupon (admin only)
router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PUBLIC ROUTES ============

// Validate coupon (authenticated users)
router.post("/validate", protect, couponLimiter, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const userId = req.user._id;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });
    
    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }
    
    // Check expiry
    const now = new Date();
    if (now < coupon.startDate) {
      return res.status(400).json({ error: "Coupon not yet active" });
    }
    if (now > coupon.endDate) {
      return res.status(400).json({ error: "Coupon has expired" });
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "Coupon usage limit reached" });
    }
    
    // Check if user has already used this coupon
    const userOrderCount = await Order.countDocuments({ 
      user: userId, 
      appliedCoupon: coupon.code 
    });
    if (userOrderCount >= coupon.perUserLimit) {
      return res.status(400).json({ error: "You have already used this coupon" });
    }
    
    // Check first order only
    if (coupon.isFirstOrderOnly) {
      const userOrders = await Order.countDocuments({ user: userId });
      if (userOrders > 0) {
        return res.status(400).json({ error: "This coupon is for first order only" });
      }
    }
    
    // Check minimum order amount
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({ 
        error: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
      });
    }
    
    // Calculate discount
    let discount = 0;
    if (coupon.type === "percentage") {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }
    
    // Don't discount more than cart total
    discount = Math.min(discount, cartTotal);
    
    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount),
        finalTotal: Math.round(cartTotal - discount),
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;