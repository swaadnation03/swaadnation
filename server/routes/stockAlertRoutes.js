const express = require("express");
const router = express.Router();
const StockAlert = require("../models/StockAlert");
const Product = require("../models/productModel");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendStockAlertEmail } = require("../services/emailService");

// Subscribe to stock notification
router.post("/subscribe", async (req, res) => {
  try {
    const { productId, email, name } = req.body;
    
    console.log("Stock alert subscription request:", { productId, email, name });
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if product is actually out of stock
    if (product.stock > 0) {
      return res.status(400).json({ error: "Product is already in stock! You can purchase it now." });
    }
    
    // Check if already subscribed
    const existing = await StockAlert.findOne({ product: productId, email });
    if (existing) {
      return res.status(400).json({ error: "You've already subscribed for this product" });
    }
    
    const alert = await StockAlert.create({
      product: productId,
      email,
      name: name || email.split("@")[0],
    });
    
    console.log(`✅ Stock alert created for ${email} on product ${product.name}`);
    
    res.json({ 
      success: true, 
      message: "You will be notified when back in stock!", 
      alert 
    });
  } catch (error) {
    console.error("Stock alert error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all stock alerts for a product (admin only)
router.get("/product/:productId", protect, admin, async (req, res) => {
  try {
    const alerts = await StockAlert.find({ product: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all pending stock alerts (admin only)
router.get("/admin/pending", protect, admin, async (req, res) => {
  try {
    const alerts = await StockAlert.find({ isNotified: false })
      .populate("product", "name price")
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check and send notifications when stock is updated
router.post("/check-and-notify/:productId", protect, admin, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    if (product.stock <= 0) {
      return res.json({ message: "Product still out of stock", notifiedCount: 0 });
    }
    
    // Get all pending alerts for this product
    const alerts = await StockAlert.find({ 
      product: productId, 
      isNotified: false 
    });
    
    let notifiedCount = 0;
    
    for (const alert of alerts) {
      await sendStockAlertEmail(alert.email, alert.name, product);
      alert.isNotified = true;
      alert.notifiedAt = new Date();
      await alert.save();
      notifiedCount++;
    }
    
    res.json({ 
      message: `Notified ${notifiedCount} customers about stock update`,
      notifiedCount 
    });
  } catch (error) {
    console.error("Check and notify error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Delete stock alert (admin only)
router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    await StockAlert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;