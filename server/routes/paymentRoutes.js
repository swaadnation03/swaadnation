// const express = require("express");
// const router = express.Router();
// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Payment = require("../models/Payment");
// const Order = require("../models/orderModel");
// const User = require("../models/userModel");
// const { protect } = require("../middleware/authMiddleware");
// const {
//   sendOrderConfirmationEmail,
//   sendOrderStatusEmail,
// } = require("../services/emailService");

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Create Razorpay Order
// router.post("/create-order", protect, async (req, res) => {
//   try {
//     console.log("Create order request received");
//     console.log("User:", req.user?._id);
//     console.log("Body:", req.body);
    
//     const { amount, currency = "INR", receipt } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ error: "Invalid amount" });
//     }

//     const options = {
//       amount: Math.round(amount * 100), // Amount in paise
//       currency,
//       receipt: receipt || `order_${Date.now()}`,
//       payment_capture: 1,
//     };

//     console.log("Razorpay options:", options);

//     const order = await razorpay.orders.create(options);
//     console.log("Razorpay order created:", order.id);

//     // Save payment record (order will be created after payment verification)
//     const payment = new Payment({
//       razorpayOrderId: order.id,
//       amount: amount,
//       currency: currency,
//       status: "created",
//     });
//     await payment.save();

//     res.json({
//       success: true,
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       keyId: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (error) {
//     console.error("Razorpay order error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Verify Payment and Create Order
// router.post("/verify-payment", protect, async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       razorpayOrderId,
//       orderData,
//     } = req.body;

//     // Validate payment signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     const isAuthentic = expectedSignature === razorpay_signature;

//     if (!isAuthentic) {
//       return res.status(400).json({ error: "Invalid payment signature" });
//     }

//     // ✅ Payment verified! Now create the order
//     try {
//       const parsedOrderData = JSON.parse(orderData);
      
//       const orderDataWithUser = {
//         ...parsedOrderData,
//         user: req.user._id,
//         paymentId: razorpay_payment_id,
//         paymentStatus: "paid",
//         status: "Processing",
//       };

//       // Create the order
//       const newOrder = new Order(orderDataWithUser);
//       const savedOrder = await newOrder.save();

//       // Update payment record
//       await Payment.findOneAndUpdate(
//         { razorpayOrderId: razorpayOrderId },
//         {
//           order: savedOrder._id,
//           status: "paid",
//           paymentId: razorpay_payment_id,
//         }
//       );

//       // Send confirmation email
//       const user = await User.findById(req.user._id);
//       await sendOrderConfirmationEmail(savedOrder, user, req).catch((err) =>
//         console.error("Email error:", err)
//       );

//       res.json({
//         success: true,
//         message: "Payment verified and order created successfully",
//         orderId: savedOrder._id,
//       });
//     } catch (orderError) {
//       console.error("Order creation error:", orderError);
//       res.status(500).json({ error: "Payment verified but failed to create order. Please contact support." });
//     }
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     res.status(500).json({ error: error.message });
//   }

// });

// // Get payment status
// router.get("/status/:razorpayOrderId", protect, async (req, res) => {
//   try {
//     const payment = await Payment.findOne({ razorpayOrderId: req.params.razorpayOrderId });
//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }
//     res.json({
//       status: payment.status,
//       amount: payment.amount,
//       paymentId: payment.razorpayPaymentId,
//       orderId: payment.order,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/orderModel");
const Coupon = require("../models/Coupon");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const { sendOrderConfirmationEmail } = require("../services/emailService");
const logger = require("../utils/logger");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Create Razorpay Order ────────────────────────────────────────
router.post("/create-order", protect, async (req, res) => {
  try {
    const { orderData } = req.body; // ✅ receive full order data here, not just amount

    if (!orderData) {
      return res.status(400).json({ error: "Order data is required" });
    }

    const parsedOrderData = JSON.parse(orderData);
    const { items, appliedCoupon } = parsedOrderData;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // ✅ Server-side recompute — same logic as orderRoutes.js
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
        const valid =
          now >= coupon.startDate &&
          now <= coupon.endDate &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
          subtotal >= coupon.minOrderAmount;

        const userOrderCount = await Order.countDocuments({
          user: req.user._id,
          "appliedCoupon.code": coupon.code,
        });
        const underPerUserLimit = userOrderCount < coupon.perUserLimit;

        let passesFirstOrderCheck = true;
        if (coupon.isFirstOrderOnly) {
          const totalOrders = await Order.countDocuments({ user: req.user._id });
          passesFirstOrderCheck = totalOrders === 0;
        }

        if (valid && underPerUserLimit && passesFirstOrderCheck) {
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
        }
      }
    }

    const total = subtotal + deliveryFee - discount;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    const options = {
      amount: Math.round(total * 100), // ✅ server-computed amount, not client-sent
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    logger.info({ razorpayOrderId: razorpayOrder.id, total }, "Razorpay order created");

    // ✅ Store server-computed order details on the Payment record
    // so verify-payment can read them back without trusting the client
    const payment = new Payment({
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      currency: "INR",
      status: "created",
      // store the trusted server-computed data for use at verify time
      pendingOrderData: {
        customer: parsedOrderData.customer,
        items,
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod: "Online",
        appliedCoupon: validatedCoupon,
      },
    });
    await payment.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    logger.error({ err: error }, "Razorpay order creation failed");
    res.status(500).json({ error: error.message });
  }
});

// ─── Verify Payment and Create Order ─────────────────────────────
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ✅ Step 1: Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      logger.warn({ razorpay_order_id }, "Invalid payment signature");
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // ✅ Step 2: Load trusted order data from DB — not from client
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    if (payment.status === "paid") {
      return res.status(400).json({ error: "Payment already processed" });
    }

    // ✅ Step 3: Verify amount with Razorpay API directly
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);
    const paidAmountInPaise = razorpayPayment.amount;
    const expectedAmountInPaise = Math.round(payment.amount * 100);

    if (paidAmountInPaise !== expectedAmountInPaise) {
      logger.warn(
        { paid: paidAmountInPaise, expected: expectedAmountInPaise, razorpay_order_id },
        "Payment amount mismatch — possible tampering"
      );
      return res.status(400).json({ error: "Payment amount mismatch" });
    }

    // ✅ Step 4: Create order from server-stored data, not client data
    const pendingData = payment.pendingOrderData;

    const newOrder = new Order({
      ...pendingData,
      user: req.user._id,
      paymentId: razorpay_payment_id,
      paymentStatus: "paid",
      status: "Processing",
    });
    const savedOrder = await newOrder.save();

    // ✅ Step 5: Increment coupon usage if one was applied
    if (pendingData.appliedCoupon?.code) {
      await Coupon.findOneAndUpdate(
        { code: pendingData.appliedCoupon.code },
        { $inc: { usedCount: 1 } }
      );
    }

    // ✅ Step 6: Update payment record
    await Payment.findByIdAndUpdate(payment._id, {
      order: savedOrder._id,
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      pendingOrderData: null,
    });

    // Step 7: Send confirmation email
    const user = await User.findById(req.user._id);
    sendOrderConfirmationEmail(savedOrder, user).catch((err) =>
      logger.error({ err, orderId: savedOrder._id }, "Order confirmation email failed")
    );

    logger.info({ orderId: savedOrder._id, userId: req.user._id }, "Payment verified, order created");

    res.json({
      success: true,
      message: "Payment verified and order created successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    logger.error({ err: error }, "Payment verification error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get Payment Status ───────────────────────────────────────────
router.get("/status/:razorpayOrderId", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      razorpayOrderId: req.params.razorpayOrderId,
    });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({
      status: payment.status,
      amount: payment.amount,
      paymentId: payment.razorpayPaymentId,
      orderId: payment.order,
    });
  } catch (error) {
    logger.error({ err: error }, "Payment status fetch error");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 