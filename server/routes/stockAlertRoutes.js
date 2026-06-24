// const express = require("express");
// const router = express.Router();
// const StockAlert = require("../models/StockAlert");
// const Product = require("../models/productModel");
// const { protect, admin } = require("../middleware/authMiddleware");
// const { sendStockAlertEmail } = require("../services/emailService");

// // Subscribe to stock notification
// router.post("/subscribe", async (req, res) => {
//   try {
//     const { productId, email, name } = req.body;
    
//     console.log("Stock alert subscription request:", { productId, email, name });
    
//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
    
//     // Check if product is actually out of stock
//     if (product.stock > 0) {
//       return res.status(400).json({ error: "Product is already in stock! You can purchase it now." });
//     }
    
//     // Check if already subscribed
//     const existing = await StockAlert.findOne({ product: productId, email });
//     if (existing) {
//       return res.status(400).json({ error: "You've already subscribed for this product" });
//     }
    
//     const alert = await StockAlert.create({
//       product: productId,
//       email,
//       name: name || email.split("@")[0],
//     });
    
//     console.log(`✅ Stock alert created for ${email} on product ${product.name}`);
    
//     res.json({ 
//       success: true, 
//       message: "You will be notified when back in stock!", 
//       alert 
//     });
//   } catch (error) {
//     console.error("Stock alert error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get all stock alerts for a product (admin only)
// router.get("/product/:productId", protect, admin, async (req, res) => {
//   try {
//     const alerts = await StockAlert.find({ product: req.params.productId })
//       .sort({ createdAt: -1 });
//     res.json(alerts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get all pending stock alerts (admin only)
// router.get("/admin/pending", protect, admin, async (req, res) => {
//   try {
//     const alerts = await StockAlert.find({ isNotified: false })
//       .populate("product", "name price")
//       .sort({ createdAt: -1 });
//     res.json(alerts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Check and send notifications when stock is updated
// router.post("/check-and-notify/:productId", protect, admin, async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const product = await Product.findById(productId);
    
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
    
//     if (product.stock <= 0) {
//       return res.json({ message: "Product still out of stock", notifiedCount: 0 });
//     }
    
//     // Get all pending alerts for this product
//     const alerts = await StockAlert.find({ 
//       product: productId, 
//       isNotified: false 
//     });
    
//     let notifiedCount = 0;
    
//     for (const alert of alerts) {
//       await sendStockAlertEmail(alert.email, alert.name, product);
//       alert.isNotified = true;
//       alert.notifiedAt = new Date();
//       await alert.save();
//       notifiedCount++;
//     }
    
//     res.json({ 
//       message: `Notified ${notifiedCount} customers about stock update`,
//       notifiedCount 
//     });
//   } catch (error) {
//     console.error("Check and notify error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
// // Delete stock alert (admin only)
// router.delete("/admin/:id", protect, admin, async (req, res) => {
//   try {
//     await StockAlert.findByIdAndDelete(req.params.id);
//     res.json({ message: "Alert deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;






const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const StockAlert = require("../models/StockAlert");
const Product = require("../models/productModel");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendStockAlertEmail } = require("../services/emailService");
const logger = require("../utils/logger");

// ✅ Rate limit subscribe endpoint — prevents spam subscriptions
const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too many subscription attempts. Please try again later." },
});

// ✅ Simple email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Subscribe to stock notification (public) ─────────────────────
router.post("/subscribe", subscribeLimiter, async (req, res) => {
  try {
    const { productId, email, name } = req.body;

    // ✅ Validate required fields
    if (!productId || !email) {
      return res.status(400).json({ error: "Product ID and email are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock > 0) {
      return res.status(400).json({ error: "Product is already in stock! You can purchase it now." });
    }

    const existing = await StockAlert.findOne({ product: productId, email });
    if (existing) {
      return res.status(400).json({ error: "You've already subscribed for this product" });
    }

    const alert = await StockAlert.create({
      product: productId,
      email,
      name: name?.trim() || email.split("@")[0],
    });

    logger.info({ email, productId }, "Stock alert subscription created");
    res.json({
      success: true,
      message: "You will be notified when back in stock!",
      alert,
    });
  } catch (error) {
    logger.error({ err: error }, "Stock alert subscribe error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get alerts for a product (admin only) ───────────────────────
router.get("/product/:productId", protect, admin, async (req, res) => {
  try {
    const alerts = await StockAlert.find({ product: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    logger.error({ err: error }, "Fetch product alerts error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get all pending alerts (admin only) ─────────────────────────
router.get("/admin/pending", protect, admin, async (req, res) => {
  try {
    const alerts = await StockAlert.find({ isNotified: false })
      .populate("product", "name price")
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    logger.error({ err: error }, "Fetch pending alerts error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Manually trigger notifications (admin only) ─────────────────
router.post("/check-and-notify/:productId", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.stock <= 0) {
      return res.json({ message: "Product still out of stock", notifiedCount: 0 });
    }

    const alerts = await StockAlert.find({
      product: req.params.productId,
      isNotified: false,
    });

    let notifiedCount = 0;
    for (const alert of alerts) {
      try {
        // ✅ Per-alert try/catch — one failure doesn't stop the rest
        await sendStockAlertEmail(alert.email, alert.name, product);
        alert.isNotified = true;
        alert.notifiedAt = new Date();
        await alert.save();
        notifiedCount++;
      } catch (emailErr) {
        logger.error(
          { err: emailErr, email: alert.email },
          "Stock alert email failed for subscriber"
        );
      }
    }

    logger.info({ notifiedCount, productId: req.params.productId }, "Stock notifications sent");
    res.json({
      message: `Notified ${notifiedCount} customers about stock update`,
      notifiedCount,
    });
  } catch (error) {
    logger.error({ err: error }, "Check and notify error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Delete stock alert (admin only) ─────────────────────────────
router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const alert = await StockAlert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ error: "Alert not found" });
    logger.info({ alertId: req.params.id, adminId: req.user._id }, "Stock alert deleted");
    res.json({ message: "Alert deleted" });
  } catch (error) {
    logger.error({ err: error }, "Delete alert error");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;