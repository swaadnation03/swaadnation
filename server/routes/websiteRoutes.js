// const express = require("express");
// const router = express.Router();
// const WebsiteSetting = require("../models/WebsiteSetting");
// const { protect, admin } = require("../middleware/authMiddleware");

// // Get active website settings (public)
// router.get("/active", async (req, res) => {
//   try {
//     let setting = await WebsiteSetting.findOne({ isActive: true });
//     if (!setting) {
//       setting = await WebsiteSetting.create({});
//     }
//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: get all settings
// router.get("/admin/all", protect, admin, async (req, res) => {
//   try {
//     const settings = await WebsiteSetting.find({}).sort({ createdAt: -1 });
//     res.json(settings);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: create new setting
// router.post("/admin/create", protect, admin, async (req, res) => {
//   try {
//     const setting = await WebsiteSetting.create(req.body);
//     res.status(201).json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: update setting
// router.put("/admin/:id", protect, admin, async (req, res) => {
//   try {
//     const setting = await WebsiteSetting.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!setting) return res.status(404).json({ error: "Setting not found" });
//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: delete setting
// router.delete("/admin/:id", protect, admin, async (req, res) => {
//   try {
//     const setting = await WebsiteSetting.findByIdAndDelete(req.params.id);
//     if (!setting) return res.status(404).json({ error: "Setting not found" });
//     res.json({ message: "Deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin: activate a setting
// router.put("/admin/activate/:id", protect, admin, async (req, res) => {
//   try {
//     await WebsiteSetting.updateMany({}, { isActive: false });
//     const setting = await WebsiteSetting.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
//     res.json(setting);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;








const express = require("express");
const router = express.Router();
const WebsiteSetting = require("../models/WebsiteSetting");
const { protect, admin } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// ✅ Matches exact WebsiteSetting schema fields
const pickWebsiteFields = (body) => ({
  bodyBackgroundColor: body.bodyBackgroundColor,
  navbarBackgroundColor: body.navbarBackgroundColor,
  navbarTextColor: body.navbarTextColor,
  navbarHoverColor: body.navbarHoverColor,
  footerBackgroundColor: body.footerBackgroundColor,
  footerTextColor: body.footerTextColor,
  isActive: body.isActive,
});

// ─── Public ───────────────────────────────────────────────────────
router.get("/active", async (req, res) => {
  try {
    const setting = await WebsiteSetting.findOne({ isActive: true });
    if (!setting) {
      // ✅ Return schema defaults instead of creating a DB record
      return res.json({
        bodyBackgroundColor: "#F9FAFB",
        navbarBackgroundColor: "#FFFFFF",
        navbarTextColor: "#374151",
        navbarHoverColor: "#16A34A",
        footerBackgroundColor: "#111827",
        footerTextColor: "#9CA3AF",
        isActive: true,
      });
    }
    res.json(setting);
  } catch (error) {
    logger.error({ err: error }, "Fetch active website setting error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Admin ────────────────────────────────────────────────────────
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const settings = await WebsiteSetting.find({}).sort({ createdAt: -1 });
    res.json(settings);
  } catch (error) {
    logger.error({ err: error }, "Admin fetch website settings error");
    res.status(500).json({ error: error.message });
  }
});

router.post("/admin/create", protect, admin, async (req, res) => {
  try {
    const setting = await WebsiteSetting.create(pickWebsiteFields(req.body));
    logger.info({ settingId: setting._id, adminId: req.user._id }, "Website setting created");
    res.status(201).json(setting);
  } catch (error) {
    logger.error({ err: error }, "Create website setting error");
    res.status(500).json({ error: error.message });
  }
});

// ✅ activate MUST be above /:id
router.put("/admin/activate/:id", protect, admin, async (req, res) => {
  try {
    await WebsiteSetting.updateMany({}, { isActive: false });
    const setting = await WebsiteSetting.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    logger.info({ settingId: req.params.id, adminId: req.user._id }, "Website setting activated");
    res.json(setting);
  } catch (error) {
    logger.error({ err: error }, "Activate website setting error");
    res.status(500).json({ error: error.message });
  }
});

router.put("/admin/:id", protect, admin, async (req, res) => {
  try {
    const setting = await WebsiteSetting.findByIdAndUpdate(
      req.params.id,
      pickWebsiteFields(req.body),
      { new: true }
    );
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    logger.info({ settingId: req.params.id, adminId: req.user._id }, "Website setting updated");
    res.json(setting);
  } catch (error) {
    logger.error({ err: error }, "Update website setting error");
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/:id", protect, admin, async (req, res) => {
  try {
    const setting = await WebsiteSetting.findByIdAndDelete(req.params.id);
    if (!setting) return res.status(404).json({ error: "Setting not found" });
    logger.info({ settingId: req.params.id, adminId: req.user._id }, "Website setting deleted");
    res.json({ message: "Deleted" });
  } catch (error) {
    logger.error({ err: error }, "Delete website setting error");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;