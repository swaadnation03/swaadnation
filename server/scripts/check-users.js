require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Try different database names
const databases = [
  "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/swaadnation?retryWrites=true&w=majority",
  "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/test?retryWrites=true&w=majority",
  "mongodb+srv://swaadnation_db8957:bk3gjYXFruSJUGyR@cluster0.jzricr3.mongodb.net/?retryWrites=true&w=majority"
];

async function checkUsers() {
  for (const dbUri of databases) {
    try {
      console.log(`\n📁 Checking database: ${dbUri.split('/').pop() || 'default'}`);
      await mongoose.connect(dbUri);
      
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      
      if (collections.some(c => c.name === 'users')) {
        const users = await db.collection('users').find({}).toArray();
        console.log(`✅ Found ${users.length} user(s) in this database:`);
        
        for (const user of users) {
          console.log(`   - Email: ${user.email}`);
          console.log(`     Role: ${user.role}`);
          console.log(`     Name: ${user.name}`);
          console.log(`     Password hash: ${user.password.substring(0, 30)}...`);
        }
      } else {
        console.log(`❌ No 'users' collection found in this database`);
      }
      
      await mongoose.disconnect();
    } catch (err) {
      console.error(`Error with database:`, err.message);
      await mongoose.disconnect();
    }
  }
}

checkUsers();