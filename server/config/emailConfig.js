// const nodemailer = require("nodemailer");

// // Create transporter directly (simpler)
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,           // Changed from 465 to 587
//   secure: false,       // false for port 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify connection with detailed logging
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Email service ERROR:", error.message);
//     console.error("Full error details:", error);
//     console.error("Make sure you have:");
//     console.error("1. EMAIL_USER set to your Gmail address");
//     console.error("2. EMAIL_PASS set to your Gmail App Password (not regular password)");
//     console.error("3. Gmail account has 2-Factor Authentication enabled");
//     console.error("4. App Password generated at: https://myaccount.google.com/apppasswords");
//   } else {
//     console.log("✅ Email service ready - Connection verified!");
//     console.log(`📧 Configured sender: ${process.env.EMAIL_USER}`);
//   }
// });

// module.exports = { transporter };







const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = { resend };