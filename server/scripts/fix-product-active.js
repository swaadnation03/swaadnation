require("dotenv").config();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const MONGODB_URI = "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/swaadnation?retryWrites=true&w=majority";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  stock: Number,
  isActive: Boolean,
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

async function fixProduct() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to database");
    console.log("Database:", mongoose.connection.db.databaseName);
    
    // Find the product
    const product = await Product.findOne({ name: "Thekua Classic" });
    
    if (product) {
      console.log("📦 Found product:", product.name);
      console.log("Current isActive:", product.isActive);
      
      // Add isActive field if missing or set to true
      product.isActive = true;
      await product.save();
      
      console.log("✅ Updated product with isActive: true");
    } else {
      console.log("❌ Product not found!");
      
      // List all products
      const allProducts = await Product.find({});
      console.log(`\n📋 All products in database (${allProducts.length}):`);
      allProducts.forEach(p => {
        console.log(`   - ${p.name} (isActive: ${p.isActive})`);
      });
    }
    
    await mongoose.disconnect();
    console.log("\n✅ Done!");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

fixProduct();