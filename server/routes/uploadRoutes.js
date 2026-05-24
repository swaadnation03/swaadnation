const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect, admin } = require('../middleware/authMiddleware');

// Upload single image to Cloudinary
router.post('/image', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Cloudinary returns the URL directly
    const imageUrl = req.file.path;
    
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Image uploaded successfully to Cloudinary'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple images
router.post('/images', protect, admin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const imageUrls = req.files.map(file => file.path);
    
    res.json({ 
      success: true, 
      imageUrls: imageUrls,
      message: `${imageUrls.length} images uploaded successfully`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;