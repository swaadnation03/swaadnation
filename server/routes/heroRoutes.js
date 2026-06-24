// const express = require("express");
// const router = express.Router();
// const HeroSetting = require("../models/HeroSetting");
// const { protect, admin } = require("../middleware/authMiddleware");

// // Get active hero settings (public)
// router.get("/active", async (req, res) => {
//   try {
//     let setting = await HeroSetting.findOne({ isActive: true });
//     if (!setting) {
//       setting = await HeroSetting.create({});
//     }
//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: get all settings
// router.get("/admin/all", protect, admin, async (req, res) => {
//   try {
//     const settings = await HeroSetting.find({}).sort({ createdAt: -1 });
//     res.json(settings);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: create new setting
// router.post("/admin/create", protect, admin, async (req, res) => {
//   try {
//     const setting = await HeroSetting.create(req.body);
//     res.status(201).json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: update setting
// router.put("/admin/:id", protect, admin, async (req, res) => {
//   try {
//     const setting = await HeroSetting.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!setting) return res.status(404).json({ error: "Setting not found" });
//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: delete setting
// router.delete("/admin/:id", protect, admin, async (req, res) => {
//   try {
//     const setting = await HeroSetting.findByIdAndDelete(req.params.id);
//     if (!setting) return res.status(404).json({ error: "Setting not found" });
//     res.json({ message: "Deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: activate a setting (deactivates all others)
// router.put("/admin/activate/:id", protect, admin, async (req, res) => {
//   try {
//     await HeroSetting.updateMany({}, { isActive: false });
//     const setting = await HeroSetting.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const HeroSetting = require("../models/HeroSetting");
const { protect, admin } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// ✅ Matches exact HeroSetting schema fields
const pickHeroFields = (body) => ({
  backgroundType: body.backgroundType,
  gradientValue: body.gradientValue,
  solidColor: body.solidColor,
  backgroundImage: body.backgroundImage,
  videoUrl: body.videoUrl,
  overlayOpacity: body.overlayOpacity,
  textColor: body.textColor,
  title: body.title,
  subtitle: body.subtitle,
  description: body.description,
  showLogo: body.showLogo,
  isActive: body.isActive,
});

// ─── Public ───────────────────────────────────────────────────────
router.get("/active", async (req, res) => {
  try {
    const setting = await HeroSetting.findOne({ isActive: true });
    if (!setting) {
      // ✅ Return schema defaults instead of creating a DB record
      return res.json({
        backgroundType: "gradient",
        gradientValue: "linear-gradient(135deg, #1B5E20, #2E7D32, #F57C00)",
        solidColor: "#2E7D32",
        backgroundImage: "",
        videoUrl: "",
        overlayOpacity: 0.4,
        textColor: "#FFFFFF",
        title: "Swaad Nation",
        subtitle: "Taste of Champaran",
        description: "Authentic Bihari flavors delivered to your doorstep",
        showLogo: true,
        isActive: true,
      });
    }
    res.json(setting);
  } catch (error) {
    logger.error({ err: error }, "Fetch active hero setting error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Admin ────────────────────────────────────────────────────────
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const settings = await HeroSetting.find({}).sort({ createdAt: -1 });
    res.json(settings);
  } catch (error) {
    logger.error({ err: error }, "Admin fetch hero settings error");
    res.status(500).json({ error: error.message });
  }
});

router.post("/admin/create", protect, admin, async (req, res) => {
  try {
    const setting = await HeroSetting.create(pickHeroFields(req.body));
    logger.info({ settingId: setting._id, adminId: req.user._id }, "Hero setting created");
    res.status(201).json(setting);
  } catch (error) {
    logger.error({ err: error }, "Create hero setting error");
    res.status(500).json({ error: error.message });
  }
});

// ✅ activate MUST be above /:id — otherwise Express matches it as id="activate"
router.put("/admin/activate/:id", protect, admin, async (req, res) => {
  try {
    await HeroSetting.updateMany({}, { isActive: false });
    const setting = await HeroSetting.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    logger.info({ settingId: req.params.id, adminId: req.user._id }, "Hero setting activated");
    res.json(setting);
  } catch (error) {
    logger.error({ err: error }, "Activate hero setting error");
    res.status(500).json({ error: error.message });
  }
});

router.put("/admin/:id", protect, admin, async (req, res) => {
  try {
    const setting = await HeroSetting.findByIdAndUpdate(
      req.params.id,
      pickHeroFields(req.body),
      { new: true }
    );
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    logger.info({ settingId: req.params.id, adminId: req.user._id }, "Hero setting updated");
    res.json(setting);
  } catch (error) {
    logger.error({ err: error }, "Update hero setting error");
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const setting = await HeroSetting.findByIdAndDelete(req.params.id);
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    logger.info({ settingId: req.params.id, adminId: req.user._id }, "Hero setting deleted");
    res.json({ message: "Deleted" });
  } catch (error) {
    logger.error({ err: error }, "Delete hero setting error");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;