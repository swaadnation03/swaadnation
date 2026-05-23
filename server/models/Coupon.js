const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    default: null,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  perUserLimit: {
    type: Number,
    default: 1,
  },
  applicableCategories: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFirstOrderOnly: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for faster lookups
couponSchema.index({ code: 1, isActive: 1, endDate: 1 });

module.exports = mongoose.model("Coupon", couponSchema);