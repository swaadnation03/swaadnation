require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Use the database where your admin user exists
const MONGODB_URI = "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/swaadnation?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  role: String,
  isActive: Boolean,
});

const User = mongoose.model("User", userSchema);

async function fixAdminPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to database:", mongoose.connection.db.databaseName);
    
    // Find the admin user
    const admin = await User.findOne({ email: "singhaditya5833@gmail.com" });
    
    if (admin) {
      console.log("📧 Found admin user:", admin.email);
      console.log("Current password hash:", admin.password);
      
      // Hash the password properly
      const plainPassword = "Aditya@1464";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);
      
      // Update the password
      admin.password = hashedPassword;
      await admin.save();
      
      console.log("\n✅ Password updated successfully!");
      console.log("New password hash:", admin.password.substring(0, 30) + "...");
      
      // Verify the password works
      const isValid = await bcrypt.compare(plainPassword, admin.password);
      console.log("Password verification:", isValid ? "✅ Valid" : "❌ Invalid");
      
      console.log("\n📋 Login with:");
      console.log("Email: singhaditya5833@gmail.com");
      console.log("Password: Aditya@1464");
    } else {
      console.log("❌ Admin user not found!");
    }
    
    await mongoose.disconnect();
    console.log("\n✅ Done!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fixAdminPassword();