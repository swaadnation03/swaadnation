// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const User = require("../models/userModel");
// const { protect, admin } = require("../middleware/authMiddleware");
// const { sendWelcomeEmail, sendEmailVerificationLink } = require("../services/emailService");
// const JWT_SECRET = process.env.JWT_SECRET;

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
// };

// // @route   POST /api/auth/register
// // @desc    Register a new user and send email verification link
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, phone, address } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "Name, email, and password are required" });
//     }

//     // Check if user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ error: "User already exists with this email" });
//     }

//     // Create unverified user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       phone: phone || "",
//       address: address || "",
//       isEmailVerified: false,
//     });

//     // Generate email verification token
//     const verificationToken = user.generateEmailVerificationToken();
//     await user.save();

//     // Send verification email
//     await sendEmailVerificationLink(user, verificationToken);

//     res.status(201).json({
//       message: "Registration successful! Please check your email to verify your account.",
//       email: user.email,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   POST /api/auth/verify-email
// // @desc    Verify email with token
// router.post("/verify-email", async (req, res) => {
//   try {
//     const { token, email } = req.body;

//     if (!token || !email) {
//       return res.status(400).json({ error: "Token and email are required" });
//     }

//     // Hash the token to match stored token
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     // Find user by email and valid token
//     const user = await User.findOne({
//       email,
//       emailVerificationToken: hashedToken,
//       emailVerificationTokenExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ error: "Invalid or expired verification token" });
//     }

//     // Mark email as verified
//     user.isEmailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationTokenExpires = undefined;
//     await user.save();

//     // Send welcome email
//     await sendWelcomeEmail(user);

//     res.json({
//       message: "Email verified successfully! Your account is now active.",
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       address: user.address,
//       role: user.role,
//       token: generateToken(user._id),
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   POST /api/auth/resend-verification
// // @desc    Resend verification email
// router.post("/resend-verification", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({ error: "Email is already verified" });
//     }

//     // Generate new verification token
//     const verificationToken = user.generateEmailVerificationToken();
//     await user.save();

//     // Send verification email
//     await sendEmailVerificationLink(user, verificationToken, req);

//     res.json({ message: "Verification email sent! Please check your email." });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Login user (must have verified email)
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // Check if email is verified
//     if (!user.isEmailVerified) {
//       return res.status(403).json({ 
//         error: "Please verify your email before logging in",
//         email: user.email,
//       });
//     }

//     // Check password
//     if (await user.comparePassword(password)) {
//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         role: user.role,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ error: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   GET /api/auth/me
// // @desc    Get current user profile
// router.get("/me", protect, async (req, res) => {
//   res.json(req.user);
// });

// // @route   PUT /api/auth/profile
// // @desc    Update user profile
// router.put("/profile", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.phone = req.body.phone || user.phone;
//       user.address = req.body.address || user.address;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phone: updatedUser.phone,
//         address: updatedUser.address,
//         role: updatedUser.role,
//         token: generateToken(updatedUser._id),
//       });
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // @route   GET /api/auth/users
// // @desc    Get all users (admin only)
// router.get("/users", protect, admin, async (req, res) => {
//   try {
//     const users = await User.find({}).select("-password");
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const User = require("../models/userModel");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendWelcomeEmail, sendEmailVerificationLink } = require("../services/emailService");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET;

// ─── Rate limiters ────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 min per IP
  message: { error: "Too many login attempts. Please try again later." },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5, // 5 registrations per hour per IP
  message: { error: "Too many accounts created. Please try again later." },
});

const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // 3 resend attempts per 15 min per IP
  message: { error: "Too many resend attempts. Please try again later." },
});

// ─── Generate JWT Token ───────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

// ─── Register ─────────────────────────────────────────────────────
router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      address: address || "",
      isEmailVerified: false,
    });

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    await sendEmailVerificationLink(user, verificationToken);

    logger.info({ email: user.email }, "New user registered");

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      email: user.email,
    });
  } catch (error) {
    logger.error({ err: error }, "Registration error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Verify Email ─────────────────────────────────────────────────
router.post("/verify-email", async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ error: "Token and email are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      email,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user);

    logger.info({ email: user.email }, "Email verified");

    res.json({
      message: "Email verified successfully! Your account is now active.",
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    logger.error({ err: error }, "Email verification error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Resend Verification ──────────────────────────────────────────
router.post("/resend-verification", resendLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    // ✅ Same response whether user doesn't exist or email already verified
    // — prevents email enumeration
    if (!user || user.isEmailVerified) {
      return res.json({
        message: "If this email exists and is unverified, a verification link has been sent.",
      });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    await sendEmailVerificationLink(user, verificationToken);

    logger.info({ email }, "Verification email resent");

    res.json({ message: "If this email exists and is unverified, a verification link has been sent." });
  } catch (error) {
    logger.error({ err: error }, "Resend verification error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Login ────────────────────────────────────────────────────────
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    // ✅ Same error for wrong email vs wrong password — prevents email enumeration
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
        email: user.email,
      });
    }

    logger.info({ email: user.email }, "User logged in");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    logger.error({ err: error }, "Login error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get Current User ─────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  // ✅ Return only what the frontend needs — no internal fields
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    role: req.user.role,
    isEmailVerified: req.user.isEmailVerified,
  });
});

// ─── Update Profile ───────────────────────────────────────────────
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    // ✅ Require current password to change password
    if (req.body.password) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ error: "Current password is required to set a new password" });
      }
      const isMatch = await user.comparePassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    logger.info({ userId: user._id }, "User profile updated");

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    logger.error({ err: error }, "Profile update error");
    res.status(500).json({ error: error.message });
  }
});

// ─── Get All Users (admin only) ───────────────────────────────────
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-password -emailVerificationToken -emailVerificationTokenExpires"
    );
    res.json(users);
  } catch (error) {
    logger.error({ err: error }, "Fetch users error");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;