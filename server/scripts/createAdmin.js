// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/?appName=Cluster0";

// User Schema (copy from your userModel.js)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Function to create admin user
const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB ✅");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@swaadnation.com" });
    
    if (adminExists) {
      console.log("Admin user already exists!");
      console.log("Email: admin@swaadnation.com");
      console.log("You can login with password: admin123 (if you haven't changed it)");
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      // Create admin user
      const admin = await User.create({
        name: "Aditya Singh",
        email: "singhaditya5833@gmail.com",
        password: "Aditya@1464",
        phone: "7754037920",
        address: "Hamirpur, Himachal Pradesh",
        role: "admin",
        isActive: true,
      });
      
      console.log("✅ Admin user created successfully!");
      console.log("📧 Email: admin@swaadnation.com");
      console.log("🔑 Password: admin123");
      console.log("👤 Role: Admin");
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

// Run the function
createAdmin();