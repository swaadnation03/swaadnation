const { transporter } = require("../config/emailConfig");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

// Load and compile templates
const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, "../templates", `${templateName}.html`);
  const source = fs.readFileSync(templatePath, "utf8");
  return Handlebars.compile(source);
};

// Email templates
const templates = {
  welcome: loadTemplate("welcome"),
  orderConfirmation: loadTemplate("order-confirmation"),
};

// Send welcome email
const sendWelcomeEmail = async (user, req) => {
  try {
    const html = templates.welcome({
      name: user.name,
      shopUrl: `${req.protocol}://${req.get("host")}`,
      unsubscribeUrl: `${req.protocol}://${req.get("host")}/unsubscribe?email=${user.email}`,
    });

    const mailOptions = {
      from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to Swaad Nation! 🎉 Taste of Champaran",
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("Welcome email error:", error);
    return false;
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, user, req) => {
  try {
    const items = order.items.map(item => ({
      name: item.name,
      qty: item.qty,
      total: item.price * item.qty,
    }));

    const subtotal = order.total;
    const deliveryFee = subtotal > 499 ? 0 : 40;
    const total = subtotal + deliveryFee;

    const html = templates.orderConfirmation({
      customerName: order.customer.name,
      orderId: order._id.toString().slice(-8).toUpperCase(),
      orderDate: new Date(order.createdAt).toLocaleDateString("en-IN"),
      orderStatus: order.status,
      items,
      subtotal,
      deliveryFee,
      freeDelivery: deliveryFee === 0,
      total,
      phone: order.customer.phone,
      address: order.customer.address,
      paymentMethod: order.paymentMethod,
      trackOrderUrl: `${req.protocol}://${req.get("host")}/my-orders`,
    });

    const mailOptions = {
      from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Confirmed! #${order._id.toString().slice(-8)} - Swaad Nation`,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("Order confirmation email error:", error);
    return false;
  }
};

// Send order status update email
const sendOrderStatusEmail = async (order, user, oldStatus, newStatus, req) => {
  try {
    const statusMessages = {
      Processing: "Your order is being prepared with care and will be shipped soon!",
      Shipped: "Your order is on the way! It has been handed over to our delivery partner.",
      Delivered: "Your order has been delivered! We hope you enjoy our authentic Bihari flavors.",
      Cancelled: "Your order has been cancelled as requested.",
    };

    const template = `
      <!DOCTYPE html>
      <html>
      <head><title>Order Status Update - Swaad Nation</title></head>
      <body style="font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white;">Swaad Nation</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2>Order Status Update</h2>
            <p>Dear ${order.customer.name},</p>
            <p>Your order #${order._id.toString().slice(-8)} status has been updated:</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Old Status:</strong> ${oldStatus}</p>
              <p><strong>New Status:</strong> ${newStatus}</p>
              <p><strong>Message:</strong> ${statusMessages[newStatus] || "Your order is being processed."}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${req.protocol}://${req.get("host")}/my-orders" style="display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 5px;">Track Your Order</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order ${newStatus}! #${order._id.toString().slice(-8)} - Swaad Nation`,
      html: template,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("Order status email error:", error);
    return false;
  }
};

const sendStockAlertEmail = async (email, name, product) => {
  try {
    const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Back in Stock - Swaad Nation</title>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
          .product-box { background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
          .product-name { font-size: 24px; font-weight: bold; color: #2E7D32; margin: 10px 0; }
          .price { font-size: 28px; font-weight: bold; color: #F57C00; margin: 10px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Swaad Nation</h1>
            <p style="color: #FFC107; margin: 5px 0 0;">Taste of Champaran</p>
          </div>
          <div class="content">
            <h2>Good News, ${name}! 🎉</h2>
            <p>The product you've been waiting for is back in stock!</p>
            
            <div class="product-box">
              <div style="font-size: 48px;">🍪</div>
              <div class="product-name">${product.name}</div>
              <div class="price">₹${product.price}</div>
              <p>Hurry up! Stock is limited.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000/product/${product._id}" class="button">
                Shop Now
              </a>
            </div>
            
            <p style="margin-top: 20px;">Thank you for choosing Swaad Nation!</p>
            <p><strong>Team Swaad Nation</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Swaad Nation. All rights reserved.</p>
            <p><small>You received this email because you requested a stock notification.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Swaad Nation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Back in Stock: ${product.name} is now available!`,
      html: template,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Stock alert email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Stock alert email error:", error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendStockAlertEmail,
};