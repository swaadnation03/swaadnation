const express = require("express");
const router = express.Router();
const WebsiteSetting = require("../models/WebsiteSetting");
const { protect, admin } = require("../middleware/authMiddleware");

// Get active website settings (public)
router.get("/active", async (req, res) => {
  try {
    let setting = await WebsiteSetting.findOne({ isActive: true });
    if (!setting) {
      setting = await WebsiteSetting.create({});
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: get all settings
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSetting.find({}).sort({ createdAt: -1 });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: create new setting
router.post("/admin/create", protect, admin, async (req, res) => {
  try {
    const setting = await WebsiteSetting.create(req.body);
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: update setting
router.put("/admin/:id", protect, admin, async (req, res) => {
  try {
    const setting = await WebsiteSetting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: delete setting
router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const setting = await WebsiteSetting.findByIdAndDelete(req.params.id);
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: activate a setting
router.put("/admin/activate/:id", protect, admin, async (req, res) => {
  try {
    await WebsiteSetting.updateMany({}, { isActive: false });
    const setting = await WebsiteSetting.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;