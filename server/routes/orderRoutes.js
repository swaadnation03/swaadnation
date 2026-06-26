// const express = require("express");
// const router = express.Router();
// const Order = require("../models/orderModel");

// // CREATE ORDER
// router.post("/", async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     const savedOrder = await order.save();
//     res.json(savedOrder);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     console.log("BODY RECEIVED:", req.body); // 👈 ADD THIS

//     const order = new Order(req.body);
//     const savedOrder = await order.save();

//     console.log("SAVED:", savedOrder); // 👈 ADD THIS

//     res.json(savedOrder);
//   } catch (err) {
//     console.log("ERROR:", err); // 👈 ADD THIS
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET ALL ORDERS (for admin later)
// router.get("/", async (req, res) => {
//   const orders = await Order.find().sort({ createdAt: -1 });
//   res.json(orders);
// });

// module.exports = router;

// working

// const express = require("express");
// const router = express.Router();
// const Order = require("../models/orderModel");

// // CREATE ORDER - Remove the duplicate
// router.post("/", async (req, res) => {
//   try {
//     console.log("BODY RECEIVED:", req.body);

//     const order = new Order(req.body);
//     const savedOrder = await order.save();

//     console.log("SAVED:", savedOrder);

//     res.json(savedOrder);
//   } catch (err) {
//     console.log("ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET ALL ORDERS (for admin later)
// router.get("/", async (req, res) => {
//   const orders = await Order.find().sort({ createdAt: -1 });
//   res.json(orders);
// });

// module.exports = router;

//2nd working

// const express = require("express");
// const router = express.Router();
// const Order = require("../models/orderModel");

// // CREATE ORDER
// router.post("/", async (req, res) => {
//   try {
//     console.log("BODY RECEIVED:", req.body);
//     const order = new Order(req.body);
//     const savedOrder = await order.save();
//     console.log("SAVED:", savedOrder);
//     res.json(savedOrder);
//   } catch (err) {
//     console.log("ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET ALL ORDERS (for admin)
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET SINGLE ORDER
// router.get("/:id", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE ORDER STATUS (Admin)
// router.put("/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;
//     const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ error: "Invalid status" });
//     }

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE ORDER (Admin)
// router.delete("/:id", async (req, res) => {
//   try {
//     const order = await Order.findByIdAndDelete(req.params.id);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }
//     res.json({ message: "Order deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const Order = require("../models/orderModel");
// const { protect, admin } = require("../middleware/authMiddleware");
// const {
//   sendOrderConfirmationEmail,
//   sendOrderStatusEmail,
// } = require("../services/emailService");
// const User = require("../models/userModel");

// // CREATE ORDER (authenticated users only)
// // router.post("/", protect, async (req, res) => {
// //   try {
// //     // Add user ID to order
// //     const orderData = {
// //       ...req.body,
// //       user: req.user._id,
// //     };

// //     const order = new Order(orderData);
// //     const savedOrder = await order.save();
// //     res.json(savedOrder);
// //     const user = await User.findById(req.user._id);
// //     sendOrderConfirmationEmail(savedOrder, user, req).catch((err) =>
// //       console.error("Email error:", err),
// //     );
// //   } catch (err) {
// //     console.log("ERROR:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// router.post("/", protect, async (req, res) => {
//   try {
//     const orderData = { ...req.body, user: req.user._id };
//     const order = new Order(orderData);
//     const savedOrder = await order.save();

//     // Fire-and-forget — don't block the response on email
//     User.findById(req.user._id).then((user) => {
//       if (user) sendOrderConfirmationEmail(savedOrder, user).catch((err) =>
//         console.error("Email error:", err)
//       );
//     });

//     res.json(savedOrder);
//   } catch (err) {
//     console.error("Order creation error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const Coupon = require("../models/Coupon");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} = require("../services/emailService");
const User = require("../models/userModel");
const logger = require("../utils/logger");

const rateLimit = require("express-rate-limit");

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many orders placed. Please try again later." },
});

// CREATE ORDER (authenticated users only)
router.post("/", protect, orderLimiter, async (req, res) => {
  try {
    const { items, appliedCoupon, customer, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = 0;
    // const deliveryFee = subtotal > 499 ? 0 : 40;

    let discount = 0;
    let validatedCoupon = null;

    if (appliedCoupon?.code) {
      const coupon = await Coupon.findOne({
        code: appliedCoupon.code.toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        const now = new Date();
        const withinDateRange = now >= coupon.startDate && now <= coupon.endDate;
        const underUsageLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
        const meetsMinOrder = subtotal >= coupon.minOrderAmount;

        const userOrderCount = await Order.countDocuments({
          user: userId,
          "appliedCoupon.code": coupon.code,
        });
        const underPerUserLimit = userOrderCount < coupon.perUserLimit;

        let passesFirstOrderCheck = true;
        if (coupon.isFirstOrderOnly) {
          const totalUserOrders = await Order.countDocuments({ user: userId });
          passesFirstOrderCheck = totalUserOrders === 0;
        }

        const couponIsValid =
          withinDateRange &&
          underUsageLimit &&
          meetsMinOrder &&
          underPerUserLimit &&
          passesFirstOrderCheck;

        if (couponIsValid) {
          if (coupon.type === "percentage") {
            discount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.value;
          }
          discount = Math.min(Math.round(discount), subtotal);

          validatedCoupon = { code: coupon.code, discount };

          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
          logger.info({ userId, couponCode: coupon.code, discount }, "Coupon applied to order");
        } else {
          logger.warn(
            { userId, couponCode: coupon.code },
            "Coupon validation failed at order creation — dropped silently"
          );
        }
      }
    }

    const total = subtotal + deliveryFee - discount;

    const order = new Order({
      customer,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "initiated",
      status: "Pending",
      appliedCoupon: validatedCoupon,
      user: userId,
    });

    const savedOrder = await order.save();
    logger.info({ orderId: savedOrder._id, userId, total }, "Order created");

    // Fire-and-forget confirmation email
    User.findById(userId).then((user) => {
      if (user) {
        sendOrderConfirmationEmail(savedOrder, user).catch((err) =>
          logger.error({ err, orderId: savedOrder._id }, "Order confirmation email failed")
        );
      }
    });

    res.json(savedOrder);
  } catch (err) {
    logger.error({ err }, "Order creation error");
    res.status(500).json({ error: err.message });
  }
});

// GET USER'S ORDERS
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    logger.error({ err, userId: req.user._id }, "Failed to fetch user orders");
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ORDERS (admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    logger.error({ err }, "Failed to fetch all orders");
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE ORDER
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      logger.warn(
        { userId: req.user._id, orderId: req.params.id },
        "Unauthorized order access attempt"
      );
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    logger.error({ err, orderId: req.params.id }, "Failed to fetch order");
    res.status(500).json({ error: err.message });
  }
});

// UPDATE ORDER STATUS (admin only)
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const currentOrder = await Order.findById(req.params.id);

    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const oldStatus = currentOrder.status;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    const user = await User.findById(order.user);

    if (oldStatus !== status) {
      logger.info(
        { orderId: order._id, oldStatus, newStatus: status, adminId: req.user._id },
        "Order status updated"
      );
      sendOrderStatusEmail(order, user, oldStatus, status).catch((err) =>
        logger.error({ err, orderId: order._id }, "Order status email failed")
      );
    }

    res.json(order);
  } catch (err) {
    logger.error({ err, orderId: req.params.id }, "Status update error");
    res.status(500).json({ error: err.message });
  }
});

// DELETE ORDER (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    logger.info({ orderId: req.params.id, adminId: req.user._id }, "Order deleted");
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    logger.error({ err, orderId: req.params.id }, "Order deletion error");
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;