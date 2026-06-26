// const { transporter } = require("../config/emailConfig");
// const fs = require("fs");
// const path = require("path");
// const Handlebars = require("handlebars");

// // Load and compile templates
// const loadTemplate = (templateName) => {
//   const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
//   const source = fs.readFileSync(templatePath, "utf8");
//   return Handlebars.compile(source);
// };

// // Email templates
// const templates = {
//   welcome: loadTemplate("welcome"),
//   orderConfirmation: loadTemplate("order-confirmation"),
// };

// // Send welcome email
// const sendWelcomeEmail = async (user, req) => {
//   try {
//     console.log("📧 Sending welcome email to:", user.email);
//     const html = templates.welcome({
//       name: user.name,
//       shopUrl: `${req.protocol}://${req.get("host")}`,
//       unsubscribeUrl: `${req.protocol}://${req.get("host")}/unsubscribe?email=${user.email}`,
//     });

//     const mailOptions = {
//       from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: "Welcome to Swaad Nation! 🎉 Taste of Champaran",
//       html,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(`✅ Welcome email sent to ${user.email}. Response:`, result);
//     return true;
//   } catch (error) {
//     console.error("❌ Welcome email error:", error.message);
//     console.error("Full error:", error);
//     return false;
//   }
// };

// // Send order confirmation email
// const sendOrderConfirmationEmail = async (order, user, req) => {
//   try {
//     console.log("📧 Sending order confirmation email to:", user.email);
//     const items = order.items.map(item => ({
//       name: item.name,
//       qty: item.qty,
//       total: item.price * item.qty,
//     }));

//     const subtotal = order.total;
//     const deliveryFee = subtotal > 499 ? 0 : 40;
//     const total = subtotal + deliveryFee;

//     const html = templates.orderConfirmation({
//       customerName: order.customer.name,
//       orderId: order._id.toString().slice(-8).toUpperCase(),
//       orderDate: new Date(order.createdAt).toLocaleDateString("en-IN"),
//       orderStatus: order.status,
//       items,
//       subtotal,
//       deliveryFee,
//       freeDelivery: deliveryFee === 0,
//       total,
//       phone: order.customer.phone,
//       address: order.customer.address,
//       paymentMethod: order.paymentMethod,
//       trackOrderUrl: `${req.protocol}://${req.get("host")}/my-orders`,
//     });

//     const mailOptions = {
//       from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: `Order Confirmed! #${order._id.toString().slice(-8)} - Swaad Nation`,
//       html,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(`✅ Order confirmation email sent to ${user.email}. Response:`, result);
//     return true;
//   } catch (error) {
//     console.error("❌ Order confirmation email error:", error.message);
//     console.error("Full error:", error);
//     return false;
//   }
// };

// // Send order status update email
// const sendOrderStatusEmail = async (order, user, oldStatus, newStatus, req) => {
//   try {
//     console.log("📧 Sending order status email to:", user.email, `(Status: ${oldStatus} → ${newStatus})`);
//     const statusMessages = {
//       Processing: "Your order is being prepared with care and will be shipped soon!",
//       Shipped: "Your order is on the way! It has been handed over to our delivery partner.",
//       Delivered: "Your order has been delivered! We hope you enjoy our authentic Bihari flavors.",
//       Cancelled: "Your order has been cancelled as requested.",
//     };

//     const template = `
//       <!DOCTYPE html>
//       <html>
//       <head><title>Order Status Update - Swaad Nation</title></head>
//       <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white;">Swaad Nation</h1>
//           </div>
//           <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
//             <h2>Order Status Update</h2>
//             <p>Dear ${order.customer.name},</p>
//             <p>Your order #${order._id.toString().slice(-8)} status has been updated:</p>
            
//             <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
//               <p><strong>Old Status:</strong> ${oldStatus}</p>
//               <p><strong>New Status:</strong> ${newStatus}</p>
//               <p><strong>Message:</strong> ${statusMessages[newStatus] || "Your order is being processed."}</p>
//             </div>
            
//             <div style="text-align: center;">
//               <a href="${req.protocol}://${req.get("host")}/my-orders" style="display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 5px;">Track Your Order</a>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;

//     const mailOptions = {
//       from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: `Order ${newStatus}! #${order._id.toString().slice(-8)} - Swaad Nation`,
//       html: template,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(`✅ Order status email sent to ${user.email}. Response:`, result);
//     return true;
//   } catch (error) {
//     console.error("❌ Order status email error:", error.message);
//     console.error("Full error:", error);
//     return false;
//   }
// };

// const sendStockAlertEmail = async (email, name, product) => {
//   try {
//     const template = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="utf-8">
//         <title>Back in Stock - Swaad Nation</title>
//         <style>
//           body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//           .header h1 { color: white; margin: 0; }
//           .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
//           .product-box { background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
//           .product-name { font-size: 24px; font-weight: bold; color: #2E7D32; margin: 10px 0; }
//           .price { font-size: 28px; font-weight: bold; color: #F57C00; margin: 10px 0; }
//           .button { display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
//           .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Swaad Nation</h1>
//             <p style="color: #FFC107; margin: 5px 0 0;">Taste of Champaran</p>
//           </div>
//           <div class="content">
//             <h2>Good News, ${name}! 🎉</h2>
//             <p>The product you've been waiting for is back in stock!</p>
            
//             <div class="product-box">
//               <div style="font-size: 48px;">🍪</div>
//               <div class="product-name">${product.name}</div>
//               <div class="price">₹${product.price}</div>
//               <p>Hurry up! Stock is limited.</p>
//             </div>
            
//             <div style="text-align: center;">
//               <a href="http://localhost:3000/product/${product._id}" class="button">
//                 Shop Now
//               </a>
//             </div>
            
//             <p style="margin-top: 20px;">Thank you for choosing Swaad Nation!</p>
//             <p><strong>Team Swaad Nation</strong></p>
//           </div>
//           <div class="footer">
//             <p>&copy; 2024 Swaad Nation. All rights reserved.</p>
//             <p><small>You received this email because you requested a stock notification.</small></p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;

//     const mailOptions = {
//       from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `🎉 Back in Stock: ${product.name} is now available!`,
//       html: template,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Stock alert email sent to ${email}`);
//     return true;
//   } catch (error) {
//     console.error("Stock alert email error:", error);
//     return false;
//   }
// };

// // Send email verification link
// const sendEmailVerificationLink = async (user, token, req) => {
//   try {
//     console.log("📧 Sending email verification to:", user.email);
//     const clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get("host")}`;
//     const verificationUrl = `${clientUrl}/verify-email?token=${token}&email=${user.email}`;
//     console.log("📧 Verification URL:", verificationUrl);
    
//     const template = `
//       <!DOCTYPE html>
//       <html>
//       <head><title>Verify Your Email - Swaad Nation</title></head>
//       <body style="font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white;">Swaad Nation</h1>
//           </div>
//           <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
//             <h2>Welcome to Swaad Nation! 🎉</h2>
//             <p>Dear ${user.name},</p>
//             <p>Thank you for signing up with us. To complete your registration and start ordering our authentic Bihari delicacies, please verify your email address.</p>
            
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
//             </div>
            
//             <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
//             <p style="word-break: break-all; color: #2E7D32; background: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            
//             <p style="color: #666; font-size: 14px; margin-top: 20px;">This link will expire in 24 hours.</p>
//             <p style="color: #666; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
            
//             <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
//             <p style="color: #999; font-size: 12px;">© 2024 Swaad Nation. All rights reserved.</p>
//             <p style="color: #999; font-size: 12px;">Taste of Champaran</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;

//     const mailOptions = {
//       from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: "Verify Your Email - Swaad Nation",
//       html: template,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email verification link sent to ${user.email}. Response:`, result);
//     return true;
//   } catch (error) {
//     console.error("❌ Email verification error:", error.message);
//     console.error("Full error:", error);
//     return false;
//   }
// };

// module.exports = {
//   sendWelcomeEmail,
//   sendOrderConfirmationEmail,
//   sendOrderStatusEmail,
//   sendStockAlertEmail,
//   sendEmailVerificationLink,
// };






const { resend } = require("../config/emailConfig");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const logger = require("../utils/logger");
const { emailLayout, emailButton, CLIENT_URL } = require("./emailLayout");
const { fromEmail: FROM_EMAIL } = require("../config/appConfig"); // ⬅️ now from appConfig

// Load and compile templates
const loadTemplate = (templateName) => { 
  const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
  const source = fs.readFileSync(templatePath, "utf8");
  return Handlebars.compile(source);
};

const templates = {
  welcome: loadTemplate("welcome"),
  orderConfirmation: loadTemplate("order-confirmation"),
};

// ─── Shared send helper ───────────────────────────────────────────
const sendEmail = async ({ to, subject, html, text, unsubscribeUrl }) => {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    text,
    headers: unsubscribeUrl
      ? {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        }
      : undefined,
  });

  if (error) throw new Error(error.message || "Resend send failed");
  return data;
};

// ─── Welcome Email ────────────────────────────────────────────────
const sendWelcomeEmail = async (user) => {
  try {
    logger.info({ email: user.email }, "Sending welcome email");
    const unsubscribeUrl = `${CLIENT_URL}/unsubscribe?email=${user.email}`;

    const html = templates.welcome({
      name: user.name,
      shopUrl: CLIENT_URL,
      unsubscribeUrl,
    });

    const data = await sendEmail({
      to: user.email,
      subject: "Welcome to Swaad Nation! 🎉 Taste of Champaran",
      html,
      text: `Hi ${user.name}, welcome to Swaad Nation! Visit us at ${CLIENT_URL}`,
      unsubscribeUrl,
    });

    logger.info({ email: user.email, emailId: data?.id }, "Welcome email sent");
    return true;
  } catch (error) {
    logger.error({ err: error, email: user.email }, "Welcome email failed");
    return false;
  }
};

// ─── Order Confirmation Email ─────────────────────────────────────
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    logger.info({ email: user.email, orderId: order._id }, "Sending order confirmation email");
    const unsubscribeUrl = `${CLIENT_URL}/unsubscribe?email=${user.email}`;

    const items = order.items.map((item) => ({
      name: item.name,
      qty: item.qty,
      total: item.price * item.qty,
    }));

    const subtotal = order.subtotal;
    const deliveryFee = order.deliveryFee;
    const discount = order.discount || 0;
    const couponCode = order.appliedCoupon?.code;
    const total = order.total;
    const orderId = order._id.toString().slice(-8).toUpperCase();

    const html = templates.orderConfirmation({
      customerName: order.customer.name,
      orderId,
      orderDate: new Date(order.createdAt).toLocaleDateString("en-IN"),
      orderStatus: order.status,
      items,
      subtotal,
      hasCoupon: !!couponCode,
      couponCode,
      discount,
      deliveryFee,
      freeDelivery: deliveryFee === 0,
      total,
      phone: order.customer.phone,
      address: order.customer.address,
      paymentMethod: order.paymentMethod,
      trackOrderUrl: `${CLIENT_URL}/my-orders`,
    });

    const data = await sendEmail({
      to: user.email,
      subject: `Order Confirmed! #${orderId} - Swaad Nation`,
      html,
      text: `Hi ${order.customer.name}, your order #${orderId} has been confirmed! Total: ₹${total}. Track it at ${CLIENT_URL}/my-orders`,
      unsubscribeUrl,
    });

    logger.info({ email: user.email, orderId: order._id, emailId: data?.id }, "Order confirmation email sent");

    // ✅ mark success on the order
    const Order = require("../models/orderModel");
    await Order.findByIdAndUpdate(order._id, { confirmationEmailSent: true }).catch((err) =>
      logger.error({ err, orderId: order._id }, "Failed to update confirmationEmailSent flag")
    );

    return true;
  } catch (error) {
    logger.error({ err: error, email: user.email, orderId: order._id }, "Order confirmation email failed");

    // ✅ mark failure on the order
    const Order = require("../models/orderModel");
    await Order.findByIdAndUpdate(order._id, { confirmationEmailSent: false }).catch(() => {});

    return false;
  }
};

// ─── Order Status Update Email ────────────────────────────────────
const sendOrderStatusEmail = async (order, user, oldStatus, newStatus) => {
  try {
    logger.info(
      { email: user.email, orderId: order._id, oldStatus, newStatus },
      "Sending order status email"
    );
    const unsubscribeUrl = `${CLIENT_URL}/unsubscribe?email=${user.email}`;
    const trackUrl = `${CLIENT_URL}/my-orders`;
    const orderId = order._id.toString().slice(-8).toUpperCase();

    const statusMessages = {
      Processing: "Your order is being prepared with care and will be shipped soon!",
      Shipped: "Your order is on the way! It has been handed over to our delivery partner.",
      Delivered: "Your order has been delivered! We hope you enjoy our authentic Bihari flavors.",
      Cancelled: "Your order has been cancelled as requested.",
    };

    const bodyContent = `
      <h2>Order Status Update</h2>
      <p>Dear ${order.customer.name},</p>
      <p>Your order #${orderId} status has been updated:</p>

      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Old Status:</strong> ${oldStatus}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p><strong>Message:</strong> ${statusMessages[newStatus] || "Your order is being processed."}</p>
      </div>

      ${emailButton(trackUrl, "Track Your Order")}
    `;

    const html = emailLayout({
      title: "Order Status Update - Swaad Nation",
      bodyContent,
      unsubscribeUrl,
    });

    const data = await sendEmail({
      to: user.email,
      subject: `Order ${newStatus}! #${orderId} - Swaad Nation`,
      html,
      text: `Hi ${order.customer.name}, your order #${orderId} status changed from ${oldStatus} to ${newStatus}. ${statusMessages[newStatus] || ""} Track at ${trackUrl}`,
      unsubscribeUrl,
    });

    logger.info({ email: user.email, orderId: order._id, emailId: data?.id }, "Order status email sent");
    return true;
  } catch (error) {
    logger.error({ err: error, email: user.email, orderId: order._id }, "Order status email failed");
    return false;
  }
};

// ─── Stock Alert Email ────────────────────────────────────────────
const sendStockAlertEmail = async (email, name, product) => {
  try {
    logger.info({ email, productId: product._id }, "Sending stock alert email");
    const unsubscribeUrl = `${CLIENT_URL}/unsubscribe?email=${email}`;
    const productUrl = `${CLIENT_URL}/product/${product._id}`;

    const bodyContent = `
      <h2>Good News, ${name}! 🎉</h2>
      <p>The product you've been waiting for is back in stock!</p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
        <div style="font-size: 48px;">🍪</div>
        <div style="font-size: 24px; font-weight: bold; color: #2E7D32; margin: 10px 0;">${product.name}</div>
        <div style="font-size: 28px; font-weight: bold; color: #F57C00; margin: 10px 0;">₹${product.price}</div>
        <p>Hurry up! Stock is limited.</p>
      </div>

      ${emailButton(productUrl, "Shop Now")}

      <p style="margin-top: 20px;">Thank you for choosing Swaad Nation!</p>
      <p><strong>Team Swaad Nation</strong></p>
    `;

    const html = emailLayout({
      title: "Back in Stock - Swaad Nation",
      bodyContent,
      unsubscribeUrl,
      showTagline: true,
    });

    const data = await sendEmail({
      to: email,
      subject: `🎉 Back in Stock: ${product.name} is now available!`,
      html,
      text: `Hi ${name}, ${product.name} is back in stock at ₹${product.price}! Shop now: ${productUrl}`,
      unsubscribeUrl,
    });

    logger.info({ email, emailId: data?.id }, "Stock alert email sent");
    return true;
  } catch (error) {
    logger.error({ err: error, email }, "Stock alert email failed");
    return false;
  }
};

// ─── Email Verification Link ──────────────────────────────────────
const sendEmailVerificationLink = async (user, token) => {
  try {
    logger.info({ email: user.email }, "Sending email verification link");
    const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;
    const unsubscribeUrl = `${CLIENT_URL}/unsubscribe?email=${user.email}`;
    logger.debug({ verificationUrl }, "Verification URL generated");

    const bodyContent = `
      <h2>Welcome to Swaad Nation! 🎉</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for signing up with us. To complete your registration and start ordering our authentic Bihari delicacies, please verify your email address.</p>

      ${emailButton(verificationUrl, "Verify Email Address")}

      <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #2E7D32; background: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationUrl}</p>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">This link will expire in 24 hours.</p>
      <p style="color: #666; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
    `;

    const html = emailLayout({
      title: "Verify Your Email - Swaad Nation",
      bodyContent,
      unsubscribeUrl,
    });

    const data = await sendEmail({
      to: user.email,
      subject: "Verify Your Email - Swaad Nation",
      html,
      text: `Hi ${user.name}, please verify your email by visiting: ${verificationUrl} (expires in 24 hours)`,
      unsubscribeUrl,
    });

    logger.info({ email: user.email, emailId: data?.id }, "Email verification link sent");
    return true;
  } catch (error) {
    logger.error({ err: error, email: user.email }, "Email verification failed");
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendStockAlertEmail,
  sendEmailVerificationLink,
};