// const express = require("express");
// const router = express.Router();
// const Product = require("../models/productModel");
// const { protect, admin } = require("../middleware/authMiddleware");

// // GET all products (public)
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET single product (public)
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // CREATE product (admin only)
// router.post("/", protect, admin, async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // UPDATE product (admin only)
// router.put("/:id", protect, admin, async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id, 
//       req.body, 
//       { new: true, runValidators: true }
//     );
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // DELETE product (admin only)
// router.delete("/:id", protect, admin, async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const StockAlert = require("../models/StockAlert"); // ✅ Import StockAlert
const { protect, admin } = require("../middleware/authMiddleware");
const { sendStockAlertEmail } = require("../services/emailService");

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    console.log(`Found ${products.length} active products`);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET all products for admin (including inactive)
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE product (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE product (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    
    // Get old product to check stock change
    const oldProduct = await Product.findById(req.params.id);
    const wasOutOfStock = oldProduct && oldProduct.stock === 0;
    const isNowInStock = stock > 0;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // If product came back in stock, send notifications directly
    if (wasOutOfStock && isNowInStock) {
      try {
        // Get all pending alerts for this product
        const alerts = await StockAlert.find({ 
          product: product._id, 
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
        
        console.log(`✅ Notified ${notifiedCount} customers about ${product.name}`);
      } catch (notifyError) {
        console.error("Error sending stock notifications:", notifyError);
        // Don't fail the update if notification fails
      }
    }
    
    res.json(product);
  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE stock only (admin only)
router.patch("/:id/stock", protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET related products based on category and order history
router.get("/related/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 6 } = req.query;
    
    // Get the current product
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Find products in same category, excluding current product
    let relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: currentProduct.category,
      isActive: true,
    }).limit(parseInt(limit));
    
    // If not enough products in same category, get from other categories
    if (relatedProducts.length < parseInt(limit)) {
      const remainingCount = parseInt(limit) - relatedProducts.length;
      const otherProducts = await Product.find({
        _id: { $ne: productId },
        category: { $ne: currentProduct.category },
        isActive: true,
      }).limit(remainingCount);
      
      relatedProducts = [...relatedProducts, ...otherProducts];
    }
    
    res.json({
      success: true,
      products: relatedProducts,
      total: relatedProducts.length,
    });
  } catch (error) {
    console.error("Related products error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET frequently bought together products (based on order history)
router.get("/frequently-bought/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const Order = require("../models/orderModel");
    
    // Find orders that contain this product
    const orders = await Order.find({
      "items.productId": productId,
      status: { $in: ["Delivered", "Processing", "Shipped"] },
    });
    
    // Count frequency of other products bought with this one
    const productFrequency = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId && item.productId.toString() !== productId) {
          const id = item.productId.toString();
          productFrequency[id] = (productFrequency[id] || 0) + item.qty;
        }
      });
    });
    
    // Sort by frequency and get top products
    const topProductIds = Object.entries(productFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id]) => id);
    
    // Fetch product details
    const frequentlyBought = await Product.find({
      _id: { $in: topProductIds },
      isActive: true,
    });
    
    res.json({
      success: true,
      products: frequentlyBought,
      total: frequentlyBought.length,
    });
  } catch (error) {
    console.error("Frequently bought error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;