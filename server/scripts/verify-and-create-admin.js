require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/swaadnation?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  role: String,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function verifyAndCreateAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    console.log("Database:", mongoose.connection.db.databaseName);

    // Check if admin exists
    let admin = await User.findOne({ email: "singhaditya5833@gmail.com" });
    
    if (admin) {
      console.log("📧 Admin user found!");
      console.log("Current role:", admin.role);
      
      // Update to admin if not already
      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log("✅ Updated user to admin role!");
      } else {
        console.log("✅ User already has admin role!");
      }
    } else {
      console.log("❌ Admin user not found. Creating new admin...");
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Aditya@1464", salt);
      
      // Create new admin
      admin = await User.create({
        name: "Aditya Singh",
        email: "singhaditya5833@gmail.com",
        password: hashedPassword,
        phone: "7754037920",
        address: "Hamirpur, Himachal Pradesh",
        role: "admin",
        isActive: true,
      });
      
      console.log("✅ Admin user created successfully!");
    }
    
    // Display admin info
    console.log("\n📋 Admin Credentials:");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Name:", admin.name);
    
    // List all users
    console.log("\n👥 All users in database:");
    const allUsers = await User.find({});
    allUsers.forEach(u => {
      console.log(`- ${u.email} (${u.role})`);
    });
    
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

verifyAndCreateAdmin();