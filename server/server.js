const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const logger = require("./utils/logger");

dotenv.config();

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://swaadnation.vercel.app",
  "https://swaadnation-api.onrender.com",
  "https://swaadnation.com",
  "https://www.swaadnation.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error("CORS policy: Origin not allowed"),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ─── Body parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" })); // ✅ prevents giant JSON body abuse

// ─── Database ─────────────────────────────────────────────────────
// ✅ Connect before registering routes so DB is ready when first request hits
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => {
    logger.error({ err }, "MongoDB connection failed");
    process.exit(1); // ✅ crash fast — don't run without a DB
  });

// ─── Routes ───────────────────────────────────────────────────────
app.use("/api/orders",       require("./routes/orderRoutes"));
app.use("/api/products",     require("./routes/productRoutes"));
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/upload",       require("./routes/uploadRoutes"));
app.use("/api/coupons",      require("./routes/couponRoutes"));
app.use("/api/reviews",      require("./routes/reviewRoutes"));
app.use("/api/stock-alerts", require("./routes/stockAlertRoutes"));
app.use("/api/payments",     require("./routes/paymentRoutes"));
app.use("/api/offers",       require("./routes/offerRoutes"));
app.use("/api/hero",         require("./routes/heroRoutes"));
app.use("/api/website",      require("./routes/websiteRoutes"));

// ─── Health check ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Swaad Nation API 🚀" });
});

// ─── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────
// ✅ Catches any unhandled errors from routes and returns clean JSON
app.use((err, req, res, next) => {
  logger.error({ err, method: req.method, url: req.url }, "Unhandled error");
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production"
      ? "Something went wrong"  // ✅ don't leak stack traces in production
      : err.message,
  });
});

// ─── Start server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server started");
});