const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Offer = require("../models/Offer");
const { protect, admin } = require("../middleware/authMiddleware");

// Configure multer for image upload
const uploadDir = path.join(__dirname, "../uploads/offers");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "offer-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// GET all active offers (public)
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ order: 1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all offers (admin only)
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ order: 1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE offer with image upload (admin only)
router.post("/admin/create", protect, admin, upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);
    
    const { title, description, link, startDate, endDate, order, discount, isActive } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    if (!endDate) {
      return res.status(400).json({ error: "End date is required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const offer = await Offer.create({
      title: title,
      description: description,
      image: "/uploads/offers/" + req.file.filename,
      link: link || "",
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: new Date(endDate),
      order: parseInt(order) || 0,
      discount: discount || "",
      isActive: isActive === "true" || isActive === true,
    });

    res.status(201).json(offer);
  } catch (error) {
    console.error("Create offer error:", error);
    if (error.name === "ValidationError") {
      const errors = [];
      for (const key in error.errors) {
        errors.push(error.errors[key].message);
      }
      return res.status(400).json({ error: errors.join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE offer (admin only)
router.put("/admin/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, link, startDate, endDate, order, discount, isActive } = req.body;
    
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Update fields
    if (title) offer.title = title;
    if (description) offer.description = description;
    if (link !== undefined) offer.link = link;
    if (startDate) offer.startDate = new Date(startDate);
    if (endDate) offer.endDate = new Date(endDate);
    if (order !== undefined) offer.order = parseInt(order);
    if (discount !== undefined) offer.discount = discount;
    if (isActive !== undefined) offer.isActive = isActive === "true" || isActive === true;

    // Update image if new one uploaded
    if (req.file) {
      // Delete old image if exists
      if (offer.image) {
        const oldImagePath = path.join(__dirname, "..", offer.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      offer.image = "/uploads/offers/" + req.file.filename;
    }

    await offer.save();
    res.json(offer);
  } catch (error) {
    console.error("Update offer error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE offer (admin only)
router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Delete image file
    if (offer.image) {
      const imagePath = path.join(__dirname, "..", offer.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete offer error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;