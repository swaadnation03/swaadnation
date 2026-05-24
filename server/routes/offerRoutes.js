const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); // Use Cloudinary upload
const Offer = require("../models/Offer");
const { protect, admin } = require("../middleware/authMiddleware");

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

// CREATE offer with image upload (admin only) - NOW USES CLOUDINARY
router.post("/admin/create", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, link, startDate, endDate, order, discount, isActive } = req.body;
    
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
      image: req.file.path, // Cloudinary URL (not local path)
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

    if (title) offer.title = title;
    if (description) offer.description = description;
    if (link !== undefined) offer.link = link;
    if (startDate) offer.startDate = new Date(startDate);
    if (endDate) offer.endDate = new Date(endDate);
    if (order !== undefined) offer.order = parseInt(order);
    if (discount !== undefined) offer.discount = discount;
    if (isActive !== undefined) offer.isActive = isActive === "true" || isActive === true;

    // Update image if new one uploaded (now uses Cloudinary)
    if (req.file) {
      offer.image = req.file.path; // Cloudinary URL
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
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete offer error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;