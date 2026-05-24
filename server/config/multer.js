const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'swaadnation/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    // ADD THESE LINES FOR BETTER QUALITY
    transformation: [
      { 
        width: 1000,
        height: 1000,
        crop: 'limit',
        quality: '100'
      }
    ]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // CHANGE from 5MB to 10MB
});

module.exports = upload;