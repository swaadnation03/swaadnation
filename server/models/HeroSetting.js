const mongoose = require("mongoose");

const heroSettingSchema = new mongoose.Schema({
  // Background type: gradient, solid, image, or video
  backgroundType: {
    type: String,
    enum: ["gradient", "solid", "image", "video"],
    default: "gradient",
  },
  // For gradient background
  gradientValue: {
    type: String,
    default: "linear-gradient(135deg, #1B5E20, #2E7D32, #F57C00)",
  },
  // For solid color background
  solidColor: {
    type: String,
    default: "#2E7D32",
  },
  // For image background
  backgroundImage: {
    type: String,
    default: "",
  },
  // For video background
  videoUrl: {
    type: String,
    default: "",
  },
  // Overlay darkness (0 = no overlay, 1 = completely dark)
  overlayOpacity: {
    type: Number,
    default: 0.4,
    min: 0,
    max: 1,
  },
  // Text color
  textColor: {
    type: String,
    default: "#FFFFFF",
  },
  // Hero content
  title: {
    type: String,
    default: "Swaad Nation",
  },
  subtitle: {
    type: String,
    default: "Taste of Champaran",
  },
  description: {
    type: String,
    default: "Authentic Bihari flavors delivered to your doorstep",
  },
  showLogo: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("HeroSetting", heroSettingSchema);