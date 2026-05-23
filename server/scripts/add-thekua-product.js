require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/swaadnation?retryWrites=true&w=majority";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  longDescription: String,
  image: String,
  imageBack: String,
  category: String,
  stock: Number,
  ingredients: String,
  nutrients: Object,
  weight: String,
  shelfLife: String,
  mrp: Number,
  fssaiLicense: String,
  manufacturer: Object,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

async function addThekuaProduct() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to database");

    // Check if product already exists
    const existingProduct = await Product.findOne({ name: "Thekua Classic" });
    
    if (existingProduct) {
      console.log("Product already exists, updating...");
      await Product.deleteOne({ name: "Thekua Classic" });
    }

    const thekuaProduct = new Product({
      name: "Thekua Classic",
      price: 199,
      mrp: 249,
      weight: "250 g",
      category: "Snacks",
      stock: 100,
      description: "An authentic traditional snack from Bihar. Made with wheat flour, jaggery, and ghee. Perfect for Chhath Puja and everyday snacking.",
      longDescription: `Thekua is a traditional sweet snack from Bihar, especially famous during the festival of Chhath Puja. It is made from wheat flour, jaggery (or sugar), and ghee, flavored with cardamom and sometimes coconut. The dough is shaped by hand or with traditional wooden molds and then deep-fried until golden brown and crispy.

Thekua is known for its rich taste, long shelf life, and cultural significance, symbolizing devotion, purity, and the authentic flavors of Bihar.`,
      ingredients: "WHEAT FLOUR, SOOJI, COCONUT, REFINED OIL, DESI GHEE, SUGAR AND LOVE",
      nutrients: {
        protein: "5.39%",
        carbohydrate: "52.46%",
        energy: "542.80 kcal/gm",
        moisture: "7.15%",
        totalAsh: "0.40%",
        sugar: "26.69%",
        fat: "34.60%"
      },
      image: "/images/thekua-front.jpg",
      imageBack: "/images/thekua-back.jpg",
      shelfLife: "45 days",
      fssaiLicense: "20426071000061",
      manufacturer: {
        name: "Swad Nation",
        address: "Motihari, East Champaran, Bihar, 845401, India",
        email: "swaadnation03@gmail.com"
      }
    });

    await thekuaProduct.save();
    console.log("✅ Thekua Classic product added successfully!");
    console.log("\n📋 Product Details:");
    console.log("Name:", thekuaProduct.name);
    console.log("Price: ₹" + thekuaProduct.price);
    console.log("MRP: ₹" + thekuaProduct.mrp);
    console.log("Weight:", thekuaProduct.weight);
    console.log("Category:", thekuaProduct.category);

    await mongoose.disconnect();
    console.log("\n✅ Done!");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

addThekuaProduct();