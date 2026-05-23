const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/orderModel");
const { protect } = require("../middleware/authMiddleware");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post("/create-order", protect, async (req, res) => {
  try {
    console.log("Create order request received");
    console.log("User:", req.user?._id);
    console.log("Body:", req.body);
    
    const { amount, currency = "INR", receipt, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      payment_capture: 1,
    };

    console.log("Razorpay options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order.id);

    // Save payment record
    const payment = new Payment({
      order: orderId,
      razorpayOrderId: order.id,
      amount: amount,
      currency: currency,
      status: "created",
    });
    await payment.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    console.log("Verifying payment:", { razorpay_order_id, razorpay_payment_id, orderId });

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment record
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "paid",
        }
      );

      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "Processing",
        paymentId: razorpay_payment_id,
      });

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      console.error("Invalid payment signature");
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment status
router.get("/status/:orderId", protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({
      status: payment.status,
      amount: payment.amount,
      paymentId: payment.razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;