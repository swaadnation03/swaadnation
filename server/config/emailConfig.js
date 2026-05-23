// const nodemailer = require("nodemailer");

// // Email configuration
// const emailConfig = {
//   // For Gmail (development)
//   gmail: {
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER, // your Gmail address
//       pass: process.env.EMAIL_PASS, // your Gmail app password
//     },
//   },
  
//   // For production (SendGrid, Mailgun, AWS SES)
//   sendgrid: {
//     host: "smtp.sendgrid.net",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "apikey",
//       pass: process.env.SENDGRID_API_KEY,
//     },
//   },
// };

// // Use Gmail for development, SendGrid for production
// const transporter = nodemailer.createTransport(
//   process.env.NODE_ENV === "production" ? emailConfig.sendgrid : emailConfig.gmail
// );

// // Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("Email service error:", error);
//   } else {
//     console.log("Email service ready ✅");
//   }
// });

// module.exports = { transporter };


const nodemailer = require("nodemailer");

// Create transporter directly (simpler)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,           // Changed from 465 to 587
  secure: false,       // false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email service ready ✅");
  }
});

module.exports = { transporter };

// const nodemailer = require("nodemailer");

// let transporter = null;

// const getTransporter = async () => {
//   if (!transporter) {
//     // Create a test account on Ethereal (free, no setup needed)
//     const testAccount = await nodemailer.createTestAccount();
    
//     transporter = nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       secure: false,
//       auth: {
//         user: testAccount.user,
//         pass: testAccount.pass,
//       },
//     });
    
//     console.log("📧 Email service ready (Ethereal)");
//     console.log("📨 Preview emails at: https://ethereal.email/login");
//     console.log("Username:", testAccount.user);
//   }
//   return transporter;
// };

// module.exports = { getTransporter };