const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// ✅ Updated CORS Configuration - Allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://swaadnation.vercel.app",
  "https://swaadnation-api.onrender.com",
  "https://swaadnation.com", // Add this
  "https://www.swaadnation.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json());

// ✅ IMPORTANT: Serve static files from uploads directory
// This line MUST be before your routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const couponRoutes = require("./routes/couponRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const stockAlertRoutes = require("./routes/stockAlertRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const offerRoutes = require("./routes/offerRoutes");
const heroRoutes = require("./routes/heroRoutes");
const websiteRoutes = require("./routes/websiteRoutes");

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/stock-alerts", stockAlertRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/website", websiteRoutes);

// Add this after your routes to see what routes are registered
console.log("Registered routes:");
console.log("- /api/products");
console.log("- /api/hero");
console.log("- /api/auth");

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("DB Connected ✅"))
  .catch((err) => console.log("DB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.get("/test-email", async (req, res) => {
  const { sendWelcomeEmail } = require("./services/emailService");
  const testUser = { name: "Test User", email: "your-email@gmail.com" };
  await sendWelcomeEmail(testUser, req);
  res.send("Test email sent! Check your inbox.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
