const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect, admin } = require('../middleware/authMiddleware');

// @route POST /api/upload/image
// @desc  Upload an image to Cloudinary (Admin only)
router.post('/image', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the secure URL from Cloudinary
  res.json({ success: true, imageUrl: req.file.path });
});

module.exports = router;