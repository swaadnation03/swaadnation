// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   customer: {
//     name: String,
//     phone: String,
//     address: String,
//   },
//   items: [
//     {
//       name: String,
//       price: Number,
//       qty: Number,
//     },
//   ],
//   total: Number,
//   paymentMethod: {
//     type: String,
//     default: "COD",
//   },
//   status: {
//     type: String,
//     default: "Pending",
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Order", orderSchema);

// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   customer: {
//     name: String,
//     phone: String,
//     address: String,
//   },
//   items: [
//     {
//       name: String,
//       price: Number,
//       qty: Number,
//       // Don't include _id here - let MongoDB handle it
//     },
//   ],
//   total: Number,
//   paymentMethod: {
//     type: String,
//     default: "COD",
//   },
//   status: {
//     type: String,
//     default: "Pending",
//   },
// }, { 
//   timestamps: true,
//   // This ensures only defined fields are saved
//   strict: true 
// });

// module.exports = mongoose.model("Order", orderSchema);





const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  items: [
    {
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  total: Number,
  paymentMethod: {
    type: String,
    default: "COD",
  },
  status: {
    type: String,
    default: "Pending",
  },
}, { 
  timestamps: true,
  strict: true 
});

module.exports = mongoose.model("Order", orderSchema);