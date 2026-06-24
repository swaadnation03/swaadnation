// const express = require('express');
// const router = express.Router();
// const upload = require('../config/multer');
// const { protect, admin } = require('../middleware/authMiddleware');

// // @route POST /api/upload/image
// // @desc  Upload an image to Cloudinary (Admin only)
// router.post('/image', protect, admin, upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   // Return the secure URL from Cloudinary
//   res.json({ success: true, imageUrl: req.file.path });
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const upload = require("../config/multer");
const { protect, admin } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,                   // 50 uploads per hour per IP
  message: { error: "Too many uploads. Please try again later." },
});

// @route POST /api/upload/image
// @desc  Upload an image to Cloudinary (Admin only)
router.post("/image", protect, admin, uploadLimiter, (req, res) => {
  // ✅ Wrap multer in a callback to catch errors and return clean JSON
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      // fileFilter error (wrong MIME type) lands here
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    logger.info(
      { adminId: req.user._id, imageUrl: req.file.path },
      "Image uploaded"
    );

    res.json({ success: true, imageUrl: req.file.path });
  });
});

module.exports = router;