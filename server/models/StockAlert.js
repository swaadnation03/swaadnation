const mongoose = require("mongoose");

const stockAlertSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  isNotified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notifiedAt: {
    type: Date,
    default: null,
  },
});

// Ensure one alert per product per email
stockAlertSchema.index({ product: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("StockAlert", stockAlertSchema);