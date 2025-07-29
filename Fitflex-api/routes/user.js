const express = require("express");
const User = require("../models/User");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  uploadImage,
  updateUserProfile,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require("../controllers/user");

const upload = require("../middleware/uploads"); // multer setup
const UserValidation = require("../validation/userValidation");

// ✅ Registration route with validation and file upload
router.post("/register", upload.single("image"), UserValidation, register);

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("pro");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ OTP and Login routes
router.post("/login", login);
router.post("/verify-otp", verifyOTP);

// ✅ Standalone image upload route (optional)
router.post("/uploadImage", upload.single("image"), uploadImage);

// ✅ NEW: Update user profile (email passed as route param)
router.put("/updateUser/:email", upload.single("image"), updateUserProfile);

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;


