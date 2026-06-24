// Shared wrapper for all hand-built (non-Handlebars) emails.
// Keeps header/footer/brand styling in exactly one place.

const { clientUrl: CLIENT_URL } = require("../config/appConfig"); // ⬅️ now from appConfig

const emailLayout = ({ title, bodyContent, unsubscribeUrl, showTagline = false }) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
  </head>
  <body style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%); padding: ${showTagline ? "30px" : "20px"}; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Swaad Nation</h1>
        ${showTagline ? `<p style="color: #FFC107; margin: 5px 0 0;">Taste of Champaran</p>` : ""}
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        ${bodyContent}
      </div>
      <div style="text-align: center; padding: 15px; font-size: 12px; color: #999;">
        <p style="margin: 0 0 6px;">&copy; ${new Date().getFullYear()} Swaad Nation. All rights reserved.</p>
        ${unsubscribeUrl ? `<a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>` : ""}
      </div>
    </div>
  </body>
  </html>
`;

const emailButton = (url, label) => `
  <div style="text-align: center; margin: 20px 0;">
    <a href="${url}" style="display: inline-block; padding: 12px 30px; background: #2E7D32; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">${label}</a>
  </div>
`;

module.exports = { emailLayout, emailButton, CLIENT_URL };