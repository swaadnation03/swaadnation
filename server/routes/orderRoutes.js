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

const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} = require("../services/emailService");
const User = require("../models/userModel");

// CREATE ORDER (authenticated users only)
router.post("/", protect, async (req, res) => {
  try {
    // Add user ID to order
    const orderData = {
      ...req.body,
      user: req.user._id,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();
    res.json(savedOrder);
    const user = await User.findById(req.user._id);
    sendOrderConfirmationEmail(savedOrder, user, req).catch((err) =>
      console.error("Email error:", err),
    );
  } catch (err) {
    console.log("ERROR:", err);
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
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ORDERS (admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
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

    // Check if user is admin or order belongs to user
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
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

    // ✅ FIRST: Get the current order to know the old status
    const currentOrder = await Order.findById(req.params.id);
    
    if (!currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    const oldStatus = currentOrder.status; // Store old status
    
    // ✅ SECOND: Update the order status
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    // ✅ THIRD: Send email with both old and new status
    const user = await User.findById(order.user);
    
    // Only send email if status actually changed
    if (oldStatus !== status) {
      sendOrderStatusEmail(order, user, oldStatus, status, req).catch((err) =>
        console.error("Email error:", err),
      );
    }

    res.json(order);
    
  } catch (err) {
    console.error("Status update error:", err);
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
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
