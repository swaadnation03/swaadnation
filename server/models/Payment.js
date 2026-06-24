// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   order: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Order",
//     // NOT required - order will be linked after payment verification
//   },
//   razorpayOrderId: {
//     type: String,
//     required: true,
//   },
//   razorpayPaymentId: String,
//   razorpaySignature: String,
//   amount: {
//     type: Number,
//     required: true,
//   },
//   currency: {
//     type: String,
//     default: "INR",
//   },
//   status: {
//     type: String,
//     enum: ["created", "attempted", "paid", "failed"],
//     default: "created",
//   },
//   paymentMethod: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Payment", paymentSchema);



const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "INR",
  },
  status: {
    type: String,
    enum: ["created", "attempted", "paid", "failed"],
    default: "created",
  },
  paymentMethod: String,

  // ✅ NEW: stores server-computed order data between create and verify
  // so verify-payment never needs to trust the client
  pendingOrderData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);