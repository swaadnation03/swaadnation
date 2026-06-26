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



// const express = require("express");
// const router = express.Router();
// const Product = require("../models/productModel");
// const StockAlert = require("../models/StockAlert"); // ✅ Import StockAlert
// const { protect, admin } = require("../middleware/authMiddleware");
// const { sendStockAlertEmail } = require("../services/emailService");

// // GET all products (public)
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
//     console.log(`Found ${products.length} active products`);
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET all products for admin (including inactive)
// router.get("/admin/all", protect, admin, async (req, res) => {
//   try {
//     const products = await Product.find({}).sort({ createdAt: -1 });
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
//     const { stock } = req.body;
    
//     // Get old product to check stock change
//     const oldProduct = await Product.findById(req.params.id);
//     const wasOutOfStock = oldProduct && oldProduct.stock === 0;
//     const isNowInStock = stock > 0;
    
//     const product = await Product.findByIdAndUpdate(
//       req.params.id, 
//       req.body, 
//       { new: true, runValidators: true }
//     );
    
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
    
//     // If product came back in stock, send notifications directly
//     if (wasOutOfStock && isNowInStock) {
//       try {
//         // Get all pending alerts for this product
//         const alerts = await StockAlert.find({ 
//           product: product._id, 
//           isNotified: false 
//         });
        
//         let notifiedCount = 0;
        
//         for (const alert of alerts) {
//           await sendStockAlertEmail(alert.email, alert.name, product);
//           alert.isNotified = true;
//           alert.notifiedAt = new Date();
//           await alert.save();
//           notifiedCount++;
//         }
        
//         console.log(`✅ Notified ${notifiedCount} customers about ${product.name}`);
//       } catch (notifyError) {
//         console.error("Error sending stock notifications:", notifyError);
//         // Don't fail the update if notification fails
//       }
//     }
    
//     res.json(product);
//   } catch (error) {
//     console.error("Product update error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // UPDATE stock only (admin only)
// router.patch("/:id/stock", protect, admin, async (req, res) => {
//   try {
//     const { stock } = req.body;
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { stock },
//       { new: true }
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

// // GET related products based on category and order history
// router.get("/related/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { limit = 6 } = req.query;
    
//     // Get the current product
//     const currentProduct = await Product.findById(productId);
//     if (!currentProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }
    
//     // Find products in same category, excluding current product
//     let relatedProducts = await Product.find({
//       _id: { $ne: productId },
//       category: currentProduct.category,
//       isActive: true,
//     }).limit(parseInt(limit));
    
//     // If not enough products in same category, get from other categories
//     if (relatedProducts.length < parseInt(limit)) {
//       const remainingCount = parseInt(limit) - relatedProducts.length;
//       const otherProducts = await Product.find({
//         _id: { $ne: productId },
//         category: { $ne: currentProduct.category },
//         isActive: true,
//       }).limit(remainingCount);
      
//       relatedProducts = [...relatedProducts, ...otherProducts];
//     }
    
//     res.json({
//       success: true,
//       products: relatedProducts,
//       total: relatedProducts.length,
//     });
//   } catch (error) {
//     console.error("Related products error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET frequently bought together products (based on order history)
// router.get("/frequently-bought/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const Order = require("../models/orderModel");
    
//     // Find orders that contain this product
//     const orders = await Order.find({
//       "items.productId": productId,
//       status: { $in: ["Delivered", "Processing", "Shipped"] },
//     });
    
//     // Count frequency of other products bought with this one
//     const productFrequency = {};
    
//     orders.forEach(order => {
//       order.items.forEach(item => {
//         if (item.productId && item.productId.toString() !== productId) {
//           const id = item.productId.toString();
//           productFrequency[id] = (productFrequency[id] || 0) + item.qty;
//         }
//       });
//     });
    
//     // Sort by frequency and get top products
//     const topProductIds = Object.entries(productFrequency)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 6)
//       .map(([id]) => id);
    
//     // Fetch product details
//     const frequentlyBought = await Product.find({
//       _id: { $in: topProductIds },
//       isActive: true,
//     });
    
//     res.json({
//       success: true,
//       products: frequentlyBought,
//       total: frequentlyBought.length,
//     });
//   } catch (error) {
//     console.error("Frequently bought error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;








const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const StockAlert = require("../models/StockAlert");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendStockAlertEmail } = require("../services/emailService");
const logger = require("../utils/logger");

// ─── Whitelisted fields for create/update ────────────────────────
// Prevents client from overwriting system-managed fields like averageRating
const pickProductFields = (body) => ({
  name: body.name,
  price: body.price,
  mrp: body.mrp,
  description: body.description,
  longDescription: body.longDescription,
  imageFront: body.imageFront,
  imageBack: body.imageBack,
  category: body.category,
  stock: body.stock,
  weight: body.weight,
  shelfLife: body.shelfLife,
  ingredients: body.ingredients,
  nutrients: body.nutrients,
  fssaiLicense: body.fssaiLicense,
  manufacturer: body.manufacturer,
  isActive: body.isActive,
});

// ─── GET all products (public) ────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    logger.info({ count: products.length }, "Fetched active products");
    res.json(products);
  } catch (error) {
    logger.error({ err: error }, "Fetch products error");
    res.status(500).json({ error: error.message });
  }
});

// ─── GET all products for admin (including inactive) ──────────────
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    logger.error({ err: error }, "Admin fetch products error");
    res.status(500).json({ error: error.message });
  }
});

// ─── GET related products ─────────────────────────────────────────
// ⚠️ Must be defined BEFORE /:id or Express matches "related" as an id
router.get("/related/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    // ✅ Cap limit
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 6));

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    let relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: currentProduct.category,
      isActive: true,
    }).limit(limit);

    if (relatedProducts.length < limit) {
      const remainingCount = limit - relatedProducts.length;
      const otherProducts = await Product.find({
        _id: { $ne: productId },
        category: { $ne: currentProduct.category },
        isActive: true,
      }).limit(remainingCount);
      relatedProducts = [...relatedProducts, ...otherProducts];
    }

    res.json({ success: true, products: relatedProducts, total: relatedProducts.length });
  } catch (error) {
    logger.error({ err: error }, "Related products error");
    res.status(500).json({ error: error.message });
  }
});

// ─── GET frequently bought together ──────────────────────────────
// ⚠️ Must be defined BEFORE /:id
router.get("/frequently-bought/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const Order = require("../models/orderModel");
    // ✅ Cap limit
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 6));

    // Note: returns empty until productId is added to order items schema
    const orders = await Order.find({
      "items.productId": productId,
      status: { $in: ["Delivered", "Processing", "Shipped"] },
    });

    const productFrequency = {}; 
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId && item.productId.toString() !== productId) {
          const id = item.productId.toString();
          productFrequency[id] = (productFrequency[id] || 0) + item.qty;
        }
      });
    });

    const topProductIds = Object.entries(productFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    const frequentlyBought = await Product.find({
      _id: { $in: topProductIds },
      isActive: true,
    });

    res.json({ success: true, products: frequentlyBought, total: frequentlyBought.length });
  } catch (error) {
    logger.error({ err: error }, "Frequently bought error");
    res.status(500).json({ error: error.message });
  }
});

// ─── GET single product (public) ─────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    logger.error({ err: error }, "Fetch single product error");
    res.status(500).json({ error: error.message });
  }
});

// ─── CREATE product (admin only) ──────────────────────────────────
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, price } = req.body;

    // ✅ Validate required fields explicitly
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    // ✅ Only pick whitelisted fields — blocks averageRating/totalReviews injection
    const product = await Product.create(pickProductFields(req.body));

    logger.info({ productId: product._id, adminId: req.user._id }, "Product created");
    res.status(201).json(product);
  } catch (error) {
    logger.error({ err: error }, "Create product error");
    res.status(500).json({ error: error.message });
  }
});

// ─── UPDATE product (admin only) ──────────────────────────────────
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;

    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const wasOutOfStock = oldProduct.stock === 0;
    const isNowInStock = stock !== undefined && stock > 0;

    // ✅ Only update whitelisted fields
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      pickProductFields(req.body),
      { new: true, runValidators: true }
    );

    // Stock notification — if product came back in stock
    if (wasOutOfStock && isNowInStock) {
      const alerts = await StockAlert.find({
        product: product._id,
        isNotified: false,
      });

      let notifiedCount = 0;
      for (const alert of alerts) {
        try {
          // ✅ Wrap each individually — one failure doesn't stop the rest
          await sendStockAlertEmail(alert.email, alert.name, product);
          alert.isNotified = true;
          alert.notifiedAt = new Date();
          await alert.save();
          notifiedCount++;
        } catch (emailErr) {
          logger.error(
            { err: emailErr, email: alert.email, productId: product._id },
            "Stock alert email failed for one subscriber"
          );
        }
      }
      logger.info({ notifiedCount, productId: product._id }, "Stock alert notifications sent");
    }

    logger.info({ productId: product._id, adminId: req.user._id }, "Product updated");
    res.json(product);
  } catch (error) {
    logger.error({ err: error }, "Update product error");
    res.status(500).json({ error: error.message });
  }
});

// ─── UPDATE stock only (admin only) ──────────────────────────────
router.patch("/:id/stock", protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;

    // ✅ Validate stock value
    if (stock === undefined || stock === null) {
      return res.status(400).json({ error: "Stock value is required" });
    }
    if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: "Stock must be a non-negative integer" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    logger.info({ productId: product._id, stock, adminId: req.user._id }, "Stock updated");
    res.json(product);
  } catch (error) {
    logger.error({ err: error }, "Update stock error");
    res.status(500).json({ error: error.message });
  }
});

// ─── DELETE product (admin only) ──────────────────────────────────
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    logger.info({ productId: req.params.id, adminId: req.user._id }, "Product deleted");
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error({ err: error }, "Delete product error");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;