const mongoose = require("mongoose");

const websiteSettingSchema = new mongoose.Schema({
  // Global website colors
  bodyBackgroundColor: {
    type: String,
    default: "#F9FAFB", // Light gray (Tailwind's gray-50)
  },
  navbarBackgroundColor: {
    type: String,
    default: "#FFFFFF", // White
  },
  navbarTextColor: {
    type: String,
    default: "#374151", // Tailwind's gray-700
  },
  navbarHoverColor: {
    type: String,
    default: "#16A34A", // Green-600
  },
  footerBackgroundColor: {
    type: String,
    default: "#111827", // Gray-900
  },
  footerTextColor: {
    type: String,
    default: "#9CA3AF", // Gray-400
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("WebsiteSetting", websiteSettingSchema);