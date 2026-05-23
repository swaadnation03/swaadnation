// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   mrp: {
//     type: Number,
//     default: 0,
//   },
//   description: {
//     type: String,
//     default: "",
//   },
//   longDescription: {
//     type: String,
//     default: "",
//   },
//   image: {
//     type: String,
//     default: "",
//   },
//   imageBack: {
//     type: String,
//     default: "",
//   },
//   category: {
//     type: String,
//     default: "Snacks",
//   },
//   stock: {
//     type: Number,
//     default: 100,
//   },
//   weight: {
//     type: String,
//     default: "250 g",
//   },
//   shelfLife: {
//     type: String,
//     default: "45 days",
//   },
//   ingredients: {
//     type: String,
//     default: "",
//   },
//   nutrients: {
//     protein: String,
//     carbohydrate: String,
//     energy: String,
//     moisture: String,
//     totalAsh: String,
//     sugar: String,
//     fat: String,
//   },
//   fssaiLicense: {
//     type: String,
//     default: "",
//   },
//   manufacturer: {
//     name: String,
//     address: String,
//     email: String,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    longDescription: {
      type: String,
      default: "",
    },
    imageFront: {
      type: String,
      default: "",
    },
    imageBack: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Snacks",
    },
    stock: {
      type: Number,
      default: 100,
    },
    weight: {
      type: String,
      default: "250 g",
    },
    shelfLife: {
      type: String,
      default: "45 days",
    },
    ingredients: {
      type: String,
      default: "",
    },
    nutrients: {
      protein: String,
      carbohydrate: String,
      energy: String,
      moisture: String,
      totalAsh: String,
      sugar: String,
      fat: String,
    },
    fssaiLicense: {
      type: String,
      default: "",
    },
    manufacturer: {
      name: String,
      address: String,
      email: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
